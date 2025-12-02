/**
 * Microtask Test Component
 */

'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface Microtask {
  id: string
  title: string
  description: string
  skill_category: string
  difficulty: string
  time_limit_minutes: number
}

interface MicroTaskTestProps {
  userId: string
  onComplete?: () => void
}

export default function MicroTaskTest({ userId, onComplete }: MicroTaskTestProps) {
  const [microtasks, setMicrotasks] = useState<Microtask[]>([])
  const [selectedTask, setSelectedTask] = useState<Microtask | null>(null)
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ passed: boolean; score: number; feedback: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMicrotasks()
  }, [])

  const fetchMicrotasks = async () => {
    try {
      const response = await fetch('/api/verification/microtask/list')
      const data = await response.json()
      if (data.microtasks) {
        setMicrotasks(data.microtasks)
      }
    } catch (error) {
      console.error('Error fetching microtasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTask || !submissionUrl) return

    setSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('microtaskId', selectedTask.id)
      formData.append('submissionType', 'url')
      formData.append('submissionUrl', submissionUrl)

      const response = await fetch('/api/verification/microtask/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      setSubmitted(true)
      setResult({
        passed: data.status === 'passed',
        score: data.score || 0,
        feedback: data.feedback || ''
      })

      if (data.status === 'passed' && onComplete) {
        onComplete()
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading microtasks...</div>
  }

  if (!selectedTask) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-[#111] mb-4">Select a Microtask</h4>
        <div className="space-y-3">
          {microtasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="w-full text-left p-4 border border-slate-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-[#111]">{task.title}</h5>
                  <p className="text-sm text-[#333] mt-1">{task.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  task.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  task.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {task.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (submitted && result) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className={`p-4 rounded-lg ${
          result.passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {result.passed ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-semibold ${
              result.passed ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {result.passed ? 'Passed!' : 'Failed'}
            </span>
            <span className="ml-auto text-sm font-medium">Score: {result.score}/100</span>
          </div>
          <p className={`text-sm ${result.passed ? 'text-emerald-700' : 'text-red-700'}`}>
            {result.feedback}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-[#111]">{selectedTask.title}</h4>
        <button
          onClick={() => setSelectedTask(null)}
          className="text-sm text-[#333] hover:text-[#111]"
        >
          ← Back
        </button>
      </div>

      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
        <p className="text-sm text-[#333] mb-2">{selectedTask.description}</p>
        <div className="flex items-center gap-4 text-xs text-[#333]">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {selectedTask.time_limit_minutes} minutes
          </span>
          <span className="capitalize">{selectedTask.difficulty}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#111] mb-2">
            Submission URL (GitHub repo or deployment) *
          </label>
          <input
            type="url"
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            placeholder="https://github.com/username/repo or https://your-app.vercel.app"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !submissionUrl}
          className="w-full px-4 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition disabled:opacity-50 font-semibold"
        >
          {submitting ? 'Submitting...' : 'Submit Solution'}
        </button>
      </form>
    </div>
  )
}

