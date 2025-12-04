/**
 * GET /api/health
 * Health check endpoint for monitoring and deployment verification
 * Checks database connectivity and returns system status
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: string; message?: string; duration?: number }> = {};

  try {
    // Check database connectivity
    const dbStartTime = Date.now();
    const { error: dbError } = await supabaseAdmin
      .from('categories')
      .select('count')
      .limit(1);

    const dbDuration = Date.now() - dbStartTime;
    
    if (dbError) {
      checks.database = {
        status: 'unhealthy',
        message: dbError.message,
        duration: dbDuration
      };
    } else {
      checks.database = {
        status: 'healthy',
        duration: dbDuration
      };
    }

    // Check environment variables
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    checks.environment = {
      status: hasSupabaseUrl && hasServiceKey ? 'healthy' : 'unhealthy',
      message: !hasSupabaseUrl 
        ? 'NEXT_PUBLIC_SUPABASE_URL not set'
        : !hasServiceKey
        ? 'SUPABASE_SERVICE_ROLE_KEY not set'
        : undefined
    };

    // Determine overall health
    const allHealthy = Object.values(checks).every(check => check.status === 'healthy');
    const totalDuration = Date.now() - startTime;

    if (allHealthy) {
      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks,
        duration_ms: totalDuration
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks,
        duration_ms: totalDuration
      }, { status: 503 });
    }
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message || 'Unknown error',
      checks,
      duration_ms: totalDuration
    }, { status: 503 });
  }
}
