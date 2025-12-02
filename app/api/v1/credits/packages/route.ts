/**
 * GET /api/v1/credits/packages
 * Get Shift Credits packages for purchase
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('user_type') || 'worker';

    const { data: packages, error } = await supabaseAdmin
      .from('shifts_packages')
      .select('*')
      .or(`user_type.eq.${userType},user_type.eq.both`)
      .eq('is_active', true)
      .order('shifts_amount', { ascending: true });

    if (error) {
      console.error('Error fetching packages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch packages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ packages: packages || [] });
  } catch (error) {
    console.error('Packages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
