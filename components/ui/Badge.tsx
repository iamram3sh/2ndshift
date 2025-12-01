import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  icon?: ReactNode
  onRemove?: () => void
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  icon,
  onRemove,
  className
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold transition-all duration-200',
        rounded ? 'rounded-full' : 'rounded-lg',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

interface BadgeDotProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  pulse?: boolean
  className?: string
}

export function BadgeDot({ variant = 'default', pulse = false, className }: BadgeDotProps) {
  const variants = {
    default: 'bg-slate-500',
    primary: 'bg-indigo-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500'
  }

  return (
    <span
      className={clsx(
        'inline-block w-2 h-2 rounded-full',
        variants[variant],
        pulse && 'animate-pulse-ring',
        className
      )}
    />
  )
}

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function StatusBadge({ status, size = 'md', showLabel = false, className }: StatusBadgeProps) {
  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online' },
    offline: { color: 'bg-slate-400', label: 'Offline' },
    away: { color: 'bg-amber-500', label: 'Away' },
    busy: { color: 'bg-red-500', label: 'Busy' }
  }

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const config = statusConfig[status]

  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      <span className="relative">
        <span className={clsx('block rounded-full', config.color, sizes[size])} />
        {status === 'online' && (
          <span className={clsx('absolute inset-0 rounded-full animate-pulse-ring', config.color)} />
        )}
      </span>
      {showLabel && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {config.label}
        </span>
      )}
    </span>
  )
}
