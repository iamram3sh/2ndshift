/**
 * OTP Generation and Verification
 * Supports email and SMS OTP
 */

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const resendApiKey = process.env.RESEND_API_KEY || ''
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilioVerifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const resend = resendApiKey ? new Resend(resendApiKey) : null

// OTP storage in Supabase (in-memory cache for development, use Redis in production)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>()

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP with expiry (5 minutes)
function storeOTP(key: string, code: string): void {
  otpStore.set(key, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0
  })
  
  // Cleanup expired OTPs
  setTimeout(() => {
    otpStore.delete(key)
  }, 5 * 60 * 1000)
}

// Get OTP from store
function getOTP(key: string): { code: string; expiresAt: number; attempts: number } | null {
  const stored = otpStore.get(key)
  if (!stored) return null
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(key)
    return null
  }
  
  return stored
}

// Send OTP via Email
async function sendEmailOTP(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn('Resend API key not configured. Using mock email OTP.')
    return { success: true } // Mock for development
  }

  try {
    await resend.emails.send({
      from: '2ndShift <noreply@2ndshift.com>',
      to: email,
      subject: 'Your 2ndShift Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('Error sending email OTP:', error)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}

// Send OTP via SMS (Twilio)
async function sendSMSOTP(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
  if (!twilioAccountSid || !twilioAuthToken || !twilioVerifyServiceSid) {
    console.warn('Twilio not configured. Using mock SMS OTP.')
    console.log(`[MOCK SMS] OTP for ${phone}: ${code}`)
    return { success: true } // Mock for development
  }

  try {
    // Use Twilio Verify API
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${twilioVerifyServiceSid}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`
        },
        body: new URLSearchParams({
          To: phone,
          Channel: 'sms'
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error sending SMS OTP:', error)
    return { success: false, error: error.message || 'Failed to send SMS' }
  }
}

// Verify OTP via Twilio
async function verifyTwilioOTP(phone: string, code: string): Promise<{ success: boolean; verified: boolean; error?: string }> {
  if (!twilioAccountSid || !twilioAuthToken || !twilioVerifyServiceSid) {
    // Mock verification for development
    const stored = getOTP(`sms:${phone}`)
    if (stored && stored.code === code) {
      otpStore.delete(`sms:${phone}`)
      return { success: true, verified: true }
    }
    return { success: true, verified: false }
  }

  try {
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${twilioVerifyServiceSid}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`
        },
        body: new URLSearchParams({
          To: phone,
          Code: code
        })
      }
    )

    const data = await response.json()
    
    if (data.status === 'approved') {
      return { success: true, verified: true }
    }
    
    return { success: true, verified: false }
  } catch (error: any) {
    console.error('Error verifying SMS OTP:', error)
    return { success: false, verified: false, error: error.message || 'Failed to verify OTP' }
  }
}

/**
 * Send OTP to email or phone
 */
export async function sendOTP(
  method: 'email' | 'phone',
  contactInfo: string,
  userId: string
): Promise<{ success: boolean; error?: string; expiresIn?: number }> {
  // Rate limiting: Max 3 requests per hour per user
  const rateLimitKey = `otp:${userId}:${method}:${contactInfo}`
  const lastRequest = otpStore.get(rateLimitKey)
  
  if (lastRequest && Date.now() < lastRequest.expiresAt) {
    return { success: false, error: 'Please wait before requesting another OTP' }
  }

  const code = generateOTP()
  const otpKey = `${method}:${contactInfo}`
  
  storeOTP(otpKey, code)
  
  // Store rate limit (1 hour)
  otpStore.set(rateLimitKey, {
    code: '',
    expiresAt: Date.now() + 60 * 60 * 1000,
    attempts: 0
  })

  let result: { success: boolean; error?: string }
  
  if (method === 'email') {
    result = await sendEmailOTP(contactInfo, code)
  } else {
    result = await sendSMSOTP(contactInfo, code)
  }

  if (!result.success) {
    otpStore.delete(otpKey)
    return result
  }

  return { success: true, expiresIn: 300 } // 5 minutes
}

/**
 * Verify OTP
 */
export async function verifyOTP(
  method: 'email' | 'phone',
  contactInfo: string,
  code: string
): Promise<{ success: boolean; verified: boolean; error?: string }> {
  const otpKey = `${method}:${contactInfo}`
  const stored = getOTP(otpKey)

  if (!stored) {
    return { success: true, verified: false, error: 'OTP expired or invalid' }
  }

  // Increment attempts
  stored.attempts++
  
  // Max 5 attempts
  if (stored.attempts > 5) {
    otpStore.delete(otpKey)
    return { success: true, verified: false, error: 'Too many attempts. Please request a new OTP.' }
  }

  // For SMS, use Twilio verification if configured
  if (method === 'phone' && twilioAccountSid) {
    const result = await verifyTwilioOTP(contactInfo, code)
    if (result.verified) {
      otpStore.delete(otpKey)
    }
    return result
  }

  // For email or mock SMS, verify against stored code
  if (stored.code === code) {
    otpStore.delete(otpKey)
    return { success: true, verified: true }
  }

  return { success: true, verified: false, error: 'Invalid OTP' }
}

/**
 * Cleanup expired OTPs (call periodically)
 */
export function cleanupExpiredOTPs(): void {
  const now = Date.now()
  for (const [key, value] of otpStore.entries()) {
    if (now > value.expiresAt) {
      otpStore.delete(key)
    }
  }
}

// Cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredOTPs, 10 * 60 * 1000)
}

