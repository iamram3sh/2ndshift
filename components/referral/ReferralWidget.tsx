'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Gift, Users } from 'lucide-react'
import { getShareLinks } from '@/lib/referral'

interface ReferralWidgetProps {
  referralCode: string
  totalReferrals: number
  totalEarned: number
  userType: 'worker' | 'client'
}

export function ReferralWidget({
  referralCode,
  totalReferrals,
  totalEarned,
  userType,
}: ReferralWidgetProps) {
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareLinks = getShareLinks(referralCode, baseUrl)

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLinks.copy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const bonusAmount = userType === 'worker' ? 500 : 1000

  return (
    <div className="bg-gradient-to-br from-[#0b63ff] to-[#0a56e6] rounded-3xl p-8 text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Gift className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Refer & Earn</h3>
          <p className="text-blue-100">Invite friends and get ₹{bonusAmount} each</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <Users className="w-5 h-5 mb-2 text-indigo-200" />
          <div className="text-2xl font-bold">{totalReferrals}</div>
          <div className="text-sm text-indigo-200">Referrals</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <Gift className="w-5 h-5 mb-2 text-green-300" />
          <div className="text-2xl font-bold">₹{totalEarned.toLocaleString()}</div>
          <div className="text-sm text-indigo-200">Earned</div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 mb-4">
        <div className="text-sm text-indigo-200 mb-2">Your Referral Code</div>
        <div className="flex items-center justify-between gap-4">
          <div className="text-3xl font-bold tracking-wider">{referralCode}</div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white text-[#0b63ff] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div className="space-y-3">
        <div className="text-sm text-indigo-200 mb-2">Share via</div>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 rounded-lg px-4 py-3 text-center font-medium transition"
          >
            WhatsApp
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 rounded-lg px-4 py-3 text-center font-medium transition"
          >
            Twitter
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 rounded-lg px-4 py-3 text-center font-medium transition"
          >
            LinkedIn
          </a>
          <a
            href={shareLinks.email}
            className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 rounded-lg px-4 py-3 text-center font-medium transition"
          >
            Email
          </a>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="text-sm">
          <div className="font-semibold mb-2">How it works:</div>
          <ol className="space-y-1 text-blue-100">
            <li>1. Share your referral code with friends</li>
            <li>2. They sign up using your code</li>
            <li>3. You both get ₹{bonusAmount} when they complete first {userType === 'worker' ? 'project' : 'hire'}</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
