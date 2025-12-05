import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(request.url)
      const role = searchParams.get('role') || req.userRole || 'worker'
      const userId = req.userId!

      let metrics: any = {
        newCustomers: 0,
        successRate: 0,
        tasksInProgress: 0,
        prepayments: 0,
        sparklineData: { x: [], y: [] },
      }

      if (role === 'worker') {
        // Worker metrics
        const { data: applications } = await supabaseAdmin
          .from('applications')
          .select('id, status, created_at')
          .eq('worker_id', userId)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

        const { data: assignments } = await supabaseAdmin
          .from('assignments')
          .select('id, status')
          .eq('worker_id', userId)
          .in('status', ['assigned', 'in_progress'])

        const { data: completed } = await supabaseAdmin
          .from('assignments')
          .select('id, status')
          .eq('worker_id', userId)
          .eq('status', 'completed')

        const total = (assignments?.length || 0) + (completed?.length || 0)
        const successRate = total > 0 ? ((completed?.length || 0) / total) * 100 : 0

        // Generate sparkline data (last 7 days)
        const sparklineX: string[] = []
        const sparklineY: number[] = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dayStart = new Date(date.setHours(0, 0, 0, 0))
          const dayEnd = new Date(date.setHours(23, 59, 59, 999))

          const dayApps = applications?.filter(
            (app) =>
              new Date(app.created_at) >= dayStart && new Date(app.created_at) <= dayEnd
          ).length || 0

          sparklineX.push(dayStart.toLocaleDateString('en-US', { weekday: 'short' }))
          sparklineY.push(dayApps)
        }

        metrics = {
          newCustomers: applications?.length || 0,
          successRate: Math.round(successRate),
          tasksInProgress: assignments?.length || 0,
          prepayments: 0, // Workers don't have prepayments
          sparklineData: { x: sparklineX, y: sparklineY },
        }
      } else if (role === 'client') {
        // Client metrics
        const { data: projects } = await supabaseAdmin
          .from('jobs')
          .select('id, status, created_at')
          .eq('client_id', userId)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

        const { data: activeProjects } = await supabaseAdmin
          .from('jobs')
          .select('id, status')
          .eq('client_id', userId)
          .in('status', ['open', 'assigned', 'in_progress'])

        const { data: completedProjects } = await supabaseAdmin
          .from('jobs')
          .select('id, status')
          .eq('client_id', userId)
          .eq('status', 'completed')

        const total = (activeProjects?.length || 0) + (completedProjects?.length || 0)
        const successRate = total > 0 ? ((completedProjects?.length || 0) / total) * 100 : 0

        // Get prepayments (escrow amounts)
        const { data: escrows } = await supabaseAdmin
          .from('escrows')
          .select('amount, status')
          .eq('client_id', userId)
          .eq('status', 'funded')

        const prepayments = escrows?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0

        // Generate sparkline data
        const sparklineX: string[] = []
        const sparklineY: number[] = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dayStart = new Date(date.setHours(0, 0, 0, 0))
          const dayEnd = new Date(date.setHours(23, 59, 59, 999))

          const dayProjects = projects?.filter(
            (p) => new Date(p.created_at) >= dayStart && new Date(p.created_at) <= dayEnd
          ).length || 0

          sparklineX.push(dayStart.toLocaleDateString('en-US', { weekday: 'short' }))
          sparklineY.push(dayProjects)
        }

        metrics = {
          newCustomers: projects?.length || 0,
          successRate: Math.round(successRate),
          tasksInProgress: activeProjects?.length || 0,
          prepayments: Math.round(prepayments),
          sparklineData: { x: sparklineX, y: sparklineY },
        }
      }

      return NextResponse.json(metrics)
    } catch (error: any) {
      console.error('Error fetching dashboard metrics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch metrics', message: error.message },
        { status: 500 }
      )
    }
  })
}
