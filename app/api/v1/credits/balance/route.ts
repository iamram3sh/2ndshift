/**
 * GET /api/v1/credits/balance
 * Get user's Shift Credits balance
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const { data: credits, error } = await supabaseAdmin
        .from('shift_credits')
        .select('balance, reserved')
        .eq('user_id', authReq.userId)
        .single();

      if (error || !credits) {
        // Initialize if doesn't exist
        const { data: newCredits } = await supabaseAdmin
          .from('shift_credits')
          .insert({
            user_id: authReq.userId,
            balance: 0,
            reserved: 0,
          })
          .select()
          .single();

        return NextResponse.json({
          balance: newCredits?.balance || 0,
          reserved: newCredits?.reserved || 0,
          available: newCredits?.balance || 0,
        });
      }

      return NextResponse.json({
        balance: credits.balance,
        reserved: credits.reserved,
        available: credits.balance - credits.reserved,
      });
    } catch (error) {
      console.error('Get balance error:', error);
      return NextResponse.json(
        { error: 'Failed to get balance' },
        { status: 500 }
      );
    }
  });
}
