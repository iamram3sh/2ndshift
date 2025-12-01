'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Briefcase, Users, Mail, Lock, User, ArrowRight, Shield, CheckCircle, Zap, Eye, EyeOff, Sparkles } from 'lucide-react'

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'client' || type === 'worker') {
      setFormData(prev => ({ ...prev, userType: type }))
    }
  }, [searchParams])

  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
  }

  const isCommonPassword = (password: string): boolean => {
    const commonPasswords = [
      'password', '12345678', 'qwerty123', 'abc123456', 'password123',
      'admin123', 'welcome123', 'letmein123'
    ]
    const lowerPassword = password.toLowerCase()
    return commonPasswords.some(common => lowerPassword.includes(common))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    const sanitizedName = sanitizeInput(formData.fullName)
    const sanitizedEmail = formData.email.trim().toLowerCase()
    
    if (!sanitizedName) {
      newErrors.fullName = 'Full name is required'
    } else if (sanitizedName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    } else if (sanitizedName.length > 100) {
      newErrors.fullName = 'Name is too long'
    }
    
    if (!sanitizedEmail) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password is too long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(formData.password)) {
      newErrors.password = 'Include uppercase, lowercase, number, and special character'
    } else if (isCommonPassword(formData.password)) {
      newErrors.password = 'This password is too common'
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
      const sanitizedName = sanitizeInput(formData.fullName)
      const sanitizedEmail = formData.email.trim().toLowerCase()
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: formData.password,
        options: {
          data: {
            full_name: sanitizedName,
            user_type: formData.userType
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: sanitizedEmail,
            full_name: sanitizedName,
            user_type: formData.userType,
            profile_visibility: 'public'
          })
        
        if (profileError) {
          if (profileError.message?.includes('duplicate') || profileError.code === '23505') {
            setMessage('Registration successful! Redirecting to login...')
            setTimeout(() => router.push('/login'), 2000)
          } else {
            setMessage('Account created! Please try logging in.')
            setTimeout(() => router.push('/login'), 2000)
          }
        } else {
          setMessage('Registration successful! Redirecting to login...')
          setTimeout(() => router.push('/login'), 2000)
        }
      }
    } catch (error: any) {
      setMessage(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 group">
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
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">Get started free</h1>
            <p className="text-lg text-neutral-600">Join thousands earning legally on 2ndShift</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-2xl text-sm flex items-start gap-3 animate-in slide-in-from-top ${
              message.includes('successful') 
                ? 'bg-[#05c8b1]/10 border border-[#05c8b1]/20 text-[#058076]'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                message.includes('successful') ? 'bg-[#05c8b1]/20' : 'bg-red-100'
              }`}>
                <span className={`text-xs font-bold ${
                  message.includes('successful') ? 'text-[#05c8b1]' : 'text-red-600'
                }`}>
                  {message.includes('successful') ? '✓' : '!'}
                </span>
              </div>
              <span className="font-medium">{message}</span>
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'worker' })}
                className={`group p-5 border-2 rounded-2xl transition-all ${
                  formData.userType === 'worker'
                    ? 'border-[#05c8b1] bg-[#05c8b1]/5 shadow-lg shadow-[#05c8b1]/10'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition ${
                  formData.userType === 'worker' 
                    ? 'bg-[#05c8b1]' 
                    : 'bg-neutral-100 group-hover:bg-neutral-200'
                }`}>
                  <Briefcase className={`w-6 h-6 ${
                    formData.userType === 'worker' ? 'text-white' : 'text-neutral-600'
                  }`} />
                </div>
                <div className="font-bold text-neutral-900 mb-1">Find Work</div>
                <div className="text-xs text-neutral-500">I&apos;m a freelancer</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'client' })}
                className={`group p-5 border-2 rounded-2xl transition-all ${
                  formData.userType === 'client'
                    ? 'border-[#3373ff] bg-[#3373ff]/5 shadow-lg shadow-[#3373ff]/10'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition ${
                  formData.userType === 'client' 
                    ? 'bg-[#3373ff]' 
                    : 'bg-neutral-100 group-hover:bg-neutral-200'
                }`}>
                  <Users className={`w-6 h-6 ${
                    formData.userType === 'client' ? 'text-white' : 'text-neutral-600'
                  }`} />
                </div>
                <div className="font-bold text-neutral-900 mb-1">Hire Talent</div>
                <div className="text-xs text-neutral-500">I&apos;m hiring</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#05c8b1] transition" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-[#05c8b1]/10 focus:border-[#05c8b1] transition-all outline-none text-neutral-900 placeholder:text-neutral-400"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  {errors.fullName}
                </p>
              )}
            </div>

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
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-[#05c8b1]/10 focus:border-[#05c8b1] transition-all outline-none text-neutral-900 placeholder:text-neutral-400"
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

            <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#05c8b1] transition" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-10 py-3.5 bg-white border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-[#05c8b1]/10 focus:border-[#05c8b1] transition-all outline-none text-neutral-900 placeholder:text-neutral-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-red-600 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#05c8b1] transition" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-10 py-3.5 bg-white border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-[#05c8b1]/10 focus:border-[#05c8b1] transition-all outline-none text-neutral-900 placeholder:text-neutral-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-xs text-red-600 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-neutral-900 text-white py-4 rounded-xl font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden mt-6"
            >
              <span className="relative z-10 flex items-center gap-2">
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
              </span>
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                formData.userType === 'worker' 
                  ? 'bg-gradient-to-r from-[#05c8b1] to-[#058076]' 
                  : 'bg-gradient-to-r from-[#3373ff] to-[#1c50f5]'
              } opacity-0 group-hover:opacity-100`}></div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#05c8b1] hover:text-[#058076] transition">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-[#05c8b1] hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#05c8b1] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#05c8b1] to-[#058076] p-12 items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#003332]/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start Earning in
            <br />
            Less Than 24 Hours
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join India&apos;s fastest-growing platform for legal, compliant freelance work
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: '100% tax compliant - TDS & Form 16A' },
              { icon: CheckCircle, text: 'Get verified in 24 hours' },
              { icon: Zap, text: 'Weekly payments - no waiting' },
              { icon: Briefcase, text: 'Access verified, high-paying projects' }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 text-white">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <span className="text-lg">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
            <div className="grid grid-cols-3 gap-6 mb-4">
              {[
                { value: '₹20K+', label: 'Avg. Monthly' },
                { value: '5K+', label: 'Active Users' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-white/70 italic">
              &quot;Best platform for part-time work. Finally, something that&apos;s completely legal!&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
