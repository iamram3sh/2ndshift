'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { CheckCircle, AlertCircle, Circle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileTask {
  id: string
  title: string
  description: string
  completed: boolean
  points: number
  action: string
  link: string
}

interface ProfileCompletionProps {
  userId: string
  userType: 'worker' | 'client'
}

export default function ProfileCompletionWidget({ userId, userType }: ProfileCompletionProps) {
  const router = useRouter()
  const [completion, setCompletion] = useState(0)
  const [tasks, setTasks] = useState<ProfileTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileCompletion()
  }, [userId])

  const fetchProfileCompletion = async () => {
    try {
      // Get user data
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!user) return

      setCompletion(user.profile_completion_percentage || 0)

      // Get profile data based on user type
      if (userType === 'worker') {
        const { data: profile } = await supabase
          .from('worker_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        const { data: certs } = await supabase
          .from('certifications')
          .select('*')
          .eq('user_id', userId)
          .eq('is_verified', true)

        setTasks(generateWorkerTasks(user, profile, certs || []))
      } else {
        const { data: profile } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        setTasks(generateClientTasks(user, profile))
      }
    } catch (error) {
      console.error('Error fetching profile completion:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateWorkerTasks = (user: any, profile: any, certs: any[]): ProfileTask[] => {
    return [
      {
        id: 'photo',
        title: 'Add Profile Photo',
        description: 'Upload a professional photo',
        completed: !!user.profile_photo_url,
        points: 5,
        action: 'Upload Photo',
        link: '/worker/profile/edit'
      },
      {
        id: 'phone',
        title: 'Verify Phone Number',
        description: 'Verify your phone for better trust',
        completed: !!user.phone_verified,
        points: 4,
        action: 'Verify Now',
        link: '/worker/profile/verify-phone'
      },
      {
        id: 'skills',
        title: 'Add Skills',
        description: 'Add at least 3 professional skills',
        completed: profile?.skills?.length >= 3,
        points: 7,
        action: 'Add Skills',
        link: '/worker/profile/edit#skills'
      },
      {
        id: 'bio',
        title: 'Write Bio',
        description: 'Write a compelling bio (100+ words)',
        completed: profile?.bio?.length >= 100,
        points: 10,
        action: 'Write Bio',
        link: '/worker/profile/edit#bio'
      },
      {
        id: 'rate',
        title: 'Set Hourly Rate',
        description: 'Define your hourly rate',
        completed: profile?.hourly_rate > 0,
        points: 3,
        action: 'Set Rate',
        link: '/worker/profile/edit#rate'
      },
      {
        id: 'id_verification',
        title: 'Verify Identity',
        description: 'Upload government ID for verification',
        completed: user.verification_status === 'verified',
        points: 10,
        action: 'Upload ID',
        link: '/worker/profile/verification'
      },
      {
        id: 'address',
        title: 'Add Address',
        description: 'Add your complete address',
        completed: !!user.address,
        points: 2,
        action: 'Add Address',
        link: '/worker/profile/edit#address'
      },
      {
        id: 'certificates',
        title: 'Add Certifications',
        description: 'Upload professional certifications',
        completed: certs.length > 0,
        points: 10,
        action: 'Add Certificates',
        link: '/worker/profile/certifications'
      },
      {
        id: 'portfolio',
        title: 'Add Portfolio',
        description: 'Showcase your work samples',
        completed: !!profile?.portfolio_url || !!profile?.website_url,
        points: 5,
        action: 'Add Portfolio',
        link: '/worker/profile/edit#portfolio'
      }
    ]
  }

  const generateClientTasks = (user: any, profile: any): ProfileTask[] => {
    return [
      {
        id: 'company_name',
        title: 'Add Company Name',
        description: 'Enter your company name',
        completed: !!profile?.company_name,
        points: 5,
        action: 'Add Name',
        link: '/client/profile/edit'
      },
      {
        id: 'logo',
        title: 'Upload Company Logo',
        description: 'Add your company logo',
        completed: !!profile?.company_logo_url,
        points: 5,
        action: 'Upload Logo',
        link: '/client/profile/edit#logo'
      },
      {
        id: 'phone',
        title: 'Verify Phone Number',
        description: 'Verify your phone for better trust',
        completed: !!user.phone_verified,
        points: 7,
        action: 'Verify Now',
        link: '/client/profile/verify-phone'
      },
      {
        id: 'description',
        title: 'Add Company Description',
        description: 'Tell us about your company (50+ words)',
        completed: profile?.company_description?.length >= 50,
        points: 7,
        action: 'Add Description',
        link: '/client/profile/edit#description'
      },
      {
        id: 'gst',
        title: 'Add GST Number',
        description: 'Add GST for business verification',
        completed: !!profile?.gst_number,
        points: 10,
        action: 'Add GST',
        link: '/client/profile/verification'
      },
      {
        id: 'registration',
        title: 'Add Company Registration',
        description: 'Upload company registration certificate',
        completed: !!profile?.company_registration_number,
        points: 10,
        action: 'Upload Certificate',
        link: '/client/profile/verification'
      },
      {
        id: 'address',
        title: 'Add Business Address',
        description: 'Add your business address',
        completed: !!profile?.business_address,
        points: 6,
        action: 'Add Address',
        link: '/client/profile/edit#address'
      },
      {
        id: 'website',
        title: 'Add Website',
        description: 'Add your company website',
        completed: !!profile?.website_url,
        points: 5,
        action: 'Add Website',
        link: '/client/profile/edit#website'
      }
    ]
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
      </div>
    )
  }

  const getCompletionColor = () => {
    if (completion >= 80) return 'text-green-600 dark:text-green-400'
    if (completion >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getProgressBarColor = () => {
    if (completion >= 80) return 'bg-green-600'
    if (completion >= 50) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">Complete Your Profile</h3>
        <p className="text-indigo-100 text-sm">
          {completion === 100 
            ? '🎉 Your profile is complete!' 
            : `${completedTasks} of ${totalTasks} tasks completed`
          }
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold text-3xl">{completion}%</span>
            <span className="text-indigo-100 text-sm">
              {100 - completion}% to complete
            </span>
          </div>
          <div className="w-full bg-indigo-400/30 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500 shadow-lg"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6">
        {completion < 100 ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Complete these tasks to improve your profile visibility and trust score:
            </p>
            <div className="space-y-3">
              {tasks
                .filter(task => !task.completed)
                .slice(0, 5)
                .map(task => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition group cursor-pointer"
                    onClick={() => router.push(task.link)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Circle className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {task.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          +{task.points}%
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {tasks.filter(t => !t.completed).length > 5 && (
              <button
                onClick={() => router.push(`/${userType}/profile/edit`)}
                className="mt-4 w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                View all {tasks.filter(t => !t.completed).length - 5} more tasks
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Complete! 🎉
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your profile is 100% complete and looks great!
            </p>
            <button
              onClick={() => router.push(`/${userType}/profile`)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              View Profile
            </button>
          </div>
        )}
      </div>

      {/* Benefits */}
      {completion < 100 && (
        <div className="bg-gray-50 dark:bg-slate-900 p-4 border-t dark:border-slate-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
            Why complete your profile?
          </p>
          <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-500">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Get 3x more {userType === 'worker' ? 'job opportunities' : 'quality applicants'}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Build trust with verification badges
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Improve search ranking and visibility
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
