import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userType = searchParams.get('userType') || 'worker'

    if (!supabaseUrl || !supabaseServiceKey) {
      // Return mock data for development
      const mockPackages = userType === 'worker' ? [
        { id: '1', name: 'Starter', shifts_amount: 10, price_inr: 9900, is_popular: false, discount_percent: 0 },
        { id: '2', name: 'Popular', shifts_amount: 25, price_inr: 19900, is_popular: true, discount_percent: 20 },
        { id: '3', name: 'Value', shifts_amount: 50, price_inr: 34900, is_popular: false, discount_percent: 30 },
        { id: '4', name: 'Pro', shifts_amount: 100, price_inr: 59900, is_popular: false, discount_percent: 40 },
      ] : [
        { id: '5', name: 'Starter', shifts_amount: 10, price_inr: 14900, is_popular: false, discount_percent: 0 },
        { id: '6', name: 'Popular', shifts_amount: 25, price_inr: 29900, is_popular: true, discount_percent: 20 },
        { id: '7', name: 'Value', shifts_amount: 50, price_inr: 49900, is_popular: false, discount_percent: 30 },
        { id: '8', name: 'Pro', shifts_amount: 100, price_inr: 84900, is_popular: false, discount_percent: 40 },
      ]

      return NextResponse.json({ packages: mockPackages })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('shifts_packages')
      .select('*')
      .or(`user_type.eq.${userType},user_type.eq.both`)
      .eq('is_active', true)
      .order('shifts_amount', { ascending: true })

    if (error) {
      console.error('Error fetching packages:', error)
      return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
    }

    return NextResponse.json({ packages: data })
  } catch (error) {
    console.error('Error in packages API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
