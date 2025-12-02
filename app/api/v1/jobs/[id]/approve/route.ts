/**
 * POST /api/v1/jobs/:id/approve
 * Client approves job delivery and releases escrow
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculateCommissions } from '@/lib/revenue/commission';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireRole('client')(request, async (authReq: AuthenticatedRequest) => {
    try {
      const clientId = authReq.userId!;
      const jobId = params.id;

      // Get job and verify ownership
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select(`
          *,
          assignment:assignments(*, worker:users!assignments_worker_id_fkey(*)),
          escrow:escrows(*)
        `)
        .eq('id', jobId)
        .eq('client_id', clientId)
        .single();

      if (jobError || !job) {
        return NextResponse.json(
          { error: 'Job not found or access denied' },
          { status: 404 }
        );
      }

      if (job.status !== 'completed') {
        return NextResponse.json(
          { error: 'Job is not completed' },
          { status: 400 }
        );
      }

      const assignment = (job.assignment as any[])?.[0];
      if (!assignment || assignment.status !== 'delivered') {
        return NextResponse.json(
          { error: 'Job is not delivered' },
          { status: 400 }
        );
      }

      // Get escrow
      const escrow = job.escrow as any;
      if (!escrow || escrow.status !== 'funded') {
        return NextResponse.json(
          { error: 'Escrow not funded' },
          { status: 400 }
        );
      }

      // Calculate commissions
      const worker = assignment.worker;
      const contractAmount = job.price_fixed || escrow.amount;
      
      // TODO: Get actual verification status and subscription status
      const commissionResult = calculateCommissions({
        contractAmount: parseFloat(contractAmount.toString()),
        workerId: assignment.worker_id,
        isWorkerVerified: worker?.is_verified || false,
        isFirstThreeJobs: false, // TODO: Check from worker_job_counts
        clientHasSubscription: false, // TODO: Check from user_subscriptions
        isMicroTask: !!job.microtask_id,
        paymentAmount: parseFloat(escrow.amount.toString()),
      });

      // Create commission record
      await supabaseAdmin
        .from('commissions')
        .insert({
          job_id: jobId,
          amount: commissionResult.totalPlatformRevenue,
          percent: commissionResult.workerCommissionPercent + commissionResult.clientCommissionPercent,
          charged_to: 'both',
        });

      // Release escrow (stub - replace with actual payment provider)
      const { error: escrowError } = await supabaseAdmin
        .from('escrows')
        .update({
          status: 'released',
        })
        .eq('id', escrow.id);

      if (escrowError) {
        return NextResponse.json(
          { error: 'Failed to release escrow' },
          { status: 500 }
        );
      }

      // Update assignment
      await supabaseAdmin
        .from('assignments')
        .update({ status: 'approved' })
        .eq('id', assignment.id);

      // Create payment record
      await supabaseAdmin
        .from('payments')
        .insert({
          payer_id: clientId,
          payee_id: assignment.worker_id,
          amount: contractAmount,
          currency: job.price_currency || 'INR',
          status: 'completed',
          net_amount: commissionResult.netWorkerPayout,
          platform_fee: commissionResult.workerCommissionAmount,
        });

      // Create notification for worker
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: assignment.worker_id,
          type: 'job_approved',
          payload: {
            job_id: jobId,
            payout: commissionResult.netWorkerPayout,
          },
        });

      return NextResponse.json({
        message: 'Job approved and escrow released',
        commission: commissionResult,
      });
    } catch (error) {
      console.error('Approve error:', error);
      return NextResponse.json(
        { error: 'Failed to approve job' },
        { status: 500 }
      );
    }
  });
}
