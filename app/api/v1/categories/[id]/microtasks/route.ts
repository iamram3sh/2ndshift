/**
 * GET /api/v1/categories/:id/microtasks
 * List microtasks for a category
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: microtasks, error } = await supabaseAdmin
      .from('microtasks')
      .select('*')
      .eq('category_id', params.id)
      .order('title');

    if (error) {
      console.error('Error fetching microtasks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch microtasks' },
        { status: 500 }
      );
    }

    return NextResponse.json({ microtasks: microtasks || [] });
  } catch (error) {
    console.error('Get microtasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch microtasks' },
      { status: 500 }
    );
  }
}
