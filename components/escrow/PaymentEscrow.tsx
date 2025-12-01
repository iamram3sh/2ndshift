'use client'

import { useState, useEffect } from 'react'
import { 
  Lock, Unlock, CheckCircle, Clock, AlertCircle, ArrowRight, 
  Shield, DollarSign, Star, Send, RefreshCw, AlertTriangle,
  ChevronDown, ChevronUp, Loader2, IndianRupee
} from 'lucide-react'

type EscrowStatus = 
  | 'pending' 
  | 'funded' 
  | 'work_started' 
  | 'work_submitted' 
  | 'revision_requested' 
  | 'approved' 
  | 'released' 
  | 'disputed' 
  | 'refunded' 
  | 'cancelled'

interface EscrowData {
  id: string
  status: EscrowStatus
  totalAmount: number
  platformFee: number
  tdsAmount: number
  professionalPayout: number
  fundedAt?: string
  workStartedAt?: string
  workSubmittedAt?: string
  approvedAt?: string
  releasedAt?: string
  revisionCount: number
  maxRevisions: number
  clientRating?: number
  clientReview?: string
}

interface PaymentEscrowProps {
  contractId: string
  projectId: string
  clientId: string
  professionalId: string
  amount: number
  userType: 'client' | 'professional'
  userId: string
  projectTitle: string
}

const STATUS_CONFIG: Record<EscrowStatus, { 
  label: string
  color: string
  bgColor: string
  icon: React.ComponentType<any>
  description: string
}> = {
  pending: {
    label: 'Awaiting Payment',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: Lock,
    description: 'Client needs to lock payment to proceed',
  },
  funded: {
    label: 'Payment Locked',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    icon: Shield,
    description: 'Payment is secured. Professional can start work.',
  },
  work_started: {
    label: 'Work in Progress',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50 border-sky-200',
    icon: Clock,
    description: 'Professional is working on the project',
  },
  work_submitted: {
    label: 'Under Review',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    icon: Send,
    description: 'Work submitted. Awaiting client review.',
  },
  revision_requested: {
    label: 'Revision Requested',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200',
    icon: RefreshCw,
    description: 'Client requested changes',
  },
  approved: {
    label: 'Approved',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    icon: CheckCircle,
    description: 'Work approved by client',
  },
  released: {
    label: 'Payment Released',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    icon: Unlock,
    description: 'Payment has been released to professional',
  },
  disputed: {
    label: 'In Dispute',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    icon: AlertTriangle,
    description: 'This contract is under dispute resolution',
  },
  refunded: {
    label: 'Refunded',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 border-slate-200',
    icon: DollarSign,
    description: 'Payment has been refunded to client',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 border-slate-200',
    icon: AlertCircle,
    description: 'This escrow was cancelled',
  },
}

