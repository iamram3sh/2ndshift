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
        balance: 10,
        free_balance: 5,
        lifetime_purchased: 0,
        lifetime_used: 0,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('shifts_balance')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching balance:', error)
      return NextResponse.json(
        { error: 'Failed to fetch balance' },
        { status: 500 }
      )
    }

    // If no balance exists, return defaults
    if (!data) {
      return NextResponse.json({
        balance: 5,
        free_balance: 5,
        lifetime_purchased: 0,
        lifetime_used: 0,
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in balance API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
