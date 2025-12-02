/**
 * Verification Dashboard
 * Main dashboard showing all verification tiers
 */

'use client'

import { useEffect, useState } from 'react'
import { Shield, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight } from 'lucide-react'
import IDUploadCard from './IDUploadCard'
import FaceMatchWidget from './FaceMatchWidget'
import OTPVerification from './OTPVerification'
import SkillProofUploader from './SkillProofUploader'
import MicroTaskTest from './MicroTaskTest'
import VideoUploader from './VideoUploader'
import BadgesStack from './BadgesStack'
import VerificationProgress from './VerificationProgress'

interface VerificationStatus {
  tier1: {
    status: string
    completedAt: string | null
    badges: string[]
  }
  tier2: {
    status: string
    completedAt: string | null
    badges: string[]
  }
  tier3: {
    status: string
    completedAt: string | null
    badges: string[]
  }
  overallLevel: number
  badges: Array<{ type: string; awardedAt: string }>
}

interface VerificationDashboardProps {
  userId: string
}

export default function VerificationDashboard({ userId }: VerificationDashboardProps) {
  const [status, setStatus] = useState<VerificationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTier, setActiveTier] = useState<1 | 2 | 3 | null>(null)

  useEffect(() => {
    fetchStatus()
  }, [userId])

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/verification/status/${userId}`)
      const data = await response.json()
      if (data.userId) {
        setStatus(data)
      }
    } catch (error) {
      console.error('Error fetching verification status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case 'pending':
      case 'in_review':
        return <Clock className="w-5 h-5 text-amber-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-50 border-emerald-200'
      case 'pending':
      case 'in_review':
        return 'bg-amber-50 border-amber-200'
      case 'rejected':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
      </div>
    )
  }

  if (!status) {
    return (
      <div className="text-center py-12">
        <p className="text-[#333]">Failed to load verification status</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111] flex items-center gap-2">
            <Shield className="w-6 h-6 text-sky-600" />
            Verification Dashboard
          </h2>
          <p className="text-[#333] mt-1">Complete verification to build trust and unlock opportunities</p>
        </div>
        <BadgesStack userId={userId} size="md" />
      </div>

      {/* Progress Overview */}
      <VerificationProgress
        level={status.overallLevel}
        tier1Status={status.tier1.status}
        tier2Status={status.tier2.status}
        tier3Status={status.tier3.status}
      />

      {/* Tier 1: Identity Verification */}
      <div className={`border-2 rounded-xl p-6 ${getStatusColor(status.tier1.status)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.tier1.status)}
            <div>
              <h3 className="text-lg font-bold text-[#111]">Tier 1: Identity Verification</h3>
              <p className="text-sm text-[#333]">Verify your identity with government ID and face match</p>
            </div>
          </div>
          {status.tier1.status === 'verified' && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              Verified
            </span>
          )}
        </div>

        {status.tier1.status !== 'verified' && (
          <div className="mt-4 space-y-4">
            {activeTier === 1 ? (
              <div className="space-y-4">
                <IDUploadCard userId={userId} onComplete={fetchStatus} />
                <FaceMatchWidget userId={userId} onComplete={fetchStatus} />
                <OTPVerification userId={userId} onComplete={fetchStatus} />
                <button
                  onClick={() => setActiveTier(null)}
                  className="text-sm text-[#333] hover:text-[#111]"
                >
                  ← Back to overview
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTier(1)}
                className="w-full px-4 py-3 bg-[#111] text-white rounded-lg hover:bg-[#333] transition flex items-center justify-center gap-2 font-semibold"
              >
                Start Identity Verification
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tier 2: Skills Verification */}
      <div className={`border-2 rounded-xl p-6 ${getStatusColor(status.tier2.status)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.tier2.status)}
            <div>
              <h3 className="text-lg font-bold text-[#111]">Tier 2: Skills Verification</h3>
              <p className="text-sm text-[#333]">Verify your skills with proofs and microtask tests</p>
            </div>
          </div>
          {status.tier2.status === 'verified' && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              Verified
            </span>
          )}
        </div>

        {status.tier1.status === 'verified' && status.tier2.status !== 'verified' && (
          <div className="mt-4 space-y-4">
            {activeTier === 2 ? (
              <div className="space-y-4">
                <SkillProofUploader userId={userId} onComplete={fetchStatus} />
                <MicroTaskTest userId={userId} onComplete={fetchStatus} />
                <button
                  onClick={() => setActiveTier(null)}
                  className="text-sm text-[#333] hover:text-[#111]"
                >
                  ← Back to overview
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTier(2)}
                className="w-full px-4 py-3 bg-[#111] text-white rounded-lg hover:bg-[#333] transition flex items-center justify-center gap-2 font-semibold"
              >
                Start Skills Verification
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {status.tier1.status !== 'verified' && (
          <p className="text-sm text-[#333] mt-4">Complete Tier 1 first</p>
        )}
      </div>

      {/* Tier 3: Video Verification */}
      <div className={`border-2 rounded-xl p-6 ${getStatusColor(status.tier3.status)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.tier3.status)}
            <div>
              <h3 className="text-lg font-bold text-[#111]">Tier 3: Video Verification</h3>
              <p className="text-sm text-[#333]">Complete video verification for highest trust level</p>
            </div>
          </div>
          {status.tier3.status === 'verified' && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              Verified
            </span>
          )}
        </div>

        {status.tier2.status === 'verified' && status.tier3.status !== 'verified' && (
          <div className="mt-4 space-y-4">
            {activeTier === 3 ? (
              <div className="space-y-4">
                <VideoUploader userId={userId} onComplete={fetchStatus} />
                <button
                  onClick={() => setActiveTier(null)}
                  className="text-sm text-[#333] hover:text-[#111]"
                >
                  ← Back to overview
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTier(3)}
                className="w-full px-4 py-3 bg-[#111] text-white rounded-lg hover:bg-[#333] transition flex items-center justify-center gap-2 font-semibold"
              >
                Start Video Verification
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {status.tier2.status !== 'verified' && (
          <p className="text-sm text-[#333] mt-4">Complete Tier 2 first</p>
        )}
      </div>
    </div>
  )
}

