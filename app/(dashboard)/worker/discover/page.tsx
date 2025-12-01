'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { 
  Search, Filter, Bookmark, Clock, DollarSign, Calendar,
  TrendingUp, Zap, Star, ArrowLeft, Bell, Shield, Lock
} from 'lucide-react'
import type { User as UserType, Project } from '@/types/database.types'
import RecommendedJobs from '@/components/worker/RecommendedJobs'
import JobAlertsManager from '@/components/worker/JobAlertsManager'
import JobAlertModal from '@/components/worker/JobAlertModal'
import { PaymentVerifiedBadge } from '@/components/badges/PaymentBadges'

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
    }
    setIsLoading(false)
  }

  const fetchProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('status', 'open')

      // Apply filters
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

      // Apply sorting
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

      // Apply search filter
      let filteredData = data || []
      if (searchQuery) {
        filteredData = filteredData.filter(project => 
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.required_skills.some((skill: string) => 
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      }

      setProjects(filteredData)

      // Track search if query exists
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/worker')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Zap className="w-8 h-8 text-indigo-600" />
                  Job Discovery
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Find your perfect project with AI-powered recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 justify-center"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 pt-4 border-t dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Budget (₹)
                </label>
                <input
                  type="number"
                  value={filters.minBudget}
                  onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value }))}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Budget (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxBudget}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: e.target.value }))}
                  placeholder="100000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Duration (hrs)
                </label>
                <input
                  type="number"
                  value={filters.minDuration}
                  onChange={(e) => setFilters(prev => ({ ...prev, minDuration: e.target.value }))}
                  placeholder="10"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="budget_high">Budget: High to Low</option>
                  <option value="budget_low">Budget: Low to High</option>
                  <option value="deadline">Deadline: Earliest</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition text-gray-700 dark:text-gray-300"
              >
                Clear Filters
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
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
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                All Available Projects
              </h3>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No projects match your filters</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 dark:border-slate-600 rounded-lg p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 
                              className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer"
                              onClick={() => router.push(`/projects/${project.id}`)}
                            >
                              {project.title}
                            </h4>
                            {(project as any).escrow_enabled && (
                              <PaymentVerifiedBadge size="sm" />
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">
                            ₹{project.budget.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                            {(project as any).escrow_enabled && (
                              <Lock className="w-3 h-3 text-emerald-500" />
                            )}
                            Budget
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {project.duration_hours}h
                          </span>
                          {project.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          )}
                          <div className="flex flex-wrap gap-1">
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

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleSaveProject(project.id)}
                            className={`p-2 rounded-lg transition ${
                              savedProjects.has(project.id)
                                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${savedProjects.has(project.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => router.push(`/projects/${project.id}`)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                          >
                            View Details
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
            // Refresh will happen automatically through JobAlertsManager
          }}
          userId={user.id}
        />
      )}
    </div>
  )
}
