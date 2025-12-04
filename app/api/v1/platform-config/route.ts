/**
 * GET /api/v1/platform-config
 * Get platform configuration (commission rates, escrow fees, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { data: configs, error } = await supabaseAdmin
      .from('platform_config')
      .select('key, value, description');

    if (error) {
      console.error('Error fetching platform config:', error);
      
      // Log to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with Sentry, LogRocket, or similar
        // Example: Sentry.captureException(error);
      }
      
      // Return 503 in production to indicate service issue, defaults in dev
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { 
            error: 'Failed to fetch platform configuration',
            details: 'Database query failed. Please check system health.'
          },
          { status: 503 }
        );
      }
      
      // Return default config in development only
      return NextResponse.json({
        worker_commission_verified: 0.05,
        worker_commission_unverified: 0.10,
        client_commission_percent: 0.04,
        escrow_fee_percent: 0.02,
        credits_per_application: 3,
        _warning: 'Using default config - database query failed',
        _error: error.message
      });
    }

    // Convert array to object
    const config: Record<string, any> = {};
    configs?.forEach((item) => {
      // Parse JSONB value
      let value = item.value;
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          // Keep as string if not valid JSON
        }
      }
      config[item.key] = value;
    });

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Platform config error:', error);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry, LogRocket, or similar
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch platform config',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
