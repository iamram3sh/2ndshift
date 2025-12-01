import { ReactNode, CSSProperties } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  style?: CSSProperties
}

export function Card({ children, className, hover = false, onClick, style }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
        hover && 'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className, size = 'default' }: { children: ReactNode; className?: string; size?: 'default' | 'lg' | 'sm' }) {
  const sizeClasses = {
    sm: 'text-base',
    default: 'text-xl',
    lg: 'text-2xl'
  }
  return <h3 className={clsx(sizeClasses[size], 'font-bold text-gray-900 dark:text-white', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('text-gray-600', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(className)}>{children}</div>
}
