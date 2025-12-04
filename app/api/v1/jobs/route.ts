/**
 * GET /api/v1/jobs - List jobs with filters
 * POST /api/v1/jobs - Create a new job
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { sanitizeInput } from '@/lib/sanitize';

const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category_id: z.string().uuid().optional(),
  microtask_id: z.string().uuid().optional(),
  custom: z.boolean().default(true),
  price_fixed: z.number().positive().optional(),
  price_currency: z.string().default('INR'),
  delivery_deadline: z.string().datetime().optional(),
  delivery_window: z.enum(['sixTo24h', 'threeTo7d', 'oneTo4w', 'oneTo6m']).optional(),
  required_skills: z.array(z.string()).optional(),
  urgency: z.enum(['low', 'normal', 'urgent', 'critical']).default('normal'),
});

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const role = searchParams.get('role') || authReq.userRole;
      const status = searchParams.get('status');
      const category_id = searchParams.get('category_id');
      const minPrice = searchParams.get('minPrice');
      const limit = parseInt(searchParams.get('limit') || '20');
      const offset = parseInt(searchParams.get('offset') || '0');

      // First, get jobs without the complex join
      let query = supabaseAdmin
        .from('jobs')
        .select(`
          *,
          category:categories(*),
          microtask:microtasks(*)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Filter by role
      if (role === 'client') {
        query = query.eq('client_id', authReq.userId);
      } else if (role === 'worker') {
        query = query.eq('status', 'open');
      }

      // Additional filters
      if (status) {
        query = query.eq('status', status);
      }
      if (category_id) {
        query = query.eq('category_id', category_id);
      }
      if (minPrice) {
        const minPriceNum = parseFloat(minPrice);
        if (!isNaN(minPriceNum) && minPriceNum >= 50) {
          // Filter by price_fixed (primary) or budget (fallback)
          // Note: We filter by price_fixed in DB, frontend will also check budget as fallback
          query = query.gte('price_fixed', minPriceNum);
        }
      }

      const { data: jobs, error } = await query;

      if (error) {
        logger.error('Error fetching jobs', error);
        return NextResponse.json(
          { error: 'Failed to fetch jobs', details: error.message },
          { status: 500 }
        );
      }

      // Fetch client information separately to avoid relationship issues
      const jobsWithClient = await Promise.all(
        (jobs || []).map(async (job: any) => {
          try {
            // Get client info (handle both success and error cases)
            const { data: clientData, error: clientError } = await supabaseAdmin
              .from('users')
              .select('id, full_name, email')
              .eq('id', job.client_id)
              .maybeSingle();

            if (clientError) {
              logger.warn(`Error fetching client for job ${job.id}:`, clientError);
            }

            // Get application count (handle errors gracefully)
            let appCount = 0;
            try {
              const { count } = await supabaseAdmin
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', job.id);
              appCount = count || 0;
            } catch (err) {
              logger.warn(`Error fetching application count for job ${job.id}:`, err);
            }

            // Get assignment count (handle errors gracefully)
            let assignCount = 0;
            try {
              const { count } = await supabaseAdmin
                .from('assignments')
                .select('*', { count: 'exact', head: true })
                .eq('job_id', job.id);
              assignCount = count || 0;
            } catch (err) {
              logger.warn(`Error fetching assignment count for job ${job.id}:`, err);
            }

            return {
              ...job,
              client: clientData || null,
              applications: [{ count: appCount }],
              assignments: [{ count: assignCount }],
            };
          } catch (err) {
            logger.error(`Unexpected error processing job ${job.id}:`, err);
            return {
              ...job,
              client: null,
              applications: [{ count: 0 }],
              assignments: [{ count: 0 }],
            };
          }
        })
      );

      // Log for debugging
      logger.info(`Fetched ${jobsWithClient?.length || 0} jobs for role=${role}, status=${status}, minPrice=${minPrice}`);

      return NextResponse.json({
        jobs: jobsWithClient || [],
        pagination: {
          limit,
          offset,
          total: jobsWithClient?.length || 0,
        },
      });
    } catch (error) {
      logger.error('Get jobs error', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return requireRole('client')(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = createJobSchema.parse(body);

      // Sanitize user inputs
      const sanitizedTitle = sanitizeInput(validated.title);
      const sanitizedDescription = sanitizeInput(validated.description);

      // Create job
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .insert({
          client_id: authReq.userId,
          title: sanitizedTitle,
          description: sanitizedDescription,
          category_id: validated.category_id,
          microtask_id: validated.microtask_id,
          custom: validated.custom,
          price_fixed: validated.price_fixed,
          price_currency: validated.price_currency,
          delivery_deadline: validated.delivery_deadline,
          delivery_window: validated.delivery_window ? 
            validated.delivery_window.replace('sixTo24h', '6-24h')
              .replace('threeTo7d', '3-7d')
              .replace('oneTo4w', '1-4w')
              .replace('oneTo6m', '1-6m') : undefined,
          status: 'open',
          required_skills: validated.required_skills || [],
          urgency: validated.urgency,
        })
        .select()
        .single();

      if (jobError || !job) {
        logger.error('Error creating job', jobError);
        return NextResponse.json(
          { error: 'Failed to create job' },
          { status: 500 }
        );
      }

      // Create audit log
      await supabaseAdmin
        .from('audits')
        .insert({
          user_id: authReq.userId,
          action: 'job_created',
          object_type: 'job',
          object_id: job.id,
          meta: { title: job.title },
        });

      return NextResponse.json({ job }, { status: 201 });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.issues },
          { status: 400 }
        );
      }

      logger.error('Create job error', error);
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      );
    }
  });
}
