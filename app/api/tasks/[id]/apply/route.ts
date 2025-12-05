import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (req) => {
    try {
      const taskId = params.id
      const userId = req.userId!
      const body = await request.json()
      const { coverLetter, attachments = [] } = body

      // Check if task exists
      const { data: task, error: taskError } = await supabaseAdmin
        .from('jobs')
        .select('id, client_id, status')
        .eq('id', taskId)
        .single()

      if (taskError || !task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        )
      }

      if (task.status !== 'open') {
        return NextResponse.json(
          { error: 'Task is not open for applications' },
          { status: 400 }
        )
      }

      // Check if already applied
      const { data: existing } = await supabaseAdmin
        .from('applications')
        .select('id')
        .eq('project_id', taskId)
        .eq('worker_id', userId)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'You have already applied to this task' },
          { status: 400 }
        )
      }

      // Check credits balance
      const { data: credits } = await supabaseAdmin
        .from('shift_credits')
        .select('total_credits, consumed_credits')
        .eq('user_id', userId)
        .single()

      const availableCredits = (credits?.total_credits || 0) - (credits?.consumed_credits || 0)
      const creditsRequired = 3

      if (availableCredits < creditsRequired) {
        return NextResponse.json(
          { error: 'Insufficient credits', required: creditsRequired, available: availableCredits },
          { status: 400 }
        )
      }

      // Create application
      const { data: application, error: applyError } = await supabaseAdmin
        .from('applications')
        .insert({
          project_id: taskId,
          worker_id: userId,
          cover_text: coverLetter || null,
          credits_used: creditsRequired,
          status: 'pending',
        })
        .select()
        .single()

      if (applyError) throw applyError

      // Consume credits
      await supabaseAdmin
        .from('shift_credits')
        .update({
          consumed_credits: (credits?.consumed_credits || 0) + creditsRequired,
        })
        .eq('user_id', userId)

      // Create notification for client
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: task.client_id,
          type: 'application_received',
          payload: {
            applicationId: application.id,
            taskId: taskId,
            workerId: userId,
          },
        })

      return NextResponse.json({
        id: application.id,
        message: 'Application submitted successfully',
      })
    } catch (error: any) {
      console.error('Error applying to task:', error)
      return NextResponse.json(
        { error: 'Failed to submit application', message: error.message },
        { status: 500 }
      )
    }
  })
}
