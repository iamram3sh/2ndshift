/**
 * Admin Verifications List Page
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { Shield, Search, Filter, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import ServiceStatusCard from '@/components/admin/verification/ServiceStatusCard'

export default function AdminVerificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [verifications, setVerifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_review' | 'verified' | 'rejected'>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchVerifications()
    }
  }, [user, filter])

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

  const fetchVerifications = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('status', filter)
      }

      const response = await fetch(`/api/admin/verifications?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setVerifications(data.verifications || [])
      }
    } catch (error) {
      console.error('Error fetching verifications:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case 'pending':
      case 'in_review':
        return <Clock className="w-4 h-4 text-amber-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Shield className="w-4 h-4 text-slate-400" />
    }
  }

  const filteredVerifications = verifications.filter((v) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      v.user?.full_name?.toLowerCase().includes(query) ||
      v.user?.email?.toLowerCase().includes(query) ||
      v.verification_type?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111] flex items-center gap-3">
            <Shield className="w-8 h-8 text-sky-600" />
            Verification Queue
          </h1>
          <p className="text-[#333] mt-1">Review and manage verification requests</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or type..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'in_review', 'verified', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === status
                      ? 'bg-[#111] text-white'
                      : 'bg-slate-100 text-[#333] hover:bg-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Verifications List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-200">
            {filteredVerifications.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-[#333]">No verifications found</p>
              </div>
            ) : (
              filteredVerifications.map((verification) => (
                <Link
                  key={verification.id}
                  href={`/admin/verifications/${verification.id}`}
                  className="block p-6 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(verification.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-[#111]">
                            {verification.user?.full_name || 'Unknown User'}
                          </h3>
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            Tier {verification.tier}
                          </span>
                          <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium capitalize">
                            {verification.verification_type}
                          </span>
                        </div>
                        <p className="text-sm text-[#333] mt-1">{verification.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#111] capitalize">
                          {verification.status.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-[#333]">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ServiceStatusCard />
          </div>
        </div>
      </div>
    </div>
  )
}
