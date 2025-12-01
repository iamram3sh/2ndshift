import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { fundEscrowAccount } from '@/lib/escrow'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { withAuthAndRateLimit, parseAndValidateJSON, logSecurityEvent } from '@/lib/api-middleware'

const confirmationSchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1)
})

const isRazorpayConfigured =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_SECRET &&
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
      const parseResult = await parseAndValidateJSON(
        request,
        (data) => {
          const validation = confirmationSchema.safeParse(data)
          return {
            success: validation.success,
            data: validation.data,
            error: validation.error
          }
        }
      )

      if (!parseResult.success) {
        return NextResponse.json(
          { error: 'Invalid request', details: parseResult.error },
          { status: 400 }
        )
      }

      const { orderId, paymentId, signature } = parseResult.data!
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET as string)
        .update(`${orderId}|${paymentId}`)
        .digest('hex')

      if (expectedSignature !== signature) {
        logSecurityEvent({
          type: 'suspicious_activity',
          userId: authRequest.userId,
          details: 'Invalid Razorpay signature'
        })
        return NextResponse.json(
          { error: 'Signature verification failed' },
          { status: 400 }
        )
      }

      const { data: paymentRecord, error: paymentError } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('razorpay_order_id', orderId)
        .single()

      if (paymentError || !paymentRecord) {
        return NextResponse.json(
          { error: 'Payment record not found' },
          { status: 404 }
        )
      }

      if (paymentRecord.payment_from !== authRequest.userId) {
        logSecurityEvent({
          type: 'suspicious_activity',
          userId: authRequest.userId,
          details: `User tried to confirm payment they do not own (${orderId})`
        })
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      if (paymentRecord.status === 'completed') {
        return NextResponse.json({ success: true, status: 'already_completed' })
      }

      await supabaseAdmin
        .from('payments')
        .update({
          status: 'processing',
          razorpay_payment_id: paymentId
        })
        .eq('id', paymentRecord.id)

      await fundEscrowAccount({
        contractId: paymentRecord.contract_id,
        amount: paymentRecord.gross_amount,
        initiatedBy: paymentRecord.payment_from,
        metadata: {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId
        }
      })

      await supabaseAdmin
        .from('payments')
        .update({
          status: 'completed',
          payment_date: new Date().toISOString()
        })
        .eq('id', paymentRecord.id)

      return NextResponse.json({ success: true, status: 'completed' })
    },
    'api'
  )
}
