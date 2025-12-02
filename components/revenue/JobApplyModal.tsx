'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Loader2, AlertCircle } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { CommissionCalculator } from './CommissionCalculator'

interface JobApplyModalProps {
  isOpen: boolean
  onClose: () => void
  job: {
    id: string
    title: string
    price_fixed?: number
    client_id?: string
    microtask_id?: string
  }
  workerId: string
  currentCredits: number
  onApplySuccess?: () => void
}

export function JobApplyModal({
  isOpen,
  onClose,
  job,
  workerId,
  currentCredits,
  onApplySuccess,
}: JobApplyModalProps) {
  const [coverText, setCoverText] = useState('')
  const [proposedPrice, setProposedPrice] = useState(job.price_fixed || 0)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creditsRequired] = useState(3) // From platform config

  useEffect(() => {
    if (isOpen && job.price_fixed) {
      setProposedPrice(job.price_fixed)
    }
  }, [isOpen, job.price_fixed])

  const handleApply = async () => {
    if (currentCredits < creditsRequired) {
      setError(`Insufficient credits. You need ${creditsRequired} credits to apply.`)
      return
    }

    setIsApplying(true)
    setError(null)

    try {
      const result = await apiClient.applyToJob(job.id, {
        cover_text: coverText,
        proposed_price: proposedPrice > 0 ? proposedPrice : undefined,
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to apply')
      }

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'job_applied',
          job_id: job.id,
          job_title: job.title,
          proposed_price: proposedPrice,
          credits_used: creditsRequired,
        })
      }

      onApplySuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to apply to job')
    } finally {
      setIsApplying(false)
    }
  }

  if (!isOpen) return null

  const isMicrotask = !!job.microtask_id

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Apply to Job</h2>
            <p className="text-sm text-slate-600 mt-1">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isApplying}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">{error}</p>
                {error.includes('Insufficient credits') && (
                  <button
                    onClick={() => {
                      onClose()
                      // Trigger buy credits modal
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('openBuyCredits'))
                      }
                    }}
                    className="mt-2 text-sm text-red-600 font-medium hover:text-red-700 underline"
                  >
                    Buy Credits
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Credits Required */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {creditsRequired} Credits Required
                  </p>
                  <p className="text-xs text-slate-600">
                    Your balance: {currentCredits} credits
                  </p>
                </div>
              </div>
              {currentCredits < creditsRequired && (
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                  Insufficient
                </span>
              )}
            </div>
          </div>

          {/* Commission Calculator */}
          {proposedPrice > 0 && (
            <CommissionCalculator
              price={proposedPrice}
              jobId={job.id}
              workerId={workerId}
              clientId={job.client_id}
              isMicroTask={isMicrotask}
            />
          )}

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={coverText}
              onChange={(e) => setCoverText(e.target.value)}
              placeholder="Tell the client why you're the right fit for this job..."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
              rows={4}
              disabled={isApplying}
            />
          </div>

          {/* Proposed Price (if job allows negotiation) */}
          {!job.price_fixed && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Proposed Price (₹)
              </label>
              <input
                type="number"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(parseFloat(e.target.value) || 0)}
                placeholder="Enter your proposed price"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                disabled={isApplying}
              />
            </div>
          )}

          {/* Apply Button */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              disabled={isApplying}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isApplying || currentCredits < creditsRequired}
              className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  Apply ({creditsRequired} Credits)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
