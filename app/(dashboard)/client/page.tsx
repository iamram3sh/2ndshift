'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { 
  Briefcase, DollarSign, User, LogOut, Plus, Clock,
  Users, CheckCircle, TrendingUp, Eye, MessageSquare,
  Bell, Filter, Search, Calendar, Award, BarChart3,
  FileText, Zap, Target, Activity
} from 'lucide-react'
import type { User as UserType, Project, Contract } from '@/types/database.types'
import { StatsCard } from '@/components/dashboard/StatsCard'

interface Application {
  id: string
  project_id: string
  worker_id: string
  cover_letter: string
  proposed_rate: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: string
  worker?: UserType
}

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalSpent: number
  pendingApplications: number
  totalWorkers: number
  avgProjectValue: number
  successRate: number
}

interface ProjectWithApplications extends Project {
  applicationCount?: number
}

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [projects, setProjects] = useState<ProjectWithApplications[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    pendingApplications: 0,
    totalWorkers: 0,
    avgProjectValue: 0,
    successRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

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

    if (profile) {
      if (profile.user_type !== 'client') {
        router.push(`/${profile.user_type}`)
        return
      }
      setUser(profile)
      await Promise.all([
        fetchProjects(authUser.id),
        fetchApplications(authUser.id),
        fetchContracts(authUser.id)
      ])
    }
    setIsLoading(false)
  }

  const fetchProjects = async (userId: string) => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })

    if (data) {
      // Fetch application counts for each project
      const projectsWithCounts = await Promise.all(
        data.map(async (project) => {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id)
          
          return { ...project, applicationCount: count || 0 }
        })
      )

      setProjects(projectsWithCounts)
      calculateStats(projectsWithCounts)
    }
  }

  const fetchApplications = async (userId: string) => {
    // Get all applications for client's projects
    const { data: projectData } = await supabase
      .from('projects')
      .select('id')
      .eq('client_id', userId)

    if (projectData && projectData.length > 0) {
      const projectIds = projectData.map(p => p.id)
      
      const { data } = await supabase
        .from('applications')
        .select(`
          *,
          worker:users!applications_worker_id_fkey(*)
        `)
        .in('project_id', projectIds)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) {
        setApplications(data as any)
        const pending = data.filter(app => app.status === 'pending').length
        setStats(prev => ({ ...prev, pendingApplications: pending }))
      }
    }
  }

  const fetchContracts = async (userId: string) => {
    const { data: projectData } = await supabase
      .from('projects')
      .select('id')
      .eq('client_id', userId)

    if (projectData && projectData.length > 0) {
      const projectIds = projectData.map(p => p.id)
      
      const { data } = await supabase
        .from('contracts')
        .select('*')
        .in('project_id', projectIds)

      if (data) {
        setContracts(data)
        
        // Calculate total spent from contracts
        const spent = data.reduce((sum, c) => sum + (c.contract_amount || 0), 0)
        
        // Count unique workers
        const uniqueWorkers = new Set(data.map(c => c.worker_id)).size
        
        setStats(prev => ({ 
          ...prev, 
          totalSpent: spent,
          totalWorkers: uniqueWorkers
        }))
      }
    }
  }

  const calculateStats = (projectList: Project[]) => {
    const total = projectList.length
    const active = projectList.filter(p => p.status === 'in_progress' || p.status === 'assigned').length
    const completed = projectList.filter(p => p.status === 'completed').length
    const avgValue = total > 0 ? projectList.reduce((sum, p) => sum + p.budget, 0) / total : 0
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0

    setStats(prev => ({
      ...prev,
      totalProjects: total,
      activeProjects: active,
      completedProjects: completed,
      avgProjectValue: avgValue,
      successRate
    }))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesStatus
  })

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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-green-600">2ndShift</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">Client Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-green-600 dark:text-gray-400">
                <Bell className="w-5 h-5" />
                {stats.pendingApplications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 dark:text-gray-300"
              >
                <User className="w-5 h-5" />
                <span>{user?.full_name}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 dark:text-gray-300"
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
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name}! 👋</h2>
              <p className="text-green-100">Manage your projects and find talent</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-4xl font-bold">{stats.activeProjects}</div>
                <div className="text-sm text-green-200">Active Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={Briefcase}
            color="green"
          />
          <StatsCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={Zap}
            color="blue"
          />
          <StatsCard
            title="Total Spent"
            value={`₹${stats.totalSpent.toLocaleString()}`}
            icon={DollarSign}
            color="orange"
          />
          <StatsCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.completedProjects}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending Apps</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.pendingApplications}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Workers</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalWorkers}</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Target className="w-5 h-5 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Project</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">₹{Math.round(stats.avgProjectValue).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Applications */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Recent Applications
              </h3>
            </div>
            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No applications yet</p>
                </div>
              ) : (
                applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                    <div className="mt-1">
                      {app.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                      {app.status === 'accepted' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {app.status === 'rejected' && <Users className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {app.worker?.full_name || 'Worker'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {app.status} • ₹{app.proposed_rate}/hr
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {applications.length > 5 && (
              <button className="w-full mt-4 text-sm text-green-600 dark:text-green-400 font-medium hover:text-green-700">
                View All Applications →
              </button>
            )}
          </div>

          {/* Active Contracts */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Active Contracts
              </h3>
            </div>
            {contracts.filter(c => c.status === 'active' || c.status === 'pending').length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No active contracts</p>
                <p className="text-sm mt-1">Post a project to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.filter(c => c.status === 'active' || c.status === 'pending').map((contract) => (
                  <div key={contract.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Contract #{contract.id.slice(0, 8)}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status: {contract.status}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">₹{contract.contract_amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Contract amount</div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              Your Projects ({filteredProjects.length})
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white w-full sm:w-auto"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => router.push('/projects/create')}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Post New Project</span>
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {projects.length === 0 
                  ? "You haven't posted any projects yet" 
                  : "No projects match your filters"}
              </p>
              <button
                onClick={() => router.push('/projects/create')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Post Your First Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 dark:border-slate-600 rounded-lg p-6 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition cursor-pointer group"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                          {project.title}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {project.applicationCount !== undefined && project.applicationCount > 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
                            {project.applicationCount} {project.applicationCount === 1 ? 'Application' : 'Applications'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        ₹{project.budget.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Budget</div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.duration_hours}h
                    </span>
                    {project.deadline && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <div className="flex flex-wrap gap-2">
                      {project.required_skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {project.required_skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          +{project.required_skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
