import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userType = searchParams.get('userType') || 'worker'

    // Return mock data for development if not configured
    if (!supabaseUrl || !supabaseServiceKey) {
      const mockPlans = userType === 'worker' ? [
        {
          id: '1',
          name: 'Free',
          slug: 'worker-free',
          price_monthly_inr: 0,
          platform_fee_percent: 10,
          free_shifts_monthly: 5,
          features: ['Create professional profile', 'Apply to unlimited projects', 'Basic search visibility', 'Email support'],
        },
        {
          id: '2',
          name: 'Professional',
          slug: 'worker-professional',
          price_monthly_inr: 49900,
          platform_fee_percent: 8,
          free_shifts_monthly: 30,
          features: ['Everything in Free', 'Profile boost (1 week/month)', 'Featured in recommendations', 'Priority in search', 'Skills verification badges', 'Priority support'],
        },
        {
          id: '3',
          name: 'Expert',
          slug: 'worker-expert',
          price_monthly_inr: 99900,
          platform_fee_percent: 5,
          free_shifts_monthly: 100,
          features: ['Everything in Professional', 'Permanent profile boost', 'Top placement in searches', 'Expert badge', 'Early access to premium projects', 'Dedicated account manager', 'Phone support'],
        },
      ] : [
        {
          id: '4',
          name: 'Starter',
          slug: 'client-starter',
          price_monthly_inr: 0,
          platform_fee_percent: 12,
          free_shifts_monthly: 5,
          features: ['Post unlimited projects', 'Access to all professionals', 'Basic filters and search', 'Email support'],
        },
        {
          id: '5',
          name: 'Business',
          slug: 'client-business',
          price_monthly_inr: 149900,
          platform_fee_percent: 10,
          free_shifts_monthly: 50,
          features: ['Everything in Starter', '3 featured job listings/month', 'AI-powered recommendations', 'Advanced filters & analytics', 'Priority matching', 'Priority support'],
        },
        {
          id: '6',
          name: 'Enterprise',
          slug: 'client-enterprise',
          price_monthly_inr: 0,
          platform_fee_percent: 5,
          free_shifts_monthly: 0,
          features: ['Everything in Business', 'Custom platform fee', 'Unlimited Shifts', 'Unlimited featured listings', 'Custom integrations (API)', 'Dedicated account manager', 'Custom contracts & SLA'],
        },
      ]

      return NextResponse.json({ plans: mockPlans })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('user_type', userType)
      .eq('is_active', true)
      .order('price_monthly_inr', { ascending: true })

    if (error) {
      console.error('Error fetching plans:', error)
      return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
    }

    return NextResponse.json({ plans: data })
  } catch (error) {
    console.error('Error in plans API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
