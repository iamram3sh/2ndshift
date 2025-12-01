'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Briefcase, Users, Mail, Lock, User, ArrowRight, Layers, Shield, CheckCircle, Zap, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'worker' as 'worker' | 'client'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'client' || type === 'worker') {
      setFormData(prev => ({ ...prev, userType: type }))
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Include uppercase, lowercase, and number'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    setMessage('')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            user_type: formData.userType
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        await supabase.from('users').insert({
          id: data.user.id,
          email: formData.email.trim().toLowerCase(),
          full_name: formData.fullName.trim(),
          user_type: formData.userType,
          profile_visibility: 'public'
        })
        
        setMessage('Account created successfully! Redirecting...')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (error: any) {
      setMessage(error.message || 'Registration failed. Please try again.')
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
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-600 mb-8">Get started for free in 2 minutes</p>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 ${
              message.includes('success') 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.includes('success') && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <span>{message}</span>
            </div>
          )}

          {/* User Type */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'worker' })}
              className={`p-4 border rounded-xl text-center transition-all ${
                formData.userType === 'worker'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Briefcase className={`w-5 h-5 mx-auto mb-2 ${formData.userType === 'worker' ? 'text-white' : 'text-slate-400'}`} />
              <div className="font-medium text-sm">Find Work</div>
              <div className={`text-xs mt-0.5 ${formData.userType === 'worker' ? 'text-slate-300' : 'text-slate-500'}`}>I&apos;m a professional</div>
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'client' })}
              className={`p-4 border rounded-xl text-center transition-all ${
                formData.userType === 'client'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Users className={`w-5 h-5 mx-auto mb-2 ${formData.userType === 'client' ? 'text-white' : 'text-slate-400'}`} />
              <div className="font-medium text-sm">Hire Talent</div>
              <div className={`text-xs mt-0.5 ${formData.userType === 'client' ? 'text-slate-300' : 'text-slate-500'}`}>I&apos;m hiring</div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full name</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="mt-1.5 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPass"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              <label htmlFor="showPass" className="text-sm text-slate-600">Show password</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-slate-900 hover:underline">Sign in</Link>
          </p>

          <p className="mt-6 pt-6 border-t border-slate-200 text-xs text-center text-slate-500">
            By creating an account, you agree to our{' '}
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
            <Zap className="w-7 h-7 text-white" />
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-4">
            Start earning in 24 hours
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join India&apos;s fastest-growing platform for compliant contract work.
          </p>

          <ul className="space-y-4">
            {[
              '100% tax compliant - TDS & Form 16A included',
              'Get verified within 24 hours',
              'Weekly payments - no waiting',
              'Access verified, high-paying projects'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: '100%', label: 'Tax Compliant' },
              { value: 'Weekly', label: 'Payments' },
              { value: 'Secure', label: 'Escrow' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-semibold text-white">{stat.value}</div>
                <div className="text-sm text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
