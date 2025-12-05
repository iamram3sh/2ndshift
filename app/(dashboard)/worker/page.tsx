'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { BidModal } from '@/components/tasks/BidModal'
import { ShiftsModal } from '@/components/shifts/ShiftsModal'
import { BuyCreditsModalV1 } from '@/components/revenue/BuyCreditsModalV1'
import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from '@/components/ui/Topbar'
import { StatsBar } from '@/components/ui/StatsBar'
import { ActivityFeed } from '@/components/ui/ActivityFeed'
import apiClient from '@/lib/apiClient'
import { 
  Layers, LogOut, Zap, Loader2, AlertCircle, Briefcase,
  Shield, IndianRupee, Search, Sparkles, TrendingUp, Users, DollarSign
} from 'lucide-react'
import type { Job, JobFilters } from '@/types/jobs'
import { Skeleton } from '@/components/ui/Skeleton'

export default function WorkerDashboard() {
  const router = useRouter()
  const [selectedTask, setSelectedTask] = useState<Job | null>(null)
  const [showBidModal, setShowBidModal] = useState(false)
  const [showShiftsModal, setShowShiftsModal] = useState(false)
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false)
  
  // State management
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState<Job[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [tasksError, setTasksError] = useState<Error | null>(null)
  const [creditsBalance, setCreditsBalance] = useState(0)
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  
  const [filters, setFilters] = useState<JobFilters>({
    status: 'open',
    role: 'worker',
    minPrice: 50
  })

  // Fetch current user and credits
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        
        // Get current user
        const userResult = await apiClient.getCurrentUser()
        if (userResult.error || !userResult.data?.user) {
          router.push('/login')
          return
        }

        const user = userResult.data.user
        if (user.role !== 'worker') {
          router.push(user.role === 'client' ? '/client' : '/login')
          return
        }

        setCurrentUser(user)

        // Get credits balance
        const creditsResult = await apiClient.getCreditsBalance()
        if (creditsResult.data) {
          setCreditsBalance(creditsResult.data.balance || 0)
        }

        // Fetch dashboard metrics
        try {
          const metricsResponse = await fetch('/api/dashboard/metrics?role=worker', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          })
          if (metricsResponse.ok) {
            const metrics = await metricsResponse.json()
            setDashboardMetrics(metrics)
          }
        } catch (err) {
          console.error('Error fetching metrics:', err)
        }
      } catch (err) {
        console.error('Error loading user data:', err)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  // Fetch tasks when user is loaded and filters change
  useEffect(() => {
    if (!currentUser) return

    const fetchTasks = async () => {
      try {
        setTasksLoading(true)
        setTasksError(null)

        const params: any = {
          role: 'worker',
          status: 'open',
          ...filters,
        }
        
        const result = await apiClient.listJobs(params)

        if (result.error) {
          const errorMsg = result.error.message || result.error.error || 'Failed to fetch tasks'
          setTasksError(new Error(errorMsg))
          setTasks([])
          return
        }

        if (!result.data || !result.data.jobs) {
          setTasks([])
          return
        }

        let jobs = result.data.jobs || []

        // Apply client-side filtering for minPrice (fallback)
        if (filters.minPrice && filters.minPrice >= 50) {
          jobs = jobs.filter((job: Job) => {
            const price = job.price_fixed || (job as any).budget || 0
            const priceNum = typeof price === 'string' ? parseFloat(price) : price
            return priceNum >= filters.minPrice!
          })
        }

        // Apply search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          jobs = jobs.filter((job: Job) => 
            job.title.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower)
          )
        }

        setTasks(jobs)
      } catch (err: any) {
        setTasksError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
        setTasks([])
      } finally {
        setTasksLoading(false)
      }
    }

    fetchTasks()
  }, [currentUser, filters])

  const handleBidClick = (task: Job) => {
    if (creditsBalance < 3) {
      setShowBuyCreditsModal(true)
      return
    }
    setSelectedTask(task)
    setShowBidModal(true)
  }

  const handleBidSuccess = () => {
    // Refetch tasks
    if (currentUser) {
      const fetchTasks = async () => {
        try {
          const result = await apiClient.listJobs({
            role: 'worker',
            status: 'open',
            ...filters,
          })
          if (result.data?.jobs) {
            setTasks(result.data.jobs)
          }
        } catch (err) {
          console.error('Error refetching tasks:', err)
        }
      }
      fetchTasks()
    }
    setShowBidModal(false)
    setSelectedTask(null)
  }

  const handleSignOut = async () => {
    await apiClient.logout()
    localStorage.removeItem('access_token')
    router.push('/')
  }

  const handleRetry = () => {
    setTasksError(null)
    if (currentUser) {
      const fetchTasks = async () => {
        try {
          setTasksLoading(true)
          const result = await apiClient.listJobs({
            role: 'worker',
            status: 'open',
            ...filters,
          })
          if (result.data?.jobs) {
            setTasks(result.data.jobs)
          } else if (result.error) {
            setTasksError(new Error(result.error.message || 'Failed to fetch tasks'))
          }
        } catch (err: any) {
          setTasksError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
        } finally {
          setTasksLoading(false)
        }
      }
      fetchTasks()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#1E40AF]" />
          <span className="text-slate-600 dark:text-slate-300">Loading...</span>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const handleQuickAction = () => {
    router.push('/worker/discover')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar role="worker" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Topbar */}
        <Topbar
          role="worker"
          onQuickAction={handleQuickAction}
          quickActionLabel="Find Work"
          onSignOut={handleSignOut}
          user={{
            name: currentUser?.name || currentUser?.full_name,
            email: currentUser?.email,
          }}
          onSearch={(query) => {
            setFilters(prev => ({ ...prev, search: query }))
          }}
        />

        <div className="p-6 lg:p-8">
          {/* Stats Bar */}
          <div className="mb-6">
            <StatsBar
              stats={[
                {
                  title: 'New Applications',
                  value: dashboardMetrics?.newCustomers || 0,
                  sparkline: dashboardMetrics?.sparklineData,
                  icon: <TrendingUp className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Success Rate',
                  value: `${dashboardMetrics?.successRate || 0}%`,
                  gauge: {
                    value: dashboardMetrics?.successRate || 0,
                    max: 100,
                  },
                  icon: <Briefcase className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Tasks in Progress',
                  value: dashboardMetrics?.tasksInProgress || tasks.length,
                  icon: <Zap className="w-5 h-5 text-slate-600" />,
                },
                {
                  title: 'Shifts Balance',
                  value: creditsBalance,
                  icon: <Sparkles className="w-5 h-5 text-slate-600" />,
                },
              ]}
            />
          </div>

          {/* Hero Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              High-Value IT Microtasks
            </h1>
            <p className="text-slate-600 max-w-2xl">
              Browse premium microtasks from verified employers. Minimum ₹50 per task.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <TaskFilters
              filters={filters}
              onFiltersChange={(newFilters) => setFilters(newFilters)}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Content - Left Column */}
            <div className="lg:col-span-2">
        {tasksLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : tasksError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-800 p-12 text-center shadow-md"
          >
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Error loading tasks
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">
              {tasksError.message}
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#1E40AF] !text-white rounded-lg hover:bg-[#1E3A8A] transition shadow-md hover:shadow-lg"
            >
              Retry
            </button>
          </motion.div>
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-md"
          >
            <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your filters or check back later for new high-value tasks.
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#1E40AF] !text-white rounded-lg hover:bg-[#1E3A8A] transition shadow-md hover:shadow-lg"
            >
              Refresh Tasks
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onBidClick={handleBidClick}
                  showBidButton={true}
                  index={index}
                />
              ))}
            </div>

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Activity Feed */}
              <ActivityFeed
                activities={activities.length > 0 ? activities : [
                  {
                    id: '1',
                    timestamp: new Date(),
                    type: 'info',
                    title: 'Welcome to your dashboard',
                    description: 'Start browsing tasks to see your activity here',
                  },
                ]}
                maxItems={5}
              />

              {/* Quick Stats */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Available Tasks</span>
                    <span className="text-sm font-semibold text-slate-900">{tasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Shifts Balance</span>
                    <span className="text-sm font-semibold text-slate-900">{creditsBalance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Value</span>
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{tasks.reduce((sum, t) => sum + (t.price_fixed || (t as any).budget || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <BidModal
          isOpen={showBidModal}
          onClose={() => {
            setShowBidModal(false)
            setSelectedTask(null)
          }}
          task={selectedTask}
          onSuccess={handleBidSuccess}
        />
      )}

      <ShiftsModal
        isOpen={showShiftsModal}
        onClose={() => setShowShiftsModal(false)}
        userId={currentUser?.id || ''}
        userType="worker"
        currentBalance={creditsBalance}
        onPurchaseComplete={() => {
          apiClient.getCreditsBalance().then(result => {
            if (result.data) {
              setCreditsBalance(result.data.balance || 0)
            }
          })
        }}
      />
      
      <BuyCreditsModalV1
        isOpen={showBuyCreditsModal}
        onClose={() => setShowBuyCreditsModal(false)}
        userId={currentUser?.id || ''}
        userType="worker"
        currentBalance={creditsBalance}
        onPurchaseComplete={() => {
          setShowBuyCreditsModal(false)
          apiClient.getCreditsBalance().then(result => {
            if (result.data) {
              setCreditsBalance(result.data.balance || 0)
            }
          })
        }}
      />
    </div>
  )
}
