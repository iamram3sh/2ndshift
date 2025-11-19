'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error tracking service (e.g., Sentry)
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Oops! Something went wrong
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-6 mb-8 text-left">
            <div className="text-red-400 font-mono text-sm">
              <div className="font-bold mb-2">Error Details:</div>
              <div className="text-xs overflow-auto max-h-40">
                {error.message}
              </div>
              {error.digest && (
                <div className="mt-2 text-slate-400">
                  Digest: {error.digest}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Code Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            What can you do?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Try again</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  The issue might be temporary
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Go back home</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Start fresh from the homepage
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Report the issue</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Help us improve by reporting what happened
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-400 hover:shadow-xl transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          Error persists?{' '}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
