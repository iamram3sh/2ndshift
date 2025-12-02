/**
 * GET /api/v1/admin/jobs
 * Admin: List all jobs with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  return requireRole('admin')(request, async (authReq: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      let query = supabaseAdmin
        .from('jobs')
        .select(`
          *,
          client:users!jobs_client_id_fkey(id, full_name, email),
          category:categories(*),
          applications(count),
          assignments(count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: jobs, error } = await query;

      if (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
          { error: 'Failed to fetch jobs' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        jobs: jobs || [],
        pagination: { limit, offset, total: jobs?.length || 0 },
      });
    } catch (error) {
      console.error('Admin get jobs error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
  });
}
