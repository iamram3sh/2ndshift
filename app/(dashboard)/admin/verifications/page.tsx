'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Shield, CheckCircle, XCircle, Eye, ArrowLeft, Download, Search, Filter, ShieldCheck, TrendingUp, Activity, RefreshCcw } from 'lucide-react'
import type { Verification, User } from '@/types/database.types'

interface VerificationWithUser extends Verification {
  user: User
}

export default function AdminVerificationsPage() {
  const router = useRouter()
  const [verifications, setVerifications] = useState<VerificationWithUser[]>([])
  const [filteredVerifications, setFilteredVerifications] = useState<VerificationWithUser[]>([])
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVerification, setSelectedVerification] = useState<VerificationWithUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    avgTurnaroundHours: 0
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    filterVerifications()
  }, [verifications, filterStatus, searchQuery])

  const checkAuth = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (!profile || !['admin', 'superadmin'].includes(profile.user_type)) {
      router.push('/dashboard')
      return
    }

    fetchVerifications()
    setIsLoading(false)
  }

  const fetchVerifications = async () => {
    const { data, error } = await supabase
      .from('verifications')
      .select(`
        *,
        user:users(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching verifications:', error)
      return
    }

    const typed = (data as VerificationWithUser[]) || []
    setVerifications(typed)

    if (typed.length) {
      const pending = typed.filter(v => v.status === 'pending').length
      const verified = typed.filter(v => v.status === 'verified').length
      const rejected = typed.filter(v => v.status === 'rejected').length
      const turnaround = typed
        .filter(v => v.status !== 'pending' && v.created_at && v.verified_at)
        .map(v => {
          const start = new Date(v.created_at).getTime()
          const end = new Date(v.verified_at || v.updated_at || new Date()).getTime()
          return (end - start) / (1000 * 60 * 60)
        })
      const avgTurnaroundHours = turnaround.length ? turnaround.reduce((a, b) => a + b, 0) / turnaround.length : 0

      setStats({
        total: typed.length,
        pending,
        verified,
        rejected,
        avgTurnaroundHours: Math.round(avgTurnaroundHours * 10) / 10
      })
    } else {
      setStats({ total: 0, pending: 0, verified: 0, rejected: 0, avgTurnaroundHours: 0 })
    }
  }

  const filterVerifications = () => {
    let filtered = verifications

    if (filterStatus !== 'all') {
      filtered = filtered.filter(v => v.status === filterStatus)
    }

    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.verification_type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredVerifications(filtered)
  }

  const handleApprove = async (verificationId: string) => {
    if (!confirm('Are you sure you want to approve this verification?')) return

    setIsProcessing(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('verifications')
        .update({
          status: 'verified',
          verified_by: authUser?.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', verificationId)

      if (error) throw error

      // Send notification to user
      const verification = verifications.find(v => v.id === verificationId)
      if (verification) {
        await supabase
          .from('notifications')
          .insert({
            user_id: verification.user_id,
            type: 'verification',
            title: 'Verification Approved',
            message: `Your ${verification.verification_type} verification has been approved`,
            link: '/verification'
          })
      }

      alert('Verification approved successfully!')
      fetchVerifications()
      setSelectedVerification(null)
    } catch (error) {
      console.error('Error approving verification:', error)
      alert('Failed to approve verification. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (verificationId: string) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    setIsProcessing(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('verifications')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          verified_by: authUser?.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', verificationId)

      if (error) throw error

      // Send notification to user
      const verification = verifications.find(v => v.id === verificationId)
      if (verification) {
        await supabase
          .from('notifications')
          .insert({
            user_id: verification.user_id,
            type: 'verification',
            title: 'Verification Rejected',
            message: `Your ${verification.verification_type} verification was rejected: ${reason}`,
            link: '/verification'
          })
      }

      alert('Verification rejected.')
      fetchVerifications()
      setSelectedVerification(null)
    } catch (error) {
      console.error('Error rejecting verification:', error)
      alert('Failed to reject verification. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-600" />
                Verification Management
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Cases</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Avg Turnaround</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.avgTurnaroundHours}h</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name, email, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Verifications List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {filteredVerifications.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No verifications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredVerifications.map((verification) => (
                    <tr key={verification.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {verification.user.full_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {verification.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-sm text-gray-900 dark:text-white">
                          {verification.verification_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(verification.status)}`}>
                          {verification.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(verification.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedVerification(verification)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {verification.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(verification.id)}
                                disabled={isProcessing}
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(verification.id)}
                                disabled={isProcessing}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Verification Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">User</label>
                <p className="text-gray-900 dark:text-white">{selectedVerification.user.full_name}</p>
                <p className="text-sm text-gray-500">{selectedVerification.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <p className="text-gray-900 dark:text-white capitalize">{selectedVerification.verification_type.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <p className="text-gray-900 dark:text-white capitalize">{selectedVerification.status}</p>
              </div>
              {selectedVerification.verification_data && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submitted Data</label>
                  <pre className="mt-2 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm overflow-auto">
                    {JSON.stringify(selectedVerification.verification_data, null, 2)}
                  </pre>
                </div>
              )}
              {selectedVerification.document_urls && selectedVerification.document_urls.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents</label>
                  <div className="mt-2 space-y-2">
                    {selectedVerification.document_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Document {index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {selectedVerification.rejection_reason && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejection Reason</label>
                  <p className="text-red-600 dark:text-red-400">{selectedVerification.rejection_reason}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex gap-3">
              {selectedVerification.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedVerification.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedVerification.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedVerification(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
