'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Mail, MessageSquare, Phone, CheckCircle, Clock, XCircle, Users } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { formatCurrency } from '@/lib/utils/formatCurrency'

interface SourcingRequest {
  id: string
  job_id: string
  client_id: string
  status: string
  created_at: string
  job?: {
    id: string
    title: string
    price_fixed: number
  }
  client?: {
    id: string
    full_name: string
    email: string
  }
}

interface Worker {
  id: string
  name: string
  headline: string
  skills: string[]
  verified_level: string
  score: number
}

export default function AdminSourcingPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<SourcingRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<SourcingRequest | null>(null)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [contacting, setContacting] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (selectedRequest) {
      fetchWorkers()
    }
  }, [selectedRequest])

  const checkAuth = async () => {
    try {
      const result = await apiClient.getCurrentUser()
      if (result.error || !result.data?.user) {
        router.push('/login')
        return
      }

      if (!['admin', 'superadmin'].includes(result.data.user.role)) {
        router.push('/')
        return
      }

      fetchRequests()
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    try {
      const result = await apiClient.getSourcingRequests()
      if (result.data && typeof result.data === 'object' && 'requests' in result.data) {
        setRequests((result.data as any).requests || [])
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  const fetchWorkers = async () => {
    if (!selectedRequest) return

    try {
      // Get job skills to match workers
      const jobSkills = selectedRequest.job?.title?.toLowerCase().split(' ') || []
      const skill = jobSkills.find((s: string) => s.length > 3) || ''

      const result = await apiClient.getWorkerPool({
        skill: skill || undefined,
        tier: 'all',
        limit: 10,
      })
      
      if (result.data && typeof result.data === 'object' && 'workers' in result.data) {
        setWorkers((result.data as any).workers?.map((w: any) => ({
          id: w.user_id,
          name: w.user?.full_name || 'Unknown',
          headline: w.user?.profile?.headline || '',
          skills: w.user?.profile?.skills || [],
          verified_level: w.user?.profile?.verified_level || 'none',
          score: w.user?.profile?.score || 0,
        })) || [])
      } else {
        setWorkers([])
      }
    } catch (error) {
      console.error('Error fetching workers:', error)
    }
  }

  const handleContact = async (workerId: string, method: 'email' | 'sms' | 'whatsapp') => {
    if (!selectedRequest) return

    setContacting(workerId)
    try {
      const result = await apiClient.contactWorker(selectedRequest.id, {
        worker_id: workerId,
        contact_method: method,
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to contact worker')
      }

      alert(`[DEMO] Contact sent via ${method}`)
      await fetchRequests()
    } catch (error: any) {
      alert(error.message || 'Failed to contact worker')
    } finally {
      setContacting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'in_progress')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Sourcing Queue
          </h1>
          <p className="text-slate-600 mt-2">Manage hard-to-fill jobs and contact workers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Pending Requests ({pendingRequests.length})</h2>
              </div>
              <div className="divide-y divide-slate-200">
                {pendingRequests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                      selectedRequest?.id === request.id ? 'bg-sky-50 border-l-4 border-sky-600' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-slate-900 text-sm">
                        {request.job?.title || 'Untitled Job'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    {request.job?.price_fixed && (
                      <p className="text-xs text-slate-600">
                        {formatCurrency(request.job.price_fixed)}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Worker Suggestions */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    {selectedRequest.job?.title}
                  </h2>
                  {selectedRequest.job?.price_fixed && (
                    <p className="text-slate-600">
                      Budget: {formatCurrency(selectedRequest.job.price_fixed)}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Suggested Workers
                  </h3>

                  {workers.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No workers found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {workers.map((worker) => (
                        <div
                          key={worker.id}
                          className="p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-slate-900">{worker.name}</h4>
                              <p className="text-sm text-slate-600">{worker.headline}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span>Score: {worker.score}</span>
                                <span className="capitalize">{worker.verified_level} verified</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            {worker.skills.slice(0, 4).map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleContact(worker.id, 'email')}
                              disabled={contacting === worker.id}
                              className="flex-1 px-3 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </button>
                            <button
                              onClick={() => handleContact(worker.id, 'whatsapp')}
                              disabled={contacting === worker.id}
                              className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleContact(worker.id, 'sms')}
                              disabled={contacting === worker.id}
                              className="px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600">Select a sourcing request to view worker suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
