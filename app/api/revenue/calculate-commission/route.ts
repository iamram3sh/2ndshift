import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateCommissions, isFirstThreeJobs } from '@/lib/revenue/commission'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      contractAmount,
      workerId,
      clientId,
      paymentAmount,
      isMicroTask = false,
    } = body

    if (!contractAmount || !workerId || !clientId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Return mock data if not configured
    if (!supabaseUrl || !supabaseServiceKey) {
      const mockResult = calculateCommissions({
        contractAmount,
        workerId,
        isWorkerVerified: false,
        isFirstThreeJobs: false,
        clientHasSubscription: false,
        isMicroTask,
        paymentAmount: paymentAmount || contractAmount,
      })

      return NextResponse.json({
        success: true,
        ...mockResult,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get worker verification status
    const { data: workerProfile } = await supabase
      .from('worker_profiles')
      .select('is_verified')
      .eq('user_id', workerId)
      .single()

    const isWorkerVerified = workerProfile?.is_verified || false

    // Check if first three jobs
    const isFirstThree = await isFirstThreeJobs(workerId, supabase)

    // Check client subscription
    const { data: clientSubscription } = await supabase
      .from('user_subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('user_id', clientId)
      .in('status', ['active', 'trial'])
      .single()

    const clientHasSubscription = !!clientSubscription

    // Calculate commissions
    const result = calculateCommissions({
      contractAmount,
      workerId,
      isWorkerVerified,
      isFirstThreeJobs: isFirstThree,
      clientHasSubscription,
      isMicroTask,
      paymentAmount: paymentAmount || contractAmount,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error calculating commission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

