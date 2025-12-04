'use client'

import { Crown, Zap, Check, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import apiClient from '@/lib/apiClient'

interface SubscriptionUpsellProps {
  userType: 'worker' | 'client'
  currentPlan?: string | null
  onSubscribe?: () => void
}

export function SubscriptionUpsell({ userType, currentPlan, onSubscribe }: SubscriptionUpsellProps) {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [userType])

  const fetchPlans = async () => {
    try {
      const result = await apiClient.getSubscriptionPlans(userType)
      if (result.data) {
        // Filter to show only paid plans (Pro/Elite for workers, Growth/Agency for clients)
        if (result.data && typeof result.data === 'object' && 'plans' in result.data) {
          const paidPlans = (result.data as any).plans.filter((p: any) => p.price_monthly_inr > 0)
          setPlans(paidPlans.slice(0, 2)) // Show top 2 plans
        }
      }
    } catch (err) {
      console.error('Error fetching plans:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (paise: number) => {
    return `₹${(paise / 100).toFixed(0)}`
  }

  if (loading || plans.length === 0) return null

  if (userType === 'worker') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold">Upgrade Your Plan</h3>
        </div>
        <p className="text-slate-300 text-sm mb-6">
          Lower commission rates, more credits, and premium features
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{plan.name}</h4>
                <span className="text-amber-400 font-bold">
                  {formatPrice(plan.price_monthly_inr)}/mo
                </span>
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300 mb-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{plan.platform_fee_percent}% commission</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{plan.free_shifts_monthly} Credits/month</span>
                </li>
                {plan.features && Array.isArray(plan.features) && plan.features.slice(0, 2).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSubscribe?.()}
                className="w-full bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Client view
  return (
    <div className="bg-gradient-to-br from-sky-500 to-[#0b63ff] rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-amber-300" />
        <h3 className="text-lg font-semibold">Client Subscriptions</h3>
      </div>
      <p className="text-white/90 text-sm mb-6">
        Save on commission fees and get premium features
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{plan.name}</h4>
              <span className="text-amber-300 font-bold">
                {formatPrice(plan.price_monthly_inr)}/mo
              </span>
            </div>
            <ul className="space-y-1.5 text-sm text-white/90 mb-4">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>0% commission</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{plan.free_shifts_monthly} Credits/month</span>
              </li>
              {plan.features && Array.isArray(plan.features) && plan.features.slice(0, 2).map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSubscribe?.()}
              className="w-full bg-white text-sky-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
