import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Platform fees configuration
const PLATFORM_CONFIG = {
  platformFeePercent: 10,
  tdsRate: 10,
  tdsThreshold: 30000,
  gstRate: 18,
  minEscrowAmount: 500,
  maxRevisions: 2,
  autoReleaseDays: 7,
}

function calculatePayout(totalAmount: number) {
  const platformFee = totalAmount * (PLATFORM_CONFIG.platformFeePercent / 100)
  const afterFee = totalAmount - platformFee
  const tdsAmount = afterFee > PLATFORM_CONFIG.tdsThreshold 
    ? afterFee * (PLATFORM_CONFIG.tdsRate / 100) 
    : 0
  const professionalPayout = afterFee - tdsAmount

  return {
    totalAmount,
    platformFee: Math.round(platformFee * 100) / 100,
    tdsAmount: Math.round(tdsAmount * 100) / 100,
    professionalPayout: Math.round(professionalPayout * 100) / 100,
  }
}

// GET - Fetch escrow details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const escrowId = searchParams.get('escrowId')
    const contractId = searchParams.get('contractId')
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Mock data for development
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        escrow: escrowId || contractId ? {
          id: 'mock-escrow-id',
          status: 'pending',
          totalAmount: 50000,
          platformFee: 5000,
          tdsAmount: 4500,
          professionalPayout: 40500,
          createdAt: new Date().toISOString(),
        } : null,
        config: PLATFORM_CONFIG,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('payment_escrow')
      .select('*')

    if (escrowId) {
      query = query.eq('id', escrowId)
    } else if (contractId) {
      query = query.eq('contract_id', contractId)
    }

    query = query.or(`client_id.eq.${userId},professional_id.eq.${userId}`)

    const { data, error } = await query.single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching escrow:', error)
      return NextResponse.json({ error: 'Failed to fetch escrow' }, { status: 500 })
    }

    return NextResponse.json({
      escrow: data,
      config: PLATFORM_CONFIG,
    })
  } catch (error) {
    console.error('Error in escrow GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create escrow for a contract
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractId, projectId, clientId, professionalId, amount } = body

    if (!contractId || !projectId || !clientId || !professionalId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (amount < PLATFORM_CONFIG.minEscrowAmount) {
      return NextResponse.json(
        { error: `Minimum amount is ₹${PLATFORM_CONFIG.minEscrowAmount}` },
        { status: 400 }
      )
    }

    const payout = calculatePayout(amount)

    // Mock for development
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        escrow: {
          id: 'mock-escrow-' + Date.now(),
          contractId,
          projectId,
          clientId,
          professionalId,
          ...payout,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        message: 'Escrow created. Please fund to proceed.',
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if escrow already exists
    const { data: existing } = await supabase
      .from('payment_escrow')
      .select('id, status')
      .eq('contract_id', contractId)
      .single()

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Escrow already exists for this contract',
        escrow: existing,
      }, { status: 400 })
    }

    // Create escrow
    const { data, error } = await supabase
      .from('payment_escrow')
      .insert({
        contract_id: contractId,
        project_id: projectId,
        client_id: clientId,
        professional_id: professionalId,
        total_amount: payout.totalAmount,
        platform_fee: payout.platformFee,
        tds_amount: payout.tdsAmount,
        professional_payout: payout.professionalPayout,
        status: 'pending',
        max_revisions: PLATFORM_CONFIG.maxRevisions,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating escrow:', error)
      return NextResponse.json({ error: 'Failed to create escrow' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      escrow: data,
      message: 'Escrow created. Please fund to proceed.',
    })
  } catch (error) {
    console.error('Error in escrow POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update escrow status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { escrowId, action, userId, rating, review, feedback } = body

    if (!escrowId || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const validActions = [
      'fund', 'start_work', 'submit_work', 
      'request_revision', 'approve', 'dispute', 'cancel'
    ]

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Mock for development
    if (!supabaseUrl || !supabaseServiceKey) {
      const statusMap: Record<string, string> = {
        fund: 'funded',
        start_work: 'work_started',
        submit_work: 'work_submitted',
        request_revision: 'revision_requested',
        approve: 'released',
        dispute: 'disputed',
        cancel: 'cancelled',
      }

      return NextResponse.json({
        success: true,
        escrow: {
          id: escrowId,
          status: statusMap[action],
          updatedAt: new Date().toISOString(),
        },
        message: `Escrow ${action} successful`,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current escrow
    const { data: escrow, error: fetchError } = await supabase
      .from('payment_escrow')
      .select('*')
      .eq('id', escrowId)
      .single()

    if (fetchError || !escrow) {
      return NextResponse.json({ error: 'Escrow not found' }, { status: 404 })
    }

    // Validate user authorization
    if (action === 'approve' || action === 'request_revision' || action === 'fund') {
      if (escrow.client_id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    } else if (action === 'submit_work' || action === 'start_work') {
      if (escrow.professional_id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    // Build update based on action
    let updateData: Record<string, any> = { updated_at: new Date().toISOString() }

    switch (action) {
      case 'fund':
        if (escrow.status !== 'pending') {
          return NextResponse.json({ error: 'Invalid status for funding' }, { status: 400 })
        }
        updateData.status = 'funded'
        updateData.funded_at = new Date().toISOString()
        break

      case 'start_work':
        if (escrow.status !== 'funded') {
          return NextResponse.json({ error: 'Escrow must be funded first' }, { status: 400 })
        }
        updateData.status = 'work_started'
        updateData.work_started_at = new Date().toISOString()
        break

      case 'submit_work':
        if (!['funded', 'work_started', 'revision_requested'].includes(escrow.status)) {
          return NextResponse.json({ error: 'Invalid status for submission' }, { status: 400 })
        }
        updateData.status = 'work_submitted'
        updateData.work_submitted_at = new Date().toISOString()
        break

      case 'request_revision':
        if (escrow.status !== 'work_submitted') {
          return NextResponse.json({ error: 'Work must be submitted first' }, { status: 400 })
        }
        if (escrow.revision_count >= escrow.max_revisions) {
          return NextResponse.json({ error: 'Maximum revisions reached' }, { status: 400 })
        }
        updateData.status = 'revision_requested'
        updateData.revision_count = escrow.revision_count + 1
        break

      case 'approve':
        if (escrow.status !== 'work_submitted') {
          return NextResponse.json({ error: 'Work must be submitted first' }, { status: 400 })
        }
        if (!rating || rating < 1 || rating > 5) {
          return NextResponse.json({ error: 'Rating required (1-5)' }, { status: 400 })
        }
        updateData.status = 'released'
        updateData.client_rating = rating
        updateData.client_review = review || null
        updateData.rating_submitted_at = new Date().toISOString()
        updateData.approved_at = new Date().toISOString()
        updateData.released_at = new Date().toISOString()
        break

      case 'dispute':
        updateData.status = 'disputed'
        updateData.dispute_reason = feedback || null
        updateData.dispute_opened_at = new Date().toISOString()
        break

      case 'cancel':
        if (escrow.status !== 'pending') {
          return NextResponse.json({ error: 'Can only cancel pending escrows' }, { status: 400 })
        }
        updateData.status = 'cancelled'
        break
    }

    const { data: updated, error: updateError } = await supabase
      .from('payment_escrow')
      .update(updateData)
      .eq('id', escrowId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating escrow:', updateError)
      return NextResponse.json({ error: 'Failed to update escrow' }, { status: 500 })
    }

    // If approved, update contract status
    if (action === 'approve') {
      await supabase
        .from('contracts')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', escrow.contract_id)

      // Create payment release record
      await supabase
        .from('payment_releases')
        .insert({
          escrow_id: escrowId,
          amount: escrow.total_amount,
          platform_fee: escrow.platform_fee,
          tds_deducted: escrow.tds_amount,
          net_amount: escrow.professional_payout,
        })
    }

    return NextResponse.json({
      success: true,
      escrow: updated,
      message: `Escrow ${action} successful`,
    })
  } catch (error) {
    console.error('Error in escrow PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
