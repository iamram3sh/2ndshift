/**
 * POST /api/v1/alerts/respond
 * Worker responds to alert with fast-apply (reserves credits + creates proposal)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const respondAlertSchema = z.object({
  alert_id: z.string().uuid(),
  job_id: z.string().uuid(),
  cover_text: z.string().optional(),
  proposed_price: z.number().positive().optional(),
})

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      if (authReq.userRole !== 'worker') {
        return NextResponse.json(
          { error: 'Only workers can respond to alerts' },
          { status: 403 }
        )
      }

      const body = await request.json()
      const validated = respondAlertSchema.parse(body)

      // Verify alert exists and belongs to worker
      const { data: alert, error: alertError } = await supabaseAdmin
        .from('alert_events')
        .select('*')
        .eq('id', validated.alert_id)
        .eq('user_id', authReq.userId)
        .single()

      if (alertError || !alert) {
        return NextResponse.json(
          { error: 'Alert not found' },
          { status: 404 }
        )
      }

      // Get job details
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select('id, price_fixed, status')
        .eq('id', validated.job_id)
        .single()

      if (jobError || !job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        )
      }

      if (job.status !== 'open') {
        return NextResponse.json(
          { error: 'Job is not open for applications' },
          { status: 400 }
        )
      }

      // Reserve credits (3 credits per application)
      const creditsNeeded = 3
      const { data: credits, error: creditsError } = await supabaseAdmin
        .from('shift_credits')
        .select('balance, reserved')
        .eq('user_id', authReq.userId)
        .single()

      if (creditsError || !credits) {
        return NextResponse.json(
          { error: 'Failed to check credits' },
          { status: 500 }
        )
      }

      if (credits.balance - credits.reserved < creditsNeeded) {
        return NextResponse.json(
          { error: 'Insufficient credits', required: creditsNeeded, available: credits.balance - credits.reserved },
          { status: 400 }
        )
      }

      // Reserve credits
      const { error: reserveError } = await supabaseAdmin
        .from('shift_credits')
        .update({
          reserved: credits.reserved + creditsNeeded
        })
        .eq('user_id', authReq.userId)

      if (reserveError) {
        return NextResponse.json(
          { error: 'Failed to reserve credits' },
          { status: 500 }
        )
      }

      // Create credit transaction
      await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: authReq.userId,
          change: -creditsNeeded,
          reason: 'apply',
          reference_id: validated.job_id,
          meta: { alert_id: validated.alert_id, fast_apply: true }
        })

      // Create application
      const { data: application, error: appError } = await supabaseAdmin
        .from('applications')
        .insert({
          project_id: validated.job_id,
          worker_id: authReq.userId,
          cover_text: validated.cover_text || 'Fast-apply from alert',
          credits_used: creditsNeeded,
          proposed_price: validated.proposed_price ? validated.proposed_price * 100 : job.price_fixed,
          status: 'pending'
        })
        .select()
        .single()

      if (appError) {
        // Rollback credit reservation
        await supabaseAdmin
          .from('shift_credits')
          .update({
            reserved: credits.reserved
          })
          .eq('user_id', authReq.userId)

        return NextResponse.json(
          { error: 'Failed to create application' },
          { status: 500 }
        )
      }

      // Update alert as responded
      await supabaseAdmin
        .from('alert_events')
        .update({
          responded_at: new Date().toISOString()
        })
        .eq('id', validated.alert_id)

      return NextResponse.json({
        success: true,
        application,
        credits_reserved: creditsNeeded
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.issues },
          { status: 400 }
        )
      }
      console.error('Error responding to alert:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
