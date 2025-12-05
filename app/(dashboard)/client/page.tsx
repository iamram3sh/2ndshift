'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { ShiftsModal } from '@/components/shifts/ShiftsModal'
import { BuyCreditsModalV1 } from '@/components/revenue/BuyCreditsModalV1'
import { SubscriptionUpsell } from '@/components/revenue/SubscriptionUpsell'
import { CommissionCalculator } from '@/components/revenue/CommissionCalculator'
import { CommissionBreakdown } from '@/components/revenue/CommissionBreakdown'
import { SubscriptionUpsellSection } from '@/components/revenue/SubscriptionUpsellSection'
import { AIJobWizard } from '@/components/jobs/AIJobWizard'
import MicroJobPacks from '@/components/jobs/MicroJobPacks'
import { 
  Briefcase, IndianRupee, User, LogOut, Plus, Clock,
  Users, CheckCircle, TrendingUp, Eye, MessageSquare,
  Bell, Search, Calendar, Award, BarChart3, FileText, 
  Zap, Target, Activity, Star, ChevronRight, Rocket, 
  Shield, BadgeCheck, Sparkles, ArrowRight, Crown,
  Layers, XCircle, Timer, MapPin, Filter, ArrowUpRight,
  UserPlus, Send, Gift, Settings, HelpCircle, Info
} from 'lucide-react'
import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from '@/components/ui/Topbar'
import { StatsBar } from '@/components/ui/StatsBar'
import { KanbanBoard, type KanbanColumn } from '@/components/ui/KanbanBoard'
import { ActivityFeed } from '@/components/ui/ActivityFeed'
import type { User as UserType, Project, Contract } from '@/types/database.types'

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
  shiftsBalance: number
}

