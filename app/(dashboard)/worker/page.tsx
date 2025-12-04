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
import apiClient from '@/lib/apiClient'
import { 
  Layers, LogOut, Zap, Loader2, AlertCircle, Briefcase,
  Shield, DollarSign, Search, Sparkles, TrendingUp
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
          <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
          <span className="text-slate-600 dark:text-slate-300">Loading...</span>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/worker" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center shadow-md"
              >
                <Layers className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                2ndShift
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/worker" className="px-3 py-2 text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg">
                Dashboard
              </Link>
              <Link href="/worker/discover" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Discover
              </Link>
              <Link href="/messages" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Messages
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShiftsModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                <Zap className="w-4 h-4" />
                {creditsBalance} Shifts
              </motion.button>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              High-Value IT Microtasks
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Browse premium microtasks from verified employers. Minimum ₹50 per task. 
            <span className="font-semibold text-primary-600 dark:text-primary-400"> Fast bidding. Trusted clients. Escrow-protected payments.</span>
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <TaskFilters
            filters={filters}
            onFiltersChange={(newFilters) => setFilters(newFilters)}
          />
        </motion.div>

        {/* Tasks Content */}
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
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg"
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
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg"
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

            {/* Stats Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Available Tasks</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{creditsBalance}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Shifts Balance</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      ₹{tasks.reduce((sum, t) => sum + (t.price_fixed || (t as any).budget || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Value</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {tasks.filter(t => t.client?.trust_score && t.client.trust_score > 80).length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Verified Employers</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
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
