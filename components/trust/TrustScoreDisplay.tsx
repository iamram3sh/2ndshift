'use client'

import { useState, useEffect } from 'react'
import { 
  Star, Shield, Award, Crown, TrendingUp, 
  CheckCircle, Clock, MessageSquare, Zap, ThumbsUp,
  ChevronDown, ChevronUp, Loader2
} from 'lucide-react'

interface TrustScore {
  overall_score: number
  badge_level: 'new' | 'verified' | 'trusted' | 'elite' | 'champion'
  total_reviews: number
  quality_score?: number
  communication_score?: number
  timeliness_score?: number
  professionalism_score?: number
  repeat_hire_rate?: number
  payment_reliability_score?: number
  clarity_score?: number
  responsiveness_score?: number
  fairness_score?: number
}

interface Review {
  id: string
  reviewer: { full_name: string }
  overall_rating: number
  review_text?: string
  created_at: string
}

interface TrustScoreDisplayProps {
  userId: string
  userType?: 'worker' | 'client'
  variant?: 'compact' | 'detailed' | 'full'
  showReviews?: boolean
}

export function TrustScoreDisplay({
  userId,
  userType = 'worker',
  variant = 'detailed',
  showReviews = false,
}: TrustScoreDisplayProps) {
  const [score, setScore] = useState<TrustScore | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [badgeInfo, setBadgeInfo] = useState<{
    current: string
    nextLevel: string | null
    reviewsNeeded: number
    scoreNeeded: number
    progressPercent: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    fetchTrustScore()
  }, [userId])

  const fetchTrustScore = async () => {
    try {
      const response = await fetch(`/api/trust-score?userId=${userId}`)
      const data = await response.json()
      
      if (data.score) {
        setScore(data.score)
      }
      if (data.reviews) {
        setReviews(data.reviews)
      }
      if (data.badgeInfo) {
        setBadgeInfo(data.badgeInfo)
      }
    } catch (err) {
      console.error('Error fetching trust score:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getBadgeConfig = (level: string) => {
    const configs: Record<string, { 
      icon: React.ReactNode
      label: string
      color: string
      bg: string
      border: string
    }> = {
      new: {
        icon: <Star className="w-4 h-4" />,
        label: 'New',
        color: 'text-slate-600',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
      },
      verified: {
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Verified',
        color: 'text-sky-600',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
      },
      trusted: {
        icon: <Shield className="w-4 h-4" />,
        label: 'Trusted',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
      },
      elite: {
        icon: <Award className="w-4 h-4" />,
        label: 'Elite',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
      },
      champion: {
        icon: <Crown className="w-4 h-4" />,
        label: 'Champion',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      },
    }
    return configs[level] || configs.new
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!score) {
    return null
  }

  const badgeConfig = getBadgeConfig(score.badge_level)

  // Compact variant - just badge and score
  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.color} border ${badgeConfig.border}`}>
          {badgeConfig.icon}
          {badgeConfig.label}
        </span>
        <span className="flex items-center gap-1 text-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-slate-900">{score.overall_score.toFixed(1)}</span>
          <span className="text-slate-400">({score.total_reviews})</span>
        </span>
      </div>
    )
  }

  // Detailed variant - badge card with breakdown
  if (variant === 'detailed') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badgeConfig.bg} ${badgeConfig.color}`}>
              {badgeConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{badgeConfig.label} Member</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.color} border ${badgeConfig.border}`}>
                  {score.badge_level.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-slate-500">{score.total_reviews} reviews</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-2xl font-bold text-slate-900">{score.overall_score.toFixed(1)}</span>
            </div>
            <p className="text-xs text-slate-500">Overall Score</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {userType === 'worker' ? (
            <>
              <ScoreBar 
                label="Quality" 
                value={score.quality_score} 
                icon={<Star className="w-3.5 h-3.5" />} 
              />
              <ScoreBar 
                label="Communication" 
                value={score.communication_score} 
                icon={<MessageSquare className="w-3.5 h-3.5" />} 
              />
              <ScoreBar 
                label="Timeliness" 
                value={score.timeliness_score} 
                icon={<Clock className="w-3.5 h-3.5" />} 
              />
              <ScoreBar 
                label="Professionalism" 
                value={score.professionalism_score} 
                icon={<CheckCircle className="w-3.5 h-3.5" />} 
              />
            </>
          ) : (
            <>
              <ScoreBar 
                label="Payment" 
                value={score.payment_reliability_score} 
                icon={<Shield className="w-3.5 h-3.5" />} 
              />
              <ScoreBar 
                label="Clarity" 
                value={score.clarity_score} 
                icon={<CheckCircle className="w-3.5 h-3.5" />} 
              />
              <ScoreBar 
                label="Response" 
                value={score.responsiveness_score} 
                icon={<Zap className="w-3.5 h-3.5" />} 
              />
              <ScoreBar 
                label="Fairness" 
                value={score.fairness_score} 
                icon={<ThumbsUp className="w-3.5 h-3.5" />} 
              />
            </>
          )}
        </div>

        {/* Repeat Rate */}
        {score.repeat_hire_rate !== undefined && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              {userType === 'worker' ? 'Would Hire Again' : 'Would Work Again'}
            </span>
            <span className="font-semibold text-emerald-600">
              {Math.round(score.repeat_hire_rate)}%
            </span>
          </div>
        )}

        {/* Progress to Next Badge */}
        {badgeInfo && badgeInfo.nextLevel && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Progress to {badgeInfo.nextLevel}</span>
              <span className="font-medium text-slate-900">{badgeInfo.progressPercent}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getBadgeConfig(badgeInfo.nextLevel).bg.replace('50', '500')}`}
                style={{ width: `${badgeInfo.progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Need {badgeInfo.reviewsNeeded} more reviews
              {badgeInfo.scoreNeeded > 0 && ` and ${badgeInfo.scoreNeeded} higher score`}
            </p>
          </div>
        )}
      </div>
    )
  }

  // Full variant - includes reviews
  return (
    <div className="space-y-4">
      {/* Trust Score Card */}
      <TrustScoreDisplay 
        userId={userId} 
        userType={userType} 
        variant="detailed" 
      />

      {/* Reviews Section */}
      {showReviews && reviews.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-900 mb-4">Recent Reviews</h4>
          <div className="space-y-4">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div key={review.id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900">{review.reviewer.full_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.overall_rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-sm text-slate-600">{review.review_text}</p>
                )}
              </div>
            ))}
          </div>
          
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
            >
              {showAllReviews ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View All {reviews.length} Reviews
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreBar({ 
  label, 
  value, 
  icon 
}: { 
  label: string
  value?: number
  icon: React.ReactNode 
}) {
  const displayValue = value ?? 5.0
  const percentage = (displayValue / 5) * 100

  return (
    <div className="bg-slate-50 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600 flex items-center gap-1">
          {icon}
          {label}
        </span>
        <span className="text-xs font-semibold text-slate-900">{displayValue.toFixed(1)}</span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Mini badge for cards
export function TrustBadgeMini({ 
  badgeLevel, 
  score 
}: { 
  badgeLevel: string
  score: number 
}) {
  const configs: Record<string, { color: string; icon: React.ReactNode }> = {
    new: { color: 'text-slate-500', icon: <Star className="w-3 h-3" /> },
    verified: { color: 'text-sky-500', icon: <CheckCircle className="w-3 h-3" /> },
    trusted: { color: 'text-emerald-500', icon: <Shield className="w-3 h-3" /> },
    elite: { color: 'text-purple-500', icon: <Award className="w-3 h-3" /> },
    champion: { color: 'text-amber-500', icon: <Crown className="w-3 h-3" /> },
  }

  const config = configs[badgeLevel] || configs.new

  return (
    <div className={`inline-flex items-center gap-1 ${config.color}`}>
      {config.icon}
      <span className="text-xs font-medium">{score.toFixed(1)}</span>
    </div>
  )
}
