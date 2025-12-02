/**
 * GET /api/v1/alerts
 * Get worker's job alerts
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      if (authReq.userRole !== 'worker') {
        return NextResponse.json(
          { error: 'Only workers can view alerts' },
          { status: 403 }
        )
      }

      const { data, error } = await supabaseAdmin
        .from('alert_events')
        .select(`
          *,
          job:jobs(
            id,
            title,
            price_fixed,
            description
          )
        `)
        .eq('user_id', authReq.userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching alerts:', error)
        return NextResponse.json(
          { error: 'Failed to fetch alerts' },
          { status: 500 }
        )
      }

      return NextResponse.json({ alerts: data || [] })
    } catch (error) {
      console.error('Error in alerts GET:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
