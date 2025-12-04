'use client'

import { Inbox, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  title?: string
  message?: string
  showRetry?: boolean
  onRetry?: () => void
}

export function EmptyState({ 
  title = 'No microtasks available', 
  message = 'There are no microtasks available for this category yet. Check back soon!',
  showRetry = false,
  onRetry
}: EmptyStateProps) {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#111] mb-2">{title}</h2>
          <p className="text-lg text-[#333] max-w-2xl mx-auto mb-6">
            {message}
          </p>
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              icon={<AlertCircle className="w-4 h-4" />}
              iconPosition="left"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
