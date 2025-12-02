/**
 * GET /api/v1/commissions/calc
 * Calculate commission breakdown for a job price
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const calcSchema = z.object({
  price: z.number().positive(),
  worker_id: z.string().uuid().optional(),
  client_id: z.string().uuid().optional(),
  is_microtask: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const price = parseFloat(searchParams.get('price') || '0');
      const workerId = searchParams.get('worker_id') || undefined;
      const clientId = searchParams.get('client_id') || undefined;
      const isMicrotask = searchParams.get('is_microtask') === 'true';

      if (!price || price <= 0) {
        return NextResponse.json(
          { error: 'Invalid price' },
          { status: 400 }
        );
      }

      // Get platform config
      const { data: configs } = await supabaseAdmin
        .from('platform_config')
        .select('key, value');

      const config: Record<string, any> = {};
      configs?.forEach((item) => {
        let value = item.value;
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch {
            // Keep as string
          }
        }
        config[item.key] = value;
      });

      const escrowFeePercent = parseFloat(config.escrow_fee_percent || '0.02');
      const clientCommissionPercent = parseFloat(config.client_commission_percent || '0.04');
      const workerCommissionVerified = parseFloat(config.worker_commission_verified || '0.05');
      const workerCommissionUnverified = parseFloat(config.worker_commission_unverified || '0.10');
      const microtaskFee = 49; // Flat fee for microtasks

      // Calculate escrow fee
      const escrowFee = price * escrowFeePercent;
      const afterEscrowFee = price + escrowFee;

      // Calculate client commission
      let clientCommission = 0;
      if (isMicrotask) {
        clientCommission = microtaskFee;
      } else {
        // Check if client has subscription (0% commission)
        if (clientId) {
          const { data: subscription } = await supabaseAdmin
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', clientId)
            .in('status', ['active', 'trial'])
            .single();

          if (!subscription) {
            clientCommission = afterEscrowFee * clientCommissionPercent;
          }
        } else {
          clientCommission = afterEscrowFee * clientCommissionPercent;
        }
      }

      const clientPays = afterEscrowFee + clientCommission;

      // Calculate worker commission
      let workerCommission = 0;
      if (workerId) {
        // Check worker verification status
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('verified_level')
          .eq('user_id', workerId)
          .single();

        const isVerified = profile?.verified_level && profile.verified_level >= 1;
        const commissionRate = isVerified ? workerCommissionVerified : workerCommissionUnverified;

        // Check if first 3 jobs (0% commission)
        const { count } = await supabaseAdmin
          .from('assignments')
          .select('*', { count: 'exact', head: true })
          .eq('worker_id', workerId)
          .in('status', ['completed', 'in_progress', 'assigned']);

        if (count && count < 3) {
          workerCommission = 0;
        } else {
          // Check worker subscription
          const { data: subscription } = await supabaseAdmin
            .from('user_subscriptions')
            .select('*, plan:subscription_plans(*)')
            .eq('user_id', workerId)
            .in('status', ['active', 'trial'])
            .single();

          if (subscription && subscription.plan) {
            // Use subscription's platform_fee_percent
            const subCommissionRate = parseFloat(subscription.plan.platform_fee_percent) / 100;
            workerCommission = price * subCommissionRate;
          } else {
            workerCommission = price * commissionRate;
          }
        }
      } else {
        // Default to unverified rate
        workerCommission = price * workerCommissionUnverified;
      }

      const workerReceives = price - workerCommission;

      return NextResponse.json({
        breakdown: {
          job_price: price,
          escrow_fee: escrowFee,
          escrow_fee_percent: escrowFeePercent * 100,
          client_commission: clientCommission,
          client_commission_percent: isMicrotask ? null : clientCommissionPercent * 100,
          client_pays: clientPays,
          worker_commission: workerCommission,
          worker_commission_percent: workerCommission > 0 ? (workerCommission / price) * 100 : 0,
          worker_receives: workerReceives,
        },
        is_microtask: isMicrotask,
      });
    } catch (error: any) {
      console.error('Commission calc error:', error);
      return NextResponse.json(
        { error: 'Failed to calculate commission' },
        { status: 500 }
      );
    }
  });
}
