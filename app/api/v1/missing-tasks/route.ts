/**
 * POST /api/v1/missing-tasks
 * Classify missing microtask request using LLM (stub)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const missingTaskSchema = z.object({
  raw_text: z.string().min(10),
});

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = missingTaskSchema.parse(body);

      // TODO: Use LLM to classify the request
      // Extract: skills, urgency, complexity, suggested category
      // For now, return stub classification
      const parsed = {
        skills: ['stub_skill'],
        urgency: 'normal',
        complexity: 'intermediate',
        suggested_category: null,
      };

      // Create missing task request
      const { data: taskRequest, error } = await supabaseAdmin
        .from('missing_task_requests')
        .insert({
          client_id: authReq.userId,
          raw_text: validated.raw_text,
          parsed,
          assigned: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating missing task request:', error);
        return NextResponse.json(
          { error: 'Failed to create request' },
          { status: 500 }
        );
      }

      // TODO: Notify admin about new missing task request

      return NextResponse.json({
        request: taskRequest,
        message: 'LLM classification stub - replace with actual LLM integration (OpenAI, Anthropic, etc.)',
      }, { status: 201 });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Missing task error:', error);
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      );
    }
  });
}
