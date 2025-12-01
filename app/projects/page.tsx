'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import {
  Search,
  Filter,
  Briefcase,
  Clock,
  Users,
  Flame,
  ShieldCheck,
  BookmarkPlus,
  Bookmark
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { Project, Application, SavedSearch, User } from '@/types/database.types'

type DurationFilter = 'any' | 'short' | 'medium' | 'long'

interface ProjectInsight {
  bidCount: number
  avgBid?: number
  avgHourly?: number
  milestoneDensity?: number
  earliestAvailability?: string
  pitchStrength?: number
}

type BidSample = Pick<Application,
  | 'project_id'
  | 'bid_type'
  | 'bid_amount'
  | 'hourly_rate'
  | 'estimated_hours'
  | 'milestone_plan'
  | 'availability_date'
  | 'pitch_strength'
>

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 200000])
  const [minBidCount, setMinBidCount] = useState(0)
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('any')
  const [requireQuickStart, setRequireQuickStart] = useState(false)
  const [projectInsights, setProjectInsights] = useState<Record<string, ProjectInsight>>({})
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (data) {
      setProjects(data)
      await hydrateInsights(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProjects()
    loadCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadSavedSearches()
    }
  }, [currentUser])

  const hydrateInsights = async (projectList: Project[]) => {
    if (!projectList.length) {
      setProjectInsights({})
      return
    }

    const projectIds = projectList.map((p) => p.id)
    const { data: applicationRows } = await supabase
      .from('applications')
      .select('project_id, bid_type, bid_amount, hourly_rate, estimated_hours, milestone_plan, availability_date, pitch_strength')
      .in('project_id', projectIds)

    const applications = applicationRows as BidSample[] | null

    if (!applications) {
      setProjectInsights({})
      return
    }

    const insights: Record<string, ProjectInsight> = {}

    applications.forEach((app) => {
      if (!insights[app.project_id]) {
        insights[app.project_id] = {
          bidCount: 0,
          avgBid: 0,
          avgHourly: 0,
          milestoneDensity: 0,
          earliestAvailability: undefined,
          pitchStrength: 0
        }
      }
      const entry = insights[app.project_id]
      entry.bidCount += 1

      if (app.bid_type === 'fixed' && app.bid_amount) {
        entry.avgBid = (entry.avgBid || 0) + app.bid_amount
      }
      if (app.hourly_rate) {
        entry.avgHourly = (entry.avgHourly || 0) + app.hourly_rate
      }
      if (Array.isArray(app.milestone_plan)) {
        entry.milestoneDensity = (entry.milestoneDensity || 0) + app.milestone_plan.length
      }
      if (app.pitch_strength) {
        entry.pitchStrength = (entry.pitchStrength || 0) + app.pitch_strength
      }
      if (app.availability_date) {
        const currentEarliest = entry.earliestAvailability
        if (!currentEarliest || new Date(app.availability_date) < new Date(currentEarliest)) {
          entry.earliestAvailability = app.availability_date
        }
      }
    })

    Object.keys(insights).forEach((key) => {
      const entry = insights[key]
      const total = entry.bidCount || 1
      entry.avgBid = entry.avgBid ? Number((entry.avgBid / total).toFixed(2)) : undefined
      entry.avgHourly = entry.avgHourly ? Number((entry.avgHourly / total).toFixed(2)) : undefined
      entry.milestoneDensity = entry.milestoneDensity ? Number((entry.milestoneDensity / total).toFixed(1)) : undefined
      entry.pitchStrength = entry.pitchStrength ? Number((entry.pitchStrength / total).toFixed(1)) : undefined
    })

    setProjectInsights(insights)
  }

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profile) {
        setCurrentUser(profile as User)
      }
    }
  }

  const loadSavedSearches = async () => {
    if (!currentUser) return
    const { data } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })

    if (data) {
      setSavedSearches(data as SavedSearch[])
    }
  }

  const handleSaveSearch = async () => {
    if (!currentUser) {
      alert('Sign in to save searches.')
      return
    }
    const name = prompt('Name this search')
    if (!name) return
    const query = {
      searchTerm,
      selectedSkills,
      budgetRange,
      minBidCount,
      durationFilter,
      requireQuickStart
    }
    const { error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: currentUser.id,
        name,
        query
      })
    if (error) {
      alert('Failed to save search')
      return
    }
    loadSavedSearches()
  }

  const applySavedSearch = (search: SavedSearch) => {
    const query = search.query as any
    setSearchTerm(query.searchTerm || '')
    setSelectedSkills(query.selectedSkills || [])
    setBudgetRange(query.budgetRange || [0, 200000])
    setMinBidCount(query.minBidCount || 0)
    setDurationFilter(query.durationFilter || 'any')
    setRequireQuickStart(Boolean(query.requireQuickStart))
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) =>
          project.required_skills.some((projectSkill) =>
            projectSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )

      const matchesBudget =
        project.budget >= budgetRange[0] && project.budget <= budgetRange[1]

      const insight = projectInsights[project.id]
      const matchesBidCount = !minBidCount || (insight?.bidCount || 0) >= minBidCount

      const matchesDuration =
        durationFilter === 'any' ||
        (durationFilter === 'short' && project.duration_hours <= 40) ||
        (durationFilter === 'medium' && project.duration_hours > 40 && project.duration_hours <= 120) ||
        (durationFilter === 'long' && project.duration_hours > 120)

      const matchesQuickStart =
        !requireQuickStart ||
        (insight?.earliestAvailability &&
          new Date(insight.earliestAvailability).getTime() - Date.now() <= 7 * 24 * 60 * 60 * 1000)

      return matchesSearch && matchesSkills && matchesBudget && matchesBidCount && matchesDuration && matchesQuickStart
    })
  }, [projects, searchTerm, selectedSkills, budgetRange, minBidCount, durationFilter, requireQuickStart, projectInsights])

  const allSkills = Array.from(new Set(projects.flatMap(p => p.required_skills)))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Projects</h1>
          <p className="text-gray-600 mt-2">Find your next opportunity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={handleSaveSearch}
              >
                <BookmarkPlus className="w-5 h-5" />
                <span>Save search</span>
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" />
                Advanced filters below
              </div>
            </div>
          </div>

          {/* Skills Filter */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {allSkills.slice(0, 10).map(skill => (
                <button
                  key={skill}
                  onClick={() => {
                    setSelectedSkills(prev =>
                      prev.includes(skill)
                        ? prev.filter(s => s !== skill)
                        : [...prev, skill]
                    )
                  }}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    selectedSkills.includes(skill)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Budget range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={budgetRange[0]}
                  onChange={(e) => setBudgetRange([Number(e.target.value), budgetRange[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min={0}
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  value={budgetRange[1]}
                  onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value)])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min={budgetRange[0]}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Minimum bids</label>
              <input
                type="range"
                min={0}
                max={25}
                value={minBidCount}
                onChange={(e) => setMinBidCount(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">{minBidCount}+ bids</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Duration</label>
              <div className="flex gap-2">
                {['any', 'short', 'medium', 'long'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setDurationFilter(option as DurationFilter)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                      durationFilter === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {option === 'short' && '< 40h'}
                    {option === 'medium' && '40-120h'}
                    {option === 'long' && '> 120h'}
                    {option === 'any' && 'Any'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={requireQuickStart}
                onChange={(e) => setRequireQuickStart(e.target.checked)}
                className="rounded"
              />
              Ready to start within 7 days
            </label>
            {savedSearches.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {savedSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => applySavedSearch(search)}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <Bookmark className="inline-block w-3 h-3 mr-1" />
                    {search.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <Card className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </Card>
          ) : (
            filteredProjects.map((project) => {
              const insight = projectInsights[project.id]
              const crowdScore = insight ? Math.min((insight.bidCount / 10) * 100, 100) : 0
              return (
                <Card
                  key={project.id}
                  hover
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                          {project.status === 'open' ? 'LIVE BRIEF' : project.status}
                        </span>
                        {crowdScore > 70 && (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                            <Flame className="w-3 h-3" />
                            High demand
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {project.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-green-600">
                        ₹{project.budget.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500">Budget</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Active bids</p>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        {insight?.bidCount || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Avg bid</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {insight?.avgBid ? `₹${insight.avgBid.toLocaleString()}` : '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {project.duration_hours}h
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Earliest start</p>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        {insight?.earliestAvailability
                          ? new Date(insight.earliestAvailability).toLocaleDateString()
                          : 'Flexible'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Crowd meter</span>
                      <span>{crowdScore.toFixed(0)}% of target pipeline</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
                        style={{ width: `${crowdScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Pagination placeholder */}
        {filteredProjects.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
            Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
