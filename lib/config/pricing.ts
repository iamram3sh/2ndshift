/**
 * Pricing Configuration with Fallbacks
 * Used when backend platform_config is unavailable or returns null/zero
 */

export const PLATFORM_FEE_CONFIG = {
  // Quick tasks (low complexity)
  quick: {
    commission: 0.05, // 5%
    promoFirstThree: 0.00, // 0% for first 3 jobs
  },
  // Medium tasks
  medium: {
    commission: 0.10, // 10%
    promoFirstThree: 0.00,
  },
  // High-value tasks
  high: {
    commission: 0.15, // 15%
    promoFirstThree: 0.00,
  },
  // Default fallback
  default: {
    commission: 0.10, // 10%
    promoFirstThree: 0.00,
  },
}

/**
 * Get platform fee based on job difficulty/complexity
 * Falls back to default if difficulty not provided
 */
export function getPlatformFee(job?: {
  difficulty?: 'low' | 'medium' | 'high'
  complexity?: 'low' | 'medium' | 'high'
  platformFee?: number | null
}): number {
  // If platformFee is explicitly set and not null/zero, use it
  if (job?.platformFee != null && job.platformFee > 0) {
    return job.platformFee
  }

  // Determine difficulty
  const difficulty = job?.difficulty || job?.complexity || 'medium'
  
  // Get config based on difficulty
  const config = 
    difficulty === 'low' ? PLATFORM_FEE_CONFIG.quick :
    difficulty === 'high' ? PLATFORM_FEE_CONFIG.high :
    PLATFORM_FEE_CONFIG.medium

  return config.commission
}

/**
 * Get commission percentage for display
 * Returns formatted string like "15%" or "0% (promo)"
 */
export function getCommissionDisplay(
  commission: number,
  isPromo: boolean = false
): string {
  if (commission === 0 && isPromo) {
    return '0% (promo)'
  }
  return `${(commission * 100).toFixed(0)}%`
}

/**
 * Format currency for Indian locale
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}
