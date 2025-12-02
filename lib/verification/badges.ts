/**
 * Badge Calculation and Awarding Logic
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export type BadgeType =
  | 'identity_verified'
  | 'skill_verified'
  | 'video_verified'
  | 'level_1'
  | 'level_2'
  | 'level_3'
  | 'payment_verified'
  | 'business_verified'
  | 'top_performer'
  | 'trusted_worker'
  | 'verified_client'

export interface Badge {
  id: string
  user_id: string
  badge_type: BadgeType
  awarded_at: string
  awarded_by?: string
  revoked_at?: string
  metadata: Record<string, any>
}

/**
 * Award a badge to a user
 */
export async function awardBadge(
  userId: string,
  badgeType: BadgeType,
  awardedBy?: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; error?: string; badge?: Badge }> {
  try {
    // Check if badge already exists and is active
    const { data: existing } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .is('revoked_at', null)
      .single()

    if (existing) {
      return { success: true, badge: existing as Badge }
    }

    // Award new badge
    const { data, error } = await supabase
      .from('badges')
      .insert({
        user_id: userId,
        badge_type: badgeType,
        awarded_by: awardedBy || null,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) throw error

    // Log badge award
    await logBadgeAction(userId, badgeType, 'badge_awarded', awardedBy)

    return { success: true, badge: data as Badge }
  } catch (error: any) {
    console.error('Error awarding badge:', error)
    return { success: false, error: error.message || 'Failed to award badge' }
  }
}

/**
 * Revoke a badge
 */
export async function revokeBadge(
  userId: string,
  badgeType: BadgeType,
  revokedBy: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('badges')
      .update({
        revoked_at: new Date().toISOString(),
        revoked_by: revokedBy,
        revocation_reason: reason || null
      })
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .is('revoked_at', null)

    if (error) throw error

    // Log badge revocation
    await logBadgeAction(userId, badgeType, 'badge_revoked', revokedBy)

    return { success: true }
  } catch (error: any) {
    console.error('Error revoking badge:', error)
    return { success: false, error: error.message || 'Failed to revoke badge' }
  }
}

/**
 * Get all active badges for a user
 */
export async function getUserBadges(userId: string): Promise<Badge[]> {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .is('revoked_at', null)
      .order('awarded_at', { ascending: false })

    if (error) throw error

    return (data || []) as Badge[]
  } catch (error: any) {
    console.error('Error fetching badges:', error)
    return []
  }
}

/**
 * Calculate and award verification level badges
 */
export async function calculateVerificationLevel(userId: string): Promise<{
  level: number
  badgesAwarded: string[]
}> {
  try {
    // Get all verifications for user
    const { data: verifications } = await supabase
      .from('verifications_v2')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'verified')

    if (!verifications || verifications.length === 0) {
      return { level: 0, badgesAwarded: [] }
    }

    const badgesAwarded: string[] = []
    let level = 0

    // Check Tier 1 (Identity)
    const tier1Identity = verifications.find(
      v => v.tier === 1 && v.verification_type === 'identity'
    )
    if (tier1Identity) {
      const result = await awardBadge(userId, 'identity_verified')
      if (result.success && result.badge) {
        badgesAwarded.push('identity_verified')
      }
      const result2 = await awardBadge(userId, 'level_1')
      if (result2.success && result2.badge) {
        badgesAwarded.push('level_1')
      }
      level = 1
    }

    // Check Tier 2 (Skills)
    const tier2Skill = verifications.find(
      v => v.tier === 2 && v.verification_type === 'skill'
    )
    if (tier2Skill) {
      const result = await awardBadge(userId, 'skill_verified')
      if (result.success && result.badge) {
        badgesAwarded.push('skill_verified')
      }
      const result2 = await awardBadge(userId, 'level_2')
      if (result2.success && result2.badge) {
        badgesAwarded.push('level_2')
      }
      level = 2
    }

    // Check Tier 3 (Video)
    const tier3Video = verifications.find(
      v => v.tier === 3 && v.verification_type === 'video'
    )
    if (tier3Video) {
      const result = await awardBadge(userId, 'video_verified')
      if (result.success && result.badge) {
        badgesAwarded.push('video_verified')
      }
      const result2 = await awardBadge(userId, 'level_3')
      if (result2.success && result2.badge) {
        badgesAwarded.push('level_3')
      }
      level = 3
    }

    // Update worker profile verification level
    await supabase
      .from('worker_profiles')
      .update({ verification_level: level })
      .eq('user_id', userId)

    return { level, badgesAwarded }
  } catch (error: any) {
    console.error('Error calculating verification level:', error)
    return { level: 0, badgesAwarded: [] }
  }
}

/**
 * Log badge action for audit
 */
async function logBadgeAction(
  userId: string,
  badgeType: BadgeType,
  action: 'badge_awarded' | 'badge_revoked',
  performedBy?: string
): Promise<void> {
  try {
    await supabase.from('verification_audit_logs').insert({
      user_id: userId,
      action,
      performed_by: performedBy || null,
      notes: `Badge: ${badgeType}`
    })
  } catch (error) {
    console.error('Error logging badge action:', error)
  }
}

/**
 * Get badge metadata (for display)
 */
export function getBadgeMetadata(badgeType: BadgeType): {
  name: string
  description: string
  icon: string
  color: string
} {
  const metadata: Record<BadgeType, { name: string; description: string; icon: string; color: string }> = {
    identity_verified: {
      name: 'Identity Verified',
      description: 'Government ID and face match verified',
      icon: '🆔',
      color: 'blue'
    },
    skill_verified: {
      name: 'Skill Verified',
      description: 'Skills verified through tests and proofs',
      icon: '✅',
      color: 'green'
    },
    video_verified: {
      name: 'Video Verified',
      description: 'Video verification completed',
      icon: '🎥',
      color: 'purple'
    },
    level_1: {
      name: 'Level 1 Verified',
      description: 'Identity verification completed',
      icon: '⭐',
      color: 'blue'
    },
    level_2: {
      name: 'Level 2 Verified',
      description: 'Identity and skills verified',
      icon: '⭐⭐',
      color: 'green'
    },
    level_3: {
      name: 'Level 3 Verified',
      description: 'Full verification completed',
      icon: '⭐⭐⭐',
      color: 'purple'
    },
    payment_verified: {
      name: 'Payment Verified',
      description: 'Payment method verified',
      icon: '💳',
      color: 'green'
    },
    business_verified: {
      name: 'Business Verified',
      description: 'Business documents verified',
      icon: '🏢',
      color: 'blue'
    },
    top_performer: {
      name: 'Top Performer',
      description: 'Consistently high ratings',
      icon: '🏆',
      color: 'gold'
    },
    trusted_worker: {
      name: 'Trusted Worker',
      description: 'Verified and trusted by clients',
      icon: '🤝',
      color: 'green'
    },
    verified_client: {
      name: 'Verified Client',
      description: 'Client verification completed',
      icon: '✓',
      color: 'blue'
    }
  }

  return metadata[badgeType] || {
    name: badgeType,
    description: '',
    icon: '✓',
    color: 'gray'
  }
}

