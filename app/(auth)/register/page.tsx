'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Briefcase, Users, Mail, Lock, User, ArrowRight, Shield, CheckCircle, Zap } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
    
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          user_type: formData.userType
        }
      }
    })
    
    if (data.user && !error) {
      // Create user profile in public.users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: formData.fullName,
          user_type: formData.userType,
          profile_visibility: 'public'
        })
      
      if (profileError) console.error('Profile creation error:', profileError)
    }
    
    setIsLoading(false)
    
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Registration successful! Check your email to verify.')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
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
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Get started free</h1>
            <p className="text-lg text-slate-600">Join thousands earning legally on 2ndShift</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 animate-in slide-in-from-top ${
              message.includes('successful') 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                message.includes('successful') ? 'bg-green-200' : 'bg-red-200'
              }`}>
                <span className={`text-xs font-bold ${
                  message.includes('successful') ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.includes('successful') ? '✓' : '!'}
                </span>
              </div>
              <span>{message}</span>
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              What brings you here?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'worker' })}
                className={`group p-6 border-2 rounded-2xl transition-all ${
                  formData.userType === 'worker'
                    ? 'border-purple-600 bg-purple-50 shadow-lg shadow-purple-100'
                    : 'border-slate-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition ${
                  formData.userType === 'worker' 
                    ? 'bg-purple-600' 
                    : 'bg-slate-100 group-hover:bg-purple-100'
                }`}>
                  <Briefcase className={`w-6 h-6 ${
                    formData.userType === 'worker' ? 'text-white' : 'text-slate-600 group-hover:text-purple-600'
                  }`} />
                </div>
                <div className="font-bold text-slate-900 mb-1">Find Work</div>
                <div className="text-xs text-slate-500">I&apos;m a freelancer</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'client' })}
                className={`group p-6 border-2 rounded-2xl transition-all ${
                  formData.userType === 'client'
                    ? 'border-green-600 bg-green-50 shadow-lg shadow-green-100'
                    : 'border-slate-200 hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition ${
                  formData.userType === 'client' 
                    ? 'bg-green-600' 
                    : 'bg-slate-100 group-hover:bg-green-100'
                }`}>
                  <Users className={`w-6 h-6 ${
                    formData.userType === 'client' ? 'text-white' : 'text-slate-600 group-hover:text-green-600'
                  }`} />
                </div>
                <div className="font-bold text-slate-900 mb-1">Hire Talent</div>
                <div className="text-xs text-slate-500">I&apos;m hiring</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition outline-none"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.fullName}
                </p>
              )}
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
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

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-indigo-600 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 to-emerald-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-md">
          <Zap className="w-16 h-16 text-white mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Earning in
            <br />
            Less Than 24 Hours
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join India&apos;s fastest-growing platform for legal, compliant freelance work
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: '100% tax compliant - TDS & Form 16A included' },
              { icon: CheckCircle, text: 'Get verified in 24 hours, start earning immediately' },
              { icon: Zap, text: 'Instant payments - no 30-day waiting' },
              { icon: Briefcase, text: 'Access to verified, high-paying projects' }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-4 h-4" />
                </div>
                <span className="text-lg">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur border border-white/20 rounded-2xl">
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <div className="text-3xl font-bold text-white">₹20K+</div>
                <div className="text-sm text-green-100">Avg. Monthly</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">5K+</div>
                <div className="text-sm text-green-100">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm text-green-100">Satisfaction</div>
              </div>
            </div>
            <p className="text-sm text-green-100">
              &quot;Best platform for part-time work. Finally, something that&apos;s completely legal!&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
