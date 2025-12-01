import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Shifts costs configuration
const SHIFTS_COSTS: Record<string, number> = {
  boost_application: 2,
  boost_profile: 5,
  direct_message: 1,
  feature_job: 3,
  urgent_badge: 2,
  direct_invite: 1,
  ai_recommendation: 5,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, action, reference_id, reference_type } = body

    if (!user_id || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      )
    }

    const cost = SHIFTS_COSTS[action]
    if (!cost) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Return mock response for development if not configured
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        new_balance: 8,
        shifts_used: cost,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current balance
    const { data: balance, error: balanceError } = await supabase
      .from('shifts_balance')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (balanceError || !balance) {
      return NextResponse.json(
        { error: 'No Shifts balance found' },
        { status: 404 }
      )
    }

    if (balance.balance < cost) {
      return NextResponse.json(
        { 
          error: 'Insufficient Shifts',
          required: cost,
          available: balance.balance,
        },
        { status: 400 }
      )
    }

    const newBalance = balance.balance - cost

    // Update balance
    const { error: updateError } = await supabase
      .from('shifts_balance')
      .update({
        balance: newBalance,
        lifetime_used: (balance.lifetime_used || 0) + cost,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)

    if (updateError) {
      console.error('Error updating balance:', updateError)
      return NextResponse.json(
        { error: 'Failed to use Shifts' },
        { status: 500 }
      )
    }

    // Log transaction
    await supabase
      .from('shifts_transactions')
      .insert({
        user_id,
        type: action,
        amount: -cost,
        balance_after: newBalance,
        description: `Used ${cost} Shifts for ${action.replace('_', ' ')}`,
        reference_id,
        reference_type,
      })

    // Create boost record if applicable
    if (action === 'boost_profile' || action === 'feature_job') {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

      await supabase
        .from('boosts')
        .insert({
          user_id,
          boost_type: action === 'boost_profile' ? 'profile' : 'job',
          reference_id,
          shifts_used: cost,
          expires_at: expiresAt.toISOString(),
          is_active: true,
        })
    }

    return NextResponse.json({
      success: true,
      new_balance: newBalance,
      shifts_used: cost,
    })
  } catch (error) {
    console.error('Error in use Shifts API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
