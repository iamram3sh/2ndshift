/**
 * POST /api/v1/alerts/send
 * Send job alert to workers (admin/system only)
 * DEMO-STUB - replace for production
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const sendAlertSchema = z.object({
  job_id: z.string().uuid(),
  worker_ids: z.array(z.string().uuid()),
  channel: z.enum(['email', 'sms', 'push', 'whatsapp']).default('email'),
})

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      // Only admin or system can send alerts
      if (authReq.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      const body = await request.json()
      const validated = sendAlertSchema.parse(body)

      // Verify job exists
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select('id, title, client_id')
        .eq('id', validated.job_id)
        .single()

      if (jobError || !job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        )
      }

      // Create alert events
      const alerts = validated.worker_ids.map(workerId => ({
        user_id: workerId,
        job_id: validated.job_id,
        channel: validated.channel,
        delivered_at: new Date().toISOString(),
      }))

      const { data: alertEvents, error: alertError } = await supabaseAdmin
        .from('alert_events')
        .insert(alerts)
        .select()

      if (alertError) {
        console.error('Error creating alerts:', alertError)
        return NextResponse.json(
          { error: 'Failed to send alerts' },
          { status: 500 }
        )
      }

      // DEMO-STUB - replace for production
      // In production, send actual notifications via email/SMS/WhatsApp/push
      console.log(`[DEMO-STUB] Sent ${alerts.length} ${validated.channel} alerts for job ${validated.job_id}`)

      return NextResponse.json({
        success: true,
        alerts_sent: alertEvents?.length || 0,
        message: `[DEMO] ${alerts.length} alerts sent via ${validated.channel}`
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        )
      }
      console.error('Error sending alerts:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
