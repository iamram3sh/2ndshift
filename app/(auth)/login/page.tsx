'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Mail, Lock, ArrowRight, Briefcase, Shield, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Check for URL parameters on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const verified = params.get('verified')
      const error = params.get('error')
      const msg = params.get('message')
      
      if (verified === 'true') {
        setSuccessMessage('✅ Email verified successfully! You can now login.')
      } else if (error === 'verification_failed') {
        setMessage('Email verification failed. Please try again or contact support.')
      } else if (msg === 'check_email') {
        setSuccessMessage('📧 Please check your email to verify your account before logging in.')
      } else if (msg === 'registration_success') {
        setSuccessMessage('✅ Registration successful! You can now login.')
      }
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    setMessage('')
    
    try {
      // Sanitize email input
      const sanitizedEmail = formData.email.trim().toLowerCase()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: formData.password
      })
      
      if (error) throw error
      
      if (data.user) {
        // Call API route to get profile (bypasses RLS)
        try {
          const response = await fetch('/api/auth/get-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id })
          })
          
          console.log('API Response status:', response.status)
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error Response:', errorText)
            throw new Error(`Failed to load profile: ${response.status} - ${errorText}`)
          }
          
          const result = await response.json()
          console.log('API Result:', result)
          
          if (result.profile && result.profile.user_type) {
            // Profile loaded successfully, redirect to dashboard
            redirectBasedOnUserType(result.profile.user_type)
          } else {
            // Profile is missing or invalid
            console.error('Invalid profile data:', result)
            setMessage('Login successful but profile setup failed. Please contact support or try registering again.')
          }
        } catch (error: any) {
          console.error('Profile fetch error:', error)
          setMessage('Login successful but profile setup failed: ' + error.message)
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setMessage(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const redirectBasedOnUserType = (userType: string) => {
    // Redirect based on user type
    if (userType === 'worker') {
      router.push('/worker')
    } else if (userType === 'client') {
      router.push('/client')
    } else if (userType === 'admin' || userType === 'superadmin') {
      router.push('/admin')
    } else {
      setMessage('Invalid user type. Please contact support.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:bg-slate-900 flex animate-in fade-in">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-in slide-in-from-bottom delay-100">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                2ndShift
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 font-medium">Professional Platform</span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 animate-in slide-in-from-left">
              Welcome back 👋
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 animate-in slide-in-from-left delay-75">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl text-green-800 dark:text-green-300 text-sm flex items-start gap-3 animate-in slide-in-from-top shadow-sm">
              <div className="w-6 h-6 bg-green-200 dark:bg-green-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-800 dark:text-green-300" />
              </div>
              <span className="flex-1">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {message && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl text-red-800 dark:text-red-300 text-sm flex items-start gap-3 animate-in slide-in-from-top shadow-sm">
              <div className="w-6 h-6 bg-red-200 dark:bg-red-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-800 dark:text-red-300 text-xs font-bold">!</span>
              </div>
              <span className="flex-1">{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition outline-none"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                Create one now →
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-md animate-in slide-in-from-right delay-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-2xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            India&apos;s Most Trusted
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">Freelance Platform</span>
          </h2>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Join thousands of professionals working safely and legally on 2ndShift
          </p>

          <div className="space-y-4 mb-10 stagger-animation">
            {[
              { text: 'Automatic TDS & GST compliance', icon: '✓' },
              { text: 'Instant payments after approval', icon: '⚡' },
              { text: 'Professional contracts & NDAs', icon: '📄' },
              { text: 'Verified clients and workers', icon: '🛡️' }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-white hover:translate-x-2 transition-transform">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-sm">{benefit.icon}</span>
                </div>
                <span className="text-lg font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="p-6 glass-effect rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-3 border-white shadow-lg">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"></div>
                  </div>
                ))}
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold">5,000+</div>
                <div className="text-sm text-indigo-100 font-medium">Active Users</div>
              </div>
            </div>
            <p className="text-sm text-white font-medium leading-relaxed">
              &quot;2ndShift made freelancing completely stress-free. No more tax worries!&quot;
            </p>
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-4 h-4 text-yellow-300">★</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}