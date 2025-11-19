'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Search, Filter, Briefcase, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { Project } from '@/types/database.types'

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (data) setProjects(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSkills = selectedSkills.length === 0 ||
                         selectedSkills.some(skill => project.required_skills.includes(skill))
    
    return matchesSearch && matchesSkills
  })

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
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
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
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                hover
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{project.budget.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.duration_hours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.required_skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            ))
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
