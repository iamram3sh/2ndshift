'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { clsx } from 'clsx'

function cn(...inputs: (string | undefined | null | false)[]) {
  return clsx(inputs.filter(Boolean))
}

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const buttonVariants = {
  primary: 'bg-[#0b63ff] text-white hover:bg-[#0a56e6] shadow-lg hover:shadow-xl active:shadow-md border border-transparent',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl active:shadow-md border border-transparent',
  outline: 'bg-transparent text-[#0b1220] border-2 border-[#0b1220] hover:bg-[#0b1220] hover:text-white hover:border-[#0b1220]',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent',
  link: 'bg-transparent text-[#0b63ff] hover:text-[#0a56e6] underline-offset-4 hover:underline p-0 border-0 shadow-none'
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
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b63ff]'
  
  const classes = cn(
    baseStyles,
    buttonVariants[variant],
    buttonSizes[size],
    className
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={classes}
        {...props}
      >
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  )
}
