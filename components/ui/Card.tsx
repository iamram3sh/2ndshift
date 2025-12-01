import { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export function Card({ children, className, hover = false, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
        hover && 'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={clsx('text-xl font-bold text-gray-900', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('text-gray-600', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(className)}>{children}</div>
}
