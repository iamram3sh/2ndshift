/**
 * GET /api/v1/admin/sourcing/stats
 * Get sourcing metrics (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      if (authReq.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      // Get sourcing request stats
      const { data: requests } = await supabaseAdmin
        .from('sourcing_requests')
        .select('status, created_at, updated_at')

      // Get alert stats
      const { data: alerts } = await supabaseAdmin
        .from('alert_events')
        .select('delivered_at, responded_at, created_at')

      // Calculate metrics
      const totalRequests = requests?.length || 0
      const pendingRequests = requests?.filter(r => r.status === 'pending').length || 0
      const fulfilledRequests = requests?.filter(r => r.status === 'fulfilled').length || 0

      const totalAlerts = alerts?.length || 0
      const respondedAlerts = alerts?.filter(a => a.responded_at).length || 0
      const responseRate = totalAlerts > 0 ? (respondedAlerts / totalAlerts) * 100 : 0

      // Calculate average time to first application (simplified)
      const avgTimeToFirstApplication = 0 // Would need application timestamps

      return NextResponse.json({
        sourcing: {
          total_requests: totalRequests,
          pending: pendingRequests,
          fulfilled: fulfilledRequests,
          fulfillment_rate: totalRequests > 0 ? (fulfilledRequests / totalRequests) * 100 : 0,
        },
        alerts: {
          total_sent: totalAlerts,
          responded: respondedAlerts,
          response_rate: responseRate,
          avg_time_to_first_application_minutes: avgTimeToFirstApplication,
        }
      })
    } catch (error) {
      console.error('Error fetching sourcing stats:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
