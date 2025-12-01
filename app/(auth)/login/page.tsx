'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Mail, Lock, ArrowRight, Layers, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const verified = params.get('verified')
      const error = params.get('error')
      const msg = params.get('message')
      
      if (verified === 'true') {
        setSuccessMessage('Email verified successfully. You can now sign in.')
      } else if (error === 'verification_failed') {
        setMessage('Email verification failed. Please try again.')
      } else if (msg === 'check_email') {
        setSuccessMessage('Please check your email to verify your account.')
      } else if (msg === 'registration_success') {
        setSuccessMessage('Account created successfully. You can now sign in.')
      }
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      })
      
      if (error) throw error
      
      if (data.user) {
        const response = await fetch('/api/auth/get-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: data.user.id })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.profile?.user_type) {
            const routes: Record<string, string> = {
              worker: '/worker',
              client: '/client',
              admin: '/admin',
              superadmin: '/admin'
            }
            router.push(routes[result.profile.user_type] || '/worker')
          }
        }
      }
    } catch (error: any) {
      setMessage(error.message || 'Sign in failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">2ndShift</span>
          </Link>

          {/* Header */}
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-600 mb-8">Sign in to your account to continue</p>

          {/* Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-sm text-slate-600 hover:text-slate-900">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-slate-900 hover:underline">
              Create one
            </Link>
          </p>

          <p className="mt-6 pt-6 border-t border-slate-200 text-xs text-center text-slate-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-slate-700">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-slate-700">Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* Right - Info Panel */}
      <div className="hidden lg:flex flex-1 bg-slate-900 p-12 items-center justify-center relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative max-w-md">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <Shield className="w-7 h-7 text-white" />
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-4">
            India&apos;s compliant talent platform
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join thousands of professionals and companies building the future of work.
          </p>

          <ul className="space-y-4">
            {[
              'Automatic TDS & GST compliance',
              'Weekly payments to your bank',
              'Professional contracts included',
              'Verified clients and professionals'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 bg-slate-700 rounded-full border-2 border-slate-900" />
                ))}
              </div>
              <div>
                <div className="font-semibold text-white">5,000+</div>
                <div className="text-sm text-slate-400">Active professionals</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 italic">
              &ldquo;The platform that finally makes freelancing simple and compliant.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
