'use client'

import { Shield, Award, Crown, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'

interface VerificationBadgeInfoProps {
  verifiedLevel: number
  badges?: string[]
}

export function VerificationBadgeInfo({
  verifiedLevel,
  badges = [],
}: VerificationBadgeInfoProps) {
  const { t } = useTranslation()
  const [showInfo, setShowInfo] = useState(false)

  const badgeTiers = [
    {
      level: 1,
      name: t('badges.basic.label'),
      tooltip: t('badges.basic.tooltip'),
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      benefits: [
        '5% platform commission (vs 10% unverified)',
        'Identity verified badge',
        'Basic profile visibility',
      ],
    },
    {
      level: 2,
      name: t('badges.professional.label'),
      tooltip: t('badges.professional.tooltip'),
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      benefits: [
        '5% platform commission',
        'Skills verified badge',
        'Enhanced profile visibility',
        'Priority in search results',
      ],
    },
    {
      level: 3,
      name: t('badges.premium.label'),
      tooltip: t('badges.premium.tooltip'),
      icon: Crown,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      benefits: [
        '5% platform commission',
        'Video verified badge',
        'Top placement in searches',
        'Featured in recommendations',
        'Early access to premium jobs',
      ],
    },
  ]

  const currentTier = badgeTiers.find(tier => tier.level === verifiedLevel) || badgeTiers[0]

  return (
    <div className="relative">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          currentTier.bgColor
        } ${currentTier.color} border-current/20 hover:border-current/40`}
      >
        <currentTier.icon className="w-4 h-4" />
        <span className="font-medium text-sm" title={currentTier.tooltip}>{currentTier.name}</span>
        <Info className="w-3.5 h-3.5 opacity-60" />
      </button>

      {showInfo && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowInfo(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
            <div className="mb-3">
              <h4 className="font-semibold text-slate-900 mb-1">
                Verification Tiers
              </h4>
              <p className="text-xs text-slate-600">
                Higher verification = Lower commission rates
              </p>
            </div>

            <div className="space-y-3">
              {badgeTiers.map((tier) => (
                <div
                  key={tier.level}
                  className={`p-3 rounded-lg border ${
                    tier.level === verifiedLevel
                      ? `${tier.bgColor} border-current`
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <tier.icon className={`w-4 h-4 ${tier.color}`} />
                    <span className={`font-medium text-sm ${tier.color}`}>
                      {tier.name}
                    </span>
                    {tier.level === verifiedLevel && (
                      <span className="text-xs text-emerald-600 font-medium">
                        (Current)
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <a
                href="/worker/verification"
                className="text-xs text-sky-600 font-medium hover:text-sky-700"
              >
                Upgrade verification →
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
