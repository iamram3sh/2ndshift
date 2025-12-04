/**
 * GET /api/v1/categories/:id/microtasks
 * List microtasks for a category
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: microtasks, error } = await supabaseAdmin
      .from('microtasks')
      .select('*')
      .eq('category_id', id)
      .order('title');

    if (error) {
      console.error('Error fetching microtasks:', error);
      
      // Log to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with Sentry, LogRocket, or similar
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch microtasks',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ microtasks: microtasks || [] });
  } catch (error: any) {
    console.error('Get microtasks error:', error);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry, LogRocket, or similar
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch microtasks',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
