// ============================================
// 2NDSHIFT - SHIFTS SERVICE
// Core business logic for Shifts system
// ============================================

import { supabaseAdmin } from './supabase/admin'
import type {
  ShiftsBalance,
  ShiftsTransaction,
  ShiftsPackage,
  ShiftsTransactionType,
  Boost,
  BoostType,
  SHIFTS_COSTS,
} from '@/types/shifts'

// ============================================
// BALANCE OPERATIONS
// ============================================

/**
 * Get user's current Shifts balance
 */
export async function getShiftsBalance(userId: string): Promise<ShiftsBalance | null> {
  const { data, error } = await supabaseAdmin
    .from('shifts_balance')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching Shifts balance:', error)
    return null
  }

  return data
}

/**
 * Initialize Shifts balance for a new user
 */
export async function initializeShiftsBalance(userId: string): Promise<ShiftsBalance | null> {
  // Check if balance already exists
  const existing = await getShiftsBalance(userId)
  if (existing) return existing

  const { data, error } = await supabaseAdmin
    .from('shifts_balance')
    .insert({
      user_id: userId,
      balance: 5,
      free_balance: 5,
      last_free_credit_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error initializing Shifts balance:', error)
    return null
  }

  // Log the welcome bonus transaction
  await logTransaction(userId, 'free_credit', 5, 5, 'Welcome bonus - 5 free Shifts')

  return data
}

/**
 * Add Shifts to user's balance
 */
export async function addShifts(
  userId: string,
  amount: number,
  type: ShiftsTransactionType,
  description?: string,
  paymentId?: string
): Promise<{ success: boolean; newBalance: number }> {
  // Get current balance
  const balance = await getShiftsBalance(userId)
  if (!balance) {
    // Initialize if doesn't exist
    await initializeShiftsBalance(userId)
  }

  const currentBalance = balance?.balance || 0
  const newBalance = currentBalance + amount

  // Update balance
  const { error: updateError } = await supabaseAdmin
    .from('shifts_balance')
    .update({
      balance: newBalance,
      lifetime_purchased: type === 'purchase' 
        ? (balance?.lifetime_purchased || 0) + amount 
        : balance?.lifetime_purchased || 0,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('Error adding Shifts:', updateError)
    return { success: false, newBalance: currentBalance }
  }

  // Log transaction
  await logTransaction(userId, type, amount, newBalance, description, undefined, undefined, paymentId)

  return { success: true, newBalance }
}

/**
 * Deduct Shifts from user's balance
 */
export async function deductShifts(
  userId: string,
  amount: number,
  type: ShiftsTransactionType,
  description?: string,
  referenceId?: string,
  referenceType?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  // Get current balance
  const balance = await getShiftsBalance(userId)
  if (!balance) {
    return { success: false, newBalance: 0, error: 'No Shifts balance found' }
  }

  if (balance.balance < amount) {
    return { 
      success: false, 
      newBalance: balance.balance, 
      error: `Insufficient Shifts. You have ${balance.balance}, need ${amount}` 
    }
  }

  const newBalance = balance.balance - amount

  // Update balance
  const { error: updateError } = await supabaseAdmin
    .from('shifts_balance')
    .update({
      balance: newBalance,
      lifetime_used: (balance.lifetime_used || 0) + amount,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('Error deducting Shifts:', updateError)
    return { success: false, newBalance: balance.balance, error: 'Failed to deduct Shifts' }
  }

  // Log transaction
  await logTransaction(userId, type, -amount, newBalance, description, referenceId, referenceType)

  return { success: true, newBalance }
}

/**
 * Log a Shifts transaction
 */
async function logTransaction(
  userId: string,
  type: ShiftsTransactionType,
  amount: number,
  balanceAfter: number,
  description?: string,
  referenceId?: string,
  referenceType?: string,
  paymentId?: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('shifts_transactions')
    .insert({
      user_id: userId,
      type,
      amount,
      balance_after: balanceAfter,
      description,
      reference_id: referenceId,
      reference_type: referenceType,
      payment_id: paymentId,
    })

  if (error) {
    console.error('Error logging Shifts transaction:', error)
  }
}

// ============================================
// TRANSACTION HISTORY
// ============================================

/**
 * Get user's Shifts transaction history
 */
export async function getTransactionHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<ShiftsTransaction[]> {
  const { data, error } = await supabaseAdmin
    .from('shifts_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching transaction history:', error)
    return []
  }

  return data || []
}

// ============================================
// PACKAGES
// ============================================

/**
 * Get available Shifts packages
 */
export async function getShiftsPackages(userType: 'worker' | 'client'): Promise<ShiftsPackage[]> {
  const { data, error } = await supabaseAdmin
    .from('shifts_packages')
    .select('*')
    .or(`user_type.eq.${userType},user_type.eq.both`)
    .eq('is_active', true)
    .order('shifts_amount', { ascending: true })

  if (error) {
    console.error('Error fetching Shifts packages:', error)
    return []
  }

  return data || []
}

/**
 * Get a specific package by ID
 */
export async function getShiftsPackage(packageId: string): Promise<ShiftsPackage | null> {
  const { data, error } = await supabaseAdmin
    .from('shifts_packages')
    .select('*')
    .eq('id', packageId)
    .single()

  if (error) {
    console.error('Error fetching Shifts package:', error)
    return null
  }

  return data
}

// ============================================
// BOOSTS
// ============================================

/**
 * Create a boost
 */
export async function createBoost(
  userId: string,
  boostType: BoostType,
  shiftsUsed: number,
  durationDays: number,
  referenceId?: string
): Promise<{ success: boolean; boost?: Boost; error?: string }> {
  // Determine transaction type based on boost type
  const transactionType: ShiftsTransactionType = 
    boostType === 'profile' ? 'boost_profile' :
    boostType === 'application' ? 'boost_application' :
    'feature_job'

  // Deduct Shifts
  const deductResult = await deductShifts(
    userId,
    shiftsUsed,
    transactionType,
    `${boostType} boost for ${durationDays} days`,
    referenceId,
    boostType
  )

  if (!deductResult.success) {
    return { success: false, error: deductResult.error }
  }

  // Create boost record
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + durationDays)

  const { data, error } = await supabaseAdmin
    .from('boosts')
    .insert({
      user_id: userId,
      boost_type: boostType,
      reference_id: referenceId,
      shifts_used: shiftsUsed,
      expires_at: expiresAt.toISOString(),
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating boost:', error)
    // Refund the Shifts if boost creation failed
    await addShifts(userId, shiftsUsed, 'refund', 'Refund for failed boost creation')
    return { success: false, error: 'Failed to create boost' }
  }

  return { success: true, boost: data }
}

/**
 * Get active boosts for a user
 */
export async function getActiveBoosts(userId: string): Promise<Boost[]> {
  const { data, error } = await supabaseAdmin
    .from('boosts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: true })

  if (error) {
    console.error('Error fetching active boosts:', error)
    return []
  }

  return data || []
}

/**
 * Check if user has active boost of a specific type
 */
export async function hasActiveBoost(
  userId: string,
  boostType: BoostType,
  referenceId?: string
): Promise<boolean> {
  let query = supabaseAdmin
    .from('boosts')
    .select('id')
    .eq('user_id', userId)
    .eq('boost_type', boostType)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())

  if (referenceId) {
    query = query.eq('reference_id', referenceId)
  }

  const { data, error } = await query.limit(1)

  if (error) {
    console.error('Error checking active boost:', error)
    return false
  }

  return (data?.length || 0) > 0
}

/**
 * Increment boost impressions
 */
export async function incrementBoostImpressions(boostId: string): Promise<void> {
  await supabaseAdmin.rpc('increment_boost_impressions', { boost_id: boostId })
}

/**
 * Increment boost clicks
 */
export async function incrementBoostClicks(boostId: string): Promise<void> {
  await supabaseAdmin.rpc('increment_boost_clicks', { boost_id: boostId })
}

// ============================================
// MONTHLY FREE SHIFTS
// ============================================

/**
 * Credit monthly free Shifts based on subscription
 */
export async function creditMonthlyFreeShifts(
  userId: string,
  amount: number
): Promise<boolean> {
  const balance = await getShiftsBalance(userId)
  if (!balance) return false

  // Check if already credited this month
  const lastCredit = balance.last_free_credit_at ? new Date(balance.last_free_credit_at) : null
  const now = new Date()
  
  if (lastCredit && 
      lastCredit.getMonth() === now.getMonth() && 
      lastCredit.getFullYear() === now.getFullYear()) {
    return false // Already credited this month
  }

  // Expire old free balance first
  if (balance.free_balance > 0) {
    await logTransaction(
      userId, 
      'expired', 
      -balance.free_balance, 
      balance.balance - balance.free_balance,
      'Monthly free Shifts expired'
    )
  }

  // Update balance with new free Shifts
  const { error } = await supabaseAdmin
    .from('shifts_balance')
    .update({
      balance: balance.balance - balance.free_balance + amount,
      free_balance: amount,
      last_free_credit_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Error crediting monthly free Shifts:', error)
    return false
  }

  // Log the credit
  await logTransaction(
    userId,
    'free_credit',
    amount,
    balance.balance - balance.free_balance + amount,
    'Monthly subscription bonus'
  )

  return true
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format Shifts amount for display
 */
export function formatShiftsAmount(amount: number): string {
  return amount === 1 ? '1 Shift' : `${amount} Shifts`
}

/**
 * Calculate price per Shift
 */
export function calculatePricePerShift(pkg: ShiftsPackage): number {
  return pkg.price_inr / pkg.shifts_amount / 100 // Convert paise to rupees
}
