// Referral System for 2ndShift

export interface ReferralCode {
  code: string
  userId: string
  createdAt: Date
  uses: number
  maxUses?: number
}

export interface ReferralReward {
  type: 'worker' | 'client'
  referrer: {
    bonus: number // in rupees
    description: string
  }
  referee: {
    bonus: number
    description: string
  }
}

// Referral rewards configuration
export const referralRewards: Record<string, ReferralReward> = {
  worker: {
    type: 'worker',
    referrer: {
      bonus: 500,
      description: 'Get ₹500 when your friend completes their first project',
    },
    referee: {
      bonus: 500,
      description: 'Get ₹500 bonus on your first project completion',
    },
  },
  client: {
    type: 'client',
    referrer: {
      bonus: 1000,
      description: 'Get ₹1000 when your referred company makes their first hire',
    },
    referee: {
      bonus: 1000,
      description: 'Get ₹1000 credit on your first hire',
    },
  },
}

// Generate unique referral code
export function generateReferralCode(userName: string, userId: string): string {
  const namePart = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${namePart}${randomPart}`
}

// Validate referral code format
export function isValidReferralCode(code: string): boolean {
  return /^[A-Z0-9]{4,10}$/.test(code)
}

// Calculate referral bonus
export function calculateReferralBonus(
  userType: 'worker' | 'client',
  isReferrer: boolean
): number {
  const reward = referralRewards[userType]
  return isReferrer ? reward.referrer.bonus : reward.referee.bonus
}

// Get referral description
export function getReferralDescription(
  userType: 'worker' | 'client',
  isReferrer: boolean
): string {
  const reward = referralRewards[userType]
  return isReferrer ? reward.referrer.description : reward.referee.description
}

// Referral tracking event
export interface ReferralEvent {
  referrerId: string
  refereeId: string
  refereeType: 'worker' | 'client'
  status: 'pending' | 'completed' | 'paid'
  bonusAmount: number
  completedAt?: Date
  paidAt?: Date
}

// Check if user is eligible for referral bonus
export function isEligibleForBonus(
  referralEvent: ReferralEvent,
  projectsCompleted: number,
  hiresCompleted: number
): boolean {
  if (referralEvent.status !== 'pending') return false

  if (referralEvent.refereeType === 'worker') {
    return projectsCompleted >= 1
  } else {
    return hiresCompleted >= 1
  }
}

// Referral stats for dashboard
export interface ReferralStats {
  totalReferrals: number
  pendingBonuses: number
  completedBonuses: number
  totalEarned: number
  referralCode: string
}

// Share referral code helpers
export function getShareUrl(referralCode: string, baseUrl: string): string {
  return `${baseUrl}/register?ref=${referralCode}`
}

export function getShareText(userName: string, userType: 'worker' | 'client'): string {
  if (userType === 'worker') {
    return `Join 2ndShift and earn ₹500 on your first project! Use my referral code and get started with legal, tax-compliant freelancing. 🚀`
  } else {
    return `Hire verified talent on 2ndShift and get ₹1000 credit! Use my referral code for your first hire. 100% tax-compliant. 🎯`
  }
}

export function getShareLinks(referralCode: string, baseUrl: string) {
  const shareUrl = getShareUrl(referralCode, baseUrl)
  const encodedUrl = encodeURIComponent(shareUrl)
  
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Join 2ndShift using my code: ${referralCode}\n${shareUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent('Join 2ndShift and earn extra income legally!')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent('Join 2ndShift')}&body=${encodeURIComponent(`Join 2ndShift using my referral code: ${referralCode}\n\n${shareUrl}`)}`,
    copy: shareUrl,
  }
}
