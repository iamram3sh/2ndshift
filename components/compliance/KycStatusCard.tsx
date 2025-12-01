'use client'

import { useEffect, useState } from 'react'
import { Shield, RefreshCcw, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react'
import type { KycVerification, KycVerificationStatus } from '@/types/database.types'

interface KycStatusCardProps {
  userId: string
  verificationType?: 'pan' | 'aadhaar' | 'gst' | 'bank_account' | 'address' | 'identity'
}

const STATUS_COPY: Record<
  KycVerificationStatus,
  { label: string; description: string; tone: 'info' | 'success' | 'warning' | 'error' }
> = {
  pending: {
    label: 'Verification Pending',
    description: 'You have requested verification. We will notify you once it is processing.',
    tone: 'info'
  },
  processing: {
    label: 'Verification In Progress',
    description: 'Our compliance partner is reviewing your documents. This usually finishes within a day.',
    tone: 'warning'
  },
  verified: {
    label: 'KYC Complete',
    description: 'You are cleared to receive payouts and access premium projects.',
    tone: 'success'
  },
  rejected: {
    label: 'Verification Rejected',
    description: 'We could not verify your documents. Update your details and try again.',
    tone: 'error'
  },
  expired: {
    label: 'Verification Expired',
    description: 'We need to refresh your KYC to stay compliant. Start a new verification.',
    tone: 'warning'
  }
}

export function KycStatusCard({ userId, verificationType = 'pan' }: KycStatusCardProps) {
  const [verification, setVerification] = useState<KycVerification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    if (!userId) return
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/kyc/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch status')
      }

      const data = await response.json()
      setVerification(data.verification ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load status')
    } finally {
      setIsLoading(false)
    }
  }

  const startVerification = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/kyc/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verificationType })
      })

      if (!response.ok) {
        throw new Error('Unable to start verification')
      }

      const data = await response.json()
      setVerification(data.verification)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start verification')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const statusTone = verification ? STATUS_COPY[verification.status].tone : 'info'

  const iconByTone = {
    info: Shield,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle
  } as const

  const toneStyles: Record<typeof statusTone, string> = {
    info: 'border-slate-200 bg-slate-50 text-slate-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    error: 'border-red-200 bg-red-50 text-red-700'
  }

  const ToneIcon = iconByTone[statusTone]

  const actionLabel = verification ? 'Refresh status' : 'Start verification'
  const showStart = !verification || verification.status === 'rejected' || verification.status === 'expired'

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Compliance</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">KYC Verification</h3>
          </div>
        </div>
        <button
          onClick={fetchStatus}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 disabled:opacity-50"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading verification status...
        </div>
      ) : (
        <>
          <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${toneStyles[statusTone]}`}>
            <ToneIcon className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold">{verification ? STATUS_COPY[verification.status].label : 'No verification on file'}</p>
              <p className="text-sm">{verification ? STATUS_COPY[verification.status].description : 'Complete KYC to unlock payouts and verified projects.'}</p>
            </div>
          </div>

          {verification?.notes && (
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700 rounded-lg p-3">
              <p className="font-medium mb-1">Notes from compliance</p>
              <p>{verification.notes}</p>
            </div>
          )}

          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              Last updated:{' '}
              {verification?.updated_at
                ? new Date(verification.updated_at).toLocaleString()
                : 'Not yet started'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchStatus}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50"
              >
                {actionLabel}
              </button>
              {showStart && (
                <button
                  onClick={startVerification}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Start verification'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </p>
          )}
        </>
      )}
    </div>
  )
}
