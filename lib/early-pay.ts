// ============================================
// 2NDSHIFT - EARLYPAY SERVICE
// Earned Wage Access - Workers access money early
// ============================================

import { supabaseAdmin } from './supabase/admin'
import type { EarlyPayRequest, EarlyPayEligibility, EarlyPayStatus } from '@/types/features'

// Configuration
const DEFAULT_ADVANCE_FEE_PERCENT = 2.50 // 2.5% fee for early access
const MAX_ADVANCE_PERCENT = 80 // Max 80% of earned amount
const MIN_ELIGIBILITY_SCORE = 60 // Minimum score to be eligible

/**
 * Get or initialize EarlyPay eligibility for worker
 */
export async function getEarlyPayEligibility(userId: string): Promise<EarlyPayEligibility | null> {
  let { data, error } = await supabaseAdmin
    .from('early_pay_eligibility')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // Initialize eligibility if doesn't exist
    const eligibility = await calculateEligibilityScore(userId)
    
    const { data: newEligibility, error: createError } = await supabaseAdmin
      .from('early_pay_eligibility')
      .insert({
        user_id: userId,
        is_eligible: eligibility.score >= MIN_ELIGIBILITY_SCORE,
        eligibility_score: eligibility.score,
        max_advance_percent: eligibility.maxAdvancePercent,
        last_assessed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating eligibility:', createError)
      return null
    }
    return newEligibility
  }

  if (error) {
    console.error('Error fetching eligibility:', error)
    return null
  }

  return data
}

/**
 * Calculate eligibility score based on worker's history
 */
async function calculateEligibilityScore(userId: string): Promise<{
  score: number
  maxAdvancePercent: number
  factors: Record<string, number>
}> {
  let score = 0
  const factors: Record<string, number> = {}

  // Factor 1: Completed contracts (max 25 points)
  const { count: completedContracts } = await supabaseAdmin
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('worker_id', userId)
    .eq('status', 'completed')

  const contractsScore = Math.min((completedContracts || 0) * 5, 25)
  factors.completed_contracts = contractsScore
  score += contractsScore

  // Factor 2: On-time delivery rate (max 25 points)
  // For simplicity, we'll check milestone approvals
  const { data: milestones } = await supabaseAdmin
    .from('milestones')
    .select('status, due_date, approved_at')
    .eq('status', 'approved')
    .limit(20)

  if (milestones && milestones.length > 0) {
    const onTimeCount = milestones.filter(m => {
      if (!m.due_date || !m.approved_at) return true
      return new Date(m.approved_at) <= new Date(m.due_date)
    }).length
    const onTimeRate = (onTimeCount / milestones.length) * 100
    const onTimeScore = Math.round((onTimeRate / 100) * 25)
    factors.on_time_delivery = onTimeScore
    score += onTimeScore
  } else {
    factors.on_time_delivery = 15 // Default for new workers
    score += 15
  }

  // Factor 3: Profile verification (max 15 points)
  const { data: profile } = await supabaseAdmin
    .from('worker_profiles')
    .select('is_verified')
    .eq('user_id', userId)
    .single()

  if (profile?.is_verified) {
    factors.verified_profile = 15
    score += 15
  } else {
    factors.verified_profile = 0
  }

  // Factor 4: Previous EarlyPay repayment history (max 20 points)
  const { data: prevRequests } = await supabaseAdmin
    .from('early_pay_requests')
    .select('status, repaid_at, repayment_due_at')
    .eq('worker_id', userId)
    .in('status', ['repaid', 'defaulted'])

  if (prevRequests && prevRequests.length > 0) {
    const repaidOnTime = prevRequests.filter(r => {
      if (r.status === 'defaulted') return false
      if (!r.repaid_at || !r.repayment_due_at) return true
      return new Date(r.repaid_at) <= new Date(r.repayment_due_at)
    }).length
    const repaymentRate = (repaidOnTime / prevRequests.length) * 100
    const repaymentScore = Math.round((repaymentRate / 100) * 20)
    factors.repayment_history = repaymentScore
    score += repaymentScore
  } else {
    factors.repayment_history = 10 // Default for first-time users
    score += 10
  }

  // Factor 5: Account age (max 15 points)
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('created_at')
    .eq('id', userId)
    .single()

  if (user?.created_at) {
    const accountAgeMonths = Math.floor(
      (Date.now() - new Date(user.created_at).getTime()) / (30 * 24 * 60 * 60 * 1000)
    )
    const ageScore = Math.min(accountAgeMonths * 2, 15)
    factors.account_age = ageScore
    score += ageScore
  }

  // Calculate max advance percent based on score
  let maxAdvancePercent = 50 // Default
  if (score >= 90) maxAdvancePercent = 80
  else if (score >= 80) maxAdvancePercent = 70
  else if (score >= 70) maxAdvancePercent = 60
  else if (score >= 60) maxAdvancePercent = 50

  return {
    score: Math.min(score, 100),
    maxAdvancePercent,
    factors,
  }
}

