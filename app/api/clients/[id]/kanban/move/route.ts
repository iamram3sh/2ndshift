import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(request, async (req) => {
    try {
      const { id } = await params
      const clientId = id
      const userId = req.userId!
      const body = await request.json()
      const { proposalId, fromColumnId, toColumnId } = body

      // Verify access
      if (clientId !== userId && req.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      // Map column IDs to application statuses
      const statusMap: Record<string, string> = {
        contacted: 'pending',
        negotiation: 'pending', // Keep as pending but could add custom field
        offer_sent: 'accepted',
        deal_closed: 'accepted', // Could be 'hired' status
      }

      const newStatus = statusMap[toColumnId] || 'pending'

      // Update application status
      const { data: application, error } = await supabaseAdmin
        .from('applications')
        .update({ status: newStatus as any })
        .eq('id', proposalId)
        .select()
        .single()

      if (error) throw error

      // Create notification for worker
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: application.worker_id,
          type: 'proposal_status_changed',
          payload: {
            applicationId: proposalId,
            fromStatus: fromColumnId,
            toStatus: toColumnId,
          },
        })

      return NextResponse.json({
        success: true,
        application,
      })
    } catch (error: any) {
      console.error('Error moving kanban card:', error)
      return NextResponse.json(
        { error: 'Failed to move card', message: error.message },
        { status: 500 }
      )
    }
  })
}
