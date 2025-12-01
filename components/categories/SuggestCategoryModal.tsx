'use client'

import { useState, useEffect } from 'react'
import { X, Plus, CheckCircle, AlertCircle, Loader2, Building2, FolderTree, Wrench } from 'lucide-react'
import type { Industry, SuggestionType } from '@/types/categories'

interface SuggestCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  defaultType?: SuggestionType
  parentIndustryId?: string
}

export function SuggestCategoryModal({
  isOpen,
  onClose,
  userId,
  defaultType = 'skill',
  parentIndustryId,
}: SuggestCategoryModalProps) {
  const [step, setStep] = useState(1)
  const [type, setType] = useState<SuggestionType>(defaultType)
  const [industries, setIndustries] = useState<Industry[]>([])
  const [selectedParent, setSelectedParent] = useState(parentIndustryId || '')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchIndustries()
      setStep(1)
      setType(defaultType)
      setSelectedParent(parentIndustryId || '')
      setName('')
      setDescription('')
      setReason('')
      setIsSuccess(false)
      setError('')
    }
  }, [isOpen, defaultType, parentIndustryId])

  const fetchIndustries = async () => {
    try {
      const response = await fetch('/api/industries')
      const data = await response.json()
      setIndustries(data.industries || [])
    } catch (error) {
      console.error('Error fetching industries:', error)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    if (type !== 'industry' && !selectedParent) {
      setError('Please select a parent industry')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          suggestion_type: type,
          parent_id: type !== 'industry' ? selectedParent : null,
          suggested_name: name.trim(),
          suggested_description: description.trim() || null,
          reason: reason.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit suggestion')
      }

      setIsSuccess(true)
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
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Suggest a New {type === 'industry' ? 'Industry' : type === 'category' ? 'Category' : 'Skill'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Suggestion Submitted!
              </h3>
              <p className="text-slate-600 mb-6">
                Thank you for your suggestion. Our team will review it and notify you once it's processed.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Choose Type */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 mb-4">
                    What would you like to suggest?
                  </p>

                  <button
                    onClick={() => { setType('industry'); setStep(2) }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      type === 'industry' 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-900">New Industry</div>
                      <div className="text-sm text-slate-500">
                        A new sector like Aerospace, Biotech, etc.
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setType('category'); setStep(2) }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      type === 'category' 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FolderTree className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-900">New Category</div>
                      <div className="text-sm text-slate-500">
                        A sub-category within an industry
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setType('skill'); setStep(2) }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      type === 'skill' 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-900">New Skill</div>
                      <div className="text-sm text-slate-500">
                        A specific skill like a tool, technology, or expertise
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Parent Industry (for category/skill) */}
                  {type !== 'industry' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Parent Industry *
                      </label>
                      <select
                        value={selectedParent}
                        onChange={(e) => setSelectedParent(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      >
                        <option value="">Select an industry</option>
                        {industries.map((industry) => (
                          <option key={industry.id} value={industry.id}>
                            {industry.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {type === 'industry' ? 'Industry' : type === 'category' ? 'Category' : 'Skill'} Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={
                        type === 'industry' 
                          ? 'e.g., Aerospace & Defense' 
                          : type === 'category' 
                            ? 'e.g., IoT Development'
                            : 'e.g., Arduino Programming'
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of what this covers..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Why should we add this? (optional)
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Help us understand why this would be valuable..."
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    />
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
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Back
              </button>
            )}
            {step === 1 && <div />}

            {step === 2 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Submit Suggestion
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
