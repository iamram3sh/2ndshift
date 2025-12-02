'use client'

import { useState } from 'react'
import { Sparkles, Loader2, CheckCircle, Users, DollarSign, Calendar } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { useTranslation } from '@/lib/i18n'
import { formatCurrency } from '@/lib/utils/formatCurrency'

interface AIJobWizardProps {
  onJobCreated?: (jobId: string) => void
  onCancel?: () => void
}

export function AIJobWizard({ onJobCreated, onCancel }: AIJobWizardProps) {
  const { t } = useTranslation()
  const [requirement, setRequirement] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!requirement.trim()) {
      setError('Please enter a job requirement')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.generateJobSpec(requirement.trim())

      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate job spec')
      }

      setResult(response.data)
    } catch (err: any) {
      setError(err.message || 'Failed to generate job specification')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = async () => {
    if (!result) return

    setLoading(true)
    try {
      // Create job using the generated spec
      const jobResponse = await apiClient.request('/jobs', {
        method: 'POST',
        body: JSON.stringify({
          title: result.job_spec.title,
          description: result.job_spec.description,
          price_fixed: result.job_spec.estimated_price_min,
          delivery_window: result.job_spec.delivery_window,
          status: 'draft',
        }),
      })

      if (jobResponse.error) {
        throw new Error(jobResponse.error.message || 'Failed to create job')
      }

      onJobCreated?.(jobResponse.data?.job?.id || '')
    } catch (err: any) {
      setError(err.message || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">AI Job Wizard</h3>
          <p className="text-sm text-slate-600">Describe your requirement in one line</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div>
            <textarea
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g., Need CI/CD pipeline fix for our Kubernetes deployment, urgent"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
              rows={4}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !requirement.trim()}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Job Spec
              </>
            )}
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-700 mb-1">[DEMO-STUB] This is a deterministic stub. Replace with real LLM in production.</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Generated Job Specification</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600">Title</label>
                <p className="font-medium text-slate-900">{result.job_spec.title}</p>
              </div>
              <div>
                <label className="text-sm text-slate-600">Description</label>
                <p className="text-slate-700">{result.job_spec.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Estimated Price
                  </label>
                  <p className="font-medium text-slate-900">
                    {formatCurrency(result.job_spec.estimated_price_min)} - {formatCurrency(result.job_spec.estimated_price_max)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Delivery Window
                  </label>
                  <p className="font-medium text-slate-900">{result.job_spec.delivery_window}</p>
                </div>
              </div>
            </div>
          </div>

          {result.top_workers && result.top_workers.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Top Matched Workers
              </h4>
              <div className="space-y-2">
                {result.top_workers.slice(0, 3).map((worker: any, i: number) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{worker.name}</p>
                        <p className="text-sm text-slate-600">{worker.headline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Score: {worker.score}</p>
                        <p className="text-xs text-emerald-600">{worker.verified_level} verified</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleCreateJob}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Create Job
                </>
              )}
            </button>
            <button
              onClick={() => {
                setResult(null)
                setRequirement('')
              }}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