export function PaymentEscrow({
  contractId,
  projectId,
  clientId,
  professionalId,
  amount,
  userType,
  userId,
  projectTitle,
}: PaymentEscrowProps) {
  const [escrow, setEscrow] = useState<EscrowData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEscrow()
  }, [contractId])

  const fetchEscrow = async () => {
    try {
      const response = await fetch(`/api/escrow?contractId=${contractId}&userId=${userId}`)
      const data = await response.json()
      
      if (data.escrow) {
        setEscrow({
          id: data.escrow.id,
          status: data.escrow.status,
          totalAmount: data.escrow.total_amount || amount,
          platformFee: data.escrow.platform_fee || amount * 0.1,
          tdsAmount: data.escrow.tds_amount || 0,
          professionalPayout: data.escrow.professional_payout || amount * 0.9,
          fundedAt: data.escrow.funded_at,
          workStartedAt: data.escrow.work_started_at,
          workSubmittedAt: data.escrow.work_submitted_at,
          approvedAt: data.escrow.approved_at,
          releasedAt: data.escrow.released_at,
          revisionCount: data.escrow.revision_count || 0,
          maxRevisions: data.escrow.max_revisions || 2,
          clientRating: data.escrow.client_rating,
          clientReview: data.escrow.client_review,
        })
      } else {
        // Create new escrow
        await createEscrow()
      }
    } catch (err) {
      console.error('Error fetching escrow:', err)
      setError('Failed to load payment details')
    } finally {
      setIsLoading(false)
    }
  }

  const createEscrow = async () => {
    try {
      const response = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          projectId,
          clientId,
          professionalId,
          amount,
        }),
      })
      const data = await response.json()
      
      if (data.success && data.escrow) {
        setEscrow({
          id: data.escrow.id,
          status: data.escrow.status || 'pending',
          totalAmount: data.escrow.totalAmount || amount,
          platformFee: data.escrow.platformFee || amount * 0.1,
          tdsAmount: data.escrow.tdsAmount || 0,
          professionalPayout: data.escrow.professionalPayout || amount * 0.9,
          revisionCount: 0,
          maxRevisions: 2,
        })
      }
    } catch (err) {
      console.error('Error creating escrow:', err)
    }
  }

  const handleAction = async (action: string) => {
    if (action === 'approve' && rating === 0) {
      setError('Please provide a rating')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/escrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          escrowId: escrow?.id,
          action,
          userId,
          rating: action === 'approve' ? rating : undefined,
          review: action === 'approve' ? review : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchEscrow()
      } else {
        setError(data.error || 'Action failed')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          <span className="text-slate-600">Loading payment details...</span>
        </div>
      </div>
    )
  }

  if (!escrow) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 text-slate-500">
          <AlertCircle className="w-5 h-5" />
          <span>Payment escrow not available</span>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[escrow.status]
  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Payment Protection</h3>
              <p className="text-sm text-slate-500">{projectTitle}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} border`}>
            {statusConfig.label}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-3">{statusConfig.description}</p>
      </div>

      {/* Amount Summary */}
      <div className="p-6 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-600">Contract Amount</span>
          <span className="text-2xl font-bold text-slate-900">
            ₹{escrow.totalAmount.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          View breakdown
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Platform Fee (10%)</span>
              <span className="text-slate-900">-₹{escrow.platformFee.toLocaleString()}</span>
            </div>
            {escrow.tdsAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">TDS (10%)</span>
                <span className="text-slate-900">-₹{escrow.tdsAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-200">
              <span className="text-slate-900">Professional Receives</span>
              <span className="text-emerald-600">₹{escrow.professionalPayout.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          {['pending', 'funded', 'work_submitted', 'released'].map((step, index) => {
            const steps = ['pending', 'funded', 'work_submitted', 'released']
            const currentIndex = steps.indexOf(escrow.status)
            const isCompleted = index < currentIndex || escrow.status === 'released'
            const isCurrent = steps[index] === escrow.status

            return (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isCurrent 
                      ? 'bg-sky-500 text-white' 
                      : 'bg-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-1 rounded ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Lock</span>
          <span>Funded</span>
          <span>Review</span>
          <span>Released</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-slate-200">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Client Actions */}
        {userType === 'client' && (
          <>
            {escrow.status === 'pending' && (
              <button
                onClick={() => handleAction('fund')}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Lock Payment - ₹{escrow.totalAmount.toLocaleString()}
                  </>
                )}
              </button>
            )}

            {escrow.status === 'work_submitted' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rate the work *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Review (optional)
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  {escrow.revisionCount < escrow.maxRevisions && (
                    <button
                      onClick={() => handleAction('request_revision')}
                      disabled={isProcessing}
                      className="flex-1 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                      Request Revision ({escrow.maxRevisions - escrow.revisionCount} left)
                    </button>
                  )}
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={isProcessing || rating === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Approve & Release Payment
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Professional Actions */}
        {userType === 'professional' && (
          <>
            {escrow.status === 'pending' && (
              <div className="text-center py-4">
                <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Waiting for payment</p>
                <p className="text-sm text-slate-500 mt-1">
                  Client needs to lock the payment before you can start work
                </p>
              </div>
            )}

            {escrow.status === 'funded' && (
              <button
                onClick={() => handleAction('start_work')}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-xl font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Start Working
                  </>
                )}
              </button>
            )}

            {(escrow.status === 'work_started' || escrow.status === 'revision_requested') && (
              <button
                onClick={() => handleAction('submit_work')}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Work for Review
                  </>
                )}
              </button>
            )}

            {escrow.status === 'work_submitted' && (
              <div className="text-center py-4">
                <Clock className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Awaiting client review</p>
                <p className="text-sm text-slate-500 mt-1">
                  You'll be notified once the client reviews your work
                </p>
              </div>
            )}
          </>
        )}

        {/* Released State */}
        {escrow.status === 'released' && (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-emerald-600 font-semibold">Payment Released!</p>
            {userType === 'professional' && (
              <p className="text-sm text-slate-500 mt-1">
                ₹{escrow.professionalPayout.toLocaleString()} has been credited to your account
              </p>
            )}
            {escrow.clientRating && (
              <div className="flex items-center justify-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= escrow.clientRating!
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trust Badge */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Protected by 2ndShift Payment Protection</span>
        </div>
      </div>
    </div>
  )
}
