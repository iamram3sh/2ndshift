/**
 * POST /api/v1/escrows/:id/release
 * Release escrow funds (demo stub)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const { id } = await params;

      // Get escrow details
      const { data: escrow, error: escrowError } = await supabaseAdmin
        .from('escrows')
        .select('*, job:jobs(*)')
        .eq('id', id)
        .single();

      if (escrowError || !escrow) {
        return NextResponse.json(
          { error: 'Escrow not found' },
          { status: 404 }
        );
      }

      // Verify client owns this escrow
      if (escrow.client_id !== authReq.userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      // Check escrow status
      if (escrow.status !== 'funded') {
        return NextResponse.json(
          { error: 'Escrow must be funded before release' },
          { status: 400 }
        );
      }

      // Use demo payment in non-production
      const useDemoPayment = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEMO_PAYMENTS === 'true';

      if (useDemoPayment) {
        // Auto-release in demo mode
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('escrows')
          .update({
            status: 'released',
            released_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to release escrow' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          escrow: updated,
          demo: true,
          message: 'Demo escrow released successfully',
        });
      } else {
        // TODO: Integrate with actual payment provider
        return NextResponse.json(
          { error: 'Payment provider integration required' },
          { status: 501 }
        );
      }
    } catch (error: any) {
      console.error('Escrow release error:', error);
      return NextResponse.json(
        { error: 'Failed to release escrow' },
        { status: 500 }
      );
    }
  });
}
