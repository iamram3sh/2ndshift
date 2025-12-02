/**
 * POST /api/v1/matching/suggest-workers
 * Suggest workers based on raw text description (uses LLM stub)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const suggestSchema = z.object({
  raw_text: z.string().min(10),
  limit: z.number().int().min(1).max(20).default(10),
});

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = suggestSchema.parse(body);

      // TODO: Use LLM to extract skills, complexity, etc. from raw_text
      // For now, use simple keyword extraction
      const keywords = validated.raw_text
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 10);

      // Search workers by skills matching keywords
      const { data: workers, error } = await supabaseAdmin
        .from('profiles')
        .select(`
          *,
          user:users!profiles_user_id_fkey(id, full_name, email, user_type)
        `)
        .eq('user.user_type', 'worker')
        .order('score', { ascending: false })
        .limit(validated.limit);

      if (error) {
        console.error('Error fetching workers:', error);
        return NextResponse.json(
          { error: 'Failed to fetch workers' },
          { status: 500 }
        );
      }

      // TODO: Use LLM to rank workers based on raw_text
      // For now, return top workers by score

      return NextResponse.json({
        suggestions: workers || [],
        parsed: {
          keywords,
          // TODO: Add LLM-extracted skills, complexity, urgency
        },
        message: 'LLM classification stub - replace with actual LLM integration',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Suggest workers error:', error);
      return NextResponse.json(
        { error: 'Failed to suggest workers' },
        { status: 500 }
      );
    }
  });
}
