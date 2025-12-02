'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { 
  Shield, FileText, Award, Building, 
  CheckCircle, XCircle, Clock, Eye,
  Download, AlertCircle
} from 'lucide-react'

interface VerificationRequest {
  id: string
  user_id: string
  full_name: string
  email: string
  user_type: string
  verification_type: string
  status: string
  created_at: string
  documents: any
}

export default function VerificationQueue() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_review'>('pending')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVerificationRequests()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('verification-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'verification_requests'
        },
        () => {
          fetchVerificationRequests()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [filter])

  const fetchVerificationRequests = async () => {
    try {
      let query = supabase
        .from('verification_requests')
        .select(`
          *,
          users!verification_requests_user_id_fkey (
            full_name,
            email,
            user_type
          )
        `)
        .order('created_at', { ascending: true })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      } else {
        query = query.in('status', ['pending', 'in_review'])
      }

      const { data, error } = await query

      if (error) throw error

      // Flatten the user data
      const formattedData = (data || []).map((req: any) => ({
        id: req.id,
        user_id: req.user_id,
        full_name: req.users?.full_name || 'Unknown',
        email: req.users?.email || '',
        user_type: req.users?.user_type || '',
        verification_type: req.verification_type,
        status: req.status,
        created_at: req.created_at,
        documents: req.documents,
        user_notes: req.user_notes,
        admin_notes: req.admin_notes
      }))

      setRequests(formattedData)
    } catch (error) {
      console.error('Error fetching verification requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (requestId: string, action: 'approve' | 'reject' | 'request_info', notes?: string) => {
    try {
      const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'more_info_needed'
      
      const { error } = await supabase
        .from('verification_requests')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          admin_notes: notes || null
        })
        .eq('id', requestId)

      if (error) throw error

      // If approved, update user verification status
      if (action === 'approve') {
        const request = requests.find(r => r.id === requestId)
        if (request) {
          await supabase
            .from('users')
            .update({
              verification_status: 'verified',
              verified_at: new Date().toISOString()
            })
            .eq('id', request.user_id)
        }
      }

      // Create notification for user
      const request = requests.find(r => r.id === requestId)
      if (request) {
        let message = ''
        if (action === 'approve') {
          message = `Your ${request.verification_type} verification has been approved! 🎉`
        } else if (action === 'reject') {
          message = `Your ${request.verification_type} verification was not approved. ${notes || 'Please contact support.'}`
        } else {
          message = `Additional information needed for your ${request.verification_type} verification. ${notes || ''}`
        }

        await supabase
          .from('notifications')
          .insert({
            user_id: request.user_id,
            type: 'verification',
            title: `Verification ${action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Update'}`,
            message,
            priority: 'high'
          })
      }

      setSelectedRequest(null)
      fetchVerificationRequests()
    } catch (error) {
      console.error('Error handling verification:', error)
      window.alert('Failed to process verification')
    }
  }

  const getVerificationIcon = (type: string) => {
    switch (type) {
      case 'identity':
        return <Shield className="w-5 h-5" />
      case 'certification':
        return <Award className="w-5 h-5" />
      case 'business':
        return <Building className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getVerificationType = (type: string) => {
    const types: { [key: string]: string } = {
      'identity': 'Identity Verification',
      'phone': 'Phone Verification',
      'email': 'Email Verification',
      'business': 'Business Verification',
      'certification': 'Certification Verification',
      'background_check': 'Background Check'
    }
    return types[type] || type
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case 'in_review':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3" />
            In Review
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-6 border-b dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              Verification Queue
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {requests.length} verification{requests.length !== 1 ? 's' : ''} pending review
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in_review')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'in_review'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            In Review
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y dark:divide-slate-700">
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No pending verifications at the moment.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    {getVerificationIcon(request.verification_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {request.full_name}
                      </h3>
                      {getStatusBadge(request.status)}
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        request.user_type === 'worker' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {request.user_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {request.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {getVerificationType(request.verification_type)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Submitted {new Date(request.created_at).toLocaleDateString()} at{' '}
                      {new Date(request.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedRequest(request)
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <VerificationReviewModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}

// Review Modal Component
interface VerificationReviewModalProps {
  request: VerificationRequest
  onClose: () => void
  onAction: (requestId: string, action: 'approve' | 'reject' | 'request_info', notes?: string) => void
}

function VerificationReviewModal({ request, onClose, onAction }: VerificationReviewModalProps) {
  const [notes, setNotes] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | 'request_info' | null>(null)

  const handleSubmit = () => {
    if (!action) return
    onAction(request.id, action, notes)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review Verification Request
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {request.full_name} • {request.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Request Details */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Request Details</h3>
            <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {request.verification_type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {request.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Submitted:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(request.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Documents */}
          {request.documents && Array.isArray(request.documents) && request.documents.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Documents</h3>
              <div className="space-y-2">
                {request.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{doc.name || `Document ${index + 1}`}</span>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Admin Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this verification..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => { setAction('approve'); handleSubmit(); }}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              Approve
            </button>
            <button
              onClick={() => { setAction('request_info'); handleSubmit(); }}
              className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center justify-center gap-2 font-medium"
            >
              <AlertCircle className="w-5 h-5" />
              Request Info
            </button>
            <button
              onClick={() => { setAction('reject'); handleSubmit(); }}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 font-medium"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
