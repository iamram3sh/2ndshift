import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// GET - Fetch milestones for an escrow
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const escrowId = searchParams.get('escrowId')

    if (!escrowId) {
      return NextResponse.json({ error: 'Escrow ID required' }, { status: 400 })
    }

    // Mock data for development
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        milestones: [
          {
            id: 'mock-1',
            number: 1,
            title: 'Design & Planning',
            description: 'UI/UX designs, wireframes, technical specs',
            amount: 10000,
            status: 'released',
            rating: 5,
          },
          {
            id: 'mock-2',
            number: 2,
            title: 'Development',
            description: 'Core functionality and frontend',
            amount: 25000,
            status: 'work_submitted',
          },
          {
            id: 'mock-3',
            number: 3,
            title: 'Testing & Launch',
            description: 'QA, bug fixes, deployment',
            amount: 15000,
            status: 'pending',
          },
        ],
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('escrow_milestones')
      .select('*')
      .eq('escrow_id', escrowId)
      .order('milestone_number', { ascending: true })

    if (error) {
      console.error('Error fetching milestones:', error)
      return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 })
    }

    // Transform to frontend format
    const milestones = (data || []).map(m => ({
      id: m.id,
      number: m.milestone_number,
      title: m.title,
      description: m.description,
      amount: m.amount,
      dueDate: m.due_date,
      status: m.status,
      submittedAt: m.submitted_at,
      approvedAt: m.approved_at,
      rating: m.rating,
      feedback: m.feedback,
    }))

    return NextResponse.json({ milestones })
  } catch (error) {
    console.error('Error in milestones GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create milestones for an escrow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { escrowId, milestones } = body

    if (!escrowId || !milestones || !Array.isArray(milestones)) {
      return NextResponse.json(
        { error: 'Escrow ID and milestones array required' },
        { status: 400 }
      )
    }

    // Mock for development
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        milestones: milestones.map((m: any, i: number) => ({
          id: `mock-${i}`,
          ...m,
          status: 'pending',
        })),
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Delete existing milestones
    await supabase
      .from('escrow_milestones')
      .delete()
      .eq('escrow_id', escrowId)

    // Insert new milestones
    const milestonesToInsert = milestones.map((m: any, i: number) => ({
      escrow_id: escrowId,
      milestone_number: i + 1,
      title: m.title,
      description: m.description || null,
      amount: m.amount,
      due_date: m.dueDate || null,
      status: 'pending',
    }))

    const { data, error } = await supabase
      .from('escrow_milestones')
      .insert(milestonesToInsert)
      .select()

    if (error) {
      console.error('Error creating milestones:', error)
      return NextResponse.json({ error: 'Failed to create milestones' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      milestones: data,
    })
  } catch (error) {
    console.error('Error in milestones POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update milestone status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { milestoneId, action, userId, rating, feedback } = body

    if (!milestoneId || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const validActions = ['fund', 'start_work', 'submit_work', 'approve', 'request_revision']

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
        approve: 'released',
        request_revision: 'work_started',
      }

      return NextResponse.json({
        success: true,
        milestone: {
          id: milestoneId,
          status: statusMap[action],
          rating: action === 'approve' ? rating : undefined,
        },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current milestone
    const { data: milestone, error: fetchError } = await supabase
      .from('escrow_milestones')
      .select('*, escrow:payment_escrow(*)')
      .eq('id', milestoneId)
      .single()

    if (fetchError || !milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }

    // Build update based on action
    let updateData: Record<string, any> = { updated_at: new Date().toISOString() }

    switch (action) {
      case 'fund':
        updateData.status = 'funded'
        break

      case 'start_work':
        if (milestone.status !== 'funded') {
          return NextResponse.json({ error: 'Milestone must be funded first' }, { status: 400 })
        }
        updateData.status = 'work_started'
        break

      case 'submit_work':
        if (!['funded', 'work_started'].includes(milestone.status)) {
          return NextResponse.json({ error: 'Invalid status for submission' }, { status: 400 })
        }
        updateData.status = 'work_submitted'
        updateData.submitted_at = new Date().toISOString()
        break

      case 'approve':
        if (milestone.status !== 'work_submitted') {
          return NextResponse.json({ error: 'Work must be submitted first' }, { status: 400 })
        }
        if (!rating || rating < 1 || rating > 5) {
          return NextResponse.json({ error: 'Rating required (1-5)' }, { status: 400 })
        }
        updateData.status = 'released'
        updateData.rating = rating
        updateData.feedback = feedback || null
        updateData.approved_at = new Date().toISOString()
        updateData.released_at = new Date().toISOString()
        break

      case 'request_revision':
        updateData.status = 'work_started'
        break
    }

    const { data: updated, error: updateError } = await supabase
      .from('escrow_milestones')
      .update(updateData)
      .eq('id', milestoneId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating milestone:', updateError)
      return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 })
    }

    // If approved, create payment release record
    if (action === 'approve') {
      await supabase
        .from('payment_releases')
        .insert({
          escrow_id: milestone.escrow_id,
          milestone_id: milestoneId,
          amount: milestone.amount,
          platform_fee: milestone.amount * 0.1,
          tds_deducted: milestone.amount > 30000 ? milestone.amount * 0.1 : 0,
          net_amount: milestone.amount * 0.9 - (milestone.amount > 30000 ? milestone.amount * 0.1 : 0),
        })

      // Update professional's trust score with the rating
      // This would call the trust score recalculation function
    }

    return NextResponse.json({
      success: true,
      milestone: updated,
    })
  } catch (error) {
    console.error('Error in milestones PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
