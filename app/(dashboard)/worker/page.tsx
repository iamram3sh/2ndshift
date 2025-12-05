'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { 
  Briefcase, IndianRupee, User, LogOut, Plus, Clock,
  Users, CheckCircle, TrendingUp, Eye, MessageSquare,
  Bell, Search, Calendar, Award, BarChart3, FileText, 
  Zap, Target, Activity, Star, ChevronRight, Rocket, 
  Shield, BadgeCheck, Sparkles, ArrowRight, Crown,
  Layers, XCircle, Timer, MapPin, Filter, ArrowUpRight,
  UserPlus, Send, Gift, Settings, HelpCircle, Info,
  CheckCircle2, TrendingDown
} from 'lucide-react'
import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from '@/components/ui/Topbar'
import { StatsBar } from '@/components/ui/StatsBar'
import { KanbanBoard, type KanbanColumn } from '@/components/ui/KanbanBoard'
import { ActivityFeed, type ActivityItem } from '@/components/ui/ActivityFeed'
import type { User as UserType } from '@/types/database.types'

interface Application {
  id: string
  project_id: string
  job_id?: string
  worker_id: string
  cover_letter: string
  proposed_rate: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: string
  job?: any
  client?: UserType
}

interface DashboardStats {
  activeApplications: number
  acceptedJobs: number
  completedJobs: number
  totalEarnings: number
  pendingApplications: number
  totalClients: number
  avgJobValue: number
  shiftsBalance: number
  activeContracts: number
}

interface JobWithClient {
  id: string
  title: string
  description: string
  budget?: number
  price_fixed?: number
  status: string
  client_id: string
  created_at: string
  client?: UserType
  applicationCount?: number
}