/**
 * Get eligible amount for early withdrawal
 */
export async function getEligibleAmount(
  userId: string,
  contractId?: string
): Promise<{
  totalEarned: number
  alreadyPaid: number
  pendingInEscrow: number
  eligibleForAdvance: number
  maxAdvancePercent: number
}> {
  const eligibility = await getEarlyPayEligibility(userId)
  const maxPercent = eligibility?.max_advance_percent || 50

  // Get approved but unreleased milestones
  const { data: milestones } = await supabaseAdmin
    .from('milestones')
    .select(`
      amount,
      status,
      escrow:escrow_accounts!inner(worker_id, status)
    `)
    .eq('escrow.worker_id', userId)
    .in('status', ['approved', 'in_progress', 'submitted'])

  // In progress or submitted milestones that are partially complete
  // For simplicity, we consider submitted milestones as 100% eligible
  let pendingInEscrow = 0
  let approvedNotReleased = 0

  if (milestones) {
    for (const m of milestones) {
      if (m.status === 'approved') {
        approvedNotReleased += m.amount
      } else if (m.status === 'submitted') {
        pendingInEscrow += m.amount
      } else if (m.status === 'in_progress') {
        // 50% of in-progress work is eligible
        pendingInEscrow += Math.round(m.amount * 0.5)
      }
    }
  }

  // Check if there are pending early pay requests
  const { data: pendingRequests } = await supabaseAdmin
    .from('early_pay_requests')
    .select('requested_amount')
    .eq('worker_id', userId)
    .in('status', ['pending', 'approved', 'disbursed'])

  const alreadyAdvanced = (pendingRequests || []).reduce(
    (sum, r) => sum + r.requested_amount, 0
  )

  const totalEarned = approvedNotReleased + pendingInEscrow
  const eligibleForAdvance = Math.round(
    (totalEarned * maxPercent / 100) - alreadyAdvanced
  )

  return {
    totalEarned,
    alreadyPaid: alreadyAdvanced,
    pendingInEscrow,
    eligibleForAdvance: Math.max(0, eligibleForAdvance),
    maxAdvancePercent: maxPercent,
  }
}

/**
 * Request early pay advance
 */
