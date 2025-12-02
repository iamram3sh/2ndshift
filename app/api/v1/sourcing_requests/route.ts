/**
 * GET /api/v1/sourcing_requests
 * List sourcing requests (admin only)
 * 
 * POST /api/v1/sourcing_requests
 * Create sourcing request
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const createRequestSchema = z.object({
  job_id: z.string().uuid(),
  flags: z.record(z.any()).optional(),
  escalate_after_minutes: z.number().int().positive().optional(),
})

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      if (authReq.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      const { searchParams } = new URL(request.url)
      const status = searchParams.get('status')

      let query = supabaseAdmin
        .from('sourcing_requests')
        .select(`
          *,
          job:jobs(
            id,
            title,
            description,
            status,
            price_fixed,
            client_id
          ),
          client:users!sourcing_requests_client_id_fkey(
            id,
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching sourcing requests:', error)
        return NextResponse.json(
          { error: 'Failed to fetch requests' },
          { status: 500 }
        )
      }

      return NextResponse.json({ requests: data || [] })
    } catch (error) {
      console.error('Error in sourcing requests GET:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      const body = await request.json()
      const validated = createRequestSchema.parse(body)

      // Verify job exists and belongs to client
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select('id, client_id')
        .eq('id', validated.job_id)
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

      const { data, error } = await supabaseAdmin
        .from('sourcing_requests')
        .insert({
          job_id: validated.job_id,
          client_id: job.client_id,
          flags: validated.flags || {},
          status: 'pending',
          escalate_after_minutes: validated.escalate_after_minutes || 60
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating sourcing request:', error)
        return NextResponse.json(
          { error: 'Failed to create sourcing request' },
          { status: 500 }
        )
      }

      return NextResponse.json({ request: data }, { status: 201 })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        )
      }
      console.error('Error in sourcing requests POST:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
