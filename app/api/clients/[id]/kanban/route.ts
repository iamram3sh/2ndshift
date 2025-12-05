import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(request, async (req) => {
    try {
      const { id } = await params
      const clientId = id
      const userId = req.userId!

      // Verify access
      if (clientId !== userId && req.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      // Get all proposals/applications for this client's jobs
      const { data: applications, error } = await supabaseAdmin
        .from('applications')
        .select(`
          id,
          project_id,
          worker_id,
          status,
          proposed_price,
          created_at,
          job:jobs!applications_project_id_fkey(id, title, client_id),
          worker:users!applications_worker_id_fkey(id, full_name, email)
        `)
        .eq('job.client_id', clientId)

      if (error) throw error

      // Map to kanban columns
      const columns = [
        {
          id: 'contacted',
          name: 'Contacted',
          cards: (applications || [])
            .filter((app: any) => app.status === 'pending')
            .map((app: any) => ({
              id: app.id,
              proposalId: app.id,
              workerId: app.worker_id,
              title: app.job?.title || 'Untitled',
              budget: Number(app.proposed_price || app.job?.price_fixed || 0),
              status: app.status,
              worker: app.worker,
              createdAt: app.created_at,
            })),
        },
        {
          id: 'negotiation',
          name: 'Negotiation',
          cards: [], // Applications in negotiation (custom status)
        },
        {
          id: 'offer_sent',
          name: 'Offer Sent',
          cards: (applications || [])
            .filter((app: any) => app.status === 'accepted')
            .map((app: any) => ({
              id: app.id,
              proposalId: app.id,
              workerId: app.worker_id,
              title: app.job?.title || 'Untitled',
              budget: Number(app.proposed_price || app.job?.price_fixed || 0),
              status: app.status,
              worker: app.worker,
              createdAt: app.created_at,
            })),
        },
        {
          id: 'deal_closed',
          name: 'Deal Closed',
          cards: [], // Completed/hired applications
        },
      ]

      return NextResponse.json({ columns })
    } catch (error: any) {
      console.error('Error fetching kanban:', error)
      return NextResponse.json(
        { error: 'Failed to fetch kanban', message: error.message },
        { status: 500 }
      )
    }
  })
}
