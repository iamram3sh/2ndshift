/**
 * POST /api/v1/matching/auto-match
 * Auto-match workers to a job based on skills, availability, score
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const matchSchema = z.object({
  job_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  return requireRole('client', 'admin')(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = matchSchema.parse(body);

      // Get job details
      const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select('id, title, description, category_id, required_skills, status')
        .eq('id', validated.job_id)
        .single();

      if (jobError || !job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      if (job.status !== 'open') {
        return NextResponse.json(
          { error: 'Job is not open for matching' },
          { status: 400 }
        );
      }

      // Get workers with matching skills
      const requiredSkills = (job.required_skills as string[]) || [];
      
      let workersQuery = supabaseAdmin
        .from('profiles')
        .select(`
          *,
          user:users!profiles_user_id_fkey(id, full_name, email, user_type, last_active_at)
        `)
        .eq('user.user_type', 'worker')
        .not('skills', 'is', null);

      // Filter by skills if provided
      if (requiredSkills.length > 0) {
        // Use GIN index for JSONB array search
        workersQuery = workersQuery.contains('skills', requiredSkills);
      }

      const { data: workers, error: workersError } = await workersQuery.limit(50);

      if (workersError) {
        console.error('Error fetching workers:', workersError);
        return NextResponse.json(
          { error: 'Failed to fetch workers' },
          { status: 500 }
        );
      }

      // Score and rank workers
      const scoredWorkers = (workers || []).map((worker: any) => {
        const workerSkills = (worker.skills as string[]) || [];
        const skillOverlap = requiredSkills.filter(skill => 
          workerSkills.some(ws => ws.toLowerCase().includes(skill.toLowerCase()))
        ).length;
        
        const skillMatchScore = requiredSkills.length > 0 
          ? skillOverlap / requiredSkills.length 
          : 0.5;

        const verifiedScore = worker.verified_level === 'premium' ? 0.3 :
                             worker.verified_level === 'professional' ? 0.2 :
                             worker.verified_level === 'basic' ? 0.1 : 0;

        const profileScore = (worker.score || 0) / 100 * 0.2;

        const totalScore = skillMatchScore * 0.5 + verifiedScore + profileScore;

        return {
          ...worker,
          match_score: totalScore,
          skill_overlap: skillOverlap,
        };
      }).sort((a, b) => b.match_score - a.match_score).slice(0, 10);

      // If no category match, trigger missing microtask detector
      if (scoredWorkers.length === 0 && job.category_id) {
        // TODO: Call missing microtask detector
        // This would classify the job and suggest a category
      }

      return NextResponse.json({
        job_id: validated.job_id,
        matches: scoredWorkers,
        count: scoredWorkers.length,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Auto-match error:', error);
      return NextResponse.json(
        { error: 'Failed to match workers' },
        { status: 500 }
      );
    }
  });
}
