/**
 * POST /api/v1/jobs/:id/apply
 * Worker applies to a job (requires Shift Credits)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const applySchema = z.object({
  cover_text: z.string().optional(),
  proposed_price: z.number().positive().optional(),
  proposed_delivery: z.string().datetime().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireRole('worker')(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = applySchema.parse(body);
      const workerId = authReq.userId!;
      const { id: jobId } = await params;

      // Get job
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select('id, status, client_id, price_fixed')
        .eq('id', jobId)
        .single();

      if (jobError || !job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      if (job.status !== 'open') {
        return NextResponse.json(
          { error: 'Job is not open for applications' },
          { status: 400 }
        );
      }

      // Check if already applied
      const { data: existing } = await supabaseAdmin
        .from('applications')
        .select('id')
        .eq('project_id', jobId)
        .eq('worker_id', workerId)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'Already applied to this job' },
          { status: 409 }
        );
      }

      // Get credits required (from platform config or default 3)
      const { data: config } = await supabaseAdmin
        .from('platform_config')
        .select('value')
        .eq('key', 'credits_per_application')
        .single();

      const creditsRequired = config ? parseInt(config.value as string) : 3;

      // Check and reserve credits
      const { data: credits, error: creditsError } = await supabaseAdmin
        .from('shift_credits')
        .select('balance, reserved')
        .eq('user_id', workerId)
        .single();

      if (creditsError || !credits) {
        return NextResponse.json(
          { error: 'Shift Credits account not found' },
          { status: 404 }
        );
      }

      if (credits.balance < creditsRequired) {
        return NextResponse.json(
          { error: 'Insufficient Shift Credits', required: creditsRequired, available: credits.balance },
          { status: 400 }
        );
      }

      // Reserve credits
      const { error: reserveError } = await supabaseAdmin.rpc('reserve_credits', {
        p_user_id: workerId,
        p_amount: creditsRequired,
        p_reference_id: jobId,
      });

      if (reserveError) {
        console.error('Error reserving credits:', reserveError);
        return NextResponse.json(
          { error: 'Failed to reserve credits' },
          { status: 500 }
        );
      }

      // Create application
      const { data: application, error: applyError } = await supabaseAdmin
        .from('applications')
        .insert({
          project_id: jobId,
          worker_id: workerId,
          cover_text: validated.cover_text,
          proposed_price: validated.proposed_price || job.price_fixed,
          proposed_delivery: validated.proposed_delivery,
          credits_used: creditsRequired,
          status: 'pending',
        })
        .select()
        .single();

      if (applyError || !application) {
        // Release credits on error
        await supabaseAdmin.rpc('release_credits', {
          p_user_id: workerId,
          p_amount: creditsRequired,
          p_reference_id: jobId,
        });

        return NextResponse.json(
          { error: 'Failed to create application' },
          { status: 500 }
        );
      }

      // Create notification for client
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: job.client_id,
          type: 'job_application',
          payload: {
            job_id: jobId,
            job_title: job.title || 'Job',
            worker_id: workerId,
            application_id: application.id,
          },
        });

      return NextResponse.json({ application }, { status: 201 });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Apply error:', error);
      return NextResponse.json(
        { error: 'Failed to apply' },
        { status: 500 }
      );
    }
  });
}
