'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useOpenTasks, useCurrentUser, useCreditsBalance } from '@/lib/queries'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { BidModal } from '@/components/tasks/BidModal'
import { ShiftsModal } from '@/components/shifts/ShiftsModal'
import { BuyCreditsModalV1 } from '@/components/revenue/BuyCreditsModalV1'
import apiClient from '@/lib/apiClient'
import { 
  Briefcase, Clock, DollarSign, User, LogOut, Search, 
  TrendingUp, FileText, CheckCircle, XCircle, AlertCircle,
  Award, Target, Activity, Bell, Filter, ArrowUpRight,
  Calendar, Zap, BarChart3, Eye, Star, ChevronRight, 
  Rocket, Shield, BadgeCheck, Sparkles, Users, MessageSquare,
  Settings, HelpCircle, Crown, ArrowRight, Lock, Gift,
  Layers, MoreHorizontal, ExternalLink, MapPin, Timer, Loader2
} from 'lucide-react'
import type { Job, JobFilters } from '@/types/jobs'

export default function WorkerDashboard() {
  const router = useRouter()
  const [selectedTask, setSelectedTask] = useState<Job | null>(null)
  const [showBidModal, setShowBidModal] = useState(false)
  const [showShiftsModal, setShowShiftsModal] = useState(false)
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false)
  const [filters, setFilters] = useState<JobFilters>({ status: 'open' as const, role: 'worker' as const, minPrice: 50 })
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const { data: creditsBalance = 0 } = useCreditsBalance()
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useOpenTasks(filters)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await apiClient.getCurrentUser()
        
        if (result.error || !result.data?.user) {
          router.push('/login')
          return
        }

        const user = result.data.user
        
        // Check if user is a worker
        if (user.role !== 'worker') {
          const routes: Record<string, string> = {
            client: '/client',
            admin: '/dashboard/admin',
            superadmin: '/dashboard/admin'
          }
          router.push(routes[user.role] || '/login')
          return
        }

        setCurrentUser(user)
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/login')
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleBidClick = (task: Job) => {
    if (creditsBalance < 3) {
      setShowBuyCreditsModal(true)
      return
    }
    setSelectedTask(task)
    setShowBidModal(true)
  }

  const handleBidSuccess = () => {
    refetchTasks()
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#0b63ff]" />
          <span className="text-[#333] dark:text-slate-300">Loading...</span>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null // Will redirect to login
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
              <Link href="/worker/discover" className="px-3 py-2 text-sm font-medium text-[#333] dark:text-slate-300 hover:text-[#111] dark:hover:text-white">
                Discover
              </Link>
              <Link href="/messages" className="px-3 py-2 text-sm font-medium text-[#333] dark:text-slate-300 hover:text-[#111] dark:hover:text-white">
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

        {/* Tasks Grid */}
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
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {tasksError instanceof Error ? tasksError.message : 'Failed to load tasks. Please try again.'}
            </p>
            <button
              onClick={() => refetchTasks()}
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
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Make sure you've run the seed data script to populate tasks.
            </p>
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
                  ₹{tasks.reduce((sum, t) => sum + (t.price_fixed || 0), 0).toLocaleString()}
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
        userType={(currentUser?.role || 'worker') as 'worker' | 'client'}
        currentBalance={creditsBalance}
        onPurchaseComplete={(newBalance) => {
          // Balance will be refetched automatically via useCreditsBalance
        }}
      />
      <BuyCreditsModalV1
        isOpen={showBuyCreditsModal}
        onClose={() => setShowBuyCreditsModal(false)}
        userId={currentUser?.id || ''}
        userType={(currentUser?.role || 'worker') as 'worker' | 'client'}
        currentBalance={creditsBalance}
        onPurchaseComplete={() => {
          setShowBuyCreditsModal(false)
        }}
      />
    </div>
  )
}
