'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Briefcase, DollarSign, User, LogOut, Plus, Clock } from 'lucide-react'
import type { User as UserType, Project } from '@/types/database.types'

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      fetchProjects(authUser.id)
    }
    setIsLoading(false)
  }

  const fetchProjects = async (userId: string) => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })

    if (data) setProjects(data)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">2ndShift</h1>
              <span className="ml-4 text-sm text-gray-500">Client Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
              >
                <User className="w-5 h-5" />
                <span>{user?.full_name}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name}!</h2>
          <p className="text-green-100">Manage your projects and find talent</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <Briefcase className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'in_progress' || p.status === 'assigned').length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Your Projects</h3>
            <button
              onClick={() => router.push('/projects/create')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Post New Project</span>
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">You haven&apos;t posted any projects yet</p>
              <button
                onClick={() => router.push('/projects/create')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Post Your First Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">₹{project.budget.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.duration_hours}h
                    </span>
                    <span>•</span>
                    <span>{project.required_skills.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
