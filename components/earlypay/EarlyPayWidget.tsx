'use client'

import { useState, useEffect } from 'react'
import { Zap, ArrowRight, CheckCircle, Clock, Info, AlertCircle, Loader2 } from 'lucide-react'

interface EarlyPayWidgetProps {
  userId: string
  onRequestEarlyPay?: () => void
}

interface EligibilityData {
  totalEarned: number
  alreadyPaid: number
  pendingInEscrow: number
  eligibleForAdvance: number
  maxAdvancePercent: number
  eligibilityScore: number
  isEligible: boolean
}

export function EarlyPayWidget({ userId, onRequestEarlyPay }: EarlyPayWidgetProps) {
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [requestAmount, setRequestAmount] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchEligibility()
  }, [userId])

  const fetchEligibility = async () => {
    try {
      // Mock data for development
      setEligibility({
        totalEarned: 7500000, // ₹75,000
        alreadyPaid: 2000000, // ₹20,000
        pendingInEscrow: 5500000, // ₹55,000
        eligibleForAdvance: 4400000, // ₹44,000 (80% of pending)
        maxAdvancePercent: 80,
        eligibilityScore: 85,
        isEligible: true,
      })
    } catch (err) {
      console.error('Error fetching eligibility:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount / 100)
  }

  const handleRequest = async () => {
    if (!requestAmount) return

    const amount = parseFloat(requestAmount) * 100 // Convert to paise

    if (amount > (eligibility?.eligibleForAdvance || 0)) {
      setError(`Maximum available is ${formatAmount(eligibility?.eligibleForAdvance || 0)}`)
      return
    }

    setIsRequesting(true)
    setError(null)

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API
      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        setSuccess(false)
        setRequestAmount('')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to process request')
    } finally {
      setIsRequesting(false)
    }
  }

  const advanceFee = requestAmount ? parseFloat(requestAmount) * 0.025 : 0
  const netAmount = requestAmount ? parseFloat(requestAmount) - advanceFee : 0

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading EarlyPay...</span>
        </div>
      </div>
    )
  }

  if (!eligibility?.isEligible) {
    return (
      <div className="bg-slate-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-200 rounded-xl">
            <Zap className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">EarlyPay</h3>
            <p className="text-sm text-slate-600 mb-3">
              Complete more projects to unlock EarlyPay. You need a minimum eligibility score of 60.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${eligibility?.eligibilityScore || 0}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {eligibility?.eligibilityScore || 0}/60
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">EarlyPay</h3>
              <p className="text-emerald-100 text-sm">Get your money early</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {formatAmount(eligibility.eligibleForAdvance)}
            </div>
            <div className="text-xs text-emerald-100">Available to withdraw</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-white/10 rounded-xl">
          <div>
            <div className="text-xs text-emerald-100 mb-1">Pending in Escrow</div>
            <div className="font-semibold">{formatAmount(eligibility.pendingInEscrow)}</div>
          </div>
          <div>
            <div className="text-xs text-emerald-100 mb-1">Max Advance</div>
            <div className="font-semibold">{eligibility.maxAdvancePercent}%</div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-white text-emerald-600 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
        >
          Get Money Now
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-emerald-100 text-center mt-3 flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          2.5% advance fee applies
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl">
            {success ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Request Submitted!</h3>
                <p className="text-slate-600">
                  Your EarlyPay request has been approved. Money will be transferred within 2 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <Zap className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Request EarlyPay</h2>
                      <p className="text-sm text-slate-500">
                        Available: {formatAmount(eligibility.eligibleForAdvance)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Amount to withdraw
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                      <input
                        type="number"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        placeholder="Enter amount"
                        max={eligibility.eligibleForAdvance / 100}
                        className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>Min: ₹500</span>
                      <span>Max: {formatAmount(eligibility.eligibleForAdvance)}</span>
                    </div>
                  </div>

                  {requestAmount && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Amount</span>
                        <span className="font-medium text-slate-900">₹{parseFloat(requestAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Advance Fee (2.5%)</span>
                        <span className="text-red-600">-₹{advanceFee.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between">
                        <span className="font-medium text-slate-900">You'll receive</span>
                        <span className="text-lg font-bold text-emerald-600">₹{netAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRequest}
                      disabled={isRequesting || !requestAmount}
                      className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isRequesting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Withdraw Now
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 text-center mt-4 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    Money transferred to your bank within 2 hours
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
