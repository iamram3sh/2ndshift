'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { 
  Briefcase, DollarSign, User, LogOut, Plus, Clock,
  Users, CheckCircle, TrendingUp, Eye, MessageSquare,
  Bell, Filter, Search, Calendar, Award, BarChart3,
  FileText, Zap, Target, Activity, ArrowRight, Sparkles,
  TrendingDown, AlertCircle, PlusCircle
} from 'lucide-react'
import type { User as UserType, Project, Contract } from '@/types/database.types'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

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
        
        const spent = data.reduce((sum, c) => sum + (c.contract_amount || 0), 0)
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

  const getStatusConfig = (status: string) => {
    const configs = {
      open: { variant: 'success' as const, label: 'Open' },
      assigned: { variant: 'info' as const, label: 'Assigned' },
      in_progress: { variant: 'warning' as const, label: 'In Progress' },
      completed: { variant: 'default' as const, label: 'Completed' },
      cancelled: { variant: 'danger' as const, label: 'Cancelled' }
    }
    return configs[status as keyof typeof configs] || { variant: 'default' as const, label: status }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:bg-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero Section */}
        <Card variant="gradient" className="mb-8 overflow-hidden animate-in slide-in-from-bottom">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
            
            <CardContent className="relative z-10 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                    Welcome back, {user?.full_name?.split(' ')[0]}! 👋
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                    Manage your projects and find the perfect talent
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="success"
                      size="lg"
                      icon={<PlusCircle className="w-5 h-5" />}
                      onClick={() => router.push('/projects/create')}
                    >
                      Post New Project
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      icon={<Search className="w-5 h-5" />}
                      onClick={() => router.push('/workers')}
                    >
                      Browse Workers
                    </Button>
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center justify-center">
                  <div className="text-center p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      {stats.activeProjects}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Active Projects</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-animation">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CheckCircle, label: 'Completed', value: stats.completedProjects, color: 'green' },
            { icon: FileText, label: 'Pending Apps', value: stats.pendingApplications, color: 'blue' },
            { icon: Users, label: 'Total Workers', value: stats.totalWorkers, color: 'purple' },
            { icon: Target, label: 'Avg Project', value: `₹${Math.round(stats.avgProjectValue).toLocaleString()}`, color: 'orange' }
          ].map((stat, index) => (
            <Card key={index} hover className="p-4 animate-in scale-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Applications */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle size="default" className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <FileText className="empty-state-icon" />
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">No applications yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Post a project to receive applications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all card-hover">
                      <div className="mt-1">
                        {app.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                        {app.status === 'accepted' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {app.status === 'rejected' && <Users className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {app.worker?.full_name || 'Worker'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={app.status === 'pending' ? 'warning' : app.status === 'accepted' ? 'success' : 'danger'} size="sm" rounded>
                            {app.status}
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">₹{app.proposed_rate}/hr</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {applications.length > 5 && (
                <Button variant="ghost" fullWidth className="mt-4" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  View All Applications
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Active Contracts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle size="default" className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Active Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contracts.filter(c => c.status === 'active' || c.status === 'pending').length === 0 ? (
                <div className="empty-state">
                  <Briefcase className="empty-state-icon" />
                  <p className="text-base font-semibold text-slate-900 dark:text-white mb-1">No active contracts</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Post a project to get started!</p>
                  <Button variant="success" icon={<PlusCircle className="w-4 h-4" />}>
                    Post New Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.filter(c => c.status === 'active' || c.status === 'pending').map((contract) => (
                    <div key={contract.id} className="border-2 border-slate-200 dark:border-slate-600 rounded-xl p-5 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg transition-all card-hover">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                            Contract #{contract.id.slice(0, 8)}
                          </h4>
                          <Badge variant="success" size="sm" rounded>
                            {contract.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ₹{contract.contract_amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Contract amount</div>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card>
          <CardHeader actions={
            <Button variant="success" icon={<Plus className="w-4 h-4" />} onClick={() => router.push('/projects/create')}>
              Post Project
            </Button>
          }>
            <CardTitle size="lg" className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              Your Projects
            </CardTitle>
            <CardDescription>
              {filteredProjects.length} projects in your portfolio
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <Input
                icon={<Search className="w-5 h-5" />}
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:flex-1"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input md:w-64"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="empty-state">
                <Briefcase className="empty-state-icon" />
                <p className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                  {projects.length === 0 
                    ? "You haven't posted any projects yet" 
                    : "No projects match your filters"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Post your first project to find talented professionals
                </p>
                <Button variant="success" icon={<PlusCircle className="w-5 h-5" />} onClick={() => router.push('/projects/create')}>
                  Post Your First Project
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => {
                  const statusConfig = getStatusConfig(project.status)
                  return (
                    <Card
                      key={project.id}
                      interactive
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="group"
                    >
                      <CardContent>
                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-2">
                                  {project.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant={statusConfig.variant} size="sm" rounded>
                                    {statusConfig.label}
                                  </Badge>
                                  {project.applicationCount !== undefined && project.applicationCount > 0 && (
                                    <Badge variant="primary" size="sm" rounded icon={<Users className="w-3 h-3" />}>
                                      {project.applicationCount} {project.applicationCount === 1 ? 'Application' : 'Applications'}
                                    </Badge>
                                  )}
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{project.duration_hours}h</span>
                                  </div>
                                  {project.deadline && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                      <Calendar className="w-3.5 h-3.5" />
                                      <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.required_skills.slice(0, 4).map(skill => (
                                <Badge key={skill} variant="default" size="sm">
                                  {skill}
                                </Badge>
                              ))}
                              {project.required_skills.length > 4 && (
                                <Badge variant="default" size="sm">
                                  +{project.required_skills.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex lg:flex-col items-end justify-between lg:justify-start gap-3">
                            <div className="text-right">
                              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                ₹{project.budget.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Budget</div>
                            </div>
                            <Button variant="secondary" size="sm" icon={<Eye className="w-4 h-4" />} iconPosition="right">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
