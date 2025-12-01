'use client'

import { useState } from 'react'
import { Star, ThumbsUp, MessageSquare, ChevronDown, ChevronUp, Clock, CheckCircle } from 'lucide-react'
import type { ProfessionalRating, CompanyRating, UserRatingSummary } from '@/types/categories'

interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function RatingStars({ rating, size = 'md', showValue = false }: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-200'
          }`}
        />
      ))}
      {showValue && (
        <span className={`ml-1 font-medium text-slate-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

interface RatingSummaryCardProps {
  summary: UserRatingSummary
  userType: 'worker' | 'client'
}

export function RatingSummaryCard({ summary, userType }: RatingSummaryCardProps) {
  const totalStars = 
    summary.five_star_count + 
    summary.four_star_count + 
    summary.three_star_count + 
    summary.two_star_count + 
    summary.one_star_count

  const getPercentage = (count: number) => {
    if (totalStars === 0) return 0
    return (count / totalStars) * 100
  }

  const ratingBreakdown = userType === 'worker'
    ? [
        { label: 'Quality', value: summary.avg_quality },
        { label: 'Communication', value: summary.avg_communication },
        { label: 'Timeliness', value: summary.avg_timeliness },
        { label: 'Professionalism', value: summary.avg_professionalism },
      ]
    : [
        { label: 'Payment', value: summary.avg_payment },
        { label: 'Communication', value: summary.avg_communication },
        { label: 'Clarity', value: summary.avg_clarity },
        { label: 'Respect', value: summary.avg_respect },
      ]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Overall Rating */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-900">
            {summary.overall_rating.toFixed(1)}
          </div>
          <RatingStars rating={summary.overall_rating} size="md" />
          <div className="text-sm text-slate-500 mt-1">
            {summary.total_reviews} reviews
          </div>
        </div>

        {/* Star Distribution */}
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = 
              star === 5 ? summary.five_star_count :
              star === 4 ? summary.four_star_count :
              star === 3 ? summary.three_star_count :
              star === 2 ? summary.two_star_count :
              summary.one_star_count

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-3">{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${getPercentage(count)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-6 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {ratingBreakdown.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-600">{item.label}</span>
              <span className="text-sm font-medium text-slate-900">{item.value.toFixed(1)}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${(item.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-slate-700">
            {summary.would_recommend_percent.toFixed(0)}% would recommend
          </span>
        </div>
        {userType === 'client' && summary.on_time_payment_percent > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            <span className="text-sm text-slate-700">
              {summary.on_time_payment_percent.toFixed(0)}% on-time payments
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

interface ReviewCardProps {
  review: ProfessionalRating | CompanyRating
  reviewerType: 'worker' | 'client'
}

export function ReviewCard({ review, reviewerType }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isProfessionalRating = 'quality_rating' in review
  const reviewer = isProfessionalRating 
    ? (review as ProfessionalRating).client 
    : (review as CompanyRating).professional

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600">
            {reviewer?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <div className="font-medium text-slate-900">
              {reviewer?.full_name || 'Anonymous'}
            </div>
            {'company_name' in (reviewer || {}) && (reviewer as any).company_name && (
              <div className="text-xs text-slate-500">{(reviewer as any).company_name}</div>
            )}
          </div>
        </div>
        <div className="text-right">
          <RatingStars rating={review.overall_rating} size="sm" />
          <div className="text-xs text-slate-500 mt-1">
            {formatDate(review.created_at)}
          </div>
        </div>
      </div>

      {/* Title */}
      {review.review_title && (
        <h4 className="font-medium text-slate-900 mb-2">{review.review_title}</h4>
      )}

      {/* Review Text */}
      {review.review_text && (
        <p className={`text-sm text-slate-600 ${!expanded && 'line-clamp-3'}`}>
          {review.review_text}
        </p>
      )}

      {review.review_text && review.review_text.length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-sky-600 font-medium mt-2 flex items-center gap-1"
        >
          {expanded ? (
            <>Show less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Read more <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}

      {/* Detailed Ratings */}
      {isProfessionalRating && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {(review as ProfessionalRating).quality_rating && (
              <div>
                <span className="text-slate-500">Quality</span>
                <div className="font-medium text-slate-700">{(review as ProfessionalRating).quality_rating}/5</div>
              </div>
            )}
            {(review as ProfessionalRating).communication_rating && (
              <div>
                <span className="text-slate-500">Communication</span>
                <div className="font-medium text-slate-700">{(review as ProfessionalRating).communication_rating}/5</div>
              </div>
            )}
            {(review as ProfessionalRating).timeliness_rating && (
              <div>
                <span className="text-slate-500">Timeliness</span>
                <div className="font-medium text-slate-700">{(review as ProfessionalRating).timeliness_rating}/5</div>
              </div>
            )}
            {(review as ProfessionalRating).professionalism_rating && (
              <div>
                <span className="text-slate-500">Professionalism</span>
                <div className="font-medium text-slate-700">{(review as ProfessionalRating).professionalism_rating}/5</div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isProfessionalRating && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {(review as CompanyRating).payment_rating && (
              <div>
                <span className="text-slate-500">Payment</span>
                <div className="font-medium text-slate-700">{(review as CompanyRating).payment_rating}/5</div>
              </div>
            )}
            {(review as CompanyRating).communication_rating && (
              <div>
                <span className="text-slate-500">Communication</span>
                <div className="font-medium text-slate-700">{(review as CompanyRating).communication_rating}/5</div>
              </div>
            )}
            {(review as CompanyRating).requirements_clarity_rating && (
              <div>
                <span className="text-slate-500">Clarity</span>
                <div className="font-medium text-slate-700">{(review as CompanyRating).requirements_clarity_rating}/5</div>
              </div>
            )}
            {(review as CompanyRating).respect_rating && (
              <div>
                <span className="text-slate-500">Respect</span>
                <div className="font-medium text-slate-700">{(review as CompanyRating).respect_rating}/5</div>
              </div>
            )}
          </div>

          {(review as CompanyRating).paid_on_time !== null && (
            <div className="flex items-center gap-2 mt-3">
              <CheckCircle className={`w-4 h-4 ${(review as CompanyRating).paid_on_time ? 'text-emerald-500' : 'text-red-500'}`} />
              <span className="text-xs text-slate-600">
                {(review as CompanyRating).paid_on_time ? 'Paid on time' : 'Payment delayed'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Skills Demonstrated */}
      {isProfessionalRating && (review as ProfessionalRating).skills_demonstrated?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {(review as ProfessionalRating).skills_demonstrated.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-xs font-medium text-sky-700 bg-sky-50 rounded border border-sky-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Would Recommend */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
        <ThumbsUp className={`w-4 h-4 ${
          (isProfessionalRating 
            ? (review as ProfessionalRating).would_hire_again 
            : (review as CompanyRating).would_work_again)
            ? 'text-emerald-500' 
            : 'text-slate-300'
        }`} />
        <span className="text-xs text-slate-600">
          {isProfessionalRating
            ? (review as ProfessionalRating).would_hire_again 
              ? 'Would hire again' 
              : 'Would not hire again'
            : (review as CompanyRating).would_work_again
              ? 'Would work again'
              : 'Would not work again'
          }
        </span>
      </div>

      {/* Response */}
      {review.response_text && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-700">Response</span>
          </div>
          <p className="text-sm text-slate-600">{review.response_text}</p>
        </div>
      )}
    </div>
  )
}
