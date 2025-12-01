// ============================================
// 2NDSHIFT - FEATURE GATING SYSTEM
// Controls access to premium features
// ============================================

import { supabaseAdmin } from './supabase/admin'

export interface FeatureAccess {
  hasAccess: boolean
  reason?: string
  requiredPlan?: string
  shiftsCost?: number
}

// Feature definitions
export const FEATURES = {
  // Worker features
  PROFILE_BOOST: {
    id: 'profile_boost',
    name: 'Profile Boost',
    description: 'Get featured in search results for 7 days',
    shiftsCost: 5,
    requiresSubscription: false,
    minPlan: null,
  },
  APPLICATION_BOOST: {
    id: 'application_boost',
    name: 'Spotlight Application',
    description: 'Make your application stand out',
    shiftsCost: 2,
    requiresSubscription: false,
    minPlan: null,
  },
  DIRECT_MESSAGE_WORKER: {
    id: 'direct_message_worker',
    name: 'Direct Message',
    description: 'Message clients directly',
    shiftsCost: 1,
    requiresSubscription: false,
    minPlan: null,
  },
  SKILLS_VERIFICATION: {
    id: 'skills_verification',
    name: 'Skills Verification',
    description: 'Verify your skills with badges',
    shiftsCost: 0,
    requiresSubscription: true,
    minPlan: 'worker-professional',
  },
  EXPERT_BADGE: {
    id: 'expert_badge',
    name: 'Expert Badge',
    description: 'Display Expert status on your profile',
    shiftsCost: 0,
    requiresSubscription: true,
    minPlan: 'worker-expert',
  },
  
  // Client features
  FEATURE_JOB: {
    id: 'feature_job',
    name: 'Featured Job',
    description: 'Pin your job at the top for 7 days',
    shiftsCost: 3,
    requiresSubscription: false,
    minPlan: null,
  },
  URGENT_BADGE: {
    id: 'urgent_badge',
    name: 'Urgent Badge',
    description: 'Mark job as urgent for faster applications',
    shiftsCost: 2,
    requiresSubscription: false,
    minPlan: null,
  },
  DIRECT_INVITE: {
    id: 'direct_invite',
    name: 'Direct Invite',
    description: 'Invite specific professionals to your job',
    shiftsCost: 1,
    requiresSubscription: false,
    minPlan: null,
  },
  AI_RECOMMENDATIONS: {
    id: 'ai_recommendations',
    name: 'AI Recommendations',
    description: 'Get AI-powered talent matches',
    shiftsCost: 5,
    requiresSubscription: true,
    minPlan: 'client-business',
  },
  ADVANCED_ANALYTICS: {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Detailed hiring analytics and insights',
    shiftsCost: 0,
    requiresSubscription: true,
    minPlan: 'client-business',
  },
  CUSTOM_API: {
    id: 'custom_api',
    name: 'Custom API Access',
    description: 'Integrate with your systems via API',
    shiftsCost: 0,
    requiresSubscription: true,
    minPlan: 'client-enterprise',
  },
} as const

export type FeatureId = keyof typeof FEATURES

// Plan hierarchy for comparison
const PLAN_HIERARCHY: Record<string, number> = {
  'worker-free': 0,
  'worker-professional': 1,
  'worker-expert': 2,
  'client-starter': 0,
  'client-business': 1,
  'client-enterprise': 2,
}

/**
 * Check if user has access to a feature
 */
export async function checkFeatureAccess(
  userId: string,
  featureId: FeatureId
): Promise<FeatureAccess> {
  const feature = FEATURES[featureId]

  try {
    // Get user's subscription
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('user_id', userId)
      .in('status', ['active', 'trial'])
      .single()

    const currentPlanSlug = subscription?.plan?.slug || ''
    const currentPlanLevel = PLAN_HIERARCHY[currentPlanSlug] || 0

    // Check subscription requirement
    if (feature.requiresSubscription && feature.minPlan) {
      const requiredPlanLevel = PLAN_HIERARCHY[feature.minPlan] || 0
      
      if (currentPlanLevel < requiredPlanLevel) {
        return {
          hasAccess: false,
          reason: `This feature requires ${feature.minPlan.split('-')[1]} plan or higher`,
          requiredPlan: feature.minPlan,
        }
      }
    }

    // Check Shifts requirement
    if (feature.shiftsCost > 0) {
      const { data: balance } = await supabaseAdmin
        .from('shifts_balance')
        .select('balance')
        .eq('user_id', userId)
        .single()

      if (!balance || balance.balance < feature.shiftsCost) {
        return {
          hasAccess: false,
          reason: `You need ${feature.shiftsCost} Shifts. Current balance: ${balance?.balance || 0}`,
          shiftsCost: feature.shiftsCost,
        }
      }
    }

    return { hasAccess: true }
  } catch (error) {
    console.error('Error checking feature access:', error)
    return {
      hasAccess: false,
      reason: 'Unable to verify access. Please try again.',
    }
  }
}

/**
 * Client-side feature check (without Shifts balance)
 */
export function canAccessFeature(
  planSlug: string | null,
  featureId: FeatureId,
  shiftsBalance: number = 0
): FeatureAccess {
  const feature = FEATURES[featureId]
  const currentPlanLevel = PLAN_HIERARCHY[planSlug || ''] || 0

  // Check subscription requirement
  if (feature.requiresSubscription && feature.minPlan) {
    const requiredPlanLevel = PLAN_HIERARCHY[feature.minPlan] || 0
    
    if (currentPlanLevel < requiredPlanLevel) {
      return {
        hasAccess: false,
        reason: `Requires ${feature.minPlan.split('-')[1]} plan`,
        requiredPlan: feature.minPlan,
      }
    }
  }

  // Check Shifts requirement
  if (feature.shiftsCost > 0 && shiftsBalance < feature.shiftsCost) {
    return {
      hasAccess: false,
      reason: `Needs ${feature.shiftsCost} Shifts`,
      shiftsCost: feature.shiftsCost,
    }
  }

  return { hasAccess: true }
}

/**
 * Get all features available to a plan
 */
export function getAvailableFeatures(planSlug: string): typeof FEATURES[FeatureId][] {
  const currentPlanLevel = PLAN_HIERARCHY[planSlug] || 0
  const isWorker = planSlug.startsWith('worker')

  return Object.values(FEATURES).filter(feature => {
    // Filter by user type
    if (isWorker && feature.id.includes('job') || feature.id.includes('invite')) {
      return false
    }
    if (!isWorker && feature.id.includes('application') || feature.id.includes('profile_boost')) {
      return false
    }

    // Check plan requirement
    if (feature.minPlan) {
      const requiredPlanLevel = PLAN_HIERARCHY[feature.minPlan] || 0
      return currentPlanLevel >= requiredPlanLevel
    }

    return true
  })
}

/**
 * Get features that require upgrade
 */
export function getLockedFeatures(planSlug: string): typeof FEATURES[FeatureId][] {
  const currentPlanLevel = PLAN_HIERARCHY[planSlug] || 0
  const isWorker = planSlug.startsWith('worker')

  return Object.values(FEATURES).filter(feature => {
    // Filter by user type
    if (isWorker && (feature.id.includes('job') || feature.id.includes('invite'))) {
      return false
    }
    if (!isWorker && (feature.id.includes('application') || feature.id.includes('profile_boost'))) {
      return false
    }

    // Check if locked due to plan
    if (feature.minPlan) {
      const requiredPlanLevel = PLAN_HIERARCHY[feature.minPlan] || 0
      return currentPlanLevel < requiredPlanLevel
    }

    return false
  })
}