export async function requestEarlyPay(
  userId: string,
  contractId: string,
  requestedAmount: number,
  milestoneId?: string
): Promise<{ success: boolean; request?: EarlyPayRequest; error?: string }> {
  // Check eligibility
  const eligibility = await getEarlyPayEligibility(userId)
  if (!eligibility?.is_eligible) {
    return { 
      success: false, 
      error: 'You are not eligible for EarlyPay. Complete more projects to build your eligibility.' 
    }
  }

  // Check eligible amount
  const { eligibleForAdvance, maxAdvancePercent } = await getEligibleAmount(userId, contractId)
  
  if (requestedAmount > eligibleForAdvance) {
    return {
      success: false,
      error: `Maximum eligible amount is ₹${(eligibleForAdvance / 100).toLocaleString()}. You can advance up to ${maxAdvancePercent}% of earned amount.`
    }
  }

  // Calculate fees
  const advanceFeeAmount = Math.round(requestedAmount * DEFAULT_ADVANCE_FEE_PERCENT / 100)
  const netDisbursement = requestedAmount - advanceFeeAmount

  // Create request
  const { data: request, error } = await supabaseAdmin
    .from('early_pay_requests')
    .insert({
      worker_id: userId,
      contract_id: contractId,
      milestone_id: milestoneId,
      requested_amount: requestedAmount,
      max_eligible_amount: eligibleForAdvance,
      advance_fee_percent: DEFAULT_ADVANCE_FEE_PERCENT,
      advance_fee_amount: advanceFeeAmount,
      net_disbursement: netDisbursement,
      status: 'pending',
      repayment_due_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating early pay request:', error)
    return { success: false, error: 'Failed to create request' }
  }

  // Auto-approve for high eligibility scores
  if (eligibility.eligibility_score >= 80) {
    await approveEarlyPayRequest(request.id)
    return { 
      success: true, 
      request: { ...request, status: 'approved' as EarlyPayStatus }
    }
  }

  return { success: true, request }
}

/**
 * Approve early pay request (admin or auto)
 */
export async function approveEarlyPayRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('early_pay_requests')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .eq('status', 'pending')

  if (error) {
    return { success: false, error: 'Failed to approve request' }
  }

  return { success: true }
}

/**
 * Disburse early pay (process actual payment)
 */
export async function disburseEarlyPay(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: request, error: fetchError } = await supabaseAdmin
    .from('early_pay_requests')
    .select('*')
    .eq('id', requestId)
    .eq('status', 'approved')
    .single()

  if (fetchError || !request) {
    return { success: false, error: 'Request not found or not approved' }
  }

  // TODO: Process actual payment via Razorpay
  // const paymentResult = await processPayoutToWorker(request.worker_id, request.net_disbursement)

  const { error } = await supabaseAdmin
    .from('early_pay_requests')
    .update({
      status: 'disbursed',
      disbursed_at: new Date().toISOString(),
      // razorpay_transfer_id: paymentResult.transfer_id,
    })
    .eq('id', requestId)

  if (error) {
    return { success: false, error: 'Failed to update disbursement status' }
  }

  // Update eligibility totals
  await supabaseAdmin
    .from('early_pay_eligibility')
    .update({
      total_advanced_amount: supabaseAdmin.rpc('increment_advanced_amount', {
        user_id: request.worker_id,
        amount: request.requested_amount,
      }),
    })
    .eq('user_id', request.worker_id)

  return { success: true }
}

/**
 * Mark early pay as repaid (called when milestone is released)
 */
export async function markEarlyPayRepaid(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString()

  const { data: request, error: fetchError } = await supabaseAdmin
    .from('early_pay_requests')
    .select('*')
    .eq('id', requestId)
    .eq('status', 'disbursed')
    .single()

  if (fetchError || !request) {
    return { success: false, error: 'Request not found or not disbursed' }
  }

  const { error } = await supabaseAdmin
    .from('early_pay_requests')
    .update({
      status: 'repaid',
      repaid_at: now,
    })
    .eq('id', requestId)

  if (error) {
    return { success: false, error: 'Failed to mark as repaid' }
  }

  // Update eligibility totals and repayment rate
  const onTime = new Date(now) <= new Date(request.repayment_due_at)
  
  await supabaseAdmin
    .from('early_pay_eligibility')
    .update({
      total_repaid_amount: supabaseAdmin.rpc('increment_repaid_amount', {
        user_id: request.worker_id,
        amount: request.requested_amount,
      }),
      // Recalculate repayment rate if needed
      updated_at: now,
    })
    .eq('user_id', request.worker_id)

  return { success: true }
}

/**
 * Get early pay history for worker
 */
export async function getEarlyPayHistory(
  userId: string,
  limit: number = 20
): Promise<EarlyPayRequest[]> {
  const { data, error } = await supabaseAdmin
    .from('early_pay_requests')
    .select('*')
    .eq('worker_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching early pay history:', error)
    return []
  }

  return data || []
}
