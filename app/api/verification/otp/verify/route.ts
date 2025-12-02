/**
 * POST /api/verification/otp/verify
 * Verify OTP code
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuthAndRateLimit } from '@/lib/api-middleware'
import { verifyOTP } from '@/lib/verification/otp'
import { parseAndValidateJSON } from '@/lib/api-middleware'
import { createClient } from '@supabase/supabase-js'
import { logAuditEvent, extractRequestInfo, logStatusChange } from '@/lib/verification/audit'
import { transitionStatus } from '@/lib/verification/state-machine'
import { calculateVerificationLevel } from '@/lib/verification/badges'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface VerifyOTPRequest {
  method: 'email' | 'phone'
  contactInfo: string
  otp: string
}

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    request,
    async (req) => {
      try {
        const userId = req.userId!
        const result = await parseAndValidateJSON<VerifyOTPRequest>(req)

        if (!result.success || !result.data) {
          return NextResponse.json(
            { error: result.error || 'Invalid request' },
            { status: 400 }
          )
        }

        const { method, contactInfo, otp } = result.data

        if (!otp || otp.length !== 6) {
          return NextResponse.json(
            { error: 'OTP must be 6 digits' },
            { status: 400 }
          )
        }

        // Verify OTP
        const verifyResult = await verifyOTP(method, contactInfo, otp)

        if (!verifyResult.success) {
          return NextResponse.json(
            { error: verifyResult.error || 'OTP verification failed' },
            { status: 500 }
          )
        }

        if (!verifyResult.verified) {
          return NextResponse.json(
            { success: false, verified: false, error: verifyResult.error || 'Invalid OTP' },
            { status: 200 } // 200 because request was valid, just OTP was wrong
          )
        }

        // Update user verification status
        const updateField = method === 'email' ? 'email_verified_at' : 'phone_verified_at'
        await supabase
          .from('users')
          .update({ [updateField]: new Date().toISOString() })
          .eq('id', userId)

        // Get identity verification
        const { data: verification } = await supabase
          .from('verifications_v2')
          .select('*')
          .eq('user_id', userId)
          .eq('verification_type', 'identity')
          .eq('tier', 1)
          .single()

        if (verification) {
          // Check if face match was successful
          const evidence = verification.evidence || {}
          const faceMatch = evidence.faceMatch

          if (faceMatch && faceMatch.verified) {
            // Complete identity verification
            const transition = transitionStatus(verification.status, 'verified')
            if (transition.valid) {
              await supabase
                .from('verifications_v2')
                .update({
                  status: 'verified',
                  verified_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .eq('id', verification.id)

              // Log status change
              const requestInfo = extractRequestInfo(req)
              await logStatusChange(
                verification.id,
                userId,
                verification.status,
                'verified',
                undefined,
                `${method} OTP verified`,
                req
              )

              // Calculate and award badges
              await calculateVerificationLevel(userId)
            }
          }
        }

        // Log audit event
        const requestInfo = extractRequestInfo(req)
        await logAuditEvent({
          user_id: userId,
          action: 'submitted',
          notes: `${method} OTP verified`,
          ...requestInfo
        })

        return NextResponse.json({
          success: true,
          verified: true
        })
      } catch (error: any) {
        console.error('Error verifying OTP:', error)
        return NextResponse.json(
          { error: error.message || 'OTP verification failed' },
          { status: 500 }
        )
      }
    },
    'verificationOTP'
  )
}

