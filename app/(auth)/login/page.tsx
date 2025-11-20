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
        // Fetch user profile to determine dashboard
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('user_type, full_name')
          .eq('id', data.user.id)
          .single()
        
        if (profileError) {
          console.error('Profile fetch error:', profileError)
          // Profile might not exist yet, try to create it
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || 'User',
              user_type: data.user.user_metadata?.user_type || 'worker',
              profile_visibility: 'public'
            })
          
          if (createError) {
            setMessage('Login successful but profile setup failed. Please contact support.')
            console.error('Profile creation error:', createError)
            return
          }
          
          // Retry fetching profile
          const { data: newProfile } = await supabase
            .from('users')
            .select('user_type, full_name')
            .eq('id', data.user.id)
            .single()
          
          if (newProfile) {
            redirectBasedOnUserType(newProfile.user_type)
          } else {
            setMessage('Profile setup failed. Please contact support.')
          }
          return
        }
        
        if (profile) {
          redirectBasedOnUserType(profile.user_type)
        } else {
          setMessage('Profile not found. Please contact support.')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              2ndShift
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Welcome back</h1>
            <p className="text-lg text-slate-600">Sign in to continue to your dashboard</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex items-start gap-3 animate-in slide-in-from-top">
              <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-3 h-3 text-green-800" />
              </div>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-3 animate-in slide-in-from-top">
              <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-800 text-xs font-bold">!</span>
              </div>
              <span>{message}</span>
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
            <p className="text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition">
                Create one now
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-indigo-600 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-md">
          <Shield className="w-16 h-16 text-white mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            India&apos;s Most Trusted
            <br />
            Freelance Platform
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of professionals working safely and legally on 2ndShift
          </p>

          <div className="space-y-4">
            {[
              'Automatic TDS & GST compliance',
              'Instant payments after approval',
              'Professional contracts & NDAs',
              'Verified clients and workers'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur border border-white/20 rounded-2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <div className="text-white">
                <div className="font-bold">5,000+</div>
                <div className="text-sm text-indigo-100">Active Users</div>
              </div>
            </div>
            <p className="text-sm text-indigo-100">
              &quot;2ndShift made freelancing completely stress-free. No more tax worries!&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}