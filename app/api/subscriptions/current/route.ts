import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Return mock data for development if not configured
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        subscription: null,
        plan: {
          id: 'free',
          name: 'Free',
          platform_fee_percent: 10,
          free_shifts_monthly: 5,
        },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user's current subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('user_id', userId)
      .in('status', ['active', 'trial'])
      .single()

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subError)
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      )
    }

    if (!subscription) {
      // Return default free plan
      const { data: freePlan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('price_monthly_inr', 0)
        .limit(1)
        .single()

      return NextResponse.json({
        subscription: null,
        plan: freePlan || {
          id: 'free',
          name: 'Free',
          platform_fee_percent: 10,
          free_shifts_monthly: 5,
        },
      })
    }

    return NextResponse.json({
      subscription,
      plan: subscription.plan,
    })
  } catch (error) {
    console.error('Error in current subscription API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
