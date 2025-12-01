// app/api/payments/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { razorpay, calculatePaymentBreakdown } from '@/lib/razorpay'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ensureEscrowAccount } from '@/lib/escrow'
import { withAuthAndRateLimit, parseAndValidateJSON, logSecurityEvent } from '@/lib/api-middleware'
import { paymentRequestSchema } from '@/lib/validation'

const isRazorpayConfigured =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('placeholder') &&
  !process.env.RAZORPAY_SECRET.includes('placeholder')

export async function POST(request: NextRequest) {
  if (!isRazorpayConfigured) {
    return NextResponse.json(
      {
        success: false,
        error: 'Payments are not configured yet. Please try again later.'
      },
      { status: 501 }
    )
  }

  return withAuthAndRateLimit(
    request,
    async (authRequest) => {
      try {
        const parseResult = await parseAndValidateJSON(
          request,
          (data) => {
            const validation = paymentRequestSchema.safeParse(data)
            return {
              success: validation.success,
              data: validation.data,
              error: validation.error
            }
          }
        )

        if (!parseResult.success) {
          logSecurityEvent({
            type: 'invalid_input',
            userId: authRequest.userId,
            details: `Payment validation failed: ${parseResult.error}`
          })
          return NextResponse.json(
            { error: 'Invalid request', details: parseResult.error },
            { status: 400 }
          )
        }

        const { contractId, amount } = parseResult.data!
        const supabase = createServerSupabaseClient()

        const { data: contract, error: contractError } = await supabase
          .from('contracts')
          .select('*, project:projects(client_id, title)')
          .eq('id', contractId)
          .single()

        if (contractError || !contract) {
          return NextResponse.json(
            { error: 'Contract not found' },
            { status: 404 }
          )
        }

        if (contract.project.client_id !== authRequest.userId) {
          logSecurityEvent({
            type: 'suspicious_activity',
            userId: authRequest.userId,
            details: `Unauthorized payment attempt for contract ${contractId}`
          })
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
          )
        }

        if (Math.abs(amount - contract.contract_amount) > 0.01) {
          return NextResponse.json(
            { error: 'Amount mismatch with contract' },
            { status: 400 }
          )
        }

        const breakdown = calculatePaymentBreakdown(amount)

        const order = await razorpay.orders.create({
          amount: Math.round(breakdown.grossAmount * 100),
          currency: 'INR',
          receipt: `contract_${contractId}_${Date.now()}`,
          notes: {
            contract_id: contractId,
            user_id: authRequest.userId!,
            platform: '2ndshift'
          }
        })

        await ensureEscrowAccount({
          contractId,
          metadata: {
            projectTitle: contract.project?.title,
            clientId: contract.project?.client_id,
            workerId: contract.worker_id
          }
        })

        const { data: payment, error } = await supabase
          .from('payments')
          .insert({
            contract_id: contractId,
            payment_from: authRequest.userId!,
            payment_to: contract.worker_id,
            gross_amount: breakdown.grossAmount,
            platform_fee: breakdown.platformFee,
            tds_deducted: breakdown.tdsAmount,
            gst_amount: breakdown.gstAmount,
            net_amount: breakdown.netAmount,
            razorpay_order_id: order.id,
            status: 'pending'
          })
          .select()
          .single()

        if (error) {
          console.error('Database error:', error)
          throw new Error('Failed to create payment record')
        }

        return NextResponse.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          breakdown,
          paymentId: payment.id
        })
      } catch (error) {
        console.error('Payment creation error:', error)

        logSecurityEvent({
          type: 'suspicious_activity',
          userId: authRequest.userId,
          details: `Payment creation failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        })

        return NextResponse.json(
          {
            error: 'Failed to create payment',
            message:
              process.env.NODE_ENV === 'development'
                ? error instanceof Error
                  ? error.message
                  : 'Unknown error'
                : 'An error occurred while processing your payment'
          },
          { status: 500 }
        )
      }
    },
    'api'
  )
}
