'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Crown, Rocket, MessageSquare, Send, Sparkles, X, CheckCircle, ArrowRight, Shield } from 'lucide-react'

interface ShiftPackage {
  shifts: number
  price: number
  perShift: number
  popular?: boolean
  save?: string
}

const WORKER_PACKAGES: ShiftPackage[] = [
  { shifts: 10, price: 99, perShift: 9.9 },
  { shifts: 25, price: 199, perShift: 7.96, popular: true },
  { shifts: 50, price: 349, perShift: 6.98, save: '30%' },
  { shifts: 100, price: 599, perShift: 5.99, save: '40%' },
]

const CLIENT_PACKAGES: ShiftPackage[] = [
  { shifts: 10, price: 149, perShift: 14.9 },
  { shifts: 25, price: 299, perShift: 11.96, popular: true },
  { shifts: 50, price: 499, perShift: 9.98, save: '30%' },
  { shifts: 100, price: 849, perShift: 8.49, save: '40%' },
]

interface ShiftsModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number
  userType: 'worker' | 'client'
  onPurchase?: (packageIndex: number) => void
}

export function ShiftsModal({ isOpen, onClose, currentBalance, userType, onPurchase }: ShiftsModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)

  if (!isOpen) return null

  const packages = userType === 'worker' ? WORKER_PACKAGES : CLIENT_PACKAGES

  const workerFeatures = [
    { icon: Rocket, title: 'Spotlight Application', description: '2 Shifts - Your application appears first' },
    { icon: Crown, title: 'Profile Boost', description: '5 Shifts/week - Appear in featured professionals' },
    { icon: MessageSquare, title: 'Direct Message', description: '1 Shift - Contact clients directly' },
  ]

  const clientFeatures = [
    { icon: Crown, title: 'Featured Job Listing', description: '3 Shifts/week - Your job appears at the top' },
    { icon: Zap, title: 'Urgent Badge', description: '2 Shifts - Mark job as urgent, get faster applications' },
    { icon: Send, title: 'Direct Invite', description: '1 Shift - Invite specific professionals to apply' },
    { icon: Sparkles, title: 'AI Recommendations', description: '5 Shifts - Get personalized talent matches' },
  ]

  const features = userType === 'worker' ? workerFeatures : clientFeatures

  const handlePurchase = async () => {
    if (selectedPackage === null) return
    setIsPurchasing(true)
    
    // Simulate purchase - in real app, this would call payment API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (onPurchase) {
      onPurchase(selectedPackage)
    }
    
    setIsPurchasing(false)
    setSelectedPackage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl animate-scale-in">
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
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Features */}
          <div className="space-y-3 mb-6">
            <h3 className="font-medium text-slate-900 mb-3">What you can do with Shifts:</h3>
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <feature.icon className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">{feature.title}</div>
                  <div className="text-sm text-slate-500">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Packages */}
          <h3 className="font-medium text-slate-900 mb-3">Choose a package:</h3>
          <div className="space-y-3">
            {packages.map((pkg, i) => (
              <button
                key={pkg.shifts}
                onClick={() => setSelectedPackage(i)}
                className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
                  selectedPackage === i
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20'
                    : pkg.popular 
                      ? 'border-amber-300 bg-amber-50/50' 
                      : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === i ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                  }`}>
                    {selectedPackage === i && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{pkg.shifts}</div>
                  <div className="text-left">
                    <div className="font-medium text-slate-900">Shifts</div>
                    <div className="text-xs text-slate-500">₹{pkg.perShift.toFixed(2)} per shift</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-900">₹{pkg.price}</div>
                  {pkg.save && (
                    <div className="text-xs text-emerald-600 font-medium">Save {pkg.save}</div>
                  )}
                  {pkg.popular && !pkg.save && (
                    <div className="text-xs text-amber-600 font-medium">Most Popular</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={selectedPackage === null || isPurchasing}
            className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isPurchasing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : selectedPackage !== null ? (
              <>
                Purchase {packages[selectedPackage].shifts} Shifts
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

interface ShiftsBalanceProps {
  balance: number
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function ShiftsBalance({ balance, onClick, size = 'md' }: ShiftsBalanceProps) {
  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs' 
    : 'px-3 py-1.5 text-sm'

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all ${sizeClasses}`}
    >
      <Zap className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{balance} Shifts</span>
    </button>
  )
}

interface UseShiftsButtonProps {
  action: string
  cost: number
  disabled?: boolean
  onUse?: () => void
  variant?: 'primary' | 'secondary'
}

export function UseShiftsButton({ action, cost, disabled, onUse, variant = 'primary' }: UseShiftsButtonProps) {
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
  
  const variantClasses = variant === 'primary'
    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
    : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"

  return (
    <button
      onClick={onUse}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Zap className="w-4 h-4" />
      <span>{action}</span>
      <span className="opacity-75">({cost} {cost === 1 ? 'Shift' : 'Shifts'})</span>
    </button>
  )
}

// Promo Card for featuring Shifts
interface ShiftsPromoCardProps {
  userType: 'worker' | 'client'
  onGetShifts: () => void
}

export function ShiftsPromoCard({ userType, onGetShifts }: ShiftsPromoCardProps) {
  const workerBenefits = [
    { icon: Rocket, text: 'Boost Applications' },
    { icon: Crown, text: 'Featured Profile' },
    { icon: MessageSquare, text: 'Direct Messages' },
  ]

  const clientBenefits = [
    { icon: Crown, text: 'Featured Listing' },
    { icon: Sparkles, text: 'AI Recommendations' },
    { icon: Send, text: 'Direct Invites' },
  ]

  const benefits = userType === 'worker' ? workerBenefits : clientBenefits
  const title = userType === 'worker' 
    ? 'Stand out from the crowd' 
    : 'Find top talent faster'
  const description = userType === 'worker'
    ? 'Use Shifts to boost your applications, appear in featured listings, and get noticed by top clients.'
    : 'Use Shifts to feature your jobs, get AI-powered recommendations, and directly invite the best professionals.'

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shifts-promo-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full text-sm font-medium mb-4 shifts-badge">
            <Zap className="w-4 h-4" />
            Shifts
          </div>
          <h3 className="text-xl font-semibold mb-2 shifts-title">{title}</h3>
          <p className="text-sm mb-4 shifts-description">{description}</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onGetShifts}
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-all"
            >
              <Zap className="w-4 h-4" />
              Get Shifts
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm font-medium shifts-learn-more"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end gap-3">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <benefit.icon className="w-4 h-4 text-amber-400" />
              <span className="shifts-benefit">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
