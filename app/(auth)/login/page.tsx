'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Mail, Lock, ArrowRight, Briefcase, Shield, CheckCircle, Eye, EyeOff, Sparkles } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)

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
      const sanitizedEmail = formData.email.trim().toLowerCase()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: formData.password
      })
      
      if (error) throw error
      
      if (data.user) {
        try {
          const response = await fetch('/api/auth/get-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id })
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to load profile: ${response.status} - ${errorText}`)
          }
          
          const result = await response.json()
          
          if (result.profile && result.profile.user_type) {
            redirectBasedOnUserType(result.profile.user_type)
          } else {
            setMessage('Login successful but profile setup failed. Please contact support.')
          }
        } catch (error: any) {
          setMessage('Login successful but profile setup failed: ' + error.message)
        }
      }
    } catch (error: any) {
      setMessage(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const redirectBasedOnUserType = (userType: string) => {
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
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-2xl flex items-center justify-center shadow-lg shadow-[#05c8b1]/20 group-hover:shadow-xl transition-all duration-300">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-neutral-900">
              2nd<span className="text-[#05c8b1]">Shift</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-lg text-neutral-600">Sign in to continue to your dashboard</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-[#05c8b1]/10 border border-[#05c8b1]/20 rounded-2xl text-[#058076] text-sm flex items-start gap-3 animate-in slide-in-from-top">
              <div className="w-6 h-6 bg-[#05c8b1]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-[#05c8b1]" />
              </div>
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-start gap-3 animate-in slide-in-from-top">
              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#05c8b1] transition" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-[#05c8b1]/10 focus:border-[#05c8b1] transition-all outline-none text-neutral-900 placeholder:text-neutral-400"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-neutral-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-[#05c8b1] hover:text-[#058076] transition">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#05c8b1] transition" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-[#05c8b1]/10 focus:border-[#05c8b1] transition-all outline-none text-neutral-900 placeholder:text-neutral-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-neutral-900 text-white py-4 rounded-xl font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
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
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#05c8b1] to-[#058076] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-neutral-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-[#05c8b1] hover:text-[#058076] transition">
                Create one free
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 text-center">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-[#05c8b1] hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#05c8b1] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#05c8b1]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#3373ff]/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-[#05c8b1]/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            India&apos;s Most Trusted
            <br />
            <span className="text-[#05c8b1]">Freelance Platform</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-10">
            Join thousands of professionals earning extra income safely and legally
          </p>

          <div className="space-y-4">
            {[
              'Automatic TDS & GST compliance',
              'Weekly payments to your bank',
              'Professional contracts & NDAs',
              'Verified clients and workers'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 text-white">
                <div className="w-8 h-8 bg-[#05c8b1]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#05c8b1]" />
                </div>
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-full border-2 border-neutral-800"></div>
                ))}
              </div>
              <div className="text-white">
                <div className="font-bold text-xl">5,000+</div>
                <div className="text-sm text-neutral-400">Active Users</div>
              </div>
            </div>
            <p className="text-neutral-400 text-sm italic">
              &quot;2ndShift made freelancing completely stress-free. No more tax worries!&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