interface ProjectWithApplications extends Project {
  applicationCount?: number
  applications?: Application[]
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
    shiftsBalance: 15
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showShiftsModal, setShowShiftsModal] = useState(false)
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false)
  const [shiftsBalance, setShiftsBalance] = useState(0)
  const [platformConfig, setPlatformConfig] = useState<any>(null)
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null)
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([])
  const [activities, setActivities] = useState<any[]>([])

  // Fetch Shifts balance (credits)
  const fetchShiftsBalance = useCallback(async () => {
    try {
      const result = await apiClient.getCreditsBalance()
      if (result.data) {
        const balance = (result.data && typeof result.data === 'object' && 'balance' in result.data) ? (result.data as any).balance || 0 : 0
        setShiftsBalance(balance)
        setStats(prev => ({ ...prev, shiftsBalance: balance }))
      }
    } catch (err) {
      console.error('Error fetching credits balance:', err)
    }
  }, [])

  // Fetch platform config
  const fetchPlatformConfig = useCallback(async () => {
    try {
      const result = await apiClient.getPlatformConfig()
      if (result.data) {
        setPlatformConfig(result.data)
      }
    } catch (err) {
      console.error('Error fetching platform config:', err)
    }
  }, [])

  const checkAuth = async () => {
    // Check authentication using v1 API
    const result = await apiClient.getCurrentUser()
    
    if (result.error || !result.data?.user) {
      router.push('/login')
      return
    }

    const currentUser = result.data.user
    
    // Check if user is a client
    if (currentUser.role !== 'client') {
      const routes: Record<string, string> = {
        worker: '/worker',
        admin: '/dashboard/admin',
        superadmin: '/dashboard/admin'
      }
      router.push(routes[currentUser.role] || '/login')
      return
    }

    // Set user data
    setUser({
      id: currentUser.id,
      email: currentUser.email,
      full_name: currentUser.name || '',
      user_type: 'client',
    } as UserType)

    // Fetch dashboard data
    await Promise.all([
      fetchProjects(currentUser.id),
      fetchApplications(currentUser.id),
      fetchContracts(currentUser.id),
      fetchShiftsBalance(),
      fetchPlatformConfig()
    ])

    // Fetch dashboard metrics
    try {
      const metricsResponse = await fetch('/api/dashboard/metrics?role=client', {
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

    // Fetch kanban data
    if (currentUser?.id) {
      try {
        const kanbanResponse = await fetch(`/api/clients/${currentUser.id}/kanban`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        if (kanbanResponse.ok) {
          const kanban = await kanbanResponse.json()
          setKanbanColumns(kanban.columns || [])
        }
      } catch (err) {
        console.error('Error fetching kanban:', err)
      }
    }
    
    setIsLoading(false)
  }

  const fetchProjects = async (userId: string) => {
    // Try jobs table first (v1 schema)
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })

    if (jobsData && jobsData.length > 0) {
      const projectsWithCounts = await Promise.all(
        jobsData.map(async (job) => {
          const { count, data: apps } = await supabase
            .from('applications')
            .select('*, worker:users!applications_worker_id_fkey(*)', { count: 'exact' })
            .eq('project_id', job.id)
            .limit(5)
          
          return { ...job, applicationCount: count || 0, applications: apps || [] }
        })
      )
      setProjects(projectsWithCounts as any)
      return
    }

    // Fallback to projects table (legacy)
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })

    if (data) {
      const projectsWithCounts = await Promise.all(
        data.map(async (project) => {
          const { count, data: apps } = await supabase
            .from('applications')
            .select('*, worker:users!applications_worker_id_fkey(*)', { count: 'exact' })
            .eq('project_id', project.id)
            .limit(5)
          
          return { ...project, applicationCount: count || 0, applications: apps || [] }
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
        .select(`*, worker:users!applications_worker_id_fkey(*)`)
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

    setStats(prev => ({
      ...prev,
      totalProjects: total,
      activeProjects: active,
      completedProjects: completed,
      avgProjectValue: avgValue
    }))
  }

  const handleSignOut = async () => {
    await apiClient.logout()
    localStorage.removeItem('access_token')
    router.push('/')
  }

  useEffect(() => { checkAuth() }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      assigned: 'bg-sky-50 text-sky-700 border-sky-200',
      in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
      completed: 'bg-slate-100 text-slate-700 border-slate-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200'
    }
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const filteredProjects = projects.filter(project => 
    filterStatus === 'all' || project.status === filterStatus
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

  const handleKanbanMove = async (cardId: string, fromColumnId: string, toColumnId: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/clients/${user.id}/kanban/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          proposalId: cardId,
          fromColumnId,
          toColumnId,
        }),
      })

      if (response.ok) {
        // Refresh kanban data
        const kanbanResponse = await fetch(`/api/clients/${user.id}/kanban`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        if (kanbanResponse.ok) {
          const kanban = await kanbanResponse.json()
          setKanbanColumns(kanban.columns || [])
        }
      }
    } catch (err) {
      console.error('Error moving kanban card:', err)
    }
  }

  const handleQuickAction = () => {
    router.push('/projects/create')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar role="client" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Topbar */}
        <Topbar
          role="client"
          onQuickAction={handleQuickAction}
          quickActionLabel="Post Project"
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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-slate-900">2ndShift</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-1">
                <Link href="/client" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                  Dashboard
                </Link>
                <Link href="/workers" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg">
                  Find Talent
                </Link>
                <Link href="/messages" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg">
                  Messages
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Shift Credits Balance Widget */}
              <div className="group relative">
                <button
                  onClick={() => setShowBuyCreditsModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
                  aria-describedby="credits-tooltip"
                >
                  <Zap className="w-4 h-4" />
                  <span>{shiftsBalance} Credits</span>
                  <HelpCircle className="w-3.5 h-3.5 opacity-80" />
                </button>
                <div id="credits-tooltip" className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-xs rounded-lg z-50 shadow-lg">
                  Shift Credits: used to apply for verified job matches. 1 credit = 1 application. Buy credits to speed up matching.
                </div>
              </div>

              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {stats.pendingApplications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              
              <div className="h-6 w-px bg-slate-200" />
              
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
              >
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              </button>
              
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pricing & Commission Summary */}
        {platformConfig && (
          <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Platform Fees</h3>
                <p className="text-sm text-slate-600">
                  Client commission: {((platformConfig.client_commission_percent || 0.04) * 100).toFixed(0)}% · 
                  Escrow fee: {((platformConfig.escrow_fee_percent || 0.02) * 100).toFixed(0)}%
                </p>
              </div>
              <Link
                href="/pricing"
                className="text-sm text-sky-600 font-medium hover:text-sky-700"
              >
                View Plans →
              </Link>
            </div>
          </div>
        )}

        {/* AI Job Wizard CTA */}
        <div className="mb-6 p-6 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-xl">
                <Sparkles className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">AI Job Wizard</h3>
                <p className="text-sm text-slate-600">
                  Generate perfect job posts in seconds. Just describe what you need.
                </p>
              </div>
            </div>
            <Link
              href="/projects/create?wizard=true"
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
            >
              Try AI Wizard
            </Link>
          </div>
        </div>

        {/* Microtask Packs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Quick-Start Microtask Packs</h2>
            <Link href="/projects/create" className="text-sm text-sky-600 font-medium hover:text-sky-700">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'DevOps Quick Fix', price: '₹5,000', tasks: ['Pipeline fixes', 'Deployment'], duration: '1-2 days' },
              { title: 'Cloud Audit', price: '₹15,000', tasks: ['Security review', 'Cost optimization'], duration: '3-5 days' },
              { title: 'API Integration', price: '₹10,000', tasks: ['Third-party API', 'Documentation'], duration: '2-3 days' },
            ].map((pack, i) => (
              <Link
                key={i}
                href="/projects/create"
                className="block p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-slate-900 mb-2">{pack.title}</h3>
                <div className="text-lg font-bold text-emerald-600 mb-2">{pack.price}</div>
                <div className="text-xs text-slate-600 mb-2">{pack.duration}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {pack.tasks.map(task => (
                    <span key={task} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                      {task}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-slate-500">
                  Platform fee: 4% · Escrow: 2%
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back, {user?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your projects and find the best talent
            </p>
            {platformConfig && (
              <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  <span>
                    Platform fee: {(parseFloat(platformConfig.client_commission_percent || '0.04') * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  <span>
                    Escrow fee: {(parseFloat(platformConfig.escrow_fee_percent || '0.02') * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <Users className="w-4 h-4" />
              Browse Talent
            </Link>
            <Link
              href="/projects/create"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all"
            >
              <Plus className="w-4 h-4" />
              Post Project
            </Link>
          </div>
        </div>

          {/* Stats Bar */}
          <div className="mb-6">
            <StatsBar
              stats={[
                {
                  title: 'New Projects',
                  value: dashboardMetrics?.newCustomers || stats.totalProjects || 0,
                  sparkline: dashboardMetrics?.sparklineData,
                  icon: <TrendingUp className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Success Rate',
                  value: `${dashboardMetrics?.successRate || 0}%`,
                  gauge: {
                    value: dashboardMetrics?.successRate || 0,
                    max: 100,
                  },
                  icon: <Briefcase className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Tasks in Progress',
                  value: dashboardMetrics?.tasksInProgress || stats.activeProjects || 0,
                  icon: <Zap className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Prepayments',
                  value: `₹${(dashboardMetrics?.prepayments || 0).toLocaleString()}`,
                  icon: <IndianRupee className="w-5 h-5 text-slate-600" />,
                },
              ]}
            />
          </div>

          {/* Kanban Board */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Proposal Pipeline</h2>
            </div>
            {kanbanColumns.length > 0 ? (
              <KanbanBoard
                columns={kanbanColumns.map(col => ({
                  ...col,
                  cards: col.cards.map((card: any) => ({
                    id: card.id || card.proposalId,
                    title: card.title,
                    description: card.worker?.full_name ? `From ${card.worker.full_name}` : undefined,
                    budget: card.budget,
                    date: card.createdAt ? new Date(card.createdAt).toLocaleDateString() : undefined,
                    avatars: card.worker ? [] : [],
                    tags: [card.status],
                    meta: card,
                  })),
                }))}
                onCardMove={handleKanbanMove}
                onCardClick={(card) => {
                  router.push(`/projects/${card.meta?.job?.id || ''}`)
                }}
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No proposals yet</p>
                <p className="text-sm text-slate-500 mt-1">Proposals will appear here when workers apply to your projects</p>
              </div>
            )}
          </div>

          {/* Legacy Stats Grid (fallback if no metrics) */}
          {!dashboardMetrics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  ₹{stats.totalSpent.toLocaleString()}
                </div>
                <div className="text-sm text-slate-500 mt-1">Total Invested</div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-sky-600" />
                  </div>
                  <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                    {stats.activeProjects} active
                  </span>
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {stats.totalProjects}
                </div>
                <div className="text-sm text-slate-500 mt-1">Total Projects</div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {stats.totalWorkers}
                </div>
                <div className="text-sm text-slate-500 mt-1">Hired Professionals</div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  {stats.pendingApplications > 0 && (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      {stats.pendingApplications} new
                    </span>
                  )}
            </div>
            <div className="text-2xl font-semibold text-slate-900">
              {applications.length}
            </div>
            <div className="text-sm text-slate-500 mt-1">Applications</div>
          </div>
        </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
            {/* Shifts Promo Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shifts-promo-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full text-sm font-medium mb-4 shifts-badge">
                    <Zap className="w-4 h-4" />
                    Shifts for Clients
                  </div>
                  <h3 className="text-xl font-semibold mb-2 shifts-title">
                    Find top talent faster
                  </h3>
                  <p className="text-sm mb-4 shifts-description">
                    Use Shifts to feature your jobs, get AI-powered recommendations, and directly invite the best professionals.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowShiftsModal(true)}
                      className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      Get Shifts
                    </button>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 text-sm font-medium shifts-learn-more"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="shifts-benefit">Featured Listing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="shifts-benefit">AI Recommendations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Send className="w-4 h-4 text-amber-400" />
                    <span className="shifts-benefit">Direct Invites</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            {stats.pendingApplications > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    Pending Applications
                  </h2>
                  <span className="text-sm text-slate-500">{stats.pendingApplications} waiting for review</span>
                </div>
                
                <div className="space-y-3">
                  {applications.filter(a => a.status === 'pending').slice(0, 3).map((app) => (
                    <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-lg font-semibold text-slate-600">
                          {app.worker?.full_name?.charAt(0) || 'W'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-slate-900">{app.worker?.full_name || 'Professional'}</h3>
                            <span className="px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-full border border-amber-200">
                              Pending
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                            {app.cover_letter || 'No cover letter provided'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="font-medium text-slate-900">₹{app.proposed_rate}/hr</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                            View
                          </button>
                          <button className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Your Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Your Projects</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No projects yet</p>
                  <p className="text-sm text-slate-500 mt-1">Post your first project to start hiring</p>
                  <Link
                    href="/projects/create"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4 hover:bg-slate-800 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Post Project
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-slate-900 group-hover:text-sky-600 transition-colors">
                              {project.title}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-semibold text-slate-900">
                            ₹{project.budget.toLocaleString()}
                          </div>
                          {user && (
                            <div className="mt-2">
                              <CommissionBreakdown
                                price={project.budget}
                                clientId={user.id}
                                showTooltips={false}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Timer className="w-4 h-4" />
                            {project.duration_hours}h
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {project.applicationCount || 0} applied
                          </span>
                        </div>
                        
                        {project.applicationCount && project.applicationCount > 0 && (
                          <div className="flex -space-x-2">
                            {project.applications?.slice(0, 3).map((app, i) => (
                              <div
                                key={i}
                                className="w-7 h-7 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600"
                              >
                                {app.worker?.full_name?.charAt(0) || 'W'}
                              </div>
                            ))}
                            {project.applicationCount > 3 && (
                              <div className="w-7 h-7 bg-slate-900 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                                +{project.applicationCount - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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

              {/* Active Contracts */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Active Contracts</h3>
                <span className="text-xs text-slate-500">{contracts.filter(c => c.status === 'active').length} active</span>
              </div>
              
              {contracts.filter(c => c.status === 'active' || c.status === 'pending').length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No active contracts
                </p>
              ) : (
                <div className="space-y-3">
                  {contracts.filter(c => c.status === 'active' || c.status === 'pending').slice(0, 3).map((contract) => (
                    <div key={contract.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">
                          #{contract.id.slice(0, 8)}
                        </span>
                        <span className="text-sm font-semibold text-emerald-600">
                          ₹{contract.contract_amount.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 capitalize">{contract.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscription Upsell */}
            <SubscriptionUpsellSection userId={user?.id} userType="client" />

            {/* Client Subscription Upsell */}
            <SubscriptionUpsell
              userType="client"
              onSubscribe={() => router.push('/pricing')}
            />

            {/* Featured Job Promo */}
            <div className="bg-gradient-to-br from-sky-500 to-[#0b63ff] rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Feature Your Job</span>
              </div>
              <p className="text-sky-100 text-sm mb-4">
                Get 10x more applications. Your job appears at the top for 7 days.
              </p>
              <button
                onClick={() => setShowBuyCreditsModal(true)}
                className="w-full bg-white text-sky-600 py-2 rounded-lg text-sm font-semibold hover:bg-sky-50 transition-colors"
              >
                Feature for 3 Credits
              </button>
            </div>

            {/* Recommended Professionals */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Recommended</h3>
                <Link href="/workers" className="text-xs text-sky-600 font-medium hover:text-sky-700">
                  View all
                </Link>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Rahul S.', skill: 'React Developer', rating: 4.9, rate: '₹1,200/hr' },
                  { name: 'Priya M.', skill: 'Cloud Architect', rating: 4.8, rate: '₹2,000/hr' },
                  { name: 'Amit K.', skill: 'Backend Dev', rating: 4.9, rate: '₹1,400/hr' },
                ].map((pro, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                      {pro.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-slate-900">{pro.name}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-slate-500">{pro.rating}</span>
                      </div>
                      <div className="text-xs text-slate-500">{pro.skill}</div>
                    </div>
                    <span className="text-xs font-medium text-slate-600">{pro.rate}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowShiftsModal(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-amber-600 font-medium hover:text-amber-700"
              >
                <Sparkles className="w-4 h-4" />
                Get AI Recommendations (5 Shifts)
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/projects/create" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Plus className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700">Post New Project</span>
                </Link>
                <Link href="/workers" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700">Browse Talent</span>
                </Link>
                <Link href="/messages" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700">Messages</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Settings className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-700">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Credits Modal */}
      {user && (
        <BuyCreditsModalV1
          isOpen={showBuyCreditsModal}
          onClose={() => setShowBuyCreditsModal(false)}
          userId={user.id}
          userType="client"
          currentBalance={shiftsBalance}
          onPurchaseComplete={(newBalance) => {
            setShiftsBalance(newBalance)
            setStats(prev => ({ ...prev, shiftsBalance: newBalance }))
            fetchShiftsBalance()
          }}
        />
      )}

      {/* Shifts Modal */}
      {user && (
        <ShiftsModal
          isOpen={showShiftsModal}
          onClose={() => setShowShiftsModal(false)}
          userId={user.id}
          userType="client"
          currentBalance={shiftsBalance}
          onPurchaseComplete={(newBalance) => {
            setShiftsBalance(newBalance)
            setStats(prev => ({ ...prev, shiftsBalance: newBalance }))
            fetchShiftsBalance()
          }}
        />
      )}
    </div>
  )
}
