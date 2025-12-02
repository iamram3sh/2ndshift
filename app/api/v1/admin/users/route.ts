/**
 * GET /api/v1/admin/users
 * Admin: List all users
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  return requireRole('admin')(request, async (authReq: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const user_type = searchParams.get('user_type');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      let query = supabaseAdmin
        .from('users')
        .select(`
          id,
          email,
          full_name,
          user_type,
          phone,
          profile_complete,
          email_verified,
          phone_verified,
          last_active_at,
          created_at,
          profiles(*)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (user_type) {
        query = query.eq('user_type', user_type);
      }

      const { data: users, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
          { error: 'Failed to fetch users' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        users: users || [],
        pagination: { limit, offset, total: users?.length || 0 },
      });
    } catch (error) {
      console.error('Admin get users error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
  });
}
