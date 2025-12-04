'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useClientJobs, useCurrentUser } from '@/lib/queries'
import { TaskCard } from '@/components/tasks/TaskCard'
import { PostTaskForm } from '@/components/tasks/PostTaskForm'
import { 
  Plus, Briefcase, Clock, DollarSign, CheckCircle, XCircle,
  Layers, Loader2, LogOut, ArrowRight, Filter
} from 'lucide-react'
import type { Job } from '@/types/jobs'

export default function ClientTasksPage() {
  const router = useRouter()
  const [showPostForm, setShowPostForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  const { data: currentUser } = useCurrentUser()
  const { data: jobs = [], isLoading, refetch } = useClientJobs({
    role: 'client',
    status: filterStatus === 'all' ? undefined : filterStatus as any,
  })

  const handlePostSuccess = () => {
    refetch()
    setShowPostForm(false)
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#0b63ff]" />
      </div>
    )
  }

  const stats = {
    total: jobs.length,
    open: jobs.filter((j: Job) => j.status === 'open').length,
    assigned: jobs.filter((j: Job) => j.status === 'assigned' || j.status === 'in_progress').length,
    completed: jobs.filter((j: Job) => j.status === 'completed').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/client" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-[#111] dark:text-white">2ndShift</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPostForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b63ff] hover:bg-[#0a56e6] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Post New Task
              </button>
              <Link
                href="/client"
                className="px-3 py-2 text-sm font-medium text-[#333] dark:text-slate-300 hover:text-[#111] dark:hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111] dark:text-white mb-2">
            Your Posted Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your high-value IT microtasks and review bids from verified professionals.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-2xl font-bold text-[#111] dark:text-white">{stats.total}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.open}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Open</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.assigned}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">In Progress</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          {['all', 'open', 'assigned', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === status
                  ? 'bg-[#0b63ff] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#0b63ff]" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#111] dark:text-white mb-2">
              No tasks yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Post your first high-value IT microtask to get started.
            </p>
            <button
              onClick={() => setShowPostForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b63ff] hover:bg-[#0a56e6] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Post Your First Task
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: Job) => (
              <div key={job.id}>
                <Link href={`/task/${job.id}`}>
                  <TaskCard task={job} showBidButton={false} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Task Form Modal */}
      <PostTaskForm
        isOpen={showPostForm}
        onClose={() => setShowPostForm(false)}
        onSuccess={handlePostSuccess}
      />
    </div>
  )
}
