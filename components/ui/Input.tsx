import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    icon, 
    iconPosition = 'left',
    fullWidth = true,
    className,
    disabled, 
    ...props 
  }, ref) => {
    return (
      <div className={clsx('group', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={clsx(
              'w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none',
              'placeholder:text-slate-400',
              'focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500',
              'disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60',
              'dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500',
              'dark:focus:ring-indigo-900 dark:focus:border-indigo-400',
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:border-red-500' 
                : 'border-slate-200',
              icon && iconPosition === 'left' && 'pl-12',
              icon && iconPosition === 'right' && 'pr-12',
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    fullWidth = true,
    className,
    disabled,
    ...props 
  }, ref) => {
    return (
      <div className={clsx('group', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none',
            'placeholder:text-slate-400 resize-none',
            'focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500',
            'disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60',
            'dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500',
            'dark:focus:ring-indigo-900 dark:focus:border-indigo-400',
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
              : 'border-slate-200',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
