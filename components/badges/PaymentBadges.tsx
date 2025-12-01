'use client'

import { 
  Shield, Lock, CheckCircle, Clock, Star, Zap, 
  BadgeCheck, Award, Crown, TrendingUp, Verified
} from 'lucide-react'

interface PaymentVerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export function PaymentVerifiedBadge({ 
  size = 'md', 
  showLabel = true,
  variant = 'default' 
}: PaymentVerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1 text-emerald-600" title="Payment Verified">
        <Shield className={iconSizes[size]} />
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
        <Shield className={`${iconSizes[size]} text-emerald-600`} />
        <div className="flex flex-col">
          <span className={`font-medium text-emerald-700 ${sizeClasses[size]}`}>
            Payment Verified
          </span>
          <span className="text-xs text-emerald-600">
            Funds locked in escrow
          </span>
        </div>
      </div>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 ${sizeClasses[size]}`}>
      <Shield className={iconSizes[size]} />
      {showLabel && <span className="font-medium">Payment Verified</span>}
    </span>
  )
}

interface EscrowStatusBadgeProps {
  status: string
  size?: 'sm' | 'md' | 'lg'
}

export function EscrowStatusBadge({ status, size = 'md' }: EscrowStatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const configs: Record<string, { 
    label: string
    color: string
    bg: string
    icon: React.ComponentType<any>
  }> = {
    pending: {
      label: 'Pending Funding',
      color: 'text-amber-700',
      bg: 'bg-amber-50 border-amber-200',
      icon: Clock,
    },
    funded: {
      label: 'Payment Locked',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
      icon: Lock,
    },
    work_started: {
      label: 'In Progress',
      color: 'text-sky-700',
      bg: 'bg-sky-50 border-sky-200',
      icon: Zap,
    },
    work_submitted: {
      label: 'Under Review',
      color: 'text-purple-700',
      bg: 'bg-purple-50 border-purple-200',
      icon: Clock,
    },
    released: {
      label: 'Payment Released',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
      icon: CheckCircle,
    },
    disputed: {
      label: 'In Dispute',
      color: 'text-red-700',
      bg: 'bg-red-50 border-red-200',
      icon: Shield,
    },
  }

  const config = configs[status] || configs.pending
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.color} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      <span className="font-medium">{config.label}</span>
    </span>
  )
}

interface TrustScoreBadgeProps {
  score: number
  level?: 'new' | 'verified' | 'trusted' | 'elite' | 'champion'
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
}

export function TrustScoreBadge({ 
  score, 
  level = 'new',
  size = 'md',
  showScore = true 
}: TrustScoreBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const levelConfigs: Record<string, { 
    label: string
    color: string
    bg: string
    icon: React.ComponentType<any>
  }> = {
    new: {
      label: 'New',
      color: 'text-slate-600',
      bg: 'bg-slate-100 border-slate-200',
      icon: Star,
    },
    verified: {
      label: 'Verified',
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-200',
      icon: BadgeCheck,
    },
    trusted: {
      label: 'Trusted',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      icon: Shield,
    },
    elite: {
      label: 'Elite',
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
      icon: Award,
    },
    champion: {
      label: 'Champion',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      icon: Crown,
    },
  }

  const config = levelConfigs[level] || levelConfigs.new
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${config.bg} ${config.color} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      <span className="font-medium">{config.label}</span>
      {showScore && (
        <span className="font-semibold">{score}</span>
      )}
    </span>
  )
}

interface ClientVerifiedBadgeProps {
  hasPaymentMethod?: boolean
  totalSpent?: number
  completedProjects?: number
  size?: 'sm' | 'md' | 'lg'
}

export function ClientVerifiedBadge({
  hasPaymentMethod = false,
  totalSpent = 0,
  completedProjects = 0,
  size = 'md',
}: ClientVerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  // Determine verification level
  let level: 'unverified' | 'basic' | 'verified' | 'premium' = 'unverified'
  
  if (hasPaymentMethod) {
    level = 'basic'
    if (totalSpent > 50000 || completedProjects >= 3) {
      level = 'verified'
    }
    if (totalSpent > 500000 || completedProjects >= 10) {
      level = 'premium'
    }
  }

  const configs = {
    unverified: {
      label: 'New Client',
      color: 'text-slate-500',
      bg: 'bg-slate-100 border-slate-200',
      icon: Clock,
    },
    basic: {
      label: 'Payment Verified',
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-200',
      icon: BadgeCheck,
    },
    verified: {
      label: 'Verified Client',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      icon: Shield,
    },
    premium: {
      label: 'Premium Client',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      icon: Crown,
    },
  }

  const config = configs[level]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${config.bg} ${config.color} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      <span className="font-medium">{config.label}</span>
    </span>
  )
}

// Job Card Badge for listings
export function JobPaymentBadge({ 
  isFunded,
  amount,
  size = 'sm' 
}: { 
  isFunded: boolean
  amount?: number
  size?: 'sm' | 'md' 
}) {
  if (!isFunded) {
    return null
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <span className={`inline-flex items-center gap-1 bg-emerald-500 text-white rounded-full font-medium ${sizeClasses[size]}`}>
      <Lock className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {amount ? `₹${(amount/1000).toFixed(0)}K Locked` : 'Payment Locked'}
    </span>
  )
}

// Professional response guarantee
export function ResponseGuaranteeBadge({ 
  avgResponseTime,
  size = 'sm' 
}: { 
  avgResponseTime: string
  size?: 'sm' | 'md' 
}) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
  }

  return (
    <span className={`inline-flex items-center gap-1 text-sky-600 ${sizeClasses[size]}`}>
      <Zap className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>Responds in {avgResponseTime}</span>
    </span>
  )
}
