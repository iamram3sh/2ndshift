'use client'

import { TrendingUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SparklineData {
  x: string[]
  y: number[]
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  sparkline?: SparklineData
  gauge?: {
    value: number
    max: number
  }
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  sparkline,
  gauge,
  icon,
  onClick,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-slate-100 rounded-lg">
            {icon}
          </div>
        )}
      </div>

      {/* Sparkline Chart Placeholder */}
      {sparkline && (
        <div className="h-12 mb-2 flex items-end gap-0.5">
          {sparkline.y.map((val, idx) => {
            const height = (val / Math.max(...sparkline.y)) * 100
            return (
              <div
                key={idx}
                className="flex-1 bg-slate-300 rounded-t"
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>
      )}

      {/* Gauge Placeholder */}
      {gauge && (
        <div className="mb-2">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full transition-all"
              style={{ width: `${(gauge.value / gauge.max) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {gauge.value}% of {gauge.max}%
          </p>
        </div>
      )}

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp
            className={cn(
              'w-4 h-4',
              trend.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'
            )}
          />
          <span
            className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        </div>
      )}

      {onClick && (
        <div className="flex items-center gap-1 mt-3 text-xs text-slate-600">
          <span>View details</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
  )
}

interface StatsBarProps {
  stats: StatCardProps[]
  className?: string
}

export function StatsBar({ stats, className }: StatsBarProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  )
}
