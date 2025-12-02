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

      // Use demo payment in non-production or if allowed
      const useDemoPayment = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEMO_PAYMENTS === 'true';

      let paymentIntentId: string;
      let paymentStatus = 'pending';

      if (useDemoPayment) {
        // Use demo payment simulator
        const demoResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/demo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: packageData.price_inr,
            currency: 'INR',
            description: `Purchase ${packageData.shifts_amount} Shift Credits`,
          }),
        });

        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          paymentIntentId = demoData.payment_id;
          paymentStatus = 'completed'; // Demo payments auto-complete
          
          // Auto-credit the user in demo mode
          const { data: credits } = await supabaseAdmin
            .from('shift_credits')
            .select('balance')
            .eq('user_id', authReq.userId)
            .single();

          if (credits) {
            await supabaseAdmin
              .from('shift_credits')
              .update({ balance: (credits.balance || 0) + packageData.shifts_amount })
              .eq('user_id', authReq.userId);

            // Create transaction record
            await supabaseAdmin
              .from('credit_transactions')
              .insert({
                user_id: authReq.userId,
                change: packageData.shifts_amount,
                reason: 'purchase',
                reference_id: paymentIntentId,
                meta: { package_id: validated.package_id, demo: true },
              });
          }
        } else {
          paymentIntentId = `pi_${crypto.randomUUID()}`;
        }
      } else {
        // TODO: Create payment intent with Razorpay/Stripe
        paymentIntentId = `pi_${crypto.randomUUID()}`;
      }

      // Store purchase record
      const { data: purchase, error: purchaseError } = await supabaseAdmin
        .from('shifts_purchases')
        .insert({
          user_id: authReq.userId,
          package_id: validated.package_id,
          shifts_amount: packageData.shifts_amount,
          amount_paid: packageData.price_inr,
          razorpay_order_id: paymentIntentId,
          status: paymentStatus,
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
        status: paymentStatus,
        demo: useDemoPayment,
        message: useDemoPayment 
          ? 'Demo payment completed. Credits added to account.'
          : 'Payment intent created. Replace with actual Razorpay/Stripe integration.',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.issues },
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