export default function WorkerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [jobs, setJobs] = useState<JobWithClient[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeApplications: 0,
    acceptedJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    pendingApplications: 0,
    totalClients: 0,
    avgJobValue: 0,
    shiftsBalance: 0,
    activeContracts: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null)
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])

  const checkAuth = async () => {
    try {
      // Simple, direct auth check
      const result = await apiClient.getCurrentUser({ skipRedirect: true })
      
      if (result.error || !result.data?.user) {
        // Not authenticated - redirect to login
        router.replace('/login?next=/worker')
        return
      }

      const currentUser = result.data.user
      
      // Check if user is a worker
      if (currentUser.role !== 'worker') {
        // Redirect to appropriate dashboard
        const routes: Record<string, string> = {
          client: '/client',
          admin: '/dashboard/admin',
          superadmin: '/dashboard/admin'
        }
        router.replace(routes[currentUser.role] || '/login')
        return
      }

      // Set user data
      setUser({
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.name || '',
        user_type: 'worker',
      } as UserType)

      // Fetch dashboard data
      await fetchWorkerData(currentUser.id)
      
    } catch (err) {
      console.error('Auth check error:', err)
      router.replace('/login?next=/worker')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWorkerData = async (userId: string) => {
    await Promise.all([
      fetchApplications(userId),
      fetchJobs(userId),
      fetchShiftsBalance(),
    ])

    // Fetch dashboard metrics
    try {
      const metricsResponse = await fetch('/api/dashboard/metrics?role=worker', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (metricsResponse.ok) {
        const metrics = await metricsResponse.json()
        setDashboardMetrics(metrics)
      }
    } catch (err) {
      console.error('Error fetching metrics:', err)
    }

    // Build activity feed
    if (applications.length > 0) {
      buildActivityFeed(userId)
    }
  }

  const fetchApplications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*, client:users!jobs_client_id_fkey(id, full_name, email))
        `)
        .eq('worker_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      if (data) {
        setApplications(data as any)
        const pending = data.filter(app => app.status === 'pending').length
        const accepted = data.filter(app => app.status === 'accepted').length
        
        setStats(prev => ({
          ...prev,
          pendingApplications: pending,
          activeApplications: accepted,
          acceptedJobs: accepted
        }))

        // Build activity feed after applications are loaded
        buildActivityFeed(userId)
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
    }
  }

  const fetchJobs = async (userId: string) => {
    try {
      // Fetch jobs the worker has applied to
      const { data: applicationsData } = await supabase
        .from('applications')
        .select('job_id, job:jobs(*)')
        .eq('worker_id', userId)
        .in('status', ['pending', 'accepted'])

      if (applicationsData) {
        const jobIds = applicationsData.map(app => app.job_id).filter(Boolean)
        
        if (jobIds.length > 0) {
          const { data: jobsData, error } = await supabase
            .from('jobs')
            .select(`
              *,
              client:users!jobs_client_id_fkey(id, full_name, email)
            `)
            .in('id', jobIds)
            .order('created_at', { ascending: false })

          if (error) throw error

          if (jobsData) {
            setJobs(jobsData as any)
            
            // Calculate stats
            const completed = jobsData.filter(job => job.status === 'completed').length
            const totalValue = jobsData.reduce((sum, job) => {
              return sum + (job.price_fixed || job.budget || 0)
            }, 0)
            const avgValue = jobsData.length > 0 ? totalValue / jobsData.length : 0
            
            const uniqueClients = new Set(jobsData.map(job => job.client_id)).size

            setStats(prev => ({
              ...prev,
              completedJobs: completed,
              totalEarnings: totalValue,
              avgJobValue: avgValue,
              totalClients: uniqueClients
            }))
          }
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
    }
  }

  const fetchShiftsBalance = useCallback(async () => {
    try {
      const result = await apiClient.getCreditsBalance()
      if (result.data) {
        const balance = (result.data && typeof result.data === 'object' && 'balance' in result.data) ? (result.data as any).balance || 0 : 0
        setStats(prev => ({ ...prev, shiftsBalance: balance }))
      }
    } catch (err) {
      console.error('Error fetching credits balance:', err)
    }
  }, [])

  const buildActivityFeed = async (userId: string) => {
    if (applications.length === 0) return

    const activityItems: ActivityItem[] = []

    // Get recent applications
    const recentApplications = applications.slice(0, 5)
    recentApplications.forEach(app => {
      activityItems.push({
        id: `app-${app.id}`,
        timestamp: app.created_at,
        type: app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'error' : 'info',
        title: app.status === 'accepted' 
          ? `Application accepted for "${app.job?.title || 'Job'}"`
          : app.status === 'pending'
          ? `Applied to "${app.job?.title || 'Job'}"`
          : `Application ${app.status} for "${app.job?.title || 'Job'}"`,
        description: app.cover_letter ? app.cover_letter.substring(0, 100) : undefined,
      })
    })

    // Sort by timestamp
    activityItems.sort((a, b) => {
      const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp.getTime()
      const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp.getTime()
      return timeB - timeA
    })

    setActivities(activityItems.slice(0, 10))
  }

  const handleSignOut = async () => {
    await apiClient.logout()
    localStorage.removeItem('access_token')
    router.push('/')
  }

  useEffect(() => { 
    checkAuth()
  }, [])

  useEffect(() => {
    if (applications.length > 0 && user) {
      buildActivityFeed(user.id)
    }
  }, [applications, user])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      completed: 'bg-slate-100 text-slate-700 border-slate-200',
      withdrawn: 'bg-slate-100 text-slate-700 border-slate-200'
    }
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span className="text-slate-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleQuickAction = () => {
    router.push('/worker/discover')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar role="worker" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Topbar */}
        <Topbar
          role="worker"
          onQuickAction={handleQuickAction}
          quickActionLabel="Find Work"
          onSignOut={handleSignOut}
          user={{
            name: user?.full_name,
            email: user?.email,
          }}
          onSearch={(query) => {
            // Handle search
          }}
        />

        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-slate-600">
              Track your applications and manage your work pipeline
            </p>
          </div>
          
          {/* Stats Bar */}
          <div className="mb-6">
            <StatsBar
              stats={[
                {
                  title: 'Active Applications',
                  value: dashboardMetrics?.activeApplications || stats.activeApplications || 0,
                  icon: <Briefcase className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Accepted Jobs',
                  value: dashboardMetrics?.acceptedJobs || stats.acceptedJobs || 0,
                  icon: <CheckCircle className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Total Earnings',
                  value: `₹${((dashboardMetrics?.totalEarnings || stats.totalEarnings || 0) / 1000).toFixed(1)}K`,
                  icon: <IndianRupee className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Completed Jobs',
                  value: dashboardMetrics?.completedJobs || stats.completedJobs || 0,
                  icon: <Award className="w-5 h-5 text-slate-600" />,
                },
              ]}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Applications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                {filteredApplications.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">No applications yet</p>
                    <p className="text-sm text-slate-500 mt-1">Start applying to jobs to see them here</p>
                    <Link
                      href="/worker/discover"
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4 hover:bg-slate-800 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Find Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <Link
                        key={app.id}
                        href={`/jobs/${app.job_id || app.project_id}`}
                        className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-slate-900 group-hover:text-sky-600 transition-colors">
                                {app.job?.title || 'Job Application'}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </div>
                            {app.job?.description && (
                              <p className="text-sm text-slate-600 line-clamp-1">
                                {app.job.description}
                              </p>
                            )}
                            {app.client && (
                              <p className="text-xs text-slate-500 mt-1">
                                Client: {app.client.full_name || app.client.email}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            {(app.job?.price_fixed || app.job?.budget || app.proposed_rate) && (
                              <div className="text-lg font-semibold text-slate-900">
                                ₹{(app.job?.price_fixed || app.job?.budget || app.proposed_rate).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied {new Date(app.created_at).toLocaleDateString()}
                          </span>
                          {app.proposed_rate && (
                            <span className="font-medium text-slate-700">
                              Proposed: ₹{app.proposed_rate}/hr
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Jobs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Available Jobs</h2>
                  <Link
                    href="/worker/discover"
                    className="text-sm text-sky-600 font-medium hover:text-sky-700"
                  >
                    View all
                  </Link>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-600 text-center py-8">
                    Browse available jobs to find your next opportunity
                  </p>
                  <Link
                    href="/worker/discover"
                    className="block w-full text-center bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
                  >
                    Explore Jobs
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Activity Feed */}
              <ActivityFeed
                activities={activities.length > 0 ? activities : [
                  {
                    id: '1',
                    timestamp: new Date(),
                    type: 'info',
                    title: 'Welcome to your dashboard',
                    description: 'Your recent activity will appear here',
                  },
                ]}
                maxItems={5}
              />

              {/* Profile Completion */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Profile</h3>
                  <Link
                    href="/worker/profile/edit"
                    className="text-xs text-sky-600 hover:text-sky-700"
                  >
                    Edit
                  </Link>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">Completion</span>
                      <span className="text-xs font-medium text-slate-900">65%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all"
                        style={{ width: '65%' }}
                      />
                    </div>
                  </div>
                  <Link
                    href="/worker/profile/verification"
                    className="block w-full text-center text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    Complete Profile
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/worker/discover" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-700">Browse Jobs</span>
                  </Link>
                  <Link href="/clients" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-700">My Clients</span>
                  </Link>
                  <Link href="/messages" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-700">Messages</span>
                  </Link>
                  <Link href="/worker/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-700">Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}