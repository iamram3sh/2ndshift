import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = clsx(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200',
    'focus:outline-none focus:ring-4',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    'active:scale-95',
    fullWidth && 'w-full'
  )
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white hover:shadow-2xl hover:scale-105 focus:ring-indigo-300/50 shadow-lg',
    secondary: 'bg-white text-slate-900 border-2 border-slate-300 hover:border-indigo-600 hover:shadow-xl hover:scale-105 focus:ring-indigo-200/50',
    outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:scale-105 focus:ring-indigo-200/50',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-2xl hover:scale-105 focus:ring-red-300/50 shadow-lg',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:shadow-md focus:ring-slate-200/50',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-2xl hover:scale-105 focus:ring-green-300/50 shadow-lg'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const content = (
    <>
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  )

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  )
}
