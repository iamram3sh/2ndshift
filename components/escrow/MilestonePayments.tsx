'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, Trash2, CheckCircle, Clock, Lock, Unlock, Send,
  AlertCircle, ChevronDown, ChevronUp, Loader2, Star,
  GripVertical, Calendar, IndianRupee, Shield, Edit2
} from 'lucide-react'

interface Milestone {
  id: string
  number: number
  title: string
  description: string
  amount: number
  dueDate?: string
  status: 'pending' | 'funded' | 'work_started' | 'work_submitted' | 'approved' | 'released'
  submittedAt?: string
  approvedAt?: string
  rating?: number
  feedback?: string
}

interface MilestonePaymentsProps {
  escrowId: string
  totalAmount: number
  userType: 'client' | 'professional'
  userId: string
  isEditable?: boolean
  onMilestonesChange?: (milestones: Milestone[]) => void
}

export function MilestonePayments({
  escrowId,
  totalAmount,
  userType,
  userId,
  isEditable = false,
  onMilestonesChange,
}: MilestonePaymentsProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMilestones()
  }, [escrowId])

  const fetchMilestones = async () => {
    try {
      const response = await fetch(`/api/escrow/milestones?escrowId=${escrowId}`)
      const data = await response.json()
      
      if (data.milestones) {
        setMilestones(data.milestones)
      }
    } catch (err) {
      console.error('Error fetching milestones:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `temp-${Date.now()}`,
      number: milestones.length + 1,
      title: `Milestone ${milestones.length + 1}`,
      description: '',
      amount: 0,
      status: 'pending',
    }
    const updated = [...milestones, newMilestone]
    setMilestones(updated)
    onMilestonesChange?.(updated)
    setExpandedId(newMilestone.id)
  }

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    const updated = milestones.map(m => 
      m.id === id ? { ...m, ...updates } : m
    )
    setMilestones(updated)
    onMilestonesChange?.(updated)
  }

  const removeMilestone = (id: string) => {
    const updated = milestones
      .filter(m => m.id !== id)
      .map((m, i) => ({ ...m, number: i + 1 }))
    setMilestones(updated)
    onMilestonesChange?.(updated)
  }

  const distributeMilestonesEvenly = () => {
    if (milestones.length === 0) return
    const amountPerMilestone = Math.floor(totalAmount / milestones.length)
    const remainder = totalAmount - (amountPerMilestone * milestones.length)
    
    const updated = milestones.map((m, i) => ({
      ...m,
      amount: amountPerMilestone + (i === milestones.length - 1 ? remainder : 0)
    }))
    setMilestones(updated)
    onMilestonesChange?.(updated)
  }

  const handleMilestoneAction = async (milestoneId: string, action: string) => {
    if (action === 'approve' && rating === 0) {
      setError('Please provide a rating')
      return
    }

    setIsProcessing(milestoneId)
    setError('')

    try {
      const response = await fetch('/api/escrow/milestones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId,
          action,
          userId,
          rating: action === 'approve' ? rating : undefined,
          feedback: action === 'approve' ? feedback : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchMilestones()
        setRating(0)
        setFeedback('')
      } else {
        setError(data.error || 'Action failed')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsProcessing(null)
    }
  }

  const totalAllocated = milestones.reduce((sum, m) => sum + m.amount, 0)
  const remainingAmount = totalAmount - totalAllocated

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string }> = {
      pending: { color: 'text-slate-500', bg: 'bg-slate-100', label: 'Pending' },
      funded: { color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Funded' },
      work_started: { color: 'text-sky-600', bg: 'bg-sky-100', label: 'In Progress' },
      work_submitted: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Submitted' },
      approved: { color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Approved' },
      released: { color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Released' },
    }
    return configs[status] || configs.pending
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Payment Milestones</h3>
          <p className="text-sm text-slate-500">
            Split the project into smaller, funded milestones
          </p>
        </div>
        {isEditable && (
          <button
            onClick={addMilestone}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
        )}
      </div>

      {/* Amount Summary */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Total Contract</span>
          <span className="font-semibold text-slate-900">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Allocated</span>
          <span className={`font-medium ${totalAllocated > totalAmount ? 'text-red-600' : 'text-slate-900'}`}>
            ₹{totalAllocated.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Remaining</span>
          <span className={`font-medium ${remainingAmount < 0 ? 'text-red-600' : remainingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            ₹{remainingAmount.toLocaleString()}
          </span>
        </div>
        {isEditable && milestones.length > 0 && (
          <button
            onClick={distributeMilestonesEvenly}
            className="mt-3 w-full text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            Distribute evenly across milestones
          </button>
        )}
      </div>

      {/* Milestones List */}
      {milestones.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl border border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No milestones yet</p>
          <p className="text-sm text-slate-500 mt-1">
            {isEditable 
              ? 'Add milestones to split this project into manageable phases'
              : 'This project uses single payment'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone) => {
            const statusConfig = getStatusConfig(milestone.status)
            const isExpanded = expandedId === milestone.id

            return (
              <div
                key={milestone.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                {/* Milestone Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                >
                  <div className="flex items-center gap-4">
                    {isEditable && (
                      <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                    )}
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
                      {milestone.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900 truncate">
                          {milestone.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      {milestone.dueDate && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        ₹{milestone.amount.toLocaleString()}
                      </div>
                      {milestone.rating && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= milestone.rating!
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-slate-200 p-4 bg-slate-50">
                    {isEditable ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={milestone.description}
                            onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                            placeholder="What will be delivered in this milestone?"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Amount (₹)
                            </label>
                            <input
                              type="number"
                              value={milestone.amount}
                              onChange={(e) => updateMilestone(milestone.id, { amount: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Due Date
                            </label>
                            <input
                              type="date"
                              value={milestone.dueDate || ''}
                              onChange={(e) => updateMilestone(milestone.id, { dueDate: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeMilestone(milestone.id)}
                          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Milestone
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {milestone.description && (
                          <p className="text-sm text-slate-600">{milestone.description}</p>
                        )}

                        {error && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                          </div>
                        )}

                        {/* Client Actions */}
                        {userType === 'client' && milestone.status === 'work_submitted' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Rate this milestone *
                              </label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="p-0.5"
                                  >
                                    <Star
                                      className={`w-6 h-6 ${
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
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Feedback (optional)
                              </label>
                              <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                placeholder="Any comments about this milestone?"
                              />
                            </div>
                            <button
                              onClick={() => handleMilestoneAction(milestone.id, 'approve')}
                              disabled={isProcessing === milestone.id || rating === 0}
                              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                              {isProcessing === milestone.id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  Approve & Release ₹{milestone.amount.toLocaleString()}
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Professional Actions */}
                        {userType === 'professional' && (
                          <>
                            {milestone.status === 'funded' && (
                              <button
                                onClick={() => handleMilestoneAction(milestone.id, 'start_work')}
                                disabled={isProcessing === milestone.id}
                                className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-2.5 rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors"
                              >
                                {isProcessing === milestone.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  'Start Work on This Milestone'
                                )}
                              </button>
                            )}

                            {milestone.status === 'work_started' && (
                              <button
                                onClick={() => handleMilestoneAction(milestone.id, 'submit_work')}
                                disabled={isProcessing === milestone.id}
                                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                              >
                                {isProcessing === milestone.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <>
                                    <Send className="w-5 h-5" />
                                    Submit for Review
                                  </>
                                )}
                              </button>
                            )}

                            {milestone.status === 'work_submitted' && (
                              <div className="flex items-center gap-2 text-purple-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Awaiting client review</span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Released State */}
                        {milestone.status === 'released' && (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Payment Released</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-4">
        <Shield className="w-4 h-4 text-emerald-500" />
        <span>Each milestone is protected by 2ndShift Escrow</span>
      </div>
    </div>
  )
}

// Milestone Suggestion Component (for project creation)
export function MilestoneSuggestions({
  projectType,
  budget,
  onSelect,
}: {
  projectType: string
  budget: number
  onSelect: (milestones: Partial<Milestone>[]) => void
}) {
  const templates: Record<string, Partial<Milestone>[]> = {
    'web-development': [
      { title: 'Design & Planning', description: 'UI/UX designs, wireframes, technical specs', amount: budget * 0.2 },
      { title: 'Development Phase 1', description: 'Core functionality and backend', amount: budget * 0.4 },
      { title: 'Development Phase 2', description: 'Frontend and integrations', amount: budget * 0.25 },
      { title: 'Testing & Launch', description: 'QA, bug fixes, deployment', amount: budget * 0.15 },
    ],
    'mobile-app': [
      { title: 'Requirements & Design', description: 'App design, user flows', amount: budget * 0.2 },
      { title: 'Core Development', description: 'Main features and API integration', amount: budget * 0.45 },
      { title: 'Testing & Polish', description: 'Bug fixes, performance optimization', amount: budget * 0.2 },
      { title: 'App Store Submission', description: 'Deployment and store submission', amount: budget * 0.15 },
    ],
    'design': [
      { title: 'Concepts & Drafts', description: 'Initial design concepts', amount: budget * 0.3 },
      { title: 'Revisions', description: 'Feedback and iterations', amount: budget * 0.4 },
      { title: 'Final Delivery', description: 'Final files and handover', amount: budget * 0.3 },
    ],
    'default': [
      { title: 'Phase 1', description: 'Initial deliverables', amount: budget * 0.5 },
      { title: 'Phase 2', description: 'Final deliverables', amount: budget * 0.5 },
    ],
  }

  const suggestions = templates[projectType] || templates.default

  return (
    <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
      <h4 className="font-medium text-sky-900 mb-2">Suggested Milestones</h4>
      <p className="text-sm text-sky-700 mb-3">
        Based on your project type, here's a recommended milestone structure:
      </p>
      <div className="space-y-2 mb-4">
        {suggestions.map((m, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-sky-800">{m.title}</span>
            <span className="font-medium text-sky-900">₹{Math.round(m.amount || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSelect(suggestions)}
        className="w-full py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
      >
        Use This Template
      </button>
    </div>
  )
}
