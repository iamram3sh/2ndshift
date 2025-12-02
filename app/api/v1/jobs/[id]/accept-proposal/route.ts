/**
 * POST /api/v1/jobs/:id/accept-proposal
 * Client accepts a proposal/application
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const acceptSchema = z.object({
  application_id: z.string().uuid(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireRole('client')(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = acceptSchema.parse(body);
      const clientId = authReq.userId!;
      const { id: jobId } = await params;

      // Get job and verify ownership
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select('id, status, client_id')
        .eq('id', jobId)
        .eq('client_id', clientId)
        .single();

      if (jobError || !job) {
        return NextResponse.json(
          { error: 'Job not found or access denied' },
          { status: 404 }
        );
      }

      if (job.status !== 'open') {
        return NextResponse.json(
          { error: 'Job is not open' },
          { status: 400 }
        );
      }

      // Get application
      const { data: application, error: appError } = await supabaseAdmin
        .from('applications')
        .select('*, worker:users!applications_worker_id_fkey(id, full_name)')
        .eq('id', validated.application_id)
        .eq('project_id', jobId)
        .single();

      if (appError || !application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }

      // Update application status
      const { error: updateError } = await supabaseAdmin
        .from('applications')
        .update({
          status: 'accepted',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', validated.application_id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to accept proposal' },
          { status: 500 }
        );
      }

      // Reject other applications
      await supabaseAdmin
        .from('applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        })
        .eq('project_id', jobId)
        .neq('id', validated.application_id)
        .eq('status', 'pending');

      // Create assignment
      const { data: assignment, error: assignError } = await supabaseAdmin
        .from('assignments')
        .insert({
          job_id: jobId,
          worker_id: application.worker_id,
          status: 'assigned',
        })
        .select()
        .single();

      if (assignError) {
        console.error('Error creating assignment:', assignError);
      }

      // Update job status
      await supabaseAdmin
        .from('jobs')
        .update({ status: 'assigned' })
        .eq('id', jobId);

      // Create notification for worker
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: application.worker_id,
          type: 'proposal_accepted',
          payload: {
            job_id: jobId,
            application_id: validated.application_id,
          },
        });

      return NextResponse.json({
        message: 'Proposal accepted',
        assignment,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.issues },
          { status: 400 }
        );
      }

      console.error('Accept proposal error:', error);
      return NextResponse.json(
        { error: 'Failed to accept proposal' },
        { status: 500 }
      );
    }
  });
}
