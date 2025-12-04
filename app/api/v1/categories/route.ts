/**
 * GET /api/v1/categories
 * List all active categories
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parent_id = searchParams.get('parent_id');

    let query = supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (parent_id) {
      query = query.eq('parent_id', parent_id);
    } else {
      query = query.is('parent_id', null);
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      
      // Log to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with Sentry, LogRocket, or similar
        // Example: Sentry.captureException(error);
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch categories',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error: any) {
    console.error('Get categories error:', error);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry, LogRocket, or similar
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
