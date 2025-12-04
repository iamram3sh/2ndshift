'use client'

import { Star, ThumbsUp, Flag } from 'lucide-react'
import { useState } from 'react'

interface Review {
  id: string
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

interface ReviewCardProps {
  review: Review
  canRespond?: boolean
  onRespond?: (reviewId: string, response: string) => void
  onFlag?: (reviewId: string) => void
}

export function ReviewCard({ review, canRespond = false, onRespond, onFlag }: ReviewCardProps) {
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !onRespond) return
    
    setIsSubmitting(true)
    await onRespond(review.id, responseText)
    setIsSubmitting(false)
    setShowResponseForm(false)
    setResponseText('')
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0b63ff] to-[#0a56e6] flex items-center justify-center text-white font-bold text-lg">
            {review.reviewer?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {review.reviewer?.full_name || 'Anonymous User'}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {onFlag && (
          <button
            onClick={() => onFlag(review.id)}
            className="text-gray-400 hover:text-red-500 transition"
            title="Report review"
          >
            <Flag className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Review Text */}
      {review.review_text && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {review.review_text}
        </p>
      )}

      {/* Response Section */}
      {review.response_text && (
        <div className="mt-4 pl-4 border-l-4 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-r-lg">
          <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
            Response from {review.reviewer?.user_type === 'worker' ? 'Client' : 'Worker'}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {review.response_text}
          </p>
        </div>
      )}

      {/* Response Form */}
      {canRespond && !review.response_text && (
        <div className="mt-4">
          {!showResponseForm ? (
            <button
              onClick={() => setShowResponseForm(true)}
              className="text-sm text-[#0b63ff] dark:text-blue-400 hover:text-[#0a56e6] dark:hover:text-blue-300 font-medium"
            >
              Respond to this review
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0b63ff] dark:bg-slate-700 dark:text-white resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitResponse}
                  disabled={isSubmitting || !responseText.trim()}
                  className="px-4 py-2 bg-[#0b63ff] text-white rounded-lg hover:bg-[#0a56e6] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
                <button
                  onClick={() => {
                    setShowResponseForm(false)
                    setResponseText('')
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
