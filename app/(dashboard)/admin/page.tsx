'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { Users, Briefcase, DollarSign, Shield, LogOut, TrendingUp } from 'lucide-react'
import type { User as UserType } from '@/types/database.types'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      // Use v1 API for authentication
      const result = await apiClient.getCurrentUser()
      
      if (result.error || !result.data?.user) {
        router.push('/login')
        setIsLoading(false)
        return
      }

      const currentUser = result.data.user
      
      // Allow both admin and superadmin to access
      if (!['admin', 'superadmin'].includes(currentUser.role)) {
        const routes: Record<string, string> = {
          worker: '/worker',
          client: '/client',
        }
        router.push(routes[currentUser.role] || '/')
        setIsLoading(false)
        return
      }

      // Fetch full profile from database
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (profile) {
        setUser(profile)
        fetchStats()
      } else {
        // Fallback to API user data
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.name || '',
          user_type: currentUser.role as 'admin' | 'superadmin',
        } as UserType)
        fetchStats()
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    // Fetch users stats
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

    // Fetch projects stats
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    const { count: activeProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('status', ['in_progress', 'assigned'])

    // Fetch revenue stats
    const { data: payments } = await supabase
      .from('payments')
      .select('platform_fee')
      .eq('status', 'completed')

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.platform_fee || 0), 0) || 0

    setStats({
      totalUsers: totalUsers || 0,
      totalWorkers: totalWorkers || 0,
      totalClients: totalClients || 0,
      totalProjects: totalProjects || 0,
      activeProjects: activeProjects || 0,
      totalRevenue
    })
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleSignOut = async () => {
    await apiClient.logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">2ndShift</h1>
              <span className="ml-4 text-sm text-gray-500">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700 font-medium">{user?.full_name}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-[#0b63ff] rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-purple-100">Monitor platform activity and manage operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalWorkers} workers, {stats.totalClients} clients
                </p>
              </div>
              <Users className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.activeProjects} active
                </p>
              </div>
              <Briefcase className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  From platform fees
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/admin/users')}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between"
              >
                <span>View All Users</span>
                <Users className="w-4 h-4 text-gray-400" />
              </button>
              <button 
                onClick={() => router.push('/admin/analytics')}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between"
              >
                <span>Analytics Dashboard</span>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
                <span>View All Projects</span>
                <Briefcase className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
                <span>View Payments</span>
                <DollarSign className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-gray-500">
              No recent activity to display
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
