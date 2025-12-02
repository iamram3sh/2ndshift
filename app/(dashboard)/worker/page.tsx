'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ShiftsModal } from '@/components/shifts/ShiftsModal'
import { 
  Briefcase, Clock, DollarSign, User, LogOut, Search, 
  TrendingUp, FileText, CheckCircle, XCircle, AlertCircle,
  Award, Target, Activity, Bell, Filter, ArrowUpRight,
  Calendar, Zap, BarChart3, Eye, Star, ChevronRight, 
  Rocket, Shield, BadgeCheck, Sparkles, Users, MessageSquare,
  Settings, HelpCircle, Crown, ArrowRight, Lock, Gift,
  Layers, MoreHorizontal, ExternalLink, MapPin, Timer
} from 'lucide-react'
import type { User as UserType, Project, Contract, WorkerProfile } from '@/types/database.types'

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
  profileViews: number
  shiftsBalance: number
}

export default function WorkerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [stats, setStats] = useState<DashboardStats>({
    activeContracts: 0,
    hoursThisMonth: 0,
    totalEarnings: 0,
    pendingApplications: 0,
    acceptanceRate: 0,
    completedProjects: 0,
    avgRating: 4.8,
    profileViews: 127,
    shiftsBalance: 10
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showShiftsModal, setShowShiftsModal] = useState(false)
  const [shiftsBalance, setShiftsBalance] = useState(0)

  // Fetch Shifts balance
  const fetchShiftsBalance = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/shifts/balance?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setShiftsBalance(data.balance || 0)
        setStats(prev => ({ ...prev, shiftsBalance: data.balance || 0 }))
      }
    } catch (err) {
      console.error('Error fetching Shifts balance:', err)
    }
  }, [])

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
    setProfileCompletion(Math.round(completion))
  }

  const fetchApplications = async () => {
    if (!user) return

    const { data } = await supabase
      .from('applications')
      .select(`*, project:projects(*)`)
      .eq('worker_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      setApplications(data as any)
      const pending = data.filter(app => app.status === 'pending').length
      const total = data.length
      const accepted = data.filter(app => app.status === 'accepted').length
      const rate = total > 0 ? Math.round((accepted / total) * 100) : 0
      
      setStats(prev => ({ ...prev, pendingApplications: pending, acceptanceRate: rate }))
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

    const { data: totalData } = await supabase
      .from('payments')
      .select('net_amount')
      .eq('payment_to', user.id)
      .eq('status', 'completed')

    if (totalData) {
      const total = totalData.reduce((sum, payment) => sum + (payment.net_amount || 0), 0)
      setStats(prev => ({ ...prev, totalEarnings: total }))
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

  useEffect(() => { checkAuth() }, [])

  useEffect(() => {
    if (user) {
      fetchProjects()
      fetchApplications()
      fetchContracts()
      fetchEarnings()
      fetchShiftsBalance(user.id)
    }
  }, [user, fetchShiftsBalance])

  const getSkillMatch = (projectSkills: string[]) => {
    if (!workerProfile?.skills?.length) return 0
    const matches = projectSkills.filter(skill => 
      workerProfile.skills.some(ws => ws.toLowerCase().includes(skill.toLowerCase()))
    )
    return Math.round((matches.length / projectSkills.length) * 100)
  }

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
          <span className="text-[#333]">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-[#111]">2ndShift</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-1">
                <Link href="/worker" className="px-3 py-2 text-sm font-semibold text-[#111] bg-slate-100 rounded-lg">
                  Dashboard
                </Link>
                <Link href="/worker/discover" className="px-3 py-2 text-sm font-medium text-[#333] hover:text-[#111] rounded-lg transition-colors">
                  Find Work
                </Link>
                <Link href="/messages" className="px-3 py-2 text-sm font-medium text-[#333] hover:text-[#111] rounded-lg transition-colors">
                  Messages
                </Link>
                <Link href="/worker/profile/edit" className="px-3 py-2 text-sm font-medium text-[#333] hover:text-[#111] rounded-lg transition-colors">
                  Profile
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Shifts Balance */}
              <button
                onClick={() => setShowShiftsModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>{shiftsBalance} Shifts</span>
              </button>

              <button className="relative p-2 text-[#333] hover:text-[#111] hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              <div className="h-6 w-px bg-slate-200" />
              
              <button
                onClick={() => router.push('/worker/profile/edit')}
                className="flex items-center gap-2 text-[#333] hover:text-[#111] transition-colors"
              >
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold text-[#111]">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              </button>
              
              <button
                onClick={handleSignOut}
                className="p-2 text-[#333] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#111]">
              Welcome back, {user?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-[#333] mt-2 text-lg">
              Here&apos;s what&apos;s happening with your work today
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/worker/discover"
              className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#333] transition-all shadow-lg hover:shadow-xl"
            >
              <Search className="w-4 h-4" />
              Find Work
            </Link>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {profileCompletion < 100 && (
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Complete your profile</h3>
                  <p className="text-sky-100 text-sm mt-1">
                    Profiles that are 100% complete get 3x more views
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all" 
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{profileCompletion}%</span>
                </div>
                <Link
                  href="/worker/profile/edit"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-all"
                >
                  Complete Profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                +12%
              </span>
            </div>
            <div className="text-3xl font-bold text-[#111] mb-1">
              ₹{stats.totalEarnings.toLocaleString()}
            </div>
            <div className="text-sm text-[#333] font-medium">Total Earnings</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-sky-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-sky-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#111] mb-1">
              {stats.activeContracts}
            </div>
            <div className="text-sm text-[#333] font-medium">Active Projects</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#111] mb-1">
              {stats.avgRating}
            </div>
            <div className="text-sm text-[#333] font-medium">Avg. Rating</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                +8%
              </span>
            </div>
            <div className="text-3xl font-bold text-[#111] mb-1">
              {stats.profileViews}
            </div>
            <div className="text-sm text-[#333] font-medium">Profile Views</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shifts Promo Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
                    <Zap className="w-4 h-4" />
                    Shifts
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Stand out from the crowd
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Use Shifts to boost your applications, appear in featured listings, and get noticed by top clients.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowShiftsModal(true)}
                      className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      Get Shifts
                    </button>
                    <button className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Rocket className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">Boost Applications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">Featured Profile</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">Direct Messages</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="border-t border-slate-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111]">
                  Recommended for you
                </h2>
                <Link href="/worker/discover" className="text-sm text-[#333] hover:text-[#111] font-semibold transition-colors">
                  View all →
                </Link>
              </div>
              
              <div className="space-y-3">
                {filteredProjects.slice(0, 5).map((project) => {
                  const skillMatch = getSkillMatch(project.required_skills)
                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-sky-300 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-[#111] group-hover:text-sky-600 transition-colors">
                              {project.title}
                            </h3>
                            {skillMatch >= 70 && (
                              <span className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                                {skillMatch}% Match
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#333] line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-[#111]">
                            ₹{project.budget.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#333] pt-4 border-t border-slate-100">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Timer className="w-4 h-4" />
                          {project.duration_hours}h
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.required_skills.slice(0, 3).map(skill => (
                            <span key={skill} className="px-2.5 py-1 bg-slate-100 text-[#333] rounded-md text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Active Contracts */}
            <div className="border-t border-slate-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111]">Active Contracts</h2>
              </div>
              
              {contracts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                  <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-[#111] font-bold text-lg mb-2">No active contracts</p>
                  <p className="text-sm text-[#333] mb-6">Apply to projects to start working</p>
                  <Link
                    href="/worker/discover"
                    className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#333] transition-all shadow-lg"
                  >
                    Browse opportunities
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-[#111] mb-1">
                            Contract #{contract.id.slice(0, 8)}
                          </h4>
                          <span className="text-sm text-[#333] font-medium">
                            {contract.status === 'active' ? 'In Progress' : 'Pending'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">
                            ₹{contract.worker_payout.toLocaleString()}
                          </div>
                          <span className="text-xs text-[#333]">Your payout</span>
                        </div>
                      </div>
                      <button className="text-sm text-[#333] hover:text-[#111] font-semibold transition-colors">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-[#111] mb-6">This Month</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-sm text-[#333] font-medium">Hours Worked</span>
                  <span className="font-bold text-lg text-[#111]">{stats.hoursThisMonth}h</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-sm text-[#333] font-medium">Projects Completed</span>
                  <span className="font-bold text-lg text-[#111]">{stats.completedProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#333] font-medium">Success Rate</span>
                  <span className="font-bold text-lg text-emerald-600">{stats.acceptanceRate}%</span>
                </div>
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#111]">Recent Applications</h3>
                <span className="text-xs text-[#333] font-medium bg-slate-100 px-2.5 py-1 rounded-full">{applications.length} total</span>
              </div>
              
              {applications.length === 0 ? (
                <p className="text-sm text-[#333] text-center py-6">
                  No applications yet
                </p>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {app.status === 'pending' && <Clock className="w-5 h-5 text-amber-500" />}
                        {app.status === 'accepted' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        {app.status === 'rejected' && <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#111] truncate">
                          {app.project?.title || 'Project'}
                        </p>
                        <p className="text-xs text-[#333] capitalize font-medium">{app.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boost Profile Card */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Boost Your Profile</span>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                Get 5x more visibility for 7 days. Appear in featured professionals.
              </p>
              <button
                onClick={() => setShowShiftsModal(true)}
                className="w-full bg-white text-purple-600 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors"
              >
                Boost for 5 Shifts
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-[#111] mb-6">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/worker/profile/edit" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                  <User className="w-5 h-5 text-[#333] group-hover:text-[#111]" />
                  <span className="text-sm text-[#333] font-medium group-hover:text-[#111]">Edit Profile</span>
                </Link>
                <Link href="/worker/verification" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                  <Shield className="w-5 h-5 text-[#333] group-hover:text-[#111]" />
                  <span className="text-sm text-[#333] font-medium group-hover:text-[#111]">Verification</span>
                </Link>
                <Link href="/messages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                  <MessageSquare className="w-5 h-5 text-[#333] group-hover:text-[#111]" />
                  <span className="text-sm text-[#333] font-medium group-hover:text-[#111]">Messages</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                  <Settings className="w-5 h-5 text-[#333] group-hover:text-[#111]" />
                  <span className="text-sm text-[#333] font-medium group-hover:text-[#111]">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shifts Modal */}
      {user && (
        <ShiftsModal
          isOpen={showShiftsModal}
          onClose={() => setShowShiftsModal(false)}
          userId={user.id}
          userType="worker"
          currentBalance={shiftsBalance}
          onPurchaseComplete={(newBalance) => {
            setShiftsBalance(newBalance)
            setStats(prev => ({ ...prev, shiftsBalance: newBalance }))
          }}
        />
      )}
    </div>
  )
}
