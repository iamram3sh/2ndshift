'use client'

import { useState, useEffect } from 'react'
import { Crown, Zap, ArrowRight, Loader2 } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { SubscriptionCard } from './SubscriptionCard'

interface SubscriptionUpsellSectionProps {
  userId?: string
  userType?: 'worker' | 'client'
}

export function SubscriptionUpsellSection({
  userId,
  userType = 'worker',
}: SubscriptionUpsellSectionProps) {
  const [plans, setPlans] = useState<any[]>([])
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchPlans()
      fetchCurrentSubscription()
    }
  }, [userId, userType])

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const result = await apiClient.getSubscriptionPlans(userType)
      if (result.data) {
        // Show only paid plans (skip free plan)
        if (result.data && typeof result.data === 'object' && 'plans' in result.data) {
          setPlans((result.data as any).plans.filter((p: any) => p.price_monthly_inr > 0).slice(0, 2))
        }
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentSubscription = async () => {
    if (!userId) return
    // TODO: Add endpoint to get current subscription
    // For now, assume no subscription
    setCurrentPlanId(undefined)
  }

  if (loading || plans.length === 0) {
    return null
  }

  const title = userType === 'worker' 
    ? 'Upgrade Your Plan' 
    : 'Save on Platform Fees'
  const description = userType === 'worker'
    ? 'Lower commission rates, more Shifts, and premium features'
    : '0% platform fee with Growth plan. Save on every project.'

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-5 h-5 text-amber-400" />
        <span className="font-semibold">{title}</span>
      </div>
      <p className="text-slate-300 text-sm mb-4">
        {description}
      </p>
      <div className="space-y-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-3 bg-white/10 rounded-lg border border-white/20"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{plan.name}</span>
              <span className="text-sm font-semibold">
                ₹{plan.price_monthly_inr / 100}/mo
              </span>
            </div>
            <div className="text-xs text-slate-300">
              {plan.platform_fee_percent}% commission • {plan.free_shifts_monthly} Shifts/month
            </div>
          </div>
        ))}
      </div>
      <a
        href="/pricing"
        className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-amber-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
      >
        View All Plans
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  )
}
