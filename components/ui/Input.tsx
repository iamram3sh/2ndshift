import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          {label}
        </label>
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-[var(--brand-primary-light)]/20 focus:border-[var(--border-focus)] transition-all duration-300',
            'bg-[var(--bg-secondary)] border-[var(--border-primary)] placeholder:text-[var(--text-muted)]',
            error ? 'border-[var(--error)] focus:ring-[var(--error-light)]/20' : 'border-[var(--border-primary)]',
            'hover:border-[var(--brand-primary-light)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
