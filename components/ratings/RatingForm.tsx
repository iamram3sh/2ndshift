'use client'

import { useState } from 'react'
import { Star, X, CheckCircle, AlertCircle, Loader2, ThumbsUp, Clock } from 'lucide-react'

interface RatingFormProps {
  isOpen: boolean
  onClose: () => void
  targetUserId: string
  targetUserName: string
  targetUserType: 'worker' | 'client'
  reviewerId: string
  contractId?: string
  onSuccess?: () => void
}

interface StarRatingInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  required?: boolean
}

function StarRatingInput({ label, value, onChange, required }: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                star <= (hoverValue || value)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200 hover:text-amber-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-500">
          {value > 0 ? `${value}/5` : 'Select'}
        </span>
      </div>
    </div>
  )
}

export function RatingForm({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  targetUserType,
  reviewerId,
  contractId,
  onSuccess,
}: RatingFormProps) {
  const [overallRating, setOverallRating] = useState(0)
  const [detailedRatings, setDetailedRatings] = useState({
    quality: 0,
    communication: 0,
    timeliness: 0,
    professionalism: 0,
    value: 0,
    payment: 0,
    clarity: 0,
    respect: 0,
  })
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [paidOnTime, setPaidOnTime] = useState<boolean | null>(null)
  const [skills, setSkills] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (overallRating === 0) {
      setError('Please provide an overall rating')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const body: any = {
        target_user_id: targetUserId,
        target_user_type: targetUserType,
        reviewer_id: reviewerId,
        contract_id: contractId,
        overall_rating: overallRating,
        review_title: reviewTitle || null,
        review_text: reviewText || null,
        is_public: isPublic,
      }

      if (targetUserType === 'worker') {
        // Rating a professional
        body.quality_rating = detailedRatings.quality || null
        body.communication_rating = detailedRatings.communication || null
        body.timeliness_rating = detailedRatings.timeliness || null
        body.professionalism_rating = detailedRatings.professionalism || null
        body.value_rating = detailedRatings.value || null
        body.would_hire_again = wouldRecommend
        body.skills_demonstrated = skills.split(',').map(s => s.trim()).filter(Boolean)
      } else {
        // Rating a client
        body.payment_rating = detailedRatings.payment || null
        body.communication_rating = detailedRatings.communication || null
        body.requirements_clarity_rating = detailedRatings.clarity || null
        body.respect_rating = detailedRatings.respect || null
        body.would_work_again = wouldRecommend
        body.paid_on_time = paidOnTime
      }

      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit rating')
      }

      setIsSuccess(true)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Rate {targetUserName}
            </h2>
            <p className="text-sm text-slate-500">
              Share your experience working with this {targetUserType === 'worker' ? 'professional' : 'client'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Review Submitted!
              </h3>
              <p className="text-slate-600 mb-6">
                Thank you for your feedback. Your review helps build trust in our community.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="bg-slate-50 rounded-xl p-5">
                <StarRatingInput
                  label="Overall Rating"
                  value={overallRating}
                  onChange={setOverallRating}
                  required
                />
              </div>

              {/* Detailed Ratings */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Detailed Ratings (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {targetUserType === 'worker' ? (
                    <>
                      <StarRatingInput
                        label="Quality of Work"
                        value={detailedRatings.quality}
                        onChange={(v) => setDetailedRatings(prev => ({ ...prev, quality: v }))}
                      />
                      <StarRatingInput
                        label="Communication"
                        value={detailedRatings.communication}
                        onChange={(v) => setDetailedRatings(prev => ({ ...prev, communication: v }))}
                      />
                      <StarRatingInput
                        label="Timeliness"
                        value={detailedRatings.timeliness}
                        onChange={(v) => setDetailedRatings(prev => ({ ...prev, timeliness: v }))}
                      />
                      <StarRatingInput
                        label="Professionalism"
                        value={detailedRatings.professionalism}
                        onChange={(v) => setDetailedRatings(prev => ({ ...prev, professionalism: v }))}
                      />
                    </>
                  ) : (
                    <>
                      <StarRatingInput
                        label="Payment"
                        value={detailedRatings.payment}
                        onChange={(v) => setDetailedRatings(prev => ({ ...prev, payment: v }))}
                      />
                      <StarRatingInput
                        label="Communication"
                        value={detailedRatings.communication}
                        onChange={(v) => setDetailedRatings(prev => ({ ...prev, communication: v }))}
                      />
                      <StarRatingInput
                        label="Requirements Clarity"
                        value={detailedRatings.clarity}
                        onChange={(v) => setDetailedRatings(prev => ({ ...prev, clarity: v }))}
                      />
                      <StarRatingInput
                        label="Respect"
                        value={detailedRatings.respect}
                        onChange={(v) => setDetailedRatings(prev => ({ ...prev, respect: v }))}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Sum up your experience in a few words..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about your experience..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Skills (for worker reviews) */}
              {targetUserType === 'worker' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Skills Demonstrated
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Communication (comma separated)"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Would Recommend */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">
                  Would you {targetUserType === 'worker' ? 'hire' : 'work with'} again?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      wouldRecommend === true
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      wouldRecommend === false
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4 rotate-180" />
                    No
                  </button>
                </div>
              </div>

              {/* Paid on Time (for client reviews) */}
              {targetUserType === 'client' && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700">
                    Paid on time?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaidOnTime(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        paidOnTime === true
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaidOnTime(false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        paidOnTime === false
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      No
                    </button>
                  </div>
                </div>
              )}

              {/* Visibility */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="isPublic" className="text-sm text-slate-700">
                  Make this review public (visible to others)
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || overallRating === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
