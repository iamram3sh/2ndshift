'use client'

import { useState } from 'react'
import { Check, Crown, Zap, Loader2, ArrowRight } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { useTranslation } from '@/lib/i18n'

interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  price_monthly_inr: number
  platform_fee_percent: number
  free_shifts_monthly: number
  features: string[]
  is_active: boolean
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan
  userType: 'worker' | 'client'
  currentPlanId?: string
  onSubscribe?: (planId: string) => void
}

export function SubscriptionCard({
  plan,
  userType,
  currentPlanId,
  onSubscribe,
}: SubscriptionCardProps) {
  const { t } = useTranslation()
  const [isSubscribing, setIsSubscribing] = useState(false)
  
  // Map plan slugs to i18n keys
  const getPlanKey = (slug: string) => {
    const slugLower = slug.toLowerCase()
    if (userType === 'worker') {
      if (slugLower.includes('starter')) return 'subscriptions.worker.starter'
      if (slugLower.includes('pro')) return 'subscriptions.worker.pro'
      if (slugLower.includes('elite')) return 'subscriptions.worker.elite'
    } else {
      if (slugLower.includes('growth')) return 'subscriptions.client.growth'
      if (slugLower.includes('agency')) return 'subscriptions.client.agency'
    }
    return null
  }
  
  const planKey = getPlanKey(plan.slug)

  const handleSubscribe = async () => {
    if (plan.id === currentPlanId) return

    setIsSubscribing(true)
    try {
      const result = await apiClient.subscribeToPlan(plan.id)
      if (result.data) {
        onSubscribe?.(plan.id)
        if (result.data.demo) {
          window.alert('Demo subscription activated! In production, this would integrate with Razorpay/Stripe.')
        }
      } else {
        alert(result.error?.message || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      window.alert('Failed to subscribe')
    } finally {
      setIsSubscribing(false)
    }
  }

  const isCurrentPlan = plan.id === currentPlanId
  const priceInRupees = plan.price_monthly_inr / 100

  return (
    <div
      className={`relative p-6 rounded-xl border-2 transition-all ${
        isCurrentPlan
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Current Plan
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {plan.name.toLowerCase().includes('expert') || plan.name.toLowerCase().includes('enterprise') || plan.name.toLowerCase().includes('elite') ? (
            <Crown className="w-5 h-5 text-amber-500" />
          ) : (
            <Zap className="w-5 h-5 text-slate-600" />
          )}
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              {planKey ? t(`${planKey}.title`) : plan.name}
            </h3>
            {planKey && (
              <p className="text-xs text-slate-500 mt-0.5">
                {t(`${planKey}.tagline`)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          {priceInRupees === 0 ? (
            <span className="text-3xl font-bold text-slate-900">Free</span>
          ) : (
            <>
              <span className="text-3xl font-bold text-slate-900">₹{priceInRupees.toLocaleString()}</span>
              <span className="text-slate-600">/month</span>
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 p-2 bg-slate-50 rounded-lg">
          <span className="text-sm text-slate-600">Platform Fee:</span>
          <span className="font-semibold text-slate-900">
            {plan.platform_fee_percent}%
          </span>
        </div>
        {plan.free_shifts_monthly > 0 && (
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">
              {plan.free_shifts_monthly} Shifts/month included
            </span>
          </div>
        )}
      </div>

      <ul className="space-y-2 mb-6">
        {(() => {
          if (planKey) {
            const bulletsKey = `${planKey}.bullets`
            const bullets = t(bulletsKey)
            const features = Array.isArray(bullets) ? bullets : plan.features
            return features.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-700">{feature}</span>
              </li>
            ))
          }
          return plan.features.map((feature: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-slate-700">{feature}</span>
            </li>
          ))
        })()}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={isCurrentPlan || isSubscribing}
        className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          isCurrentPlan
            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSubscribing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          <>
            {planKey ? t(`${planKey}.cta`) : 'Subscribe Now'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  )
}
