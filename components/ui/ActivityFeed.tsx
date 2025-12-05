'use client'

import { Clock, CheckCircle, XCircle, AlertCircle, User, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ActivityItem {
  id: string
  timestamp: Date | string
  type: 'success' | 'error' | 'info' | 'warning'
  icon?: React.ReactNode
  title: string
  description?: string
  user?: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
  maxItems?: number
}

const getActivityIcon = (type: ActivityItem['type'], customIcon?: React.ReactNode) => {
  if (customIcon) return customIcon

  switch (type) {
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'error':
      return <XCircle className="w-4 h-4 text-red-600" />
    case 'warning':
      return <AlertCircle className="w-4 h-4 text-amber-600" />
    default:
      return <Clock className="w-4 h-4 text-slate-600" />
  }
}

const formatTimestamp = (timestamp: Date | string) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function ActivityFeed({ activities, className, maxItems = 10 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <div className={cn('bg-white border border-slate-200 rounded-xl p-4', className)}>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {displayActivities.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No recent activity</p>
        ) : (
          displayActivities.map((activity, idx) => (
            <div key={activity.id || idx} className="flex gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type, activity.icon)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    {activity.description && (
                      <p className="text-xs text-slate-600 mt-0.5">{activity.description}</p>
                    )}
                    {activity.user && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {activity.user}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
