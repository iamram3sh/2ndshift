import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Razorpay from 'razorpay'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || ''
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan_id, user_id, billing_period = 'monthly' } = body

    if (!plan_id || !user_id) {
      return NextResponse.json(
        { error: 'Plan ID and User ID are required' },
        { status: 400 }
      )
    }

    // Check if services are configured
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the plan
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .single()

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    // Check if plan is free
    if (plan.price_monthly_inr === 0) {
      // Free plan - just create subscription
      const periodEnd = new Date()
      periodEnd.setMonth(periodEnd.getMonth() + 1)

      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id,
          plan_id,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
        }, {
          onConflict: 'user_id',
        })
        .select()
        .single()

      if (subError) {
        console.error('Error creating subscription:', subError)
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        )
      }

      // Credit monthly free Shifts
      if (plan.free_shifts_monthly > 0) {
        await creditFreeShifts(supabase, user_id, plan.free_shifts_monthly)
      }

      return NextResponse.json({
        success: true,
        subscription,
        plan,
      })
    }

    // Paid plan - create Razorpay subscription
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 503 }
      )
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })

    // Create or get Razorpay plan
    const amount = billing_period === 'yearly' && plan.price_yearly_inr 
      ? plan.price_yearly_inr 
      : plan.price_monthly_inr

    const period = billing_period === 'yearly' ? 'yearly' : 'monthly'
    const interval = billing_period === 'yearly' ? 1 : 1

    // For now, create a single order (subscriptions require Razorpay plan setup)
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `sub_${Date.now()}`,
      notes: {
        user_id,
        plan_id,
        plan_name: plan.name,
        billing_period,
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount,
      currency: 'INR',
      key: razorpayKeyId,
      plan,
      billing_period,
    })
  } catch (error) {
    console.error('Error in subscribe API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function creditFreeShifts(supabase: any, userId: string, amount: number) {
  // Get current balance
  const { data: balance } = await supabase
    .from('shifts_balance')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (balance) {
    // Update existing balance
    await supabase
      .from('shifts_balance')
      .update({
        balance: balance.balance + amount,
        free_balance: amount,
        last_free_credit_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
  } else {
    // Create new balance
    await supabase
      .from('shifts_balance')
      .insert({
        user_id: userId,
        balance: amount,
        free_balance: amount,
        last_free_credit_at: new Date().toISOString(),
      })
  }

  // Log transaction
  await supabase
    .from('shifts_transactions')
    .insert({
      user_id: userId,
      type: 'free_credit',
      amount,
      balance_after: (balance?.balance || 0) + amount,
      description: 'Monthly subscription bonus',
    })
}
