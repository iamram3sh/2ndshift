/**
 * POST /api/verification/otp/send
 * Send OTP to email or phone
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuthAndRateLimit } from '@/lib/api-middleware'
import { sendOTP } from '@/lib/verification/otp'
import { parseAndValidateJSON } from '@/lib/api-middleware'

interface SendOTPRequest {
  method: 'email' | 'phone'
  contactInfo: string
}

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    request,
    async (req) => {
      try {
        const userId = req.userId!
        const result = await parseAndValidateJSON<SendOTPRequest>(req)

        if (!result.success || !result.data) {
          return NextResponse.json(
            { error: result.error || 'Invalid request' },
            { status: 400 }
          )
        }

        const { method, contactInfo } = result.data

        if (!['email', 'phone'].includes(method)) {
          return NextResponse.json(
            { error: 'Invalid method. Must be email or phone' },
            { status: 400 }
          )
        }

        // Validate contact info format
        if (method === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(contactInfo)) {
            return NextResponse.json(
              { error: 'Invalid email format' },
              { status: 400 }
            )
          }
        } else {
          // Basic phone validation (adjust for your region)
          const phoneRegex = /^\+?[1-9]\d{1,14}$/
          if (!phoneRegex.test(contactInfo.replace(/\s/g, ''))) {
            return NextResponse.json(
              { error: 'Invalid phone format' },
              { status: 400 }
            )
          }
        }

        // Send OTP
        const sendResult = await sendOTP(method, contactInfo, userId)

        if (!sendResult.success) {
          return NextResponse.json(
            { error: sendResult.error || 'Failed to send OTP' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          expiresIn: sendResult.expiresIn || 300
        })
      } catch (error: any) {
        console.error('Error sending OTP:', error)
        return NextResponse.json(
          { error: error.message || 'Failed to send OTP' },
          { status: 500 }
        )
      }
    },
    'verificationOTP'
  )
}

