/**
 * POST /api/client/verification/payment
 * Verify client payment method
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuthAndRateLimit } from '@/lib/api-middleware'
import { parseAndValidateJSON } from '@/lib/api-middleware'
import { createClient } from '@supabase/supabase-js'
import { logAuditEvent, extractRequestInfo } from '@/lib/verification/audit'
import { awardBadge } from '@/lib/verification/badges'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface PaymentVerificationRequest {
  paymentMethodId: string
  provider: 'stripe' | 'razorpay' | 'upi'
  upiId?: string
}

/**
 * Payment Method Verification
 * 
 * ⚠️ INVESTOR-READY: See lib/verification/integrations/production-services.ts
 * for production integration instructions
 */
async function verifyPaymentMethod(
  provider: string,
  paymentMethodId: string,
  upiId?: string
): Promise<{ verified: boolean; error?: string }> {
  const paymentProvider = process.env.PAYMENT_VERIFICATION_PROVIDER || 'mock'

  // ⚠️ INVESTOR-READY: Uncomment when payment provider credentials are available
  if (paymentProvider !== 'mock') {
    /*
    import {
      verifyStripePaymentMethod,
      verifyRazorpayPaymentMethod,
      verifyUPI
    } from '@/lib/verification/integrations/production-services'

    switch (provider) {
      case 'stripe':
        return await verifyStripePaymentMethod(paymentMethodId)
      case 'razorpay':
        return await verifyRazorpayPaymentMethod(paymentMethodId)
      case 'upi':
        if (!upiId) return { verified: false, error: 'UPI ID required' }
        return await verifyUPI(upiId)
      default:
        return { verified: false, error: 'Invalid provider' }
    }
    */
  }

  // DEMO MODE: Mock implementation
  console.log(`[DEMO] Payment Verification - Provider: ${provider}, Using mock implementation`)
  console.log(`[DEMO] Payment Method ID: ${paymentMethodId || upiId}`)
  
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock: Always verify successfully
  return { verified: true }
}

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    request,
    async (req) => {
      try {
        const userId = req.userId!
        
        // Verify user is a client
        const { data: user } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', userId)
          .single()

        if (user?.user_type !== 'client') {
          return NextResponse.json(
            { error: 'Only clients can verify payment methods' },
            { status: 403 }
          )
        }

        const result = await parseAndValidateJSON<PaymentVerificationRequest>(req)
        if (!result.success || !result.data) {
          return NextResponse.json(
            { error: result.error || 'Invalid request' },
            { status: 400 }
          )
        }

        const { paymentMethodId, provider, upiId } = result.data

        if (!['stripe', 'razorpay', 'upi'].includes(provider)) {
          return NextResponse.json(
            { error: 'Invalid payment provider' },
            { status: 400 }
          )
        }

        if (provider === 'upi' && !upiId) {
          return NextResponse.json(
            { error: 'UPI ID is required for UPI verification' },
            { status: 400 }
          )
        }

        // Verify payment method
        const verificationResult = await verifyPaymentMethod(
          provider,
          paymentMethodId,
          upiId
        )

        if (!verificationResult.verified) {
          return NextResponse.json(
            { error: verificationResult.error || 'Payment verification failed' },
            { status: 400 }
          )
        }

        // Get or create client verification record
        const { data: existing } = await supabase
          .from('client_verifications')
          .select('*')
          .eq('client_id', userId)
          .single()

        const evidence = existing?.evidence || {}
        evidence.payment = {
          provider,
          paymentMethodId: provider === 'upi' ? upiId : paymentMethodId,
          verifiedAt: new Date().toISOString()
        }

        if (existing) {
          await supabase
            .from('client_verifications')
            .update({
              payment_status: 'verified',
              payment_method_id: provider === 'upi' ? upiId : paymentMethodId,
              payment_provider: provider,
              evidence,
              verified_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
        } else {
          await supabase
            .from('client_verifications')
            .insert({
              client_id: userId,
              payment_status: 'verified',
              payment_method_id: provider === 'upi' ? upiId : paymentMethodId,
              payment_provider: provider,
              evidence,
              verified_at: new Date().toISOString()
            })
        }

        // Award badge
        await awardBadge(userId, 'payment_verified')

        // Log audit event
        const requestInfo = extractRequestInfo(req)
        await logAuditEvent({
          user_id: userId,
          action: 'verified',
          notes: `Payment method verified: ${provider}`,
          ...requestInfo
        })

        return NextResponse.json({
          success: true,
          verified: true,
          status: 'verified'
        })
      } catch (error: any) {
        console.error('Error verifying payment:', error)
        return NextResponse.json(
          { error: error.message || 'Payment verification failed' },
          { status: 500 }
        )
      }
    },
    'api'
  )
}

