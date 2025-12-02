/**
 * GET /api/v1/workers/pool
 * Get workers from priority pool filtered by skill and tier
 * DEMO-STUB - replace for production
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      // Only admins and clients can query the pool
      if (!['admin', 'client'].includes(authReq.userRole)) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      const { searchParams } = new URL(request.url)
      const skill = searchParams.get('skill')
      const tier = searchParams.get('tier') || 'all'
      const limit = parseInt(searchParams.get('limit') || '20')

      let query = supabaseAdmin
        .from('worker_availability')
        .select(`
          *,
          user:users!inner(
            id,
            email,
            full_name,
            profile:profiles(
              headline,
              skills,
              verified_level,
              score,
              hourly_rate_min,
              hourly_rate_max
            )
          )
        `)
        .eq('open_to_work', true)
        .limit(limit)

      if (tier !== 'all') {
        query = query.eq('priority_tier', tier)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching pool:', error)
        return NextResponse.json(
          { error: 'Failed to fetch pool' },
          { status: 500 }
        )
      }

      // Filter by skill if provided
      let filtered = data || []
      if (skill) {
        filtered = filtered.filter((item: any) => {
          const skills = item.user?.profile?.skills || []
          return Array.isArray(skills) && skills.some((s: string) => 
            s.toLowerCase().includes(skill.toLowerCase())
          )
        })
      }

      // Sort by score descending
      filtered.sort((a: any, b: any) => {
        const scoreA = a.user?.profile?.score || 0
        const scoreB = b.user?.profile?.score || 0
        return scoreB - scoreA
      })

      return NextResponse.json({
        workers: filtered.slice(0, limit),
        count: filtered.length
      })
    } catch (error) {
      console.error('Error in pool query:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
