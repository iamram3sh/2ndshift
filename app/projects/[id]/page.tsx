'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { ArrowLeft, Clock, Calendar, User, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { JobApplyModal } from '@/components/jobs/JobApplyModal'
import { PriceBreakdown } from '@/components/jobs/PriceBreakdown'
import type { Project, User as UserType } from '@/types/database.types'

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [client, setClient] = useState<UserType | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)

  const checkCurrentUser = async () => {
    try {
      const result = await apiClient.getCurrentUser()
      if (result.data?.user) {
        setCurrentUser({
          id: result.data.user.id,
          email: result.data.user.email,
          full_name: result.data.user.name || '',
          user_type: result.data.user.role as 'worker' | 'client' | 'admin',
        } as UserType)
      }
    } catch (err) {
      console.error('Error fetching current user:', err)
    }
  }

  const fetchProject = async () => {
    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (projectData) {
      setProject(projectData)
      
      // Fetch client info
      const { data: clientData } = await supabase
        .from('users')
        .select('*')
        .eq('id', projectData.client_id)
        .single()
      
      if (clientData) setClient(clientData)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchProject()
    checkCurrentUser()
  }, [params.id])

  const handleApply = () => {
    if (!currentUser) {
      router.push('/login')
      return
    }

    if (currentUser.user_type !== 'worker') {
      window.alert('Only workers can apply to projects')
      return
    }

    if (!project) {
      window.alert('Project not found')
      return
    }

    setShowApplyModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Project not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      ₹{project.budget.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Budget</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{project.description}</p>
                
                {/* Price Breakdown */}
                <PriceBreakdown
                  price={project.budget}
                  jobId={params.id as string}
                  workerId={currentUser?.user_type === 'worker' ? currentUser.id : undefined}
                  clientId={project.client_id}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.required_skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-semibold">{project.duration_hours} hours</div>
                  </div>
                </div>
                
                {project.deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Deadline</div>
                      <div className="font-semibold">
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Posted</div>
                    <div className="font-semibold">
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {client && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{client.full_name}</div>
                      <div className="text-sm text-gray-500">Client</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentUser?.user_type === 'worker' && project.status === 'open' && (
              <Button
                onClick={handleApply}
                isLoading={applying}
                className="w-full"
                size="lg"
              >
                Apply for this Project
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Job Apply Modal */}
      {currentUser && project && (
        <JobApplyModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          jobId={params.id as string}
          jobPrice={project.budget}
          jobTitle={project.title}
          workerId={currentUser.id}
          clientId={project.client_id}
          onApplySuccess={() => {
            router.push('/worker')
          }}
        />
      )}
    </div>
  )
}
