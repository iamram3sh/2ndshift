import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const APPLICATION_CREDITS_COST = 3

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { project_id, worker_id } = body

    if (!project_id || !worker_id) {
      return NextResponse.json(
        { error: 'Project ID and Worker ID are required' },
        { status: 400 }
      )
    }

    // Return mock response if not configured
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        application_id: 'mock-application-id',
        credits_used: APPLICATION_CREDITS_COST,
        new_balance: 7,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('project_id', project_id)
      .eq('worker_id', worker_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already applied to this project' },
        { status: 400 }
      )
    }

    // Get current balance
    const { data: balance, error: balanceError } = await supabase
      .from('shifts_balance')
      .select('*')
      .eq('user_id', worker_id)
      .single()

    if (balanceError || !balance) {
      return NextResponse.json(
        { error: 'No Shifts balance found' },
        { status: 404 }
      )
    }

    if (balance.balance < APPLICATION_CREDITS_COST) {
      return NextResponse.json(
        {
          error: 'Insufficient Shifts',
          required: APPLICATION_CREDITS_COST,
          available: balance.balance,
        },
        { status: 400 }
      )
    }

    // Deduct credits
    const newBalance = balance.balance - APPLICATION_CREDITS_COST

    const { error: updateError } = await supabase
      .from('shifts_balance')
      .update({
        balance: newBalance,
        lifetime_used: (balance.lifetime_used || 0) + APPLICATION_CREDITS_COST,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', worker_id)

    if (updateError) {
      console.error('Error updating balance:', updateError)
      return NextResponse.json(
        { error: 'Failed to deduct Shifts' },
        { status: 500 }
      )
    }

    // Log transaction
    await supabase.from('shifts_transactions').insert({
      user_id: worker_id,
      type: 'boost_application',
      amount: -APPLICATION_CREDITS_COST,
      balance_after: newBalance,
      description: `Used ${APPLICATION_CREDITS_COST} Shifts to apply for job`,
      reference_id: project_id,
      reference_type: 'project',
    })

    // Create application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert({
        project_id,
        worker_id,
        credits_used: APPLICATION_CREDITS_COST,
        status: 'pending',
      })
      .select()
      .single()

    if (appError) {
      console.error('Error creating application:', appError)
      // Refund credits if application creation fails
      await supabase
        .from('shifts_balance')
        .update({
          balance: balance.balance,
          lifetime_used: balance.lifetime_used || 0,
        })
        .eq('user_id', worker_id)

      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      application_id: application.id,
      credits_used: APPLICATION_CREDITS_COST,
      new_balance: newBalance,
    })
  } catch (error) {
    console.error('Error in apply API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

