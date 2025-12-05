'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from '@/components/ui/Topbar'
import { ActivityFeed } from '@/components/ui/ActivityFeed'
import apiClient from '@/lib/apiClient'
import { Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface ActivityItem {
  id: string
  timestamp: Date
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description: string
}

export default function WorkerActivityPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userResult = await apiClient.getCurrentUser()
        if (userResult.error || !userResult.data?.user) {
          router.push('/login')
          return
        }

        const currentUser = userResult.data.user
        if (currentUser.role !== 'worker') {
          router.push(currentUser.role === 'client' ? '/client' : '/login')
          return
        }

        setUser(currentUser)

        // Fetch activities (you can replace this with actual API call)
        // For now, using mock data
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            timestamp: new Date(),
            type: 'success',
            title: 'Application submitted',
            description: 'You applied for "React Developer" position',
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 3600000),
            type: 'info',
            title: 'Profile updated',
            description: 'Your profile information was updated',
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 7200000),
            type: 'success',
            title: 'Bid accepted',
            description: 'Your bid for "Full Stack Developer" was accepted',
          },
        ]
        setActivities(mockActivities)
      } catch (err) {
        console.error('Error loading activity:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleSignOut = async () => {
    await apiClient.logout()
    localStorage.removeItem('access_token')
    router.push('/')
  }

  const handleQuickAction = () => {
    router.push('/worker/discover')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span className="text-slate-600">Loading activity...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role="worker" />
      
      <div className="flex-1 lg:ml-64">
        <Topbar
          role="worker"
          onQuickAction={handleQuickAction}
          quickActionLabel="Find Work"
          onSignOut={handleSignOut}
          user={{
            name: user?.name,
            email: user?.email,
          }}
        />

        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Activity</h1>
            <p className="text-slate-600">View your recent activity and updates</p>
          </div>

          <div className="max-w-4xl">
            <ActivityFeed activities={activities} maxItems={50} />
          </div>
        </div>
      </div>
    </div>
  )
}
