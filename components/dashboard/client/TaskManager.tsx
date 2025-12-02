/**
 * Simple Client Dashboard - Task Manager
 * Manage tasks, payments, and progress
 * 
 * TODO: Implement full functionality
 */

'use client'

import { CheckCircle, Clock, AlertCircle, IndianRupee } from 'lucide-react'

interface Task {
  id: string
  title: string
  worker: string
  status: 'pending' | 'in-progress' | 'review' | 'completed'
  progress: number
  budget: number
  dueDate: string
}

interface TaskManagerProps {
  tasks?: Task[]
}

export default function TaskManager({ tasks = [] }: TaskManagerProps) {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    'in-progress': 'bg-sky-100 text-sky-700',
    review: 'bg-purple-100 text-purple-700',
    completed: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#111]">Your Tasks</h2>
        <div className="flex items-center gap-4 text-sm text-[#333]">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {tasks.filter(t => t.status === 'in-progress').length} Active
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {tasks.filter(t => t.status === 'completed').length} Completed
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#111] mb-2">No tasks yet</h3>
            <p className="text-[#333]">Create your first project to get started.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#111] mb-1">{task.title}</h3>
                  <p className="text-sm text-[#333]">Worker: {task.worker}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-[#333] mb-2">
                  <span>Progress</span>
                  <span className="font-semibold">{task.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-sky-600 h-2 rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1 text-lg font-bold text-[#111]">
                  <IndianRupee className="w-5 h-5" />
                  {task.budget.toLocaleString()}
                </div>
                <div className="text-sm text-[#333]">Due: {task.dueDate}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

