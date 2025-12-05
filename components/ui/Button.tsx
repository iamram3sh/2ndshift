'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { clsx } from 'clsx'

function cn(...inputs: (string | undefined | null | false)[]) {
  return clsx(inputs.filter(Boolean))
}

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  'aria-label'?: string
}

const buttonVariants = {
  primary: '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50',
  secondary: '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50',
  outline: '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50',
  ghost: 'bg-transparent !text-slate-700 dark:!text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent',
  link: 'bg-transparent !text-[#1E40AF] hover:!text-[#1E3A8A] underline-offset-4 hover:underline p-0 border-0 shadow-none',
  danger: 'bg-red-600 !text-white hover:bg-red-700 shadow-md hover:shadow-lg active:shadow-md border border-transparent focus:ring-red-500'
}

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'right',
  isLoading = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 ease-out transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E40AF]'
  
  const classes = cn(
    baseStyles,
    buttonVariants[variant],
    buttonSizes[size],
    className
  )

  const isDisabled = disabled || isLoading

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={classes}
        aria-disabled={isDisabled}
        aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classes}
      aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  )
}
