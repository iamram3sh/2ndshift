import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'gradient' | 'glass' | 'bordered'
  hover?: boolean
  interactive?: boolean
  onClick?: () => void
}

export function Card({ 
  children, 
  className, 
  variant = 'default',
  hover = false, 
  interactive = false,
  onClick 
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm',
    gradient: 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-md',
    glass: 'glass-effect',
    bordered: 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'
  }

  const hoverStyles = hover || interactive ? 'hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-1 cursor-pointer' : ''

  return (
    <div
      className={clsx(
        'rounded-2xl p-6 transition-all duration-200',
        variants[variant],
        hoverStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ 
  children, 
  className,
  actions 
}: { 
  children: ReactNode
  className?: string
  actions?: ReactNode 
}) {
  return (
    <div className={clsx('mb-6 flex items-center justify-between', className)}>
      <div>{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function CardTitle({ 
  children, 
  className,
  size = 'default'
}: { 
  children: ReactNode
  className?: string
  size?: 'sm' | 'default' | 'lg'
}) {
  const sizes = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <h3 className={clsx('font-bold text-slate-900 dark:text-white', sizes[size], className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <p className={clsx('text-slate-600 dark:text-slate-400 text-sm mt-1', className)}>
      {children}
    </p>
  )
}

export function CardContent({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={clsx(className)}>
      {children}
    </div>
  )
}

export function CardFooter({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={clsx('mt-6 pt-6 border-t border-slate-200 dark:border-slate-700', className)}>
      {children}
    </div>
  )
}
