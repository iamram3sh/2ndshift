'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Check, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Package {
  id: string
  name: string
  shifts_amount: number
  price_inr: number
  is_popular?: boolean
}

interface BuyCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  userType?: 'worker' | 'client'
  onPurchaseComplete?: () => void
}

export function BuyCreditsModal({
  isOpen,
  onClose,
  userId,
  userType = 'worker',
  onPurchaseComplete,
}: BuyCreditsModalProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchPackages()
    }
  }, [isOpen, userType])

  const fetchPackages = async () => {
    try {
      const response = await fetch(`/api/shifts/packages?userType=${userType}`)
      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (pkg: Package) => {
    if (!userId) {
      // Get user from auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.alert('Please sign in to purchase Shifts')
        return
      }
      userId = user.id
    }

    setPurchasing(pkg.id)

    try {
      const response = await fetch('/api/shifts/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg.id,
          user_id: userId,
        }),
      })

      const data = await response.json()

      if (data.order_id) {
        // Initialize Razorpay
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const options = {
            key: data.key,
            amount: data.amount,
            currency: data.currency,
            name: '2ndShift',
            description: `Purchase ${pkg.shifts_amount} Shifts`,
            order_id: data.order_id,
            handler: async (response: any) => {
              // Verify payment
              const verifyResponse = await fetch('/api/shifts/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  purchase_id: data.purchase_id,
                }),
              })

              if (verifyResponse.ok) {
                window.alert('Shifts purchased successfully!')
                onPurchaseComplete?.()
                onClose()
              } else {
                window.alert('Payment verification failed')
              }
            },
            prefill: {
              email: '',
              contact: '',
            },
            theme: {
              color: '#0f172a',
            },
          }

          const razorpay = new (window as any).Razorpay(options)
          razorpay.open()
        }
        document.body.appendChild(script)
      } else {
        window.alert(data.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Error purchasing:', error)
      window.alert('Failed to process purchase')
    } finally {
      setPurchasing(null)
    }
  }

  if (!isOpen) return null

  const formatPrice = (paise: number) => {
    return `₹${(paise / 100).toFixed(0)}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Buy Shifts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
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
                    <p className="text-sm text-slate-600 mb-4">Shifts</p>
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
            <h3 className="font-semibold text-slate-900 mb-2">What are Shifts?</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>3 Shifts per job application</span>
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
        </div>
      </div>
    </div>
  )
}

