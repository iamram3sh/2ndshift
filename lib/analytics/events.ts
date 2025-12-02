/**
 * Analytics Events
 * Centralized analytics event tracking
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, params)
  }

  // Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    })
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, params)
  }
}

// Revenue events
export function trackCreditsPurchased(amount: number, credits: number, packageId: string) {
  trackEvent('credits_purchased', {
    amount,
    credits,
    package_id: packageId,
    currency: 'INR',
  })
}

export function trackJobPosted(jobId: string, price: number, category?: string) {
  trackEvent('job_posted', {
    job_id: jobId,
    price,
    category,
    currency: 'INR',
  })
}

export function trackJobApplied(jobId: string, jobPrice: number, proposedPrice?: number) {
  trackEvent('job_applied', {
    job_id: jobId,
    job_price: jobPrice,
    proposed_price: proposedPrice,
    currency: 'INR',
  })
}

export function trackJobFunded(jobId: string, amount: number, escrowId: string) {
  trackEvent('job_funded', {
    job_id: jobId,
    amount,
    escrow_id: escrowId,
    currency: 'INR',
  })
}

export function trackJobApproved(jobId: string, amount: number, commission: number) {
  trackEvent('job_approved', {
    job_id: jobId,
    amount,
    commission,
    currency: 'INR',
  })
}

export function trackSubscriptionStarted(planId: string, planName: string, price: number) {
  trackEvent('subscription_started', {
    plan_id: planId,
    plan_name: planName,
    price,
    currency: 'INR',
  })
}

export function trackProfileBoosted(userId: string, creditsUsed: number) {
  trackEvent('profile_boosted', {
    user_id: userId,
    credits_used: creditsUsed,
  })
}

export function trackRoleSelected(role: 'worker' | 'client', source: string) {
  trackEvent('role_selected', {
    role,
    source,
  })
}
