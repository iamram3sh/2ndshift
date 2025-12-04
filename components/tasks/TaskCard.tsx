'use client'

import Link from 'next/link'
import { Clock, DollarSign, Shield, BadgeCheck, ArrowRight } from 'lucide-react'
import type { Job } from '@/types/jobs'
import { formatDistanceToNow } from 'date-fns'

interface TaskCardProps {
  task: Job
  onBidClick?: (task: Job) => void
  showBidButton?: boolean
}

export function TaskCard({ task, onBidClick, showBidButton = true }: TaskCardProps) {
  const isVerified = task.client?.trust_score && task.client.trust_score > 80
  const price = task.price_fixed || 0
  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: task.price_currency || 'INR',
    maximumFractionDigits: 0,
  }).format(price)

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-[#0b63ff] dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#0b63ff] dark:group-hover:text-blue-400 transition-colors">
                {task.title}
              </h3>
              {isVerified && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Verified</span>
                </div>
              )}
            </div>
            
            {/* Category Badge */}
            {task.category && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg mb-3">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {task.category.name}
                </span>
              </div>
            )}
          </div>
          
          {/* Price Badge */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
              <DollarSign className="w-4 h-4 text-white" />
              <span className="text-lg font-bold text-white">{priceFormatted}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
          {truncateDescription(task.description)}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-slate-700 dark:text-slate-400 mb-4">
          {task.delivery_window && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>
                {(task.delivery_window === 'sixTo24h' || task.delivery_window === '6-24h') && '6-24 hours'}
                {(task.delivery_window === 'threeTo7d' || task.delivery_window === '3-7d') && '3-7 days'}
                {(task.delivery_window === 'oneTo4w' || task.delivery_window === '1-4w') && '1-4 weeks'}
                {(task.delivery_window === 'oneTo6m' || task.delivery_window === '1-6m') && '1-6 months'}
              </span>
            </div>
          )}
          <span>•</span>
          <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
          {task.applications_count !== undefined && (
            <>
              <span>•</span>
              <span>{task.applications_count} {task.applications_count === 1 ? 'bid' : 'bids'}</span>
            </>
          )}
        </div>

        {/* Skills */}
        {task.required_skills && task.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.required_skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {task.required_skills.length > 3 && (
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-lg text-xs font-medium">
                +{task.required_skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Link
            href={`/task/${task.id}`}
            className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-[#0b63ff] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-[#0b63ff] dark:border-blue-400"
          >
            View Details
          </Link>
          {showBidButton && onBidClick && (
            <button
              onClick={() => onBidClick(task)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0b63ff] hover:bg-[#0a56e6] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Place Bid
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
