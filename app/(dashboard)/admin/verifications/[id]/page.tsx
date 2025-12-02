/**
 * Admin Verification Detail Page
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { Shield, CheckCircle, XCircle, Clock, FileText, Video, User, ArrowLeft } from 'lucide-react'

export default function AdminVerificationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const verificationId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [verification, setVerification] = useState<any>(null)
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    checkAuth()
    fetchVerification()
  }, [verificationId])

  const checkAuth = async () => {
    try {
      // Use v1 API for authentication
      const result = await apiClient.getCurrentUser()
      
      if (result.error || !result.data?.user) {
        router.push('/login')
        setLoading(false)
        return
      }

      const currentUser = result.data.user
      
      if (!['admin', 'superadmin'].includes(currentUser.role)) {
        const routes: Record<string, string> = {
          worker: '/worker',
          client: '/client',
        }
        router.push(routes[currentUser.role] || '/')
        setLoading(false)
        return
      }

      // Fetch full profile from database
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (userData) {
        setUser(userData)
      } else {
        // Fallback to API user data
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.name || '',
          user_type: currentUser.role as 'admin' | 'superadmin',
        } as any)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchVerification = async () => {
    try {
      const response = await fetch(`/api/admin/verifications/${verificationId}`)
      if (response.ok) {
        const data = await response.json()
        setVerification(data.verification)
        setAuditLogs(data.auditLogs || [])
      }
    } catch (error) {
      console.error('Error fetching verification:', error)
    }
  }

  const handleApprove = async () => {
    if (!confirm('Approve this verification?')) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/verifications/${verificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'verified',
          notes: notes || undefined
        })
      })

      if (response.ok) {
        await fetchVerification()
        window.alert('Verification approved successfully!')
      } else {
        const data = await response.json()
        window.alert(data.error || 'Failed to approve')
      }
    } catch (error: any) {
      window.alert(error.message || 'Failed to approve')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason) {
      window.alert('Please provide a rejection reason')
      return
    }

    if (!confirm('Reject this verification?')) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/verifications/${verificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason,
          notes: notes || undefined
        })
      })

      if (response.ok) {
        await fetchVerification()
        window.alert('Verification rejected')
      } else {
        const data = await response.json()
        window.alert(data.error || 'Failed to reject')
      }
    } catch (error: any) {
      window.alert(error.message || 'Failed to reject')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
      </div>
    )
  }

  if (!verification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#333] mb-4">Verification not found</p>
          <button
            onClick={() => router.push('/admin/verifications')}
            className="px-4 py-2 bg-[#111] text-white rounded-lg"
          >
            Back to List
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'pending':
      case 'in_review':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push('/admin/verifications')}
          className="flex items-center gap-2 text-[#333] hover:text-[#111] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Verifications
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111] flex items-center gap-3">
            <Shield className="w-8 h-8 text-sky-600" />
            Verification Review
          </h1>
          <p className="text-[#333] mt-1">
            Review verification for {verification.user?.full_name || 'User'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <div className={`border-2 rounded-xl p-6 ${getStatusColor(verification.status)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">Status</h3>
                  <p className="text-sm capitalize">{verification.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Tier {verification.tier}</p>
                  <p className="text-xs capitalize">{verification.verification_type}</p>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {verification.user?.full_name}</p>
                <p><span className="font-medium">Email:</span> {verification.user?.email}</p>
                <p><span className="font-medium">Type:</span> {verification.user?.user_type}</p>
              </div>
            </div>

            {/* Evidence */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Evidence
              </h3>
              <div className="space-y-4">
                {verification.verification_type === 'identity' && (
                  <>
                    {verification.evidence?.government_id?.signedUrl && (
                      <div>
                        <p className="text-sm font-medium text-[#111] mb-2">Government ID</p>
                        <a
                          href={verification.evidence.government_id.signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-sky-600 hover:underline"
                        >
                          View Document →
                        </a>
                      </div>
                    )}
                    {verification.evidence?.selfie?.signedUrl && (
                      <div>
                        <p className="text-sm font-medium text-[#111] mb-2">Selfie</p>
                        <a
                          href={verification.evidence.selfie.signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-sky-600 hover:underline"
                        >
                          View Image →
                        </a>
                        {verification.evidence?.faceMatch && (
                          <p className="text-xs text-[#333] mt-1">
                            Similarity Score: {(verification.evidence.faceMatch.similarityScore * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {verification.verification_type === 'video' && verification.evidence?.videoSignedUrl && (
                  <div>
                    <p className="text-sm font-medium text-[#111] mb-2">Video</p>
                    <a
                      href={verification.evidence.videoSignedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sky-600 hover:underline"
                    >
                      View Video →
                    </a>
                  </div>
                )}

                {verification.verification_type === 'skill' && verification.evidence?.skillProofs && (
                  <div>
                    <p className="text-sm font-medium text-[#111] mb-2">Skill Proofs</p>
                    <div className="space-y-2">
                      {verification.evidence.skillProofs.map((proof: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                          <p className="font-medium text-sm">{proof.title}</p>
                          <p className="text-xs text-[#333]">{proof.skillName} - {proof.proofType}</p>
                          {proof.url && (
                            <a
                              href={proof.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-sky-600 hover:underline"
                            >
                              View Proof →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#111] mb-4">Audit Logs</h3>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{log.action}</span>
                      <span className="text-xs text-[#333]">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-[#333] mt-1">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {verification.status !== 'verified' && verification.status !== 'rejected' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#111] mb-4">Actions</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#111] mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-[#111]"
                      placeholder="Add notes for this verification..."
                    />
                  </div>

                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-[#111] mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-[#111]"
                      placeholder="Required if rejecting..."
                    />
                    <button
                      onClick={handleReject}
                      disabled={processing || !rejectionReason}
                      className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#111] mb-4">Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Submitted:</span> {new Date(verification.submitted_at || verification.created_at).toLocaleString()}</p>
                {verification.verified_at && (
                  <p><span className="font-medium">Verified:</span> {new Date(verification.verified_at).toLocaleString()}</p>
                )}
                {verification.score && (
                  <p><span className="font-medium">Score:</span> {verification.score}/100</p>
                )}
                {verification.rejection_reason && (
                  <div>
                    <p className="font-medium">Rejection Reason:</p>
                    <p className="text-red-600">{verification.rejection_reason}</p>
                  </div>
                )}
                {verification.notes && (
                  <div>
                    <p className="font-medium">Notes:</p>
                    <p className="text-[#333]">{verification.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

