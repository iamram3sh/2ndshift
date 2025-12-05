'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Sparkles, TrendingUp, Clock, IndianRupee, Calendar, Bookmark, ExternalLink } from 'lucide-react'
import type { Project } from '@/types/database.types'

interface RecommendedProject {
  project_id: string
  title: string
  description: string
  budget: number
  required_skills: string[]
  duration_hours: number
  deadline: string | null
  match_score: number
  match_reasons: string[]
}

interface RecommendedJobsProps {
  workerId: string
}

export default function RecommendedJobs({ workerId }: RecommendedJobsProps) {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<RecommendedProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savedProjects, setSavedProjects] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRecommendations()
    fetchSavedProjects()
  }, [workerId])

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_recommended_projects', {
          worker_uuid: workerId,
          limit_count: 10
        })

      if (error) throw error
      setRecommendations(data || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSavedProjects = async () => {
    try {
      const { data } = await supabase
        .from('saved_projects')
        .select('project_id')
        .eq('user_id', workerId)

      if (data) {
        setSavedProjects(new Set(data.map(sp => sp.project_id)))
      }
    } catch (error) {
      console.error('Error fetching saved projects:', error)
    }
  }

  const toggleSaveProject = async (projectId: string) => {
    const isSaved = savedProjects.has(projectId)
    
    try {
      if (isSaved) {
        await supabase
          .from('saved_projects')
          .delete()
          .eq('user_id', workerId)
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
            user_id: workerId,
            project_id: projectId
          })
        
        setSavedProjects(prev => new Set(prev).add(projectId))
      }
    } catch (error) {
      console.error('Error toggling saved project:', error)
    }
  }

  const trackProjectView = async (projectId: string) => {
    try {
      await supabase
        .from('project_views')
        .insert({
          project_id: projectId,
          user_id: workerId
        })
    } catch (error) {
      console.error('Error tracking project view:', error)
    }
  }

  const handleProjectClick = (projectId: string) => {
    trackProjectView(projectId)
    router.push(`/projects/${projectId}`)
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold !text-[#111] dark:!text-white">Recommended for You</h3>
        </div>
        <div className="text-center py-8 !text-[#333] dark:!text-gray-400">
          <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Complete your profile to get personalized job recommendations</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold !text-[#111] dark:!text-white">Recommended for You</h3>
            <p className="text-sm !text-[#333] dark:!text-gray-400">Based on your skills and preferences</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">{recommendations.length} matches</span>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((project) => (
          <div
            key={project.project_id}
            className="border border-gray-200 dark:border-slate-600 rounded-lg p-5 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 
                    className="text-lg font-semibold !text-[#111] dark:!text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 cursor-pointer"
                    style={{ color: '#111' }}
                    onClick={() => handleProjectClick(project.project_id)}
                  >
                    {project.title || 'Untitled Project'}
                  </h4>
                  <span className="px-3 py-1 text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {project.match_score}% Match
                  </span>
                </div>
                {project.match_reasons && project.match_reasons.filter(Boolean).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.match_reasons.filter(Boolean).map((reason, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  ₹{project.budget.toLocaleString()}
                </div>
                <div className="text-xs !text-[#333] dark:!text-gray-400">Budget</div>
              </div>
            </div>

            <p className="!text-[#333] dark:!text-gray-300 mb-4 line-clamp-2 leading-relaxed !font-normal" style={{ color: '#333' }}>
              {project.description || 'No description available'}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm !text-[#333] dark:!text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 !text-[#333] dark:!text-gray-400" />
                  {project.duration_hours}h
                </span>
                {project.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 !text-[#333] dark:!text-gray-400" />
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                )}
                <div className="flex flex-wrap gap-1">
                  {project.required_skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 !text-[#111] dark:!text-gray-300 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {project.required_skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 !text-[#111] dark:!text-gray-300 rounded text-xs font-medium">
                      +{project.required_skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleSaveProject(project.project_id)}
                  className={`p-2 rounded-lg transition ${
                    savedProjects.has(project.project_id)
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${savedProjects.has(project.project_id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleProjectClick(project.project_id)}
                  className="inline-flex items-center gap-2 !bg-white !text-[#111] border-2 border-[#111] px-4 py-2 rounded-lg hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 ease-out transform hover:scale-105 active:scale-100 text-sm font-semibold"
                >
                  Place Bid
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
