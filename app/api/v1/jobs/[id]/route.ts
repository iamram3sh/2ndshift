/**
 * GET /api/v1/jobs/:id - Get job details
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const { data: job, error } = await supabaseAdmin
        .from('jobs')
        .select(`
          *,
          category:categories(*),
          microtask:microtasks(*),
          client:users!jobs_client_id_fkey(id, full_name, email),
          applications(*, worker:users!applications_worker_id_fkey(id, full_name, email)),
          assignments(*, worker:users!assignments_worker_id_fkey(id, full_name, email)),
          escrow:escrows(*)
        `)
        .eq('id', params.id)
        .single();

      if (error || !job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      // Check permissions
      const isClient = job.client_id === authReq.userId;
      const isAssignedWorker = job.assignments?.some(
        (a: any) => a.worker_id === authReq.userId
      );
      const isOpen = job.status === 'open';

      if (!isClient && !isAssignedWorker && !isOpen) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json({ job });
    } catch (error) {
      console.error('Get job error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch job' },
        { status: 500 }
      );
    }
  });
}
