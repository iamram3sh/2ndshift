/**
 * Badges Stack Component
 * Display all badges for a user
 */

'use client'

import { useEffect, useState } from 'react'

interface Badge {
  type: string
  awardedAt: string
}

interface BadgesStackProps {
  userId: string
  size?: 'sm' | 'md' | 'lg'
  showTooltips?: boolean
  maxVisible?: number
}

export default function BadgesStack({
  userId,
  size = 'md',
  showTooltips = true,
  maxVisible
}: BadgesStackProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBadges()
  }, [userId])

  const fetchBadges = async () => {
    try {
      const response = await fetch(`/api/verification/status/${userId}`)
      const data = await response.json()
      if (data.badges) {
        setBadges(data.badges)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  if (loading) {
    return <div className="w-6 h-6 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
  }

  if (badges.length === 0) {
    return null
  }

  const getBadgeMetadata = (badgeType: string) => {
    const metadata: Record<string, { name: string; description: string; icon: string; color: string }> = {
      identity_verified: { name: 'Identity Verified', description: 'Government ID verified', icon: '🆔', color: 'blue' },
      skill_verified: { name: 'Skill Verified', description: 'Skills verified', icon: '✅', color: 'green' },
      video_verified: { name: 'Video Verified', description: 'Video verified', icon: '🎥', color: 'purple' },
      level_1: { name: 'Level 1', description: 'Tier 1 verified', icon: '⭐', color: 'blue' },
      level_2: { name: 'Level 2', description: 'Tier 2 verified', icon: '⭐⭐', color: 'green' },
      level_3: { name: 'Level 3', description: 'Tier 3 verified', icon: '⭐⭐⭐', color: 'purple' },
      payment_verified: { name: 'Payment Verified', description: 'Payment method verified', icon: '💳', color: 'green' },
      business_verified: { name: 'Business Verified', description: 'Business verified', icon: '🏢', color: 'blue' },
      top_performer: { name: 'Top Performer', description: 'High ratings', icon: '🏆', color: 'gold' },
      trusted_worker: { name: 'Trusted Worker', description: 'Trusted by clients', icon: '🤝', color: 'green' },
      verified_client: { name: 'Verified Client', description: 'Client verified', icon: '✓', color: 'blue' }
    }
    return metadata[badgeType] || { name: badgeType, description: '', icon: '✓', color: 'gray' }
  }

  const visibleBadges = maxVisible ? badges.slice(0, maxVisible) : badges
  const remaining = maxVisible ? badges.length - maxVisible : 0

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleBadges.map((badge) => {
        const metadata = getBadgeMetadata(badge.type)
        const colorClasses: Record<string, string> = {
          blue: 'bg-blue-50 text-blue-700 border-blue-200',
          green: 'bg-green-50 text-green-700 border-green-200',
          purple: 'bg-purple-50 text-purple-700 border-purple-200',
          gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          gray: 'bg-gray-50 text-gray-700 border-gray-200'
        }
        return (
          <div
            key={badge.type}
            className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} ${colorClasses[metadata.color] || colorClasses.gray} rounded-full border font-medium`}
            title={showTooltips ? metadata.description : undefined}
          >
            <span className={iconSizes[size]}>{metadata.icon}</span>
            <span>{metadata.name}</span>
          </div>
        )
      })}
      {remaining > 0 && (
        <div className={`${sizeClasses[size]} bg-slate-100 text-slate-700 rounded-full border border-slate-200 font-medium`}>
          +{remaining} more
        </div>
      )}
    </div>
  )
}

