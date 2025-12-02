/**
 * POST /api/v1/credits/purchase
 * Purchase Shift Credits (creates payment intent - stub for Razorpay/Stripe)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const purchaseSchema = z.object({
  package_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = purchaseSchema.parse(body);

      // Get package details
      const { data: packageData, error: packageError } = await supabaseAdmin
        .from('shifts_packages')
        .select('id, name, shifts_amount, price_inr, user_type')
        .eq('id', validated.package_id)
        .eq('is_active', true)
        .single();

      if (packageError || !packageData) {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 }
        );
      }

      // TODO: Create payment intent with Razorpay/Stripe
      // For now, return stub payment intent
      const paymentIntentId = `pi_${crypto.randomUUID()}`;

      // Store purchase record
      const { data: purchase, error: purchaseError } = await supabaseAdmin
        .from('shifts_purchases')
        .insert({
          user_id: authReq.userId,
          package_id: validated.package_id,
          shifts_amount: packageData.shifts_amount,
          amount_paid: packageData.price_inr,
          razorpay_order_id: paymentIntentId,
          status: 'pending',
        })
        .select()
        .single();

      if (purchaseError) {
        return NextResponse.json(
          { error: 'Failed to create purchase' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        payment_intent_id: paymentIntentId,
        purchase_id: purchase.id,
        amount: packageData.price_inr,
        credits: packageData.shifts_amount,
        // TODO: Return actual payment provider client secret/key
        client_secret: 'stub_client_secret',
        message: 'Payment intent created. Replace with actual Razorpay/Stripe integration.',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Purchase error:', error);
      return NextResponse.json(
        { error: 'Failed to create purchase' },
        { status: 500 }
      );
    }
  });
}
