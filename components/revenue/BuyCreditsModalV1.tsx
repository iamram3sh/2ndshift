'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Check, Loader2, Shield } from 'lucide-react'
import apiClient from '@/lib/apiClient'

interface Package {
  id: string
  name: string
  shifts_amount: number
  price_inr: number
  is_popular?: boolean
  discount_percent?: number
}

interface BuyCreditsModalV1Props {
  isOpen: boolean
  onClose: () => void
  userId?: string
  userType?: 'worker' | 'client'
  currentBalance?: number
  onPurchaseComplete?: (newBalance: number) => void
}

export function BuyCreditsModalV1({
  isOpen,
  onClose,
  userId,
  userType = 'worker',
  currentBalance = 0,
  onPurchaseComplete,
}: BuyCreditsModalV1Props) {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchPackages()
    }
  }, [isOpen, userType])

  const fetchPackages = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch from v1 API
      const response = await fetch(`/api/v1/credits/packages?user_type=${userType}`)
      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
      } else {
        setError('Failed to load packages')
      }
    } catch (err) {
      console.error('Error fetching packages:', err)
      setError('Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (pkg: Package) => {
    if (!userId) {
      setError('User ID is required')
      return
    }

    setPurchasing(pkg.id)
    setError(null)

    try {
      // Use v1 API for purchase (expects package_id)
      const result = await apiClient.purchaseCredits({ 
        package_id: pkg.id
      } as any)

      if (result.error) {
        throw new Error(result.error.message || 'Purchase failed')
      }

      // In demo mode, credits are auto-added
      if (result.data?.demo || result.data?.status === 'completed') {
        // Refresh balance
        const balanceResult = await apiClient.getCreditsBalance()
        if (balanceResult.data) {
          onPurchaseComplete?.(balanceResult.data.balance)
        }
        onClose()
      } else {
        // Real payment flow would go here
        setError('Real payment integration not yet implemented')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setPurchasing(null)
    }
  }

  if (!isOpen) return null

  const formatPrice = (paise: number) => {
    return `₹${(paise / 100).toFixed(0)}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Buy Shift Credits</h2>
              <p className="text-sm text-slate-500">Current balance: {currentBalance} Credits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={!!purchasing}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative border-2 rounded-xl p-6 ${
                    pkg.is_popular
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {pkg.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                      Popular
                    </div>
                  )}

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span className="text-3xl font-bold text-slate-900">
                        {pkg.shifts_amount}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Credits</p>
                    <div className="text-2xl font-bold text-slate-900 mb-6">
                      {formatPrice(pkg.price_inr)}
                    </div>
                    <button
                      onClick={() => handlePurchase(pkg)}
                      disabled={purchasing === pkg.id}
                      className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
                        pkg.is_popular
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {purchasing === pkg.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        'Buy Now'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">What are Shift Credits?</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>3 Credits per job application</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Refunded if client doesn't view your proposal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Use for profile boosts and featured listings</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4" />
            <span>Secure payment via demo mode (staging)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
