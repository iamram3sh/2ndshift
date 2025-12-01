// ============================================
// 2NDSHIFT - SHIFTS & SUBSCRIPTION TYPES
// ============================================

export type ShiftsTransactionType =
  | 'purchase'
  | 'free_credit'
  | 'referral_bonus'
  | 'promo_credit'
  | 'boost_profile'
  | 'boost_application'
  | 'direct_message'
  | 'feature_job'
  | 'urgent_badge'
  | 'direct_invite'
  | 'ai_recommendation'
  | 'refund'
  | 'expired'

export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'past_due'
  | 'expired'
  | 'trial'

export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded'

export type BoostType = 'profile' | 'job' | 'application'

export interface ShiftsBalance {
  id: string
  user_id: string
  balance: number
  free_balance: number
  lifetime_purchased: number
  lifetime_used: number
  last_free_credit_at: string | null
  created_at: string
  updated_at: string
}

export interface ShiftsTransaction {
  id: string
  user_id: string
  type: ShiftsTransactionType
  amount: number
  balance_after: number
  description: string | null
  reference_id: string | null
  reference_type: string | null
  payment_id: string | null
  created_at: string
}

export interface ShiftsPackage {
  id: string
  name: string
  shifts_amount: number
  price_inr: number // In paise
  user_type: 'worker' | 'client' | 'both'
  is_popular: boolean
  discount_percent: number
  is_active: boolean
  created_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  user_type: 'worker' | 'client'
  price_monthly_inr: number // In paise
  price_yearly_inr: number | null
  platform_fee_percent: number
  free_shifts_monthly: number
  features: string[]
  is_active: boolean
  created_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  plan?: SubscriptionPlan
  status: SubscriptionStatus
  razorpay_subscription_id: string | null
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  cancelled_at: string | null
  trial_end: string | null
  created_at: string
  updated_at: string
}

export interface ShiftsPurchase {
  id: string
  user_id: string
  package_id: string
  package?: ShiftsPackage
  shifts_amount: number
  amount_paid: number // In paise
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  status: PaymentStatus
  created_at: string
  completed_at: string | null
}

export interface Boost {
  id: string
  user_id: string
  boost_type: BoostType
  reference_id: string | null
  shifts_used: number
  started_at: string
  expires_at: string
  is_active: boolean
  impressions: number
  clicks: number
  created_at: string
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface PurchaseShiftsRequest {
  package_id: string
}

export interface PurchaseShiftsResponse {
  order_id: string
  amount: number
  currency: string
  key: string
  package: ShiftsPackage
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  purchase_id: string
}

export interface UseShiftsRequest {
  type: ShiftsTransactionType
  amount: number
  reference_id?: string
  reference_type?: string
  description?: string
}

export interface UseShiftsResponse {
  success: boolean
  new_balance: number
  transaction_id: string
}

export interface BoostRequest {
  boost_type: BoostType
  reference_id?: string
  duration_days: number
}

export interface BoostResponse {
  success: boolean
  boost: Boost
  new_balance: number
}

// ============================================
// SHIFTS COSTS CONFIGURATION
// ============================================

export const SHIFTS_COSTS = {
  // Worker actions
  boost_application: 2,
  boost_profile_week: 5,
  direct_message: 1,
  
  // Client actions
  feature_job_week: 3,
  urgent_badge: 2,
  direct_invite: 1,
  ai_recommendation: 5,
} as const

export const BOOST_DURATIONS = {
  profile: 7, // days
  job: 7,
  application: 0, // instant, no duration
} as const
