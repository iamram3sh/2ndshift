'use client'

import { useState } from 'react'
import {
  CheckCircle, Clock, AlertCircle, Upload, MessageSquare,
  Lock, ArrowRight, DollarSign, Shield, Flag, Loader2
} from 'lucide-react'
import type { Milestone, EscrowAccount, MilestoneStatus } from '@/types/features'

interface MilestoneTrackerProps {
  escrow: EscrowAccount
  userRole: 'client' | 'worker'
  onSubmitMilestone?: (milestoneId: string, notes: string) => Promise<void>
  onApproveMilestone?: (milestoneId: string, feedback: string) => Promise<void>
  onRequestRevision?: (milestoneId: string, feedback: string) => Promise<void>
  onDispute?: (milestoneId: string) => void
}

const statusConfig: Record<MilestoneStatus, { 
  label: string
  color: string
  icon: React.ComponentType<any>
  bgColor: string
}> = {
  pending: { label: 'Pending', color: 'text-slate-500', icon: Clock, bgColor: 'bg-slate-100' },
  in_progress: { label: 'In Progress', color: 'text-sky-600', icon: Clock, bgColor: 'bg-sky-50' },
  submitted: { label: 'Submitted', color: 'text-amber-600', icon: Upload, bgColor: 'bg-amber-50' },
  approved: { label: 'Approved', color: 'text-emerald-600', icon: CheckCircle, bgColor: 'bg-emerald-50' },
  revision_requested: { label: 'Revision Requested', color: 'text-orange-600', icon: AlertCircle, bgColor: 'bg-orange-50' },
  disputed: { label: 'Disputed', color: 'text-red-600', icon: Flag, bgColor: 'bg-red-50' },
  released: { label: 'Released', color: 'text-emerald-600', icon: CheckCircle, bgColor: 'bg-emerald-50' },
}

export function MilestoneTracker({
  escrow,
  userRole,
  onSubmitMilestone,
  onApproveMilestone,
  onRequestRevision,
  onDispute,
}: MilestoneTrackerProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [modalType, setModalType] = useState<'submit' | 'approve' | 'revision' | null>(null)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const milestones = escrow.milestones || []
  const totalAmount = escrow.total_amount
  const releasedAmount = escrow.released_amount || 0
  const progressPercent = totalAmount > 0 ? (releasedAmount / totalAmount) * 100 : 0

  const handleAction = async () => {
    if (!activeModal || !modalType) return

    setIsLoading(true)
    try {
      if (modalType === 'submit' && onSubmitMilestone) {
        await onSubmitMilestone(activeModal, notes)
      } else if (modalType === 'approve' && onApproveMilestone) {
        await onApproveMilestone(activeModal, notes)
      } else if (modalType === 'revision' && onRequestRevision) {
        await onRequestRevision(activeModal, notes)
      }
      setActiveModal(null)
      setModalType(null)
      setNotes('')
    } catch (error) {
      console.error('Error:', error)
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Escrow Protected</h3>
              <p className="text-sm text-slate-500">
                {formatAmount(escrow.funded_amount || 0)} of {formatAmount(totalAmount)} funded
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              {formatAmount(releasedAmount)}
            </div>
            <div className="text-xs text-slate-500">Released</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>0%</span>
            <span>{Math.round(progressPercent)}% Complete</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-slate-700 mb-4">Milestones</h4>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const config = statusConfig[milestone.status as MilestoneStatus] || statusConfig.pending
            const StatusIcon = config.icon
            const isActive = milestone.status === 'in_progress' || milestone.status === 'submitted' || milestone.status === 'revision_requested'
            
            return (
              <div
                key={milestone.id}
                className={`relative p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'border-sky-200 bg-sky-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Connector Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-8 top-14 w-0.5 h-8 bg-slate-200" />
                )}

                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgColor}`}>
                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-slate-900">{milestone.title}</h5>
                      <span className="text-lg font-semibold text-slate-900">
                        {formatAmount(milestone.amount)}
                      </span>
                    </div>

                    {milestone.description && (
                      <p className="text-sm text-slate-600 mb-2">{milestone.description}</p>
                    )}

                    <div className="flex items-center gap-4 mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                      {milestone.due_date && (
                        <span className="text-xs text-slate-500">
                          Due: {new Date(milestone.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Worker Notes */}
                    {milestone.worker_notes && (
                      <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-medium text-slate-500 mb-1">Worker Notes:</p>
                        <p className="text-sm text-slate-700">{milestone.worker_notes}</p>
                      </div>
                    )}

                    {/* Client Feedback */}
                    {milestone.client_feedback && (
                      <div className="mb-3 p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs font-medium text-amber-700 mb-1">Client Feedback:</p>
                        <p className="text-sm text-amber-900">{milestone.client_feedback}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {/* Worker Actions */}
                      {userRole === 'worker' && milestone.status === 'in_progress' && (
                        <button
                          onClick={() => {
                            setActiveModal(milestone.id)
                            setModalType('submit')
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Submit for Review
                        </button>
                      )}

                      {userRole === 'worker' && milestone.status === 'revision_requested' && (
                        <button
                          onClick={() => {
                            setActiveModal(milestone.id)
                            setModalType('submit')
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Resubmit
                        </button>
                      )}

                      {/* Client Actions */}
                      {userRole === 'client' && milestone.status === 'submitted' && (
                        <>
                          <button
                            onClick={() => {
                              setActiveModal(milestone.id)
                              setModalType('approve')
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve & Release
                          </button>
                          <button
                            onClick={() => {
                              setActiveModal(milestone.id)
                              setModalType('revision')
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Request Revision
                          </button>
                        </>
                      )}

                      {/* Dispute Button */}
                      {(milestone.status === 'submitted' || milestone.status === 'revision_requested') && (
                        <button
                          onClick={() => onDispute?.(milestone.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-red-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Flag className="w-4 h-4" />
                          Dispute
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {activeModal && modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {modalType === 'submit' && 'Submit Milestone'}
                {modalType === 'approve' && 'Approve & Release Payment'}
                {modalType === 'revision' && 'Request Revision'}
              </h3>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  modalType === 'submit'
                    ? 'Add notes about what was completed...'
                    : modalType === 'approve'
                    ? 'Add feedback (optional)...'
                    : 'Explain what needs to be revised...'
                }
                className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                required={modalType === 'revision'}
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={isLoading || (modalType === 'revision' && !notes.trim())}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    modalType === 'approve'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : modalType === 'revision'
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {modalType === 'approve' && 'Approve & Release'}
                      {modalType === 'revision' && 'Request Revision'}
                      {modalType === 'submit' && 'Submit'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
