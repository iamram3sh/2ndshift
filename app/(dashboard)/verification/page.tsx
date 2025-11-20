'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Shield, CheckCircle, Clock, XCircle, ArrowLeft, AlertTriangle } from 'lucide-react'
import { VerificationForm } from '@/components/verification/VerificationForm'
import { VerificationBadge } from '@/components/verification/VerificationBadge'
import type { User, Verification } from '@/types/database.types'

export default function VerificationPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profile) {
      setUser(profile)
      fetchVerifications(authUser.id)
    }
    setIsLoading(false)
  }

  const fetchVerifications = async (userId: string) => {
    const { data, error } = await supabase
      .from('verifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching verifications:', error)
      return
    }

    setVerifications(data || [])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'pending':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
      case 'rejected':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700'
    }
  }

  const verificationProgress = () => {
    const total = 3 // email, phone, pan (minimum required)
    const completed = verifications.filter(v => v.status === 'verified' && ['email', 'phone', 'pan'].includes(v.verification_type)).length
    return Math.round((completed / total) * 100)
  }

  const isFullyVerified = () => {
    const required = ['email', 'phone', 'pan']
    return required.every(type => 
      verifications.some(v => v.verification_type === type && v.status === 'verified')
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-600" />
                Account Verification
              </h1>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {user?.full_name}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {isFullyVerified() ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8 flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-1">
                Your Account is Fully Verified! 🎉
              </h3>
              <p className="text-sm text-green-800 dark:text-green-400">
                You have access to all platform features including payments and withdrawals.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8 flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">
                Complete Your Verification
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-400 mb-4">
                Verify your account to unlock all features. Required verifications: Email, Phone, and PAN.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-amber-600 h-full rounded-full transition-all"
                    style={{ width: `${verificationProgress()}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                  {verificationProgress()}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Current Verifications */}
        {verifications.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Your Verifications
            </h3>
            <div className="space-y-3">
              {verifications.map((verification) => (
                <div
                  key={verification.id}
                  className={`p-4 border rounded-lg ${getStatusColor(verification.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(verification.status)}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                          {verification.verification_type.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Status: <span className="capitalize font-medium">{verification.status}</span>
                        </p>
                        {verification.status === 'pending' && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Submitted on {new Date(verification.created_at).toLocaleDateString()}
                          </p>
                        )}
                        {verification.status === 'verified' && verification.verified_at && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Verified on {new Date(verification.verified_at).toLocaleDateString()}
                          </p>
                        )}
                        {verification.status === 'rejected' && verification.rejection_reason && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            Reason: {verification.rejection_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Form */}
        {showForm ? (
          <VerificationForm
            userId={user!.id}
            onSuccess={() => {
              setShowForm(false)
              fetchVerifications(user!.id)
            }}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Submit New Verification
          </button>
        )}

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Trust Badge</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get verified badge on your profile
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <Shield className="w-8 h-8 text-indigo-600 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Full Access</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unlock all platform features
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <CheckCircle className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Higher Priority</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get priority in search results
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
