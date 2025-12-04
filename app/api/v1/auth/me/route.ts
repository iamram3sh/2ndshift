/**
 * GET /api/v1/auth/me
 * Get current user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const userId = authReq.userId!;

      // Get user with profile
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          email,
          full_name,
          user_type,
          phone,
          profile_complete,
          phone_verified,
          email_verified,
          last_active_at,
          created_at,
          updated_at,
          profiles (*)
        `)
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.user_type,
          phone: user.phone,
          profile_complete: user.profile_complete,
          phone_verified: user.phone_verified,
          email_verified: user.email_verified,
          last_active_at: user.last_active_at,
          profile: user.profiles,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      logger.error('Get profile error', error);
      return NextResponse.json(
        { error: 'Failed to get profile' },
        { status: 500 }
      );
    }
  });
}
