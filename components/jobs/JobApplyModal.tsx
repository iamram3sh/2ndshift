'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Info, AlertCircle, Loader2 } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { CommissionCalculator } from '@/components/revenue/CommissionCalculator'

interface JobApplyModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobPrice: number
  jobTitle: string
  workerId?: string
  clientId?: string
  isMicrotask?: boolean
  onApplySuccess?: () => void
}

export function JobApplyModal({
  isOpen,
  onClose,
  jobId,
  jobPrice,
  jobTitle,
  workerId,
  clientId,
  isMicrotask = false,
  onApplySuccess,
}: JobApplyModalProps) {
  const [coverText, setCoverText] = useState('')
  const [proposedPrice, setProposedPrice] = useState(jobPrice)
  const [proposedDelivery, setProposedDelivery] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)
  const [creditsRequired, setCreditsRequired] = useState(3)

  useEffect(() => {
    if (isOpen) {
      fetchCreditsBalance()
      fetchCreditsRequired()
    }
  }, [isOpen])

  const fetchCreditsBalance = async () => {
    try {
      const result = await apiClient.getCreditsBalance()
      if (result.data) {
        setCreditsBalance(result.data.balance || 0)
      }
    } catch (err) {
      console.error('Error fetching credits:', err)
    }
  }

  const fetchCreditsRequired = async () => {
    try {
      const result = await apiClient.getPlatformConfig()
      if (result.data?.credits_per_application) {
        setCreditsRequired(parseInt(result.data.credits_per_application) || 3)
      }
    } catch (err) {
      console.error('Error fetching config:', err)
    }
  }

  const handleApply = async () => {
    if (creditsBalance !== null && creditsBalance < creditsRequired) {
      setError(`Insufficient credits. You need ${creditsRequired} credits to apply.`)
      return
    }

    setIsApplying(true)
    setError(null)

    try {
      const result = await apiClient.applyToJob(jobId, {
        cover_text: coverText,
        proposed_price: proposedPrice,
        proposed_delivery: proposedDelivery ? new Date(proposedDelivery).toISOString() : undefined,
      })

      if (result.error) {
        if (result.error.error === 'Insufficient Shift Credits') {
          setError(`Insufficient credits. You need ${result.error.required || creditsRequired} credits. Available: ${result.error.available || 0}`)
        } else {
          setError(result.error.message || result.error.error || 'Failed to apply')
        }
        return
      }

      // Track analytics
      if (typeof window !== 'undefined') {
        const { trackJobApplied } = await import('@/lib/analytics/events')
        trackJobApplied(jobId, jobPrice, proposedPrice)
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

  const hasEnoughCredits = creditsBalance !== null && creditsBalance >= creditsRequired

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Apply to Job</h2>
            <p className="text-sm text-slate-600 mt-1">{jobTitle}</p>
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
          {/* Credits Check */}
          {creditsBalance !== null && (
            <div className={`p-4 rounded-xl border-2 ${
              hasEnoughCredits
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className={`w-5 h-5 ${hasEnoughCredits ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <div>
                    <div className="font-semibold text-slate-900">
                      {hasEnoughCredits ? 'Credits Available' : 'Insufficient Credits'}
                    </div>
                    <div className="text-sm text-slate-600">
                      You have {creditsBalance} credits. {creditsRequired} credits required to apply.
                    </div>
                  </div>
                </div>
                {!hasEnoughCredits && (
                  <button
                    onClick={() => {
                      onClose()
                      // Trigger buy credits modal - parent should handle this
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('openBuyCredits'))
                      }
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                  >
                    Buy Credits
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-900">Error</div>
                  <div className="text-sm text-red-700 mt-1">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Commission Calculator */}
          {workerId && (
            <CommissionCalculator
              price={proposedPrice}
              jobId={jobId}
              workerId={workerId}
              clientId={clientId}
              isMicroTask={isMicrotask}
            />
          )}

          {/* Proposed Price */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Proposed Price (₹)
            </label>
            <input
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              min={0}
              step={0.01}
            />
            <p className="text-xs text-slate-500 mt-1">
              Job budget: ₹{jobPrice.toLocaleString()}
            </p>
          </div>

          {/* Proposed Delivery */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Proposed Delivery Date
            </label>
            <input
              type="date"
              value={proposedDelivery}
              onChange={(e) => setProposedDelivery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={coverText}
              onChange={(e) => setCoverText(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Tell the client why you're the right fit for this job..."
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={isApplying || !hasEnoughCredits}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isApplying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                Apply to Job ({creditsRequired} Credits)
                <Zap className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Info */}
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium mb-1">About Credits:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>{creditsRequired} credits will be reserved when you apply</li>
                  <li>Credits are refunded if the client doesn't view your proposal within 7 days</li>
                  <li>Credits are refunded if you withdraw your application</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
