/**
 * POST /api/v1/jobs/:id/deliver
 * Worker marks job as delivered with attachments
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const deliverSchema = z.object({
  delivery_notes: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireRole('worker')(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = deliverSchema.parse(body);
      const workerId = authReq.userId!;
      const { id: jobId } = await params;

      // Verify assignment
      const { data: assignment, error: assignError } = await supabaseAdmin
        .from('assignments')
        .select('*, job:jobs(*)')
        .eq('job_id', jobId)
        .eq('worker_id', workerId)
        .single();

      if (assignError || !assignment) {
        return NextResponse.json(
          { error: 'Assignment not found' },
          { status: 404 }
        );
      }

      if (assignment.status !== 'in_progress') {
        return NextResponse.json(
          { error: 'Job is not in progress' },
          { status: 400 }
        );
      }

      // Update assignment
      const { error: updateError } = await supabaseAdmin
        .from('assignments')
        .update({
          status: 'delivered',
          completed_at: new Date().toISOString(),
        })
        .eq('id', assignment.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update assignment' },
          { status: 500 }
        );
      }

      // Update job status
      await supabaseAdmin
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', jobId);

      // Create notification for client
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: (assignment.job as any).client_id,
          type: 'job_delivered',
          payload: {
            job_id: jobId,
            worker_id: workerId,
            delivery_notes: validated.delivery_notes,
            attachments: validated.attachments,
          },
        });

      return NextResponse.json({
        message: 'Job delivered successfully',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Deliver error:', error);
      return NextResponse.json(
        { error: 'Failed to deliver job' },
        { status: 500 }
      );
    }
  });
}
