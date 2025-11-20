'use client'

import { Shield, CheckCircle, Star, Award, Verified, Crown } from 'lucide-react'

interface Badge {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  bgColor: string
  description: string
  level: number
}

interface VerificationBadgesProps {
  verificationLevel: number
  isVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  isPremium?: boolean
  badges?: string[]
}

export default function VerificationBadges({
  verificationLevel,
  isVerified,
  emailVerified,
  phoneVerified,
  isPremium = false,
  badges = []
}: VerificationBadgesProps) {
  
  const allBadges: Badge[] = [
    {
      id: 'email',
      name: 'Email Verified',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      description: 'Email address verified',
      level: 1
    },
    {
      id: 'phone',
      name: 'Phone Verified',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      description: 'Phone number verified',
      level: 2
    },
    {
      id: 'identity',
      name: 'ID Verified',
      icon: <Shield className="w-4 h-4" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      description: 'Government ID verified by admin',
      level: 3
    },
    {
      id: 'professional',
      name: 'Professional Verified',
      icon: <Award className="w-4 h-4" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      description: 'Professional certificates verified',
      level: 4
    },
    {
      id: 'premium',
      name: 'Premium Verified',
      icon: <Star className="w-4 h-4" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      description: 'Background check completed',
      level: 5
    },
    {
      id: 'elite',
      name: 'Elite',
      icon: <Crown className="w-4 h-4" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900',
      description: 'Top 5% performer',
      level: 6
    }
  ]

  const earnedBadges = allBadges.filter(badge => {
    if (badge.id === 'email') return emailVerified
    if (badge.id === 'phone') return phoneVerified
    if (badge.id === 'identity') return verificationLevel >= 3
    if (badge.id === 'professional') return verificationLevel >= 4
    if (badge.id === 'premium') return verificationLevel >= 5 || isPremium
    if (badge.id === 'elite') return verificationLevel >= 6
    return false
  })

  if (earnedBadges.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {earnedBadges.map(badge => (
        <div
          key={badge.id}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.color}`}
          title={badge.description}
        >
          {badge.icon}
          <span>{badge.name}</span>
        </div>
      ))}
    </div>
  )
}

interface VerificationStatusProps {
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected'
  verificationLevel: number
  size?: 'sm' | 'md' | 'lg'
}

export function VerificationStatus({ 
  verificationStatus, 
  verificationLevel,
  size = 'md' 
}: VerificationStatusProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const iconSize = sizeClasses[size]

  if (verificationStatus === 'verified') {
    return (
      <div className="relative inline-flex" title={`Verification Level ${verificationLevel}`}>
        <Verified className={`${iconSize} text-blue-500 fill-current`} />
        {verificationLevel >= 5 && (
          <Star className="w-3 h-3 text-yellow-500 fill-current absolute -top-1 -right-1" />
        )}
      </div>
    )
  }

  if (verificationStatus === 'pending') {
    return (
      <div className="relative inline-flex" title="Verification Pending">
        <Shield className={`${iconSize} text-yellow-500`} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
      </div>
    )
  }

  return null
}
