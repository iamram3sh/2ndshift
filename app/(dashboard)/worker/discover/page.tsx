'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { 
  Search, Bookmark, Clock, IndianRupee, Calendar,
  TrendingUp, Zap, ArrowRight, Lock
} from 'lucide-react'
import type { User as UserType, Project } from '@/types/database.types'
import RecommendedJobs from '@/components/worker/RecommendedJobs'
import JobAlertsManager from '@/components/worker/JobAlertsManager'
import JobAlertModal from '@/components/worker/JobAlertModal'
import { PaymentVerifiedBadge } from '@/components/badges/PaymentBadges'
import HomeButton from '@/components/worker/HomeButton'
import { PriceBreakdown } from '@/components/jobs/PriceBreakdown'

export default function WorkerJobDiscoveryPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [savedProjects, setSavedProjects] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAlertModal, setShowAlertModal] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    minBudget: '',
    maxBudget: '',
    minDuration: '',
    maxDuration: '',
    skills: [] as string[],
    sortBy: 'newest' as 'newest' | 'budget_high' | 'budget_low' | 'deadline'
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProjects()
      fetchSavedProjects()
    }
  }, [user, filters])

  const checkAuth = async () => {
    try {
      const result = await apiClient.getCurrentUser()
      
      if (result.error || !result.data?.user) {
        router.push('/login')
        setIsLoading(false)
        return
      }

      const currentUser = result.data.user
      
      if (currentUser.role !== 'worker') {
        const routes: Record<string, string> = {
          client: '/client',
          admin: '/dashboard/admin',
          superadmin: '/dashboard/admin'
        }
        router.push(routes[currentUser.role] || '/login')
        setIsLoading(false)
        return
      }

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.name || '',
        user_type: 'worker',
      } as UserType)
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('status', 'open')

      if (filters.minBudget) {
        query = query.gte('budget', parseFloat(filters.minBudget))
      }
      if (filters.maxBudget) {
        query = query.lte('budget', parseFloat(filters.maxBudget))
      }
      if (filters.minDuration) {
        query = query.gte('duration_hours', parseInt(filters.minDuration))
      }
      if (filters.maxDuration) {
        query = query.lte('duration_hours', parseInt(filters.maxDuration))
      }

      switch (filters.sortBy) {
        case 'budget_high':
          query = query.order('budget', { ascending: false })
          break
        case 'budget_low':
          query = query.order('budget', { ascending: true })
          break
        case 'deadline':
          query = query.order('deadline', { ascending: true })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query.limit(50)

      if (error) throw error

      let filteredData = data || []
      if (searchQuery) {
        filteredData = filteredData.filter(project => 
          project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.required_skills?.some((skill: string) => 
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      }

      setProjects(filteredData)

      if (searchQuery && user) {
        await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            search_query: searchQuery,
            filters: filters,
            results_count: filteredData.length
          })
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchSavedProjects = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('saved_projects')
        .select('project_id')
        .eq('user_id', user.id)

      if (data) {
        setSavedProjects(new Set(data.map(sp => sp.project_id)))
      }
    } catch (error) {
      console.error('Error fetching saved projects:', error)
    }
  }

  const toggleSaveProject = async (projectId: string) => {
    if (!user) return
    
    const isSaved = savedProjects.has(projectId)
    
    try {
      if (isSaved) {
        await supabase
          .from('saved_projects')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', projectId)
        
        setSavedProjects(prev => {
          const updated = new Set(prev)
          updated.delete(projectId)
          return updated
        })
      } else {
        await supabase
          .from('saved_projects')
          .insert({
            user_id: user.id,
            project_id: projectId
          })
        
        setSavedProjects(prev => new Set(prev).add(projectId))
      }
    } catch (error) {
      console.error('Error toggling saved project:', error)
    }
  }

  const handleSearch = () => {
    fetchProjects()
  }

  const clearFilters = () => {
    setFilters({
      minBudget: '',
      maxBudget: '',
      minDuration: '',
      maxDuration: '',
      skills: [],
      sortBy: 'newest'
    })
    setSearchQuery('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
          <span className="text-[#111] font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <HomeButton variant="icon" />
              <div>
                <h1 className="text-3xl font-bold text-[#111] flex items-center gap-3">
                  <Zap className="w-8 h-8 text-sky-600" />
                  Job Discovery
                </h1>
                <p className="text-sm text-[#333] mt-1 font-medium">
                  Find your perfect project with AI-powered recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333]" />
                <input
                  type="text"
                  placeholder="Search by title, description, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111] placeholder:text-[#666] bg-white"
                  style={{ color: '#111' }}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#111] text-white rounded-lg hover:bg-[#333] transition-all flex items-center gap-2 justify-center font-semibold shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111] mb-1">
                  Min Budget (₹)
                </label>
                <input
                  type="number"
                  value={filters.minBudget}
                  onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value }))}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm text-[#111] placeholder:text-[#666] bg-white"
                  style={{ color: '#111' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111] mb-1">
                  Max Budget (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxBudget}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: e.target.value }))}
                  placeholder="100000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm text-[#111] placeholder:text-[#666] bg-white"
                  style={{ color: '#111' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111] mb-1">
                  Min Duration (hrs)
                </label>
                <input
                  type="number"
                  value={filters.minDuration}
                  onChange={(e) => setFilters(prev => ({ ...prev, minDuration: e.target.value }))}
                  placeholder="10"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm text-[#111] placeholder:text-[#666] bg-white"
                  style={{ color: '#111' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111] mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm text-[#111] bg-white"
                  style={{ color: '#111' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="budget_high">Budget: High to Low</option>
                  <option value="budget_low">Budget: Low to High</option>
                  <option value="deadline">Deadline: Earliest</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition text-[#111] font-medium"
                style={{ color: '#111' }}
              >
                Clear Filters
              </button>
              <div className="text-sm text-[#333] flex items-center font-medium" style={{ color: '#333' }}>
                Showing {projects.length} projects
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Projects List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Jobs */}
            {user && <RecommendedJobs workerId={user.id} />}

            {/* All Projects */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-[#111] mb-6 flex items-center gap-2" style={{ color: '#111' }}>
                <TrendingUp className="w-6 h-6 text-sky-600" />
                All Available Projects
              </h3>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-[#333] font-medium mb-2" style={{ color: '#333' }}>No projects match your filters</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition-all font-semibold shadow-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-sky-300 transition-all group bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 
                              className="text-lg font-bold text-[#111] group-hover:text-sky-600 cursor-pointer transition-colors"
                              style={{ color: '#111' }}
                              onClick={() => router.push(`/projects/${project.id}`)}
                            >
                              {project.title || 'Untitled Project'}
                            </h4>
                            {(project as any).escrow_enabled && (
                              <PaymentVerifiedBadge size="sm" />
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-emerald-600" style={{ color: '#059669' }}>
                            ₹{project.budget?.toLocaleString() || '0'}
                          </div>
                          <div className="text-xs text-[#333] flex items-center justify-end gap-1 font-medium" style={{ color: '#333' }}>
                            {(project as any).escrow_enabled && (
                              <Lock className="w-3 h-3 text-emerald-500" />
                            )}
                            Budget
                          </div>
                          {user && (
                            <div className="mt-2">
                              <PriceBreakdown
                                price={project.budget}
                                jobId={project.id}
                                workerId={user.id}
                                clientId={project.client_id}
                                compact
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <p 
                        className="text-[#333] mb-4 line-clamp-2 leading-relaxed font-normal" 
                        style={{ color: '#333' }}
                      >
                        {project.description || 'No description available'}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#333] font-medium" style={{ color: '#333' }}>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#333]" style={{ color: '#333' }} />
                            {project.duration_hours || 0}h
                          </span>
                          {project.deadline && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-[#333]" style={{ color: '#333' }} />
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {(project.required_skills || []).slice(0, 3).map((skill: string) => (
                              <span 
                                key={skill} 
                                className="px-2.5 py-1 bg-slate-100 text-[#111] rounded-md text-xs font-medium"
                                style={{ color: '#111' }}
                              >
                                {skill}
                              </span>
                            ))}
                            {(project.required_skills || []).length > 3 && (
                              <span 
                                className="px-2.5 py-1 bg-slate-100 text-[#111] rounded-md text-xs font-medium"
                                style={{ color: '#111' }}
                              >
                                +{(project.required_skills || []).length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleSaveProject(project.id)}
                            className={`p-2 rounded-lg transition ${
                              savedProjects.has(project.id)
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-slate-100 text-[#333] hover:bg-slate-200'
                            }`}
                            style={{ 
                              color: savedProjects.has(project.id) ? '#d97706' : '#333' 
                            }}
                          >
                            <Bookmark className={`w-4 h-4 ${savedProjects.has(project.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => router.push(`/projects/${project.id}`)}
                            className="inline-flex items-center gap-2 bg-white text-[#111] border-2 border-[#111] px-4 py-2 rounded-lg hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 ease-out transform hover:scale-105 active:scale-100 text-sm font-semibold"
                            style={{ color: '#111' }}
                          >
                            Place Bid
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Job Alerts */}
          <div className="lg:col-span-1">
            {user && (
              <JobAlertsManager 
                userId={user.id} 
                onCreateAlert={() => setShowAlertModal(true)} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Job Alert Modal */}
      {user && (
        <JobAlertModal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          onSave={() => {
            setShowAlertModal(false)
          }}
          userId={user.id}
        />
      )}
    </div>
  )
}
