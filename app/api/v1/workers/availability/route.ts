/**
 * POST /api/v1/workers/availability
 * Update worker availability and priority tier
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const availabilitySchema = z.object({
  availability: z.record(z.any()).optional(),
  open_to_work: z.boolean().optional(),
  priority_tier: z.enum(['standard', 'priority', 'elite']).optional(),
})

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      if (authReq.userRole !== 'worker') {
        return NextResponse.json(
          { error: 'Only workers can update availability' },
          { status: 403 }
        )
      }

      const body = await request.json()
      const validated = availabilitySchema.parse(body)

      // Upsert worker availability
      const { data, error } = await supabaseAdmin
        .from('worker_availability')
        .upsert({
          user_id: authReq.userId,
          availability: validated.availability || {},
          open_to_work: validated.open_to_work ?? true,
          priority_tier: validated.priority_tier || 'standard',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) {
        console.error('Error updating availability:', error)
        return NextResponse.json(
          { error: 'Failed to update availability' },
          { status: 500 }
        )
      }

      return NextResponse.json({ availability: data })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        )
      }
      console.error('Error in availability update:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}

/**
 * GET /api/v1/workers/availability
 * Get current worker availability
 */
export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('worker_availability')
        .select('*')
        .eq('user_id', authReq.userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        return NextResponse.json(
          { error: 'Failed to fetch availability' },
          { status: 500 }
        )
      }

      return NextResponse.json({ availability: data || null })
    } catch (error) {
      console.error('Error fetching availability:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
