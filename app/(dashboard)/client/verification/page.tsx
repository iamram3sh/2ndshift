/**
 * Client Verification Page
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { Shield, CreditCard, Building, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import HomeButton from '@/components/worker/HomeButton'

export default function ClientVerificationPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<any>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchVerificationStatus()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      // Use v1 API for authentication
      const result = await apiClient.getCurrentUser()
      
      if (result.error || !result.data?.user) {
        router.push('/login')
        setLoading(false)
        return
      }

      const currentUser = result.data.user
      
      // Check if user is a client
      if (currentUser.role !== 'client') {
        const routes: Record<string, string> = {
          worker: '/worker',
          admin: '/dashboard/admin',
          superadmin: '/dashboard/admin'
        }
        router.push(routes[currentUser.role] || '/')
        setLoading(false)
        return
      }

      // Fetch full profile from database
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (userData) {
        setUser(userData)
      } else {
        // Fallback to API user data
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.name || '',
          user_type: 'client',
        })
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch(`/api/client/verification/status/${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setVerificationStatus(data)
      }
    } catch (error) {
      console.error('Error fetching verification status:', error)
    }
  }

  const handlePaymentVerification = async () => {
    setProcessing(true)
    try {
      // Demo payment verification
      const response = await fetch('/api/client/verification/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: 'demo_payment_method_123',
          provider: 'stripe' // or 'razorpay', 'upi'
        })
      })

      const data = await response.json()
      if (data.success) {
        await fetchVerificationStatus()
        window.alert('Payment method verified successfully!')
      } else {
        window.alert(data.error || 'Verification failed')
      }
    } catch (error: any) {
      window.alert(error.message || 'Verification failed')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Verified
          </span>
        )
      case 'pending':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Not Started
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeButton href="/client" label="Back to Dashboard" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111] flex items-center gap-3">
            <Shield className="w-8 h-8 text-sky-600" />
            Client Verification
          </h1>
          <p className="text-[#333] mt-1">Verify your account to build trust with workers</p>
        </div>

        {/* Payment Verification */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-sky-600" />
              <div>
                <h3 className="text-lg font-bold text-[#111]">Payment Verification</h3>
                <p className="text-sm text-[#333]">Verify your payment method to enable escrow payments</p>
              </div>
            </div>
            {verificationStatus?.paymentStatus && getStatusBadge(verificationStatus.paymentStatus)}
          </div>

          {verificationStatus?.paymentStatus !== 'verified' && (
            <div className="mt-4">
              <p className="text-sm text-[#333] mb-4">
                Verify your payment method to enable secure escrow payments. This helps build trust with workers.
              </p>
              <button
                onClick={handlePaymentVerification}
                disabled={processing}
                className="px-6 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition disabled:opacity-50 font-semibold"
              >
                {processing ? 'Verifying...' : 'Verify Payment Method'}
              </button>
              <p className="text-xs text-[#333] mt-2">
                Demo mode: This will use a mock verification. Real integration will be enabled when investors are ready.
              </p>
            </div>
          )}
        </div>

        {/* Business Verification (Optional) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-sky-600" />
              <div>
                <h3 className="text-lg font-bold text-[#111]">Business Verification (Optional)</h3>
                <p className="text-sm text-[#333]">Verify your business for enterprise features</p>
              </div>
            </div>
            {verificationStatus?.businessStatus && getStatusBadge(verificationStatus.businessStatus)}
          </div>

          {verificationStatus?.businessStatus !== 'verified' && (
            <div className="mt-4">
              <p className="text-sm text-[#333] mb-4">
                Upload business documents to verify your business. This is optional but recommended for enterprise clients.
              </p>
              <button
                disabled
                className="px-6 py-2 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed font-semibold"
              >
                Coming Soon
              </button>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-sky-50 border border-sky-200 rounded-xl p-6">
          <h4 className="font-semibold text-[#111] mb-3">Benefits of Verification</h4>
          <ul className="space-y-2 text-sm text-[#333]">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Build trust with verified workers
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Access to escrow payment protection
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Verified badge on your profile
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

