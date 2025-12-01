'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { 
  Briefcase, Clock, DollarSign, User, LogOut, Search, 
  TrendingUp, FileText, CheckCircle, XCircle, AlertCircle,
  Award, Target, Activity, Bell, Filter, ArrowUpRight,
  Calendar, Zap, BarChart3
} from 'lucide-react'
import type { User as UserType, Project, Contract, WorkerProfile } from '@/types/database.types'
import { StatsCard } from '@/components/dashboard/StatsCard'
import ProfileCompletionWidget from '@/components/profile/ProfileCompletionWidget'
import VerificationBadges from '@/components/profile/VerificationBadges'
import OnlineStatusIndicator, { StatusToggle } from '@/components/profile/OnlineStatusIndicator'
import { KycStatusCard } from '@/components/compliance/KycStatusCard'

interface Application {
  id: string
  project_id: string
  worker_id: string
  cover_letter: string
  proposed_rate: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: string
  project?: Project
}

interface DashboardStats {
  activeContracts: number
  hoursThisMonth: number
  totalEarnings: number
  pendingApplications: number
  acceptanceRate: number
  completedProjects: number
  avgRating: number
  profileCompletion: number
}

export default function WorkerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeContracts: 0,
    hoursThisMonth: 0,
    totalEarnings: 0,
    pendingApplications: 0,
    acceptanceRate: 0,
    completedProjects: 0,
    avgRating: 0,
    profileCompletion: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSkill, setFilterSkill] = useState<string>('all')

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
      if (profile.user_type !== 'worker') {
        router.push(`/${profile.user_type}`)
        return
      }
      setUser(profile)
      await fetchWorkerProfile(authUser.id)
    }
    setIsLoading(false)
  }

  const fetchWorkerProfile = async (userId: string) => {
    const { data } = await supabase
      .from('worker_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data) {
      setWorkerProfile(data)
      calculateProfileCompletion(data)
    }
  }

  const calculateProfileCompletion = (profile: WorkerProfile) => {
    let completion = 0
    const fields = [
      profile.skills?.length > 0,
      profile.experience_years > 0,
      profile.hourly_rate > 0,
      profile.bio,
      profile.portfolio_url,
      profile.resume_url,
      profile.is_verified
    ]
    completion = (fields.filter(Boolean).length / fields.length) * 100
    setStats(prev => ({ ...prev, profileCompletion: Math.round(completion) }))
  }

  const fetchApplications = async () => {
    if (!user) return

    const { data } = await supabase
      .from('applications')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('worker_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      setApplications(data as any)
      const pending = data.filter(app => app.status === 'pending').length
      const total = data.length
      const accepted = data.filter(app => app.status === 'accepted').length
      const rate = total > 0 ? Math.round((accepted / total) * 100) : 0
      
      setStats(prev => ({ 
        ...prev, 
        pendingApplications: pending,
        acceptanceRate: rate
      }))
    }
  }

  const fetchContracts = async () => {
    if (!user) return

    const { data: activeData } = await supabase
      .from('contracts')
      .select('*')
      .eq('worker_id', user.id)
      .in('status', ['active', 'pending'])

    const { data: completedData } = await supabase
      .from('contracts')
      .select('*')
      .eq('worker_id', user.id)
      .eq('status', 'completed')

    if (activeData) {
      setContracts(activeData)
      setStats(prev => ({ 
        ...prev, 
        activeContracts: activeData.length,
        completedProjects: completedData?.length || 0
      }))
    }
  }

  const fetchEarnings = async () => {
    if (!user) return

    // Total earnings
    const { data: totalData } = await supabase
      .from('payments')
      .select('net_amount')
      .eq('payment_to', user.id)
      .eq('status', 'completed')

    if (totalData) {
      const total = totalData.reduce((sum, payment) => sum + (payment.net_amount || 0), 0)
      setStats(prev => ({ ...prev, totalEarnings: total }))
    }

    // This month's hours - calculated from contracts
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: contractsData } = await supabase
      .from('contracts')
      .select('project_id')
      .eq('worker_id', user.id)
      .gte('started_at', startOfMonth.toISOString())

    if (contractsData) {
      const projectIds = contractsData.map(c => c.project_id)
      if (projectIds.length > 0) {
        const { data: projectsData } = await supabase
          .from('projects')
          .select('duration_hours')
          .in('id', projectIds)

        if (projectsData) {
          const hours = projectsData.reduce((sum, p) => sum + (p.duration_hours || 0), 0)
          setStats(prev => ({ ...prev, hoursThisMonth: hours }))
        }
      }
    }
  }

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) setProjects(data)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProjects()
      fetchApplications()
      fetchContracts()
      fetchEarnings()
    }
  }, [user])

  const getSkillMatch = (projectSkills: string[]) => {
    if (!workerProfile?.skills?.length) return 0
    const matches = projectSkills.filter(skill => 
      workerProfile.skills.some(ws => ws.toLowerCase().includes(skill.toLowerCase()))
    )
    return Math.round((matches.length / projectSkills.length) * 100)
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSkill = filterSkill === 'all' || 
                         project.required_skills.some(skill => skill.toLowerCase().includes(filterSkill.toLowerCase()))
    return matchesSearch && matchesSkill
  })

  const allSkills = Array.from(new Set(projects.flatMap(p => p.required_skills)))

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
              <h1 className="text-2xl font-bold text-indigo-600">2ndShift</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">Worker Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400">
                <Bell className="w-5 h-5" />
                {stats.pendingApplications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300"
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
        {/* Profile Completion + KYC */}
        {user && (
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfileCompletionWidget userId={user.id} userType="worker" />
            <KycStatusCard userId={user.id} verificationType="pan" />
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white mb-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">Welcome back, {user?.full_name}! 👋</h2>
                {user && (
                  <OnlineStatusIndicator
                    userId={user.id}
                    size="lg"
                    showLabel={true}
                  />
                )}
              </div>
              {user && (
                <div className="mb-4">
                  <VerificationBadges
                    verificationLevel={3}
                    isVerified={user.verification_status === 'verified'}
                    emailVerified={user.email_verified || false}
                    phoneVerified={user.phone_verified || false}
                  />
                </div>
              )}
              <p className="text-indigo-100 mb-4">Ready to find your next project?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/worker/discover')}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Discover Jobs with AI
                </button>
                {user && (
                  <StatusToggle userId={user.id} currentStatus={user.availability_status || 'offline'} />
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-4xl font-bold">{stats.activeContracts}</div>
                <div className="text-sm text-indigo-200">Active Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Contracts"
            value={stats.activeContracts}
            icon={Briefcase}
            color="indigo"
            change={stats.activeContracts > 0 ? { value: 12, trend: 'up' } : undefined}
          />
          <StatsCard
            title="Hours This Month"
            value={stats.hoursThisMonth}
            icon={Clock}
            color="green"
          />
          <StatsCard
            title="Total Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}`}
            icon={DollarSign}
            color="orange"
            change={stats.totalEarnings > 0 ? { value: 8, trend: 'up' } : undefined}
          />
          <StatsCard
            title="Success Rate"
            value={`${stats.acceptanceRate}%`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Profile Score</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.profileCompletion}%</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Award className="w-5 h-5 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.avgRating || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Applications */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
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
                      {app.status === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {app.project?.title || 'Project'}
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
              <button className="w-full mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700">
                View All Applications →
              </button>
            )}
          </div>

          {/* Active Contracts */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Active Contracts
              </h3>
            </div>
            {contracts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No active contracts</p>
                <p className="text-sm mt-1">Apply to projects below to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Contract #{contract.id.slice(0, 8)}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status: {contract.status}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">₹{contract.worker_payout.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Your payout</div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Projects */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Available Projects ({filteredProjects.length})
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white w-full sm:w-auto"
                />
              </div>
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Skills</option>
                {allSkills.slice(0, 10).map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No projects available at the moment</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Check back later for new opportunities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const skillMatch = getSkillMatch(project.required_skills)
                return (
                  <div
                    key={project.id}
                    className="border border-gray-200 dark:border-slate-600 rounded-lg p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition cursor-pointer group"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {project.title}
                          </h4>
                          {skillMatch >= 70 && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">
                              {skillMatch}% Match
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
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
