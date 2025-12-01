'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, X, Crown, Rocket, MessageSquare, Send, Sparkles, 
  CheckCircle, ArrowRight, Shield, Loader2 
} from 'lucide-react'
import type { ShiftsPackage } from '@/types/shifts'

interface ShiftsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userType: 'worker' | 'client'
  currentBalance: number
  onPurchaseComplete?: (newBalance: number) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function ShiftsModal({ 
  isOpen, 
  onClose, 
  userId, 
  userType, 
  currentBalance,
  onPurchaseComplete 
}: ShiftsModalProps) {
  const [packages, setPackages] = useState<ShiftsPackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Razorpay script
  useEffect(() => {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script')
      script.id = 'razorpay-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // Fetch packages
  useEffect(() => {
    if (isOpen) {
      fetchPackages()
    }
  }, [isOpen, userType])

  const fetchPackages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/shifts/packages?userType=${userType}`)
      const data = await response.json()
      if (response.ok) {
        setPackages(data.packages || [])
      }
    } catch (err) {
      console.error('Error fetching packages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!selectedPackage) return

    setIsPurchasing(true)
    setError(null)

    try {
      // Create order
      const orderResponse = await fetch('/api/shifts/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: selectedPackage,
          user_id: userId,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: '2ndShift',
        description: `${orderData.package.shifts_amount} Shifts`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/shifts/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              purchase_id: orderData.purchase_id,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyResponse.ok) {
            onPurchaseComplete?.(verifyData.new_balance)
            onClose()
          } else {
            setError(verifyData.error || 'Payment verification failed')
          }
          setIsPurchasing(false)
        },
        modal: {
          ondismiss: () => {
            setIsPurchasing(false)
          },
        },
        theme: {
          color: '#0f172a',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsPurchasing(false)
    }
  }

  if (!isOpen) return null

  const workerFeatures = [
    { icon: Rocket, title: 'Spotlight Application', cost: 2, description: 'Your application appears first' },
    { icon: Crown, title: 'Profile Boost', cost: 5, description: 'Appear in featured professionals for 7 days' },
    { icon: MessageSquare, title: 'Direct Message', cost: 1, description: 'Contact clients directly' },
  ]

  const clientFeatures = [
    { icon: Crown, title: 'Featured Job', cost: 3, description: 'Your job appears at the top for 7 days' },
    { icon: Zap, title: 'Urgent Badge', cost: 2, description: 'Get faster applications' },
    { icon: Send, title: 'Direct Invite', cost: 1, description: 'Invite specific professionals' },
    { icon: Sparkles, title: 'AI Recommendations', cost: 5, description: 'Get personalized talent matches' },
  ]

  const features = userType === 'worker' ? workerFeatures : clientFeatures

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Get Shifts</h2>
                <p className="text-sm text-slate-500">Current balance: {currentBalance} Shifts</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              disabled={isPurchasing}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Features */}
          <div className="space-y-3 mb-6">
            <h3 className="font-medium text-slate-900 mb-3">What you can do with Shifts:</h3>
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <feature.icon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{feature.title}</span>
                    <span className="text-xs text-amber-600 font-medium">{feature.cost} Shifts</span>
                  </div>
                  <div className="text-sm text-slate-500">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Packages */}
          <h3 className="font-medium text-slate-900 mb-3">Choose a package:</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  disabled={isPurchasing}
                  className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all disabled:opacity-50 ${
                    selectedPackage === pkg.id
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20'
                      : pkg.is_popular 
                        ? 'border-amber-300 bg-amber-50/50' 
                        : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPackage === pkg.id ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                    }`}>
                      {selectedPackage === pkg.id && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{pkg.shifts_amount}</div>
                    <div className="text-left">
                      <div className="font-medium text-slate-900">Shifts</div>
                      <div className="text-xs text-slate-500">
                        ₹{(pkg.price_inr / pkg.shifts_amount / 100).toFixed(2)} per shift
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-slate-900">
                      ₹{(pkg.price_inr / 100).toLocaleString()}
                    </div>
                    {pkg.discount_percent > 0 && (
                      <div className="text-xs text-emerald-600 font-medium">
                        Save {pkg.discount_percent}%
                      </div>
                    )}
                    {pkg.is_popular && !pkg.discount_percent && (
                      <div className="text-xs text-amber-600 font-medium">Most Popular</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={!selectedPackage || isPurchasing}
            className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isPurchasing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : selectedPackage ? (
              <>
                Purchase {packages.find(p => p.id === selectedPackage)?.shifts_amount} Shifts
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              'Select a package'
            )}
          </button>

          {/* Trust Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4" />
            <span>Secure payment via Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  )
}
