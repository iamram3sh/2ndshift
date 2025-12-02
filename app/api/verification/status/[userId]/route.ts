/**
 * GET /api/verification/status/[userId]
 * Get verification status for a user
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserBadges } from '@/lib/verification/badges'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    // Get all verifications
    const { data: verifications } = await supabase
      .from('verifications_v2')
      .select('*')
      .eq('user_id', userId)
      .order('tier', { ascending: true })

    // Get badges
    const badges = await getUserBadges(userId)

    // Get worker profile for verification level
    const { data: profile } = await supabase
      .from('worker_profiles')
      .select('verification_level, verification_tier_1_completed_at, verification_tier_2_completed_at, verification_tier_3_completed_at')
      .eq('user_id', userId)
      .single()

    // Organize by tier
    const tier1 = verifications?.find(v => v.tier === 1 && v.verification_type === 'identity')
    const tier2 = verifications?.find(v => v.tier === 2 && v.verification_type === 'skill')
    const tier3 = verifications?.find(v => v.tier === 3 && v.verification_type === 'video')

    return NextResponse.json({
      userId,
      tier1: {
        status: tier1?.status || 'not_started',
        completedAt: tier1?.verified_at || profile?.verification_tier_1_completed_at || null,
        badges: badges.filter(b => ['identity_verified', 'level_1'].includes(b.badge_type)).map(b => b.badge_type)
      },
      tier2: {
        status: tier2?.status || 'not_started',
        completedAt: tier2?.verified_at || profile?.verification_tier_2_completed_at || null,
        badges: badges.filter(b => ['skill_verified', 'level_2'].includes(b.badge_type)).map(b => b.badge_type)
      },
      tier3: {
        status: tier3?.status || 'not_started',
        completedAt: tier3?.verified_at || profile?.verification_tier_3_completed_at || null,
        badges: badges.filter(b => ['video_verified', 'level_3'].includes(b.badge_type)).map(b => b.badge_type)
      },
      overallLevel: profile?.verification_level || 0,
      badges: badges.map(b => ({
        type: b.badge_type,
        awardedAt: b.awarded_at
      }))
    })
  } catch (error: any) {
    console.error('Error fetching verification status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch status' },
      { status: 500 }
    )
  }
}

