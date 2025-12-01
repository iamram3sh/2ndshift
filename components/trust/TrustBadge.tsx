'use client'

import { Star, Shield, Award, Crown, Zap, CheckCircle } from 'lucide-react'
import type { BadgeLevel, TrustScore } from '@/types/features'

interface TrustBadgeProps {
  level: BadgeLevel
  score?: number
  totalReviews?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showScore?: boolean
}

const badgeConfig: Record<BadgeLevel, {
  label: string
  icon: React.ComponentType<any>
  bgColor: string
  textColor: string
  borderColor: string
  iconColor: string
  gradient: string
}> = {
  new: {
    label: 'New',
    icon: Zap,
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    iconColor: 'text-slate-400',
    gradient: 'from-slate-400 to-slate-500',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle,
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    iconColor: 'text-sky-500',
    gradient: 'from-sky-400 to-sky-500',
  },
  trusted: {
    label: 'Trusted',
    icon: Shield,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    gradient: 'from-emerald-400 to-emerald-500',
  },
  elite: {
    label: 'Elite',
    icon: Award,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500',
    gradient: 'from-purple-400 to-purple-500',
  },
  champion: {
    label: 'Champion',
    icon: Crown,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500',
    gradient: 'from-amber-400 to-amber-500',
  },
}

export function TrustBadge({
  level,
  score,
  totalReviews,
  size = 'md',
  showLabel = true,
  showScore = false,
}: TrustBadgeProps) {
  const config = badgeConfig[level]
  const Icon = config.icon

  const sizeClasses = {
    sm: {
      container: 'gap-1 px-2 py-0.5',
      icon: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      container: 'gap-1.5 px-2.5 py-1',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    lg: {
      container: 'gap-2 px-3 py-1.5',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
  }

  const sizes = sizeClasses[size]

  return (
    <div className={`inline-flex items-center ${sizes.container} ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full font-medium`}>
      <Icon className={`${sizes.icon} ${config.iconColor}`} />
      {showLabel && <span className={sizes.text}>{config.label}</span>}
      {showScore && score !== undefined && (
        <span className={`${sizes.text} flex items-center gap-0.5`}>
          <Star className={`${sizes.icon} fill-current`} />
          {score.toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && totalReviews > 0 && (
        <span className={`${sizes.text} opacity-70`}>({totalReviews})</span>
      )}
    </div>
  )
}

interface TrustScoreCardProps {
  trustScore: TrustScore
  showBreakdown?: boolean
}

export function TrustScoreCard({ trustScore, showBreakdown = false }: TrustScoreCardProps) {
  const config = badgeConfig[trustScore.badge_level]
  const Icon = config.icon

  const isWorker = trustScore.user_type === 'worker'
  
  const breakdownItems = isWorker
    ? [
        { label: 'Quality', score: trustScore.quality_score },
        { label: 'Communication', score: trustScore.communication_score },
        { label: 'Timeliness', score: trustScore.timeliness_score },
        { label: 'Professionalism', score: trustScore.professionalism_score },
      ]
    : [
        { label: 'Payment', score: trustScore.payment_reliability_score },
        { label: 'Clarity', score: trustScore.clarity_score },
        { label: 'Responsiveness', score: trustScore.responsiveness_score },
        { label: 'Fairness', score: trustScore.fairness_score },
      ]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {trustScore.overall_score.toFixed(1)}
              </span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-sm text-slate-500">
              {trustScore.total_reviews} reviews
            </div>
          </div>
        </div>
        <TrustBadge level={trustScore.badge_level} size="lg" />
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="space-y-3 pt-4 border-t border-slate-100">
          {breakdownItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{item.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-8 text-right">
                  {item.score.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-900">
            {trustScore.contracts_completed}
          </div>
          <div className="text-xs text-slate-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-900">
            {Math.round(trustScore.repeat_hire_rate)}%
          </div>
          <div className="text-xs text-slate-500">Repeat Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-900">
            {trustScore.average_response_time_hours || '—'}h
          </div>
          <div className="text-xs text-slate-500">Avg Response</div>
        </div>
      </div>
    </div>
  )
}
