// ============================================
// 2NDSHIFT - ESCROW & MILESTONE SERVICE
// Financial protection for both parties
// ============================================

import { supabaseAdmin } from './supabase/admin'
import type { EscrowAccount, Milestone, EscrowStatus, MilestoneStatus } from '@/types/features'

// Platform fee percentage (can be adjusted based on subscription)
const DEFAULT_PLATFORM_FEE = 10.00

/**
 * Create an escrow account for a contract
 */
export async function createEscrowAccount(
  contractId: string,
  clientId: string,
  workerId: string,
  totalAmount: number,
  platformFeePercent: number = DEFAULT_PLATFORM_FEE
): Promise<EscrowAccount | null> {
  const { data, error } = await supabaseAdmin
    .from('escrow_accounts')
    .insert({
      contract_id: contractId,
      client_id: clientId,
      worker_id: workerId,
      total_amount: totalAmount,
      platform_fee_percent: platformFeePercent,
      status: 'pending_funding',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating escrow account:', error)
    return null
  }

  return data
}

/**
 * Create milestones for an escrow account
 */
export async function createMilestones(
  escrowId: string,
  contractId: string,
  milestones: Array<{
    title: string
    description?: string
    amount: number
    due_date?: string
  }>
): Promise<Milestone[]> {
  const milestonesData = milestones.map((m, index) => ({
    escrow_id: escrowId,
    contract_id: contractId,
    title: m.title,
    description: m.description,
    amount: m.amount,
    due_date: m.due_date,
    sequence_order: index + 1,
    status: 'pending',
  }))

  const { data, error } = await supabaseAdmin
    .from('milestones')
    .insert(milestonesData)
    .select()

  if (error) {
    console.error('Error creating milestones:', error)
    return []
  }

  return data || []
}

/**
 * Fund escrow account (client deposits money)
 */
export async function fundEscrow(
  escrowId: string,
  amount: number,
  razorpayPaymentId?: string
): Promise<{ success: boolean; error?: string }> {
  // Get current escrow
  const { data: escrow, error: fetchError } = await supabaseAdmin
    .from('escrow_accounts')
    .select('*')
    .eq('id', escrowId)
    .single()

  if (fetchError || !escrow) {
    return { success: false, error: 'Escrow account not found' }
  }

  if (escrow.status !== 'pending_funding') {
    return { success: false, error: 'Escrow already funded or closed' }
  }

  const newFundedAmount = (escrow.funded_amount || 0) + amount
  const isFullyFunded = newFundedAmount >= escrow.total_amount

  const { error: updateError } = await supabaseAdmin
    .from('escrow_accounts')
    .update({
      funded_amount: newFundedAmount,
      status: isFullyFunded ? 'funded' : 'pending_funding',
      funded_at: isFullyFunded ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', escrowId)

  if (updateError) {
    return { success: false, error: 'Failed to update escrow' }
  }

  // If fully funded, activate first milestone
  if (isFullyFunded) {
    await supabaseAdmin
      .from('milestones')
      .update({ status: 'in_progress' })
      .eq('escrow_id', escrowId)
      .eq('sequence_order', 1)
  }

  return { success: true }
}

/**
 * Worker submits milestone for approval
 */
export async function submitMilestone(
  milestoneId: string,
  workerId: string,
  notes?: string,
  attachments?: any[]
): Promise<{ success: boolean; error?: string }> {
  // Verify worker owns this milestone
  const { data: milestone, error: fetchError } = await supabaseAdmin
    .from('milestones')
    .select('*, escrow:escrow_accounts(*)')
    .eq('id', milestoneId)
    .single()

  if (fetchError || !milestone) {
    return { success: false, error: 'Milestone not found' }
  }

  if (milestone.escrow?.worker_id !== workerId) {
    return { success: false, error: 'Unauthorized' }
  }

  if (milestone.status !== 'in_progress') {
    return { success: false, error: 'Milestone not in progress' }
  }

  const { error: updateError } = await supabaseAdmin
    .from('milestones')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      worker_notes: notes,
      attachments: attachments || milestone.attachments,
      updated_at: new Date().toISOString(),
    })
    .eq('id', milestoneId)

  if (updateError) {
    return { success: false, error: 'Failed to submit milestone' }
  }

  return { success: true }
}

/**
 * Client approves milestone and releases payment
 */
export async function approveMilestone(
  milestoneId: string,
  clientId: string,
  feedback?: string
): Promise<{ success: boolean; releasedAmount?: number; error?: string }> {
  // Verify client owns this milestone
  const { data: milestone, error: fetchError } = await supabaseAdmin
    .from('milestones')
    .select('*, escrow:escrow_accounts(*)')
    .eq('id', milestoneId)
    .single()

  if (fetchError || !milestone) {
    return { success: false, error: 'Milestone not found' }
  }

  if (milestone.escrow?.client_id !== clientId) {
    return { success: false, error: 'Unauthorized' }
  }

  if (milestone.status !== 'submitted') {
    return { success: false, error: 'Milestone not submitted for approval' }
  }

  const now = new Date().toISOString()

  // Update milestone status
  const { error: milestoneError } = await supabaseAdmin
    .from('milestones')
    .update({
      status: 'approved',
      approved_at: now,
      client_feedback: feedback,
      updated_at: now,
    })
    .eq('id', milestoneId)

  if (milestoneError) {
    return { success: false, error: 'Failed to approve milestone' }
  }

  // Update escrow released amount
  const newReleasedAmount = (milestone.escrow.released_amount || 0) + milestone.amount

  await supabaseAdmin
    .from('escrow_accounts')
    .update({
      released_amount: newReleasedAmount,
      status: newReleasedAmount >= milestone.escrow.total_amount ? 'released' : 'funded',
      updated_at: now,
    })
    .eq('id', milestone.escrow_id)

  // Activate next milestone if exists
  const nextOrder = milestone.sequence_order + 1
  await supabaseAdmin
    .from('milestones')
    .update({ status: 'in_progress' })
    .eq('escrow_id', milestone.escrow_id)
    .eq('sequence_order', nextOrder)
    .eq('status', 'pending')

  // Calculate worker payout
  const platformFee = (milestone.amount * milestone.escrow.platform_fee_percent) / 100
  const workerPayout = milestone.amount - platformFee

  // TODO: Process actual payment via Razorpay
  // await processPayoutToWorker(milestone.escrow.worker_id, workerPayout)

  return { success: true, releasedAmount: workerPayout }
}

/**
 * Client requests revision
 */
export async function requestRevision(
  milestoneId: string,
  clientId: string,
  feedback: string
): Promise<{ success: boolean; error?: string }> {
  const { data: milestone, error: fetchError } = await supabaseAdmin
    .from('milestones')
    .select('*, escrow:escrow_accounts(*)')
    .eq('id', milestoneId)
    .single()

  if (fetchError || !milestone) {
    return { success: false, error: 'Milestone not found' }
  }

  if (milestone.escrow?.client_id !== clientId) {
    return { success: false, error: 'Unauthorized' }
  }

  if (milestone.status !== 'submitted') {
    return { success: false, error: 'Milestone not submitted' }
  }

  const { error: updateError } = await supabaseAdmin
    .from('milestones')
    .update({
      status: 'revision_requested',
      client_feedback: feedback,
      updated_at: new Date().toISOString(),
    })
    .eq('id', milestoneId)

  if (updateError) {
    return { success: false, error: 'Failed to request revision' }
  }

  return { success: true }
}

/**
 * Initiate dispute on milestone
 */
export async function initiateDispute(
  milestoneId: string,
  initiatorId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const { data: milestone, error: fetchError } = await supabaseAdmin
    .from('milestones')
    .select('*, escrow:escrow_accounts(*)')
    .eq('id', milestoneId)
    .single()

  if (fetchError || !milestone) {
    return { success: false, error: 'Milestone not found' }
  }

  const isClient = milestone.escrow?.client_id === initiatorId
  const isWorker = milestone.escrow?.worker_id === initiatorId

  if (!isClient && !isWorker) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error: updateError } = await supabaseAdmin
    .from('milestones')
    .update({
      status: 'disputed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', milestoneId)

  if (updateError) {
    return { success: false, error: 'Failed to initiate dispute' }
  }

  // Update escrow status
  await supabaseAdmin
    .from('escrow_accounts')
    .update({
      status: 'disputed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', milestone.escrow_id)

  // TODO: Create dispute ticket, notify admin

  return { success: true }
}

/**
 * Get escrow account with milestones
 */
export async function getEscrowWithMilestones(
  contractId: string
): Promise<EscrowAccount | null> {
  const { data, error } = await supabaseAdmin
    .from('escrow_accounts')
    .select(`
      *,
      milestones(*)
    `)
    .eq('contract_id', contractId)
    .single()

  if (error) {
    console.error('Error fetching escrow:', error)
    return null
  }

  return data
}

/**
 * Calculate milestone breakdown from total amount
 */
export function suggestMilestones(
  totalAmount: number,
  projectDescription: string,
  durationWeeks: number
): Array<{ title: string; amount: number; percentage: number }> {
  // Simple suggestion algorithm
  if (durationWeeks <= 1) {
    return [
      { title: 'Project Completion', amount: totalAmount, percentage: 100 }
    ]
  }

  if (durationWeeks <= 2) {
    return [
      { title: 'Initial Delivery', amount: Math.round(totalAmount * 0.5), percentage: 50 },
      { title: 'Final Delivery', amount: Math.round(totalAmount * 0.5), percentage: 50 }
    ]
  }

  if (durationWeeks <= 4) {
    return [
      { title: 'Project Kickoff & Planning', amount: Math.round(totalAmount * 0.2), percentage: 20 },
      { title: 'Development Phase 1', amount: Math.round(totalAmount * 0.4), percentage: 40 },
      { title: 'Final Delivery & Review', amount: Math.round(totalAmount * 0.4), percentage: 40 }
    ]
  }

  // Longer projects
  return [
    { title: 'Project Kickoff & Planning', amount: Math.round(totalAmount * 0.15), percentage: 15 },
    { title: 'Development Phase 1', amount: Math.round(totalAmount * 0.25), percentage: 25 },
    { title: 'Development Phase 2', amount: Math.round(totalAmount * 0.25), percentage: 25 },
    { title: 'Testing & QA', amount: Math.round(totalAmount * 0.15), percentage: 15 },
    { title: 'Final Delivery & Handoff', amount: Math.round(totalAmount * 0.20), percentage: 20 }
  ]
}
