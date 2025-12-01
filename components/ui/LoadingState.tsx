import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  className?: string
}

export function LoadingState({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className 
}: LoadingStateProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const content = (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-4',
      fullScreen ? 'min-h-screen' : 'py-12',
      className
    )}>
      <div className="relative">
        <Loader2 className={clsx(sizes[size], 'text-indigo-600 dark:text-indigo-400 animate-spin')} />
        <div className="absolute inset-0 animate-pulse-ring rounded-full"></div>
      </div>
      {text && (
        <p className={clsx(
          textSizes[size],
          'text-slate-600 dark:text-slate-400 font-medium animate-pulse'
        )}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:bg-slate-900 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  }

  return (
    <div className={clsx(
      'inline-block rounded-full border-current border-t-transparent animate-spin',
      sizes[size],
      className
    )} />
  )
}

interface SkeletonProps {
  className?: string
  count?: number
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className, count = 1, variant = 'rectangular' }: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'h-20 rounded-xl'
  }

  const skeletons = Array.from({ length: count }, (_, i) => i)

  return (
    <>
      {skeletons.map((i) => (
        <div
          key={i}
          className={clsx(
            'skeleton',
            variants[variant],
            className
          )}
        />
      ))}
    </>
  )
}

interface CardSkeletonProps {
  count?: number
}

export function CardSkeleton({ count = 1 }: CardSkeletonProps) {
  const cards = Array.from({ length: count }, (_, i) => i)

  return (
    <>
      {cards.map((i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="flex items-start gap-4 mb-4">
            <Skeleton variant="circular" className="w-12 h-12" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" count={3} />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  )
}

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  const rowArray = Array.from({ length: rows }, (_, i) => i)
  const colArray = Array.from({ length: columns }, (_, i) => i)

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {colArray.map((i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowArray.map((rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-200 dark:border-slate-700">
                {colArray.map((colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-32" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
