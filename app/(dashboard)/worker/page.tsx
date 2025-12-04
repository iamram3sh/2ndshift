'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { BidModal } from '@/components/tasks/BidModal'
import { ShiftsModal } from '@/components/shifts/ShiftsModal'
import { BuyCreditsModalV1 } from '@/components/revenue/BuyCreditsModalV1'
import apiClient from '@/lib/apiClient'
import { 
  Layers, LogOut, Zap, Loader2, AlertCircle, Briefcase,
  Shield, DollarSign
} from 'lucide-react'
import type { Job, JobFilters } from '@/types/jobs'

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

        console.log('[WorkerDashboard] Fetching tasks with params:', params)
        
        const result = await apiClient.listJobs(params)
        
        console.log('[WorkerDashboard] API response:', result)

        if (result.error) {
          const errorMsg = result.error.message || result.error.error || 'Failed to fetch tasks'
          console.error('[WorkerDashboard] Error:', result.error)
          setTasksError(new Error(errorMsg))
          setTasks([])
          return
        }

        if (!result.data || !result.data.jobs) {
          console.warn('[WorkerDashboard] No jobs in response')
          setTasks([])
          return
        }

        let jobs = result.data.jobs || []
        console.log('[WorkerDashboard] Raw jobs:', jobs.length)

        // Apply client-side filtering for minPrice (fallback)
        if (filters.minPrice && filters.minPrice >= 50) {
          jobs = jobs.filter((job: Job) => {
            const price = job.price_fixed || (job as any).budget || 0
            const priceNum = typeof price === 'string' ? parseFloat(price) : price
            return priceNum >= filters.minPrice!
          })
          console.log('[WorkerDashboard] After minPrice filter:', jobs.length)
        }

        // Apply search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          jobs = jobs.filter((job: Job) => 
            job.title.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower)
          )
          console.log('[WorkerDashboard] After search filter:', jobs.length)
        }

        setTasks(jobs)
        console.log('[WorkerDashboard] Final tasks:', jobs.length)
      } catch (err: any) {
        console.error('[WorkerDashboard] Fetch error:', err)
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
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' })
      localStorage.removeItem('access_token')
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
      router.push('/')
    }
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
          <Loader2 className="w-5 h-5 animate-spin text-[#0b63ff]" />
          <span className="text-slate-600 dark:text-slate-300">Loading...</span>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/worker" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-[#111] dark:text-white">2ndShift</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/worker" className="px-3 py-2 text-sm font-medium text-[#111] dark:text-white bg-slate-100 dark:bg-slate-700 rounded-lg">
                Dashboard
              </Link>
              <Link href="/worker/discover" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#111] dark:hover:text-white">
                Discover
              </Link>
              <Link href="/messages" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#111] dark:hover:text-white">
                Messages
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowShiftsModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <Zap className="w-4 h-4" />
                {creditsBalance} Shifts
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111] dark:text-white mb-2">
            High-Value IT Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse premium microtasks from verified employers. Minimum ₹50 per task.
          </p>
        </div>

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={(newFilters) => setFilters(newFilters)}
        />

        {/* Tasks Content */}
        {tasksLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#0b63ff]" />
              <span className="text-slate-600 dark:text-slate-400">Loading tasks...</span>
            </div>
          </div>
        ) : tasksError ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#111] dark:text-white mb-2">
              Error loading tasks
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">
              {tasksError.message}
            </p>
            <div className="text-sm text-slate-500 dark:text-slate-500 mb-6 space-y-2">
              <p className="font-medium">Possible causes:</p>
              <ul className="list-disc list-inside text-left max-w-md mx-auto space-y-1">
                <li>No tasks available in the database (run seed script)</li>
                <li>API endpoint not responding</li>
                <li>Network connectivity issues</li>
              </ul>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#0b63ff] text-white rounded-lg hover:bg-[#0a56e6] transition"
            >
              Retry
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#111] dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your filters or check back later for new high-value tasks.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              Make sure you've run the seed data script to populate tasks.
            </p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#0b63ff] text-white rounded-lg hover:bg-[#0a56e6] transition"
            >
              Refresh Tasks
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onBidClick={handleBidClick}
                showBidButton={true}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {tasks.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#0b63ff]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#111] dark:text-white">{tasks.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Available Tasks</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#111] dark:text-white">{creditsBalance}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Shifts Balance</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#111] dark:text-white">
                    ₹{tasks.reduce((sum, t) => sum + (t.price_fixed || (t as any).budget || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Value</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#111] dark:text-white">
                    {tasks.filter(t => t.client?.trust_score && t.client.trust_score > 80).length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Verified Employers</div>
                </div>
              </div>
            </div>
          </div>
        )}
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
          // Refetch credits
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
          // Refetch credits
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
