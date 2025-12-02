import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { application_id, reason } = body

    if (!application_id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    // Return mock response if not configured
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        credits_refunded: 3,
        new_balance: 10,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .single()

    if (appError || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    if (application.credits_refunded) {
      return NextResponse.json(
        { error: 'Credits already refunded' },
        { status: 400 }
      )
    }

    // Get current balance
    const { data: balance, error: balanceError } = await supabase
      .from('shifts_balance')
      .select('*')
      .eq('user_id', application.worker_id)
      .single()

    if (balanceError || !balance) {
      return NextResponse.json(
        { error: 'No Shifts balance found' },
        { status: 404 }
      )
    }

    // Refund credits
    const newBalance = balance.balance + application.credits_used

    const { error: updateError } = await supabase
      .from('shifts_balance')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', application.worker_id)

    if (updateError) {
      console.error('Error updating balance:', updateError)
      return NextResponse.json(
        { error: 'Failed to refund Shifts' },
        { status: 500 }
      )
    }

    // Log refund transaction
    await supabase.from('shifts_transactions').insert({
      user_id: application.worker_id,
      type: 'refund',
      amount: application.credits_used,
      balance_after: newBalance,
      description: `Refunded ${application.credits_used} Shifts - ${reason || 'Application cancelled or not viewed'}`,
      reference_id: application_id,
      reference_type: 'application',
    })

    // Mark application as refunded
    await supabase
      .from('applications')
      .update({
        credits_refunded: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', application_id)

    return NextResponse.json({
      success: true,
      credits_refunded: application.credits_used,
      new_balance: newBalance,
    })
  } catch (error) {
    console.error('Error in refund credits API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

