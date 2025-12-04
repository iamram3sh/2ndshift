import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-[180px] font-bold bg-gradient-to-r from-[#0b63ff] to-[#0a56e6] bg-clip-text text-transparent leading-none">
            404
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </div>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Here&apos;s what you can do:
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#0b63ff] dark:text-blue-400 text-sm font-bold">1</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Check the URL</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Make sure you typed the address correctly</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#0b63ff] dark:text-blue-400 text-sm font-bold">2</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Go back to home</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Start fresh from our homepage</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#0b63ff] dark:text-blue-400 text-sm font-bold">3</span>
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Search for projects</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Browse available opportunities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0b63ff] to-[#0a56e6] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-[#0b63ff] dark:hover:border-blue-400 hover:shadow-xl transition-all"
          >
            <Search className="w-5 h-5" />
            Browse Projects
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          Need help?{' '}
          <Link href="/contact" className="text-[#0b63ff] dark:text-blue-400 hover:underline font-semibold">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  )
}
