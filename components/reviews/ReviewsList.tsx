'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ReviewCard } from './ReviewCard'
import { Star, TrendingUp } from 'lucide-react'

interface Review {
  id: string
  contract_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  review_text: string
  response_text?: string
  created_at: string
  reviewer?: {
    full_name: string
    user_type: string
  }
}

interface ReviewsListProps {
  userId: string
  currentUserId?: string
  showStats?: boolean
}

export function ReviewsList({ userId, currentUserId, showStats = true }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [userId])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(full_name, user_type)
        `)
        .eq('reviewee_id', userId)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setReviews(data as any)
        calculateStats(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (reviewsData: any[]) => {
    const total = reviewsData.length
    if (total === 0) {
      setStats({ average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } })
      return
    }

    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0)
    const average = sum / total

    const distribution = reviewsData.reduce((acc, review) => {
      acc[review.rating as keyof typeof acc]++
      return acc
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

    setStats({ average, total, distribution })
  }

  const handleRespond = async (reviewId: string, responseText: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ response_text: responseText, updated_at: new Date().toISOString() })
        .eq('id', reviewId)
        .eq('reviewee_id', currentUserId)

      if (error) throw error

      // Refresh reviews
      fetchReviews()
    } catch (error) {
      console.error('Error responding to review:', error)
      window.alert('Failed to submit response. Please try again.')
    }
  }

  const handleFlag = async (reviewId: string) => {
    if (!currentUserId) return

    const reason = prompt('Please provide a reason for flagging this review:')
    if (!reason) return

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reported_by: currentUserId,
          reported_user: userId,
          report_type: 'review',
          reference_id: reviewId,
          reason: 'Inappropriate review',
          description: reason
        })

      if (error) throw error

      window.alert('Review has been flagged for admin review. Thank you!')
    } catch (error) {
      console.error('Error flagging review:', error)
      window.alert('Failed to flag review. Please try again.')
    }
  }

  const renderStarsDistribution = () => {
    const maxCount = Math.max(...Object.values(stats.distribution))
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.distribution[rating as keyof typeof stats.distribution]
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
          
          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading reviews...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && stats.total > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="text-5xl font-bold text-gray-900 dark:text-white">
                  {stats.average.toFixed(1)}
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(stats.average)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Rating Distribution
              </h4>
              {renderStarsDistribution()}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Reviews {stats.total > 0 && `(${stats.total})`}
        </h3>

        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No reviews yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Be the first to leave a review after working together
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                canRespond={currentUserId === userId && !review.response_text}
                onRespond={handleRespond}
                onFlag={currentUserId && currentUserId !== userId ? handleFlag : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
