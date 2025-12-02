/**
 * POST /api/v1/sourcing_requests/:id/contact
 * Contact a worker for a sourcing request (admin only)
 * DEMO-STUB - replace for production
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const contactSchema = z.object({
  worker_id: z.string().uuid(),
  contact_method: z.enum(['email', 'sms', 'whatsapp', 'push']),
  message: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(request, async (authReq) => {
    try {
      if (authReq.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      const { id } = await params
      const body = await request.json()
      const validated = contactSchema.parse(body)

      // Get sourcing request
      const { data: sourcingRequest, error: reqError } = await supabaseAdmin
        .from('sourcing_requests')
        .select('*, job:jobs(*)')
        .eq('id', id)
        .single()

      if (reqError || !sourcingRequest) {
        return NextResponse.json(
          { error: 'Sourcing request not found' },
          { status: 404 }
        )
      }

      // Create or update sourcing match
      const { data: match, error: matchError } = await supabaseAdmin
        .from('sourcing_matches')
        .upsert({
          request_id: id,
          worker_id: validated.worker_id,
          contacted: true,
          contact_method: validated.contact_method,
          score: 0, // Will be calculated
        }, {
          onConflict: 'request_id,worker_id'
        })
        .select()
        .single()

      if (matchError) {
        console.error('Error creating match:', matchError)
        return NextResponse.json(
          { error: 'Failed to create match' },
          { status: 500 }
        )
      }

      // DEMO-STUB - replace for production
      // In production, send actual email/SMS/WhatsApp
      console.log(`[DEMO-STUB] Contacting worker ${validated.worker_id} via ${validated.contact_method} for job ${sourcingRequest.job_id}`)
      
      // Update sourcing request status
      await supabaseAdmin
        .from('sourcing_requests')
        .update({ status: 'in_progress' })
        .eq('id', id)

      return NextResponse.json({
        success: true,
        match,
        message: `[DEMO] Contact sent via ${validated.contact_method}`
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        )
      }
      console.error('Error contacting worker:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
