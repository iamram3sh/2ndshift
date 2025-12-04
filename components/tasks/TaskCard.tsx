'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, DollarSign, Shield, BadgeCheck, ArrowRight, Sparkles } from 'lucide-react'
import type { Job } from '@/types/jobs'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Job
  onBidClick?: (task: Job) => void
  showBidButton?: boolean
  index?: number
}

export function TaskCard({ task, onBidClick, showBidButton = true, index = 0 }: TaskCardProps) {
  const isVerified = task.client?.trust_score && task.client.trust_score > 80
  const price = task.price_fixed || (task as any).budget || 0
  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: task.price_currency || 'INR',
    maximumFractionDigits: 0,
  }).format(price)

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  const getDeliveryWindowText = () => {
    const dw = task.delivery_window
    if (dw === 'sixTo24h' || dw === '6-24h') return '6-24 hours'
    if (dw === 'threeTo7d' || dw === '3-7d') return '3-7 days'
    if (dw === 'oneTo4w' || dw === '1-4w') return '1-4 weeks'
    if (dw === 'oneTo6m' || dw === '1-6m') return '1-6 months'
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div className={cn(
        "h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800",
        "shadow-md hover:shadow-xl transition-all duration-300",
        "overflow-hidden",
        isVerified && "ring-2 ring-emerald-500/20"
      )}>
        {/* Verified Glow Effect */}
        {isVerified && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
        )}

        <div className="p-6 relative">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#1E40AF] dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {task.title}
                </h3>
                {isVerified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex-shrink-0"
                  >
                    <Badge variant="success" className="gap-1.5 px-2.5 py-1">
                      <Shield className="w-3 h-3" />
                      <span className="text-xs font-semibold">Verified</span>
                    </Badge>
                  </motion.div>
                )}
              </div>
              
              {/* Category Badge */}
              {task.category && (
                <Badge variant="secondary" className="mb-3">
                  {task.category.name}
                </Badge>
              )}
            </div>
            
            {/* Price Badge */}
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md"
              >
                <DollarSign className="w-4 h-4 text-white" />
                <span className="text-lg font-bold text-white">{priceFormatted}</span>
              </motion.div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
            {truncateDescription(task.description)}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-4">
            {getDeliveryWindowText() && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{getDeliveryWindowText()}</span>
              </div>
            )}
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
            {task.applications_count !== undefined && task.applications_count > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>{task.applications_count} {task.applications_count === 1 ? 'bid' : 'bids'}</span>
              </>
            )}
          </div>

          {/* Skills */}
          {task.required_skills && task.required_skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {task.required_skills.slice(0, 3).map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  {skill}
                </Badge>
              ))}
              {task.required_skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{task.required_skills.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Link
              href={`/task/${task.id}`}
              className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-[#1E40AF] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
            >
              View Details
            </Link>
            {showBidButton && onBidClick && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBidClick(task)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E40AF] hover:bg-[#1E3A8A] !text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Place Bid
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
