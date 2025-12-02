/**
 * POST /api/v1/jobs/:id/escalate
 * Escalate job to sourcing queue
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(request, async (authReq) => {
    try {
      const { id } = await params
      
      // Verify job exists and belongs to client
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select('id, client_id, status, is_hard_to_find')
        .eq('id', id)
        .single()

      if (jobError || !job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        )
      }

      if (job.client_id !== authReq.userId && authReq.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      // Update job
      const { error: updateError } = await supabaseAdmin
        .from('jobs')
        .update({
          is_hard_to_find: true,
          sourcing_status: 'sourcing_requested',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to escalate job' },
          { status: 500 }
        )
      }

      // Create sourcing request
      const { data: sourcingRequest, error: sourcingError } = await supabaseAdmin
        .from('sourcing_requests')
        .insert({
          job_id: id,
          client_id: job.client_id,
          status: 'pending',
          flags: { escalated_by: authReq.userId, escalated_at: new Date().toISOString() },
          escalate_after_minutes: 60
        })
        .select()
        .single()

      if (sourcingError) {
        console.error('Error creating sourcing request:', sourcingError)
        // Job is still updated, so continue
      }

      return NextResponse.json({
        success: true,
        sourcing_request: sourcingRequest
      })
    } catch (error) {
      console.error('Error escalating job:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
