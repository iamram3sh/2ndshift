/**
 * Verification Progress Indicator
 */

'use client'

import { CheckCircle, Circle } from 'lucide-react'

interface VerificationProgressProps {
  level: number
  tier1Status: string
  tier2Status: string
  tier3Status: string
}

export default function VerificationProgress({
  level,
  tier1Status,
  tier2Status,
  tier3Status
}: VerificationProgressProps) {
  const tiers = [
    { number: 1, status: tier1Status, label: 'Identity' },
    { number: 2, status: tier2Status, label: 'Skills' },
    { number: 3, status: tier3Status, label: 'Video' }
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#111]">Verification Progress</h3>
        <span className="text-2xl font-bold text-[#111]">Level {level}/3</span>
      </div>
      
      <div className="flex items-center gap-4">
        {tiers.map((tier, index) => (
          <div key={tier.number} className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {tier.status === 'verified' ? (
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              ) : (
                <Circle className={`w-6 h-6 ${
                  tier.status === 'pending' || tier.status === 'in_review'
                    ? 'text-amber-600'
                    : 'text-slate-300'
                }`} />
              )}
              <span className="text-sm font-medium text-[#111]">Tier {tier.number}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  tier.status === 'verified'
                    ? 'bg-emerald-600 w-full'
                    : tier.status === 'pending' || tier.status === 'in_review'
                    ? 'bg-amber-600 w-1/2'
                    : 'bg-slate-300 w-0'
                }`}
              />
            </div>
            <p className="text-xs text-[#333] mt-1">{tier.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

