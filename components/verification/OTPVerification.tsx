/**
 * OTP Verification Component
 */

'use client'

import { useState } from 'react'
import { Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react'

interface OTPVerificationProps {
  userId: string
  onComplete?: () => void
}

export default function OTPVerification({ userId, onComplete }: OTPVerificationProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [contactInfo, setContactInfo] = useState('')
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expiresIn, setExpiresIn] = useState(0)

  const handleSendOTP = async () => {
    if (!contactInfo) {
      setError('Please enter your email or phone number')
      return
    }

    setSending(true)
    setError(null)

    try {
      const response = await fetch('/api/verification/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, contactInfo })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setOtpSent(true)
      setExpiresIn(data.expiresIn || 300)
      
      // Countdown timer
      let remaining = data.expiresIn || 300
      const timer = setInterval(() => {
        remaining--
        setExpiresIn(remaining)
        if (remaining <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setSending(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setVerifying(true)
    setError(null)

    try {
      const response = await fetch('/api/verification/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, contactInfo, otp })
      })

      const data = await response.json()

      if (!response.ok || !data.verified) {
        throw new Error(data.error || 'Invalid OTP')
      }

      setVerified(true)
      if (onComplete) onComplete()
    } catch (err: any) {
      setError(err.message || 'OTP verification failed')
    } finally {
      setVerifying(false)
    }
  }

  if (verified) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">
            {method === 'email' ? 'Email' : 'Phone'} verified successfully!
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <h4 className="text-lg font-semibold text-[#111] flex items-center gap-2">
        {method === 'email' ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
        {method === 'email' ? 'Email' : 'Phone'} Verification
      </h4>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {!otpSent ? (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                method === 'email'
                  ? 'bg-[#111] text-white'
                  : 'bg-slate-100 text-[#333] hover:bg-slate-200'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setMethod('phone')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                method === 'phone'
                  ? 'bg-[#111] text-white'
                  : 'bg-slate-100 text-[#333] hover:bg-slate-200'
              }`}
            >
              Phone
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111] mb-2">
              {method === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={method === 'email' ? 'email' : 'tel'}
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder={method === 'email' ? 'your@email.com' : '+1234567890'}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
            />
          </div>

          <button
            onClick={handleSendOTP}
            disabled={sending || !contactInfo}
            className="w-full px-4 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition disabled:opacity-50 font-semibold"
          >
            {sending ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-[#333]">
            OTP sent to {contactInfo}. Expires in {Math.floor(expiresIn / 60)}:{(expiresIn % 60).toString().padStart(2, '0')}
          </p>

          <div>
            <label className="block text-sm font-medium text-[#111] mb-2">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setOtp(value)
              }}
              placeholder="000000"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111] text-center text-2xl tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleVerifyOTP}
              disabled={verifying || otp.length !== 6}
              className="flex-1 px-4 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition disabled:opacity-50 font-semibold"
            >
              {verifying ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={() => {
                setOtpSent(false)
                setOtp('')
                setError(null)
              }}
              className="px-4 py-2 bg-white text-[#111] border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Change
            </button>
          </div>
        </>
      )}
    </div>
  )
}

