'use client'

import { BadgeCheck, Shield, Crown, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface VerificationBadgeProps {
  verifiedLevel?: 'basic' | 'professional' | 'premium' | null
  onUpgrade?: () => void
}

export function VerificationBadge({ verifiedLevel, onUpgrade }: VerificationBadgeProps) {
  const [showDetails, setShowDetails] = useState(false)

  const levels = {
    basic: {
      icon: Shield,
      label: 'Basic Verified',
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      benefits: [
        'Identity verified',
        'Basic profile visibility',
        'Standard commission rates',
      ],
    },
    professional: {
      icon: BadgeCheck,
      label: 'Professional Verified',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      benefits: [
        'All Basic benefits',
        '5% commission (vs 10%)',
        'Priority in search results',
        'Professional badge',
        'Featured profile option',
      ],
    },
    premium: {
      icon: Crown,
      label: 'Premium Verified',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      benefits: [
        'All Professional benefits',
        '0% commission (first 3 jobs)',
        'Top ranking boost',
        'Elite badge',
        'Dedicated support',
        'Early access to premium jobs',
      ],
    },
  }

  const currentLevel = verifiedLevel ? levels[verifiedLevel] : null
  const nextLevel = verifiedLevel === 'basic' ? levels.professional : verifiedLevel === 'professional' ? levels.premium : null

  if (!currentLevel && !nextLevel) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-slate-400" />
          <div>
            <h3 className="font-semibold text-slate-900">Get Verified</h3>
            <p className="text-sm text-slate-600">Unlock lower commission rates and better visibility</p>
          </div>
        </div>
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="w-full mt-3 bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Start Verification
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
          currentLevel
            ? `${currentLevel.bgColor} ${currentLevel.borderColor}`
            : 'bg-slate-50 border-slate-200'
        }`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentLevel && (
              <currentLevel.icon className={`w-6 h-6 ${currentLevel.color}`} />
            )}
            <div>
              <h3 className="font-semibold text-slate-900">
                {currentLevel?.label || 'Not Verified'}
              </h3>
              <p className="text-sm text-slate-600">
                {currentLevel
                  ? 'You are verified'
                  : 'Get verified to unlock benefits'}
              </p>
            </div>
          </div>
          {nextLevel && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpgrade?.()
              }}
              className="px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Upgrade
            </button>
          )}
        </div>

        {showDetails && currentLevel && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">Your Benefits:</h4>
            <ul className="space-y-1.5">
              {currentLevel.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Sparkles className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showDetails && nextLevel && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">Upgrade to {nextLevel.label}:</h4>
            <ul className="space-y-1.5 mb-3">
              {nextLevel.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            {onUpgrade && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onUpgrade()
                }}
                className="w-full bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                Upgrade Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
