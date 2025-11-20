'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [type, setType] = useState('welcome')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const emailTypes = [
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'verification', label: 'Email Verification' },
    { value: 'application', label: 'Job Application Notification' },
    { value: 'payment', label: 'Payment Receipt' },
    { value: 'form16a', label: 'Form 16A (TDS Certificate)' },
    { value: 'referral', label: 'Referral Bonus' }
  ]

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: 'Failed to send test email',
        details: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📧 Email Service Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test your email integration by sending sample emails
            </p>
          </div>

          {/* Status Check */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Configuration Status
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>RESEND_API_KEY:</strong>{' '}
                {process.env.NEXT_PUBLIC_RESEND_API_KEY ? (
                  <span className="text-green-600">✅ Configured</span>
                ) : (
                  <span className="text-orange-600">⚠️ Not visible (server-side only)</span>
                )}
              </p>
              <p className="text-blue-800 dark:text-blue-200 text-xs mt-2">
                If emails don't send, check your .env.local file for RESEND_API_KEY
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTest} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              >
                {emailTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  📧 Send Test Email
                </>
              )}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                result.success 
                  ? 'text-green-900 dark:text-green-100' 
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {result.success ? '✅ Success!' : '❌ Error'}
              </h3>
              <p className={`text-sm ${
                result.success 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {result.message || result.error}
              </p>
              {result.details && (
                <div className="mt-3 p-3 bg-white/50 dark:bg-slate-700/50 rounded text-xs">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
              {result.success && (
                <div className="mt-3 text-sm text-green-700 dark:text-green-300">
                  <p>✅ Check your inbox (and spam folder)</p>
                  <p>✅ Look for an email from: {result.details?.mode === 'development' ? 'Development Mode' : '2ndShift'}</p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              📝 Setup Instructions
            </h3>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
              <li>Get API key from <a href="https://resend.com" target="_blank" className="text-indigo-600 hover:underline">resend.com</a></li>
              <li>Add to .env.local: <code className="bg-gray-200 dark:bg-slate-600 px-2 py-1 rounded">RESEND_API_KEY=re_xxx</code></li>
              <li>Add: <code className="bg-gray-200 dark:bg-slate-600 px-2 py-1 rounded">EMAIL_FROM=onboarding@resend.dev</code></li>
              <li>Restart your dev server: <code className="bg-gray-200 dark:bg-slate-600 px-2 py-1 rounded">npm run dev</code></li>
              <li>Test by sending an email above!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
