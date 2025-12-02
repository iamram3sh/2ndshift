/**
 * POST /api/v1/subscriptions/subscribe
 * Subscribe to a plan (demo stub for Razorpay/Stripe)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const subscribeSchema = z.object({
  plan_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq: AuthenticatedRequest) => {
    try {
      const body = await request.json();
      const validated = subscribeSchema.parse(body);

      // Get plan details
      const { data: plan, error: planError } = await supabaseAdmin
        .from('subscription_plans')
        .select('*')
        .eq('id', validated.plan_id)
        .eq('is_active', true)
        .single();

      if (planError || !plan) {
        return NextResponse.json(
          { error: 'Plan not found' },
          { status: 404 }
        );
      }

      // Use demo payment in non-production
      const useDemoPayment = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEMO_PAYMENTS === 'true';

      let subscriptionId: string;
      let status = 'active';

      if (useDemoPayment && plan.price_monthly_inr > 0) {
        // Use demo payment simulator
        const demoResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/demo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: plan.price_monthly_inr / 100, // Convert paise to rupees
            currency: 'INR',
            description: `Subscribe to ${plan.name}`,
          }),
        });

        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          subscriptionId = demoData.payment_id;
          status = 'active'; // Demo subscriptions auto-activate
        } else {
          subscriptionId = `sub_${crypto.randomUUID()}`;
        }
      } else {
        subscriptionId = `sub_${crypto.randomUUID()}`;
      }

      // Check if user already has a subscription
      const { data: existingSub } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', authReq.userId)
        .single();

      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      if (existingSub) {
        // Update existing subscription
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('user_subscriptions')
          .update({
            plan_id: validated.plan_id,
            plan_slug: plan.slug,
            status: status as any,
            razorpay_subscription_id: subscriptionId,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            next_billing_date: periodEnd.toISOString(),
            cancel_at_period_end: false,
            cancelled_at: null,
          })
          .eq('user_id', authReq.userId)
          .select()
          .single();

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          subscription: updated,
          demo: useDemoPayment,
          message: useDemoPayment
            ? 'Demo subscription activated successfully'
            : 'Subscription updated. Replace with actual Razorpay/Stripe integration.',
        });
      } else {
        // Create new subscription
        const { data: newSub, error: createError } = await supabaseAdmin
          .from('user_subscriptions')
          .insert({
            user_id: authReq.userId,
            plan_id: validated.plan_id,
            plan_slug: plan.slug,
            status: status as any,
            razorpay_subscription_id: subscriptionId,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            next_billing_date: periodEnd.toISOString(),
          })
          .select()
          .single();

        if (createError) {
          return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          subscription: newSub,
          demo: useDemoPayment,
          message: useDemoPayment
            ? 'Demo subscription activated successfully'
            : 'Subscription created. Replace with actual Razorpay/Stripe integration.',
        });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.issues },
          { status: 400 }
        );
      }

      console.error('Subscribe error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }
  });
}
