import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Return mock data for development if not configured
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        transactions: [
          {
            id: '1',
            type: 'free_credit',
            amount: 5,
            balance_after: 10,
            description: 'Welcome bonus',
            created_at: new Date().toISOString(),
          },
        ],
        total: 1,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get transactions with count
    const { data, error, count } = await supabase
      .from('shifts_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching transactions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      transactions: data || [],
      total: count || 0,
    })
  } catch (error) {
    console.error('Error in transactions API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
