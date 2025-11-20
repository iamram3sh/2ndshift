'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign, 
  ArrowLeft,
  Calendar,
  Download
} from 'lucide-react'

interface AnalyticsData {
  totalUsers: number
  totalWorkers: number
  totalClients: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalRevenue: number
  totalEarnings: number
  recentUsers: any[]
  recentProjects: any[]
  monthlyGrowth: {
    users: number
    projects: number
    revenue: number
  }
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalWorkers: 0,
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    totalEarnings: 0,
    recentUsers: [],
    recentProjects: [],
    monthlyGrowth: {
      users: 0,
      projects: 0,
      revenue: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    checkAuthAndFetchAnalytics()
  }, [timeRange])

  const checkAuthAndFetchAnalytics = async () => {
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

    if (!profile || profile.user_type !== 'admin') {
      router.push('/')
      return
    }

    fetchAnalytics()
  }

  const fetchAnalytics = async () => {
    setIsLoading(true)

    try {
      // Fetch user stats
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      const { count: totalWorkers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'worker')

      const { count: totalClients } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'client')

      // Fetch project stats
      const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      const { count: activeProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress', 'assigned'])

      const { count: completedProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')

      // Fetch payment stats
      const { data: payments } = await supabase
        .from('payments')
        .select('platform_fee, net_amount')
        .eq('status', 'completed')

      const totalRevenue = payments?.reduce((sum, p) => sum + (p.platform_fee || 0), 0) || 0
      const totalEarnings = payments?.reduce((sum, p) => sum + (p.net_amount || 0), 0) || 0

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent projects
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('*, users!projects_client_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(5)

      // Calculate monthly growth
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: newUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      const { count: newProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      const { data: recentPayments } = await supabase
        .from('payments')
        .select('platform_fee')
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgo.toISOString())

      const recentRevenue = recentPayments?.reduce((sum, p) => sum + (p.platform_fee || 0), 0) || 0

      setAnalytics({
        totalUsers: totalUsers || 0,
        totalWorkers: totalWorkers || 0,
        totalClients: totalClients || 0,
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        completedProjects: completedProjects || 0,
        totalRevenue,
        totalEarnings,
        recentUsers: recentUsers || [],
        recentProjects: recentProjects || [],
        monthlyGrowth: {
          users: newUsers || 0,
          projects: newProjects || 0,
          revenue: recentRevenue
        }
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }

    setIsLoading(false)
  }

  const exportReport = () => {
    const report = {
      generated: new Date().toISOString(),
      timeRange,
      summary: {
        totalUsers: analytics.totalUsers,
        totalWorkers: analytics.totalWorkers,
        totalClients: analytics.totalClients,
        totalProjects: analytics.totalProjects,
        activeProjects: analytics.activeProjects,
        completedProjects: analytics.completedProjects,
        totalRevenue: analytics.totalRevenue,
        totalEarnings: analytics.totalEarnings
      },
      monthlyGrowth: analytics.monthlyGrowth
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Platform performance and insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
              <button
                onClick={exportReport}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +{analytics.monthlyGrowth.users} this month
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-2">
                {analytics.totalWorkers} workers, {analytics.totalClients} clients
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +{analytics.monthlyGrowth.projects} this month
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalProjects}</p>
              <p className="text-xs text-gray-500 mt-2">
                {analytics.activeProjects} active, {analytics.completedProjects} completed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +₹{analytics.monthlyGrowth.revenue.toLocaleString()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Platform Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{analytics.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">
                From platform fees
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                Total paid
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Worker Earnings</p>
              <p className="text-3xl font-bold text-gray-900">₹{analytics.totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">
                Paid to workers
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">User Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Workers</span>
                  <span className="text-sm font-bold text-gray-900">
                    {analytics.totalUsers > 0 
                      ? Math.round((analytics.totalWorkers / analytics.totalUsers) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ 
                      width: `${analytics.totalUsers > 0 
                        ? (analytics.totalWorkers / analytics.totalUsers) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Clients</span>
                  <span className="text-sm font-bold text-gray-900">
                    {analytics.totalUsers > 0 
                      ? Math.round((analytics.totalClients / analytics.totalUsers) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ 
                      width: `${analytics.totalUsers > 0 
                        ? (analytics.totalClients / analytics.totalUsers) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Project Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <span className="text-sm font-bold text-gray-900">
                    {analytics.totalProjects > 0 
                      ? Math.round((analytics.activeProjects / analytics.totalProjects) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ 
                      width: `${analytics.totalProjects > 0 
                        ? (analytics.activeProjects / analytics.totalProjects) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                  <span className="text-sm font-bold text-gray-900">
                    {analytics.totalProjects > 0 
                      ? Math.round((analytics.completedProjects / analytics.totalProjects) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ 
                      width: `${analytics.totalProjects > 0 
                        ? (analytics.completedProjects / analytics.totalProjects) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Users</h3>
            <div className="space-y-4">
              {analytics.recentUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No users yet</p>
              ) : (
                analytics.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.user_type === 'worker' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.user_type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Projects</h3>
            <div className="space-y-4">
              {analytics.recentProjects.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No projects yet</p>
              ) : (
                analytics.recentProjects.map((project) => (
                  <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <span className="text-sm font-bold text-green-600">₹{project.budget.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      by {project.users?.full_name || 'Unknown'} • {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
