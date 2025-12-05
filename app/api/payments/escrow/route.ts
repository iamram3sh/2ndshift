import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  return requireAuth(request, async (req) => {
    try {
      const body = await request.json()
      const { clientId, projectId, amount, currency = 'INR' } = body
      const userId = req.userId!

      // Verify access
      if (clientId !== userId && req.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      // Check if escrow already exists
      const { data: existing } = await supabaseAdmin
        .from('escrows')
        .select('id')
        .eq('job_id', projectId)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Escrow already exists for this project' },
          { status: 400 }
        )
      }

      // Create escrow
      const { data: escrow, error } = await supabaseAdmin
        .from('escrows')
        .insert({
          job_id: projectId,
          client_id: clientId,
          amount: amount,
          currency: currency,
          status: 'created',
        })
        .select()
        .single()

      if (error) throw error

      // Create transaction record
      await supabaseAdmin
        .from('audits')
        .insert({
          user_id: userId,
          action: 'escrow_created',
          object_type: 'escrow',
          object_id: escrow.id,
          meta: {
            amount,
            currency,
            projectId,
          },
        })

      // TODO: Integrate with payment gateway (Razorpay/Stripe) to actually hold funds
      // For now, we'll simulate by updating status to 'funded'
      await supabaseAdmin
        .from('escrows')
        .update({ status: 'funded' })
        .eq('id', escrow.id)

      return NextResponse.json({
        success: true,
        escrow: {
          ...escrow,
          status: 'funded',
        },
      })
    } catch (error: any) {
      console.error('Error creating escrow:', error)
      return NextResponse.json(
        { error: 'Failed to create escrow', message: error.message },
        { status: 500 }
      )
    }
  })
}
