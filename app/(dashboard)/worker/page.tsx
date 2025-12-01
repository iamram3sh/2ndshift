'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { 
  Briefcase, Clock, DollarSign, User, LogOut, Search, 
  TrendingUp, FileText, CheckCircle, XCircle, AlertCircle,
  Award, Target, Activity, Bell, Filter, ArrowUpRight,
  Calendar, Zap, BarChart3, Sparkles, ArrowRight, TrendingDown
} from 'lucide-react'
import type { User as UserType, Project, Contract, WorkerProfile } from '@/types/database.types'
import { StatsCard } from '@/components/dashboard/StatsCard'
import ProfileCompletionWidget from '@/components/profile/ProfileCompletionWidget'
import VerificationBadges from '@/components/profile/VerificationBadges'
import OnlineStatusIndicator, { StatusToggle } from '@/components/profile/OnlineStatusIndicator'
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

    const { data: totalData } = await supabase
      .from('payments')
      .select('net_amount')
      .eq('payment_to', user.id)
      .eq('status', 'completed')

    if (totalData) {
      const total = totalData.reduce((sum, payment) => sum + (payment.net_amount || 0), 0)
      setStats(prev => ({ ...prev, totalEarnings: total }))
    }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:bg-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Widget */}
        {user && stats.profileCompletion < 100 && (
          <div className="mb-6 animate-in slide-in-from-top">
            <ProfileCompletionWidget userId={user.id} userType="worker" />
          </div>
        )}

        {/* Welcome Hero Section */}
        <Card variant="gradient" className="mb-8 overflow-hidden animate-in slide-in-from-bottom">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            
            <CardContent className="relative z-10 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                      Welcome back, {user?.full_name?.split(' ')[0]}! 👋
                    </h2>
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
                  
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                    Ready to discover your next opportunity?
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={<Sparkles className="w-5 h-5" />}
                      onClick={() => router.push('/worker/discover')}
                    >
                      Discover Jobs with AI
                    </Button>
                    {user && (
                      <StatusToggle userId={user.id} currentStatus={user.availability_status || 'offline'} />
                    )}
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center justify-center">
                  <div className="text-center p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      {stats.activeContracts}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Active Projects</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-animation">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText, label: 'Pending Apps', value: stats.pendingApplications, color: 'blue' },
            { icon: CheckCircle, label: 'Completed', value: stats.completedProjects, color: 'green' },
            { icon: Target, label: 'Profile Score', value: `${stats.profileCompletion}%`, color: 'purple' },
            { icon: Award, label: 'Avg Rating', value: stats.avgRating || '—', color: 'orange' }
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
                <Activity className="w-5 h-5 text-indigo-600" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <FileText className="empty-state-icon" />
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">No applications yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Start applying to projects below</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all card-hover">
                      <div className="mt-1">
                        {app.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                        {app.status === 'accepted' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {app.status === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {app.project?.title || 'Project'}
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
                <Zap className="w-5 h-5 text-green-600" />
                Active Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contracts.length === 0 ? (
                <div className="empty-state">
                  <Briefcase className="empty-state-icon" />
                  <p className="text-base font-semibold text-slate-900 dark:text-white mb-1">No active contracts</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Apply to projects below to get started!</p>
                  <Button variant="primary" icon={<Search className="w-4 h-4" />}>
                    Browse Projects
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="border-2 border-slate-200 dark:border-slate-600 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all card-hover">
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
                            ₹{contract.worker_payout.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Your payout</div>
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

        {/* Available Projects */}
        <Card>
          <CardHeader actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
            </div>
          }>
            <CardTitle size="lg" className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Available Projects
            </CardTitle>
            <CardDescription>
              {filteredProjects.length} opportunities matching your skills
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
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="input md:w-64"
              >
                <option value="all">All Skills</option>
                {allSkills.slice(0, 10).map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="empty-state">
                <Briefcase className="empty-state-icon" />
                <p className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                  No projects available
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Check back later for new opportunities
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => {
                  const skillMatch = getSkillMatch(project.required_skills)
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
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                                  {project.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2">
                                  {skillMatch >= 70 && (
                                    <Badge variant="success" size="sm" rounded icon={<Sparkles className="w-3 h-3" />}>
                                      {skillMatch}% Match
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
                            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                              Apply Now
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
