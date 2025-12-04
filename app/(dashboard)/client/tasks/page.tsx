'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TaskCard } from '@/components/tasks/TaskCard'
import { PostTaskForm } from '@/components/tasks/PostTaskForm'
import apiClient from '@/lib/apiClient'
import { 
  Layers, LogOut, Plus, Loader2, Briefcase, Filter, Sparkles
} from 'lucide-react'
import type { Job, JobFilters } from '@/types/jobs'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ClientTasksPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState<Job[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [showPostTaskModal, setShowPostTaskModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'assigned' | 'completed'>('all')

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        const userResult = await apiClient.getCurrentUser()
        if (userResult.error || !userResult.data?.user) {
          router.push('/login')
          return
        }
        const user = userResult.data.user
        if (user.role !== 'client') {
          router.push('/worker')
          return
        }
        setCurrentUser(user)
      } catch (err) {
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [router])

  useEffect(() => {
    if (!currentUser) return

    const fetchTasks = async () => {
      try {
        setTasksLoading(true)
        const result = await apiClient.listJobs({
          role: 'client',
          status: filterStatus === 'all' ? undefined : filterStatus,
        })
        if (result.data?.jobs) {
          setTasks(result.data.jobs)
        }
      } catch (err) {
        console.error('Error fetching tasks:', err)
      } finally {
        setTasksLoading(false)
      }
    }

    fetchTasks()
  }, [currentUser, filterStatus])

  const handlePostSuccess = () => {
    setShowPostTaskModal(false)
    // Refetch tasks
    if (currentUser) {
      const fetchTasks = async () => {
        const result = await apiClient.listJobs({ role: 'client' })
        if (result.data?.jobs) {
          setTasks(result.data.jobs)
        }
      }
      fetchTasks()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E40AF]" />
      </div>
    )
  }

  if (!currentUser) return null

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/client" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center shadow-md">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                2ndShift
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowPostTaskModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Post New Task
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#1E40AF] dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Your Posted Tasks
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage your high-value IT microtasks and review bids from verified professionals.
          </p>
        </motion.div>

        {/* Status Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          {(['all', 'open', 'assigned', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-[#1E40AF] !text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Tasks Grid */}
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
        ) : filteredTasks.length === 0 ? (
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
              {filterStatus === 'all' 
                ? "Get started by posting your first high-value IT microtask."
                : `No ${filterStatus} tasks found.`}
            </p>
            <Button onClick={() => setShowPostTaskModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Task
            </Button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                showBidButton={false}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Task Modal */}
      <PostTaskForm
        isOpen={showPostTaskModal}
        onClose={() => setShowPostTaskModal(false)}
        onSuccess={handlePostSuccess}
      />
    </div>
  )
}
