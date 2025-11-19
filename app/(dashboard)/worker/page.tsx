'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Briefcase, Clock, DollarSign, User, LogOut, Search } from 'lucide-react'
import type { User as UserType, Project } from '@/types/database.types'

export default function WorkerDashboard() {
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
      if (profile.user_type !== 'worker') {
        router.push(`/${profile.user_type}`)
        return
      }
      setUser(profile)
    }
    setIsLoading(false)
  }

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) setProjects(data)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  useEffect(() => {
    checkAuth()
    fetchProjects()
  }, [])

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
              <span className="ml-4 text-sm text-gray-500">Worker Dashboard</span>
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
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name}!</h2>
          <p className="text-indigo-100">Ready to find your next project?</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Briefcase className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hours This Month</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Clock className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">₹0</p>
              </div>
              <DollarSign className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Available Projects */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Available Projects</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects available at the moment</p>
              <p className="text-sm text-gray-400">Check back later for new opportunities</p>
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
                    <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
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
