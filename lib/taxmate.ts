// ============================================
// 2NDSHIFT - TAXMATE SERVICE
// Automated India Tax Compliance (TDS, GST)
// ============================================

import { supabaseAdmin } from './supabase/admin'
import type { TaxProfile, TaxDeduction, TaxSummary } from '@/types/features'

// TDS Rates under Section 194C
const TDS_RATES = {
  individual: 1.00,      // 1% for individuals/HUF
  company: 2.00,         // 2% for companies
  no_pan: 20.00,         // 20% if PAN not provided
} as const

// TDS threshold under 194C
const TDS_THRESHOLD_194C = 3000000 // ₹30,000 in paise (single payment)
const TDS_ANNUAL_THRESHOLD = 10000000 // ₹1,00,000 in paise (annual aggregate)

// GST Rate for professional services
const GST_RATE = 18.00

/**
 * Get or create tax profile for user
 */
export async function getTaxProfile(userId: string): Promise<TaxProfile | null> {
  let { data, error } = await supabaseAdmin
    .from('tax_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // Create new profile if doesn't exist
    const { data: newProfile, error: createError } = await supabaseAdmin
      .from('tax_profiles')
      .insert({ user_id: userId })
      .select()
      .single()

    if (createError) {
      console.error('Error creating tax profile:', createError)
      return null
    }
    return newProfile
  }

  if (error) {
    console.error('Error fetching tax profile:', error)
    return null
  }

  return data
}

/**
 * Update tax profile
 */
export async function updateTaxProfile(
  userId: string,
  updates: Partial<TaxProfile>
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('tax_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Calculate TDS for a payment
 */
export async function calculateTDS(
  payerId: string,
  payeeId: string,
  grossAmount: number
): Promise<{
  tdsApplicable: boolean
  tdsAmount: number
  tdsRate: number
  netAmount: number
  reason?: string
}> {
  // Get payee's tax profile
  const payeeProfile = await getTaxProfile(payeeId)

  // Check if PAN is available
  if (!payeeProfile?.pan_number || !payeeProfile.pan_verified) {
    // 20% TDS if no valid PAN
    const tdsRate = TDS_RATES.no_pan
    const tdsAmount = Math.round((grossAmount * tdsRate) / 100)
    return {
      tdsApplicable: true,
      tdsAmount,
      tdsRate,
      netAmount: grossAmount - tdsAmount,
      reason: 'PAN not provided or verified - 20% TDS applicable'
    }
  }

  // Check threshold for single payment
  if (grossAmount < TDS_THRESHOLD_194C) {
    // Check annual aggregate
    const currentFY = getCurrentFinancialYear()
    const { data: yearlyPayments } = await supabaseAdmin
      .from('tax_deductions')
      .select('gross_amount')
      .eq('payer_id', payerId)
      .eq('payee_id', payeeId)
      .eq('financial_year', currentFY)

    const yearlyTotal = (yearlyPayments || []).reduce((sum, p) => sum + p.gross_amount, 0) + grossAmount

    if (yearlyTotal < TDS_ANNUAL_THRESHOLD) {
      return {
        tdsApplicable: false,
        tdsAmount: 0,
        tdsRate: 0,
        netAmount: grossAmount,
        reason: `Below TDS threshold (Single: ₹30,000, Annual: ₹1,00,000)`
      }
    }
  }

  // Determine TDS rate based on entity type
  const tdsRate = payeeProfile.is_company ? TDS_RATES.company : TDS_RATES.individual
  const tdsAmount = Math.round((grossAmount * tdsRate) / 100)

  return {
    tdsApplicable: true,
    tdsAmount,
    tdsRate,
    netAmount: grossAmount - tdsAmount,
  }
}

/**
 * Calculate GST for a payment
 */
export function calculateGST(
  amount: number,
  isGstRegistered: boolean
): {
  gstApplicable: boolean
  gstAmount: number
  gstRate: number
  totalWithGst: number
} {
  if (!isGstRegistered) {
    return {
      gstApplicable: false,
      gstAmount: 0,
      gstRate: 0,
      totalWithGst: amount,
    }
  }

  const gstAmount = Math.round((amount * GST_RATE) / 100)
  return {
    gstApplicable: true,
    gstAmount,
    gstRate: GST_RATE,
    totalWithGst: amount + gstAmount,
  }
}

/**
 * Record TDS deduction
 */
export async function recordTDSDeduction(
  paymentId: string,
  payerId: string,
  payeeId: string,
  grossAmount: number,
  tdsAmount: number,
  tdsRate: number
): Promise<TaxDeduction | null> {
  const currentFY = getCurrentFinancialYear()
  const currentQuarter = getCurrentQuarter()

  const { data, error } = await supabaseAdmin
    .from('tax_deductions')
    .insert({
      payment_id: paymentId,
      payer_id: payerId,
      payee_id: payeeId,
      gross_amount: grossAmount,
      tds_amount: tdsAmount,
      tds_rate: tdsRate,
      net_amount: grossAmount - tdsAmount,
      financial_year: currentFY,
      quarter: currentQuarter,
      section: '194C',
    })
    .select()
    .single()

  if (error) {
    console.error('Error recording TDS deduction:', error)
    return null
  }

  // Update tax summary
  await updateTaxSummary(payeeId, currentFY, currentQuarter, grossAmount, tdsAmount)

  return data
}

/**
 * Update quarterly tax summary
 */
async function updateTaxSummary(
  userId: string,
  financialYear: string,
  quarter: string,
  earnings: number,
  tdsDeducted: number
): Promise<void> {
  // Check if summary exists
  const { data: existing } = await supabaseAdmin
    .from('tax_summaries')
    .select('*')
    .eq('user_id', userId)
    .eq('financial_year', financialYear)
    .eq('quarter', quarter)
    .single()

  if (existing) {
    // Update existing
    await supabaseAdmin
      .from('tax_summaries')
      .update({
        total_earnings: existing.total_earnings + earnings,
        total_tds_deducted: existing.total_tds_deducted + tdsDeducted,
        net_income: existing.total_earnings + earnings - existing.total_tds_deducted - tdsDeducted,
        summary_generated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  } else {
    // Create new
    await supabaseAdmin
      .from('tax_summaries')
      .insert({
        user_id: userId,
        financial_year: financialYear,
        quarter,
        total_earnings: earnings,
        total_tds_deducted: tdsDeducted,
        net_income: earnings - tdsDeducted,
        summary_generated_at: new Date().toISOString(),
      })
  }
}

/**
 * Get tax summary for user
 */
export async function getTaxSummary(
  userId: string,
  financialYear?: string
): Promise<TaxSummary[]> {
  const fy = financialYear || getCurrentFinancialYear()

  const { data, error } = await supabaseAdmin
    .from('tax_summaries')
    .select('*')
    .eq('user_id', userId)
    .eq('financial_year', fy)
    .order('quarter', { ascending: true })

  if (error) {
    console.error('Error fetching tax summary:', error)
    return []
  }

  return data || []
}

/**
 * Get all TDS deductions for user
 */
export async function getTDSDeductions(
  userId: string,
  financialYear?: string
): Promise<TaxDeduction[]> {
  const fy = financialYear || getCurrentFinancialYear()

  const { data, error } = await supabaseAdmin
    .from('tax_deductions')
    .select('*')
    .eq('payee_id', userId)
    .eq('financial_year', fy)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching TDS deductions:', error)
    return []
  }

  return data || []
}

/**
 * Get annual tax report data
 */
export async function getAnnualTaxReport(
  userId: string,
  financialYear: string
): Promise<{
  summary: {
    totalEarnings: number
    totalTDS: number
    netIncome: number
    platformFees: number
  }
  quarterlyBreakdown: TaxSummary[]
  deductions: TaxDeduction[]
}> {
  const [summaries, deductions] = await Promise.all([
    getTaxSummary(userId, financialYear),
    getTDSDeductions(userId, financialYear),
  ])

  const summary = {
    totalEarnings: summaries.reduce((sum, s) => sum + s.total_earnings, 0),
    totalTDS: summaries.reduce((sum, s) => sum + s.total_tds_deducted, 0),
    netIncome: summaries.reduce((sum, s) => sum + s.net_income, 0),
    platformFees: summaries.reduce((sum, s) => sum + s.total_platform_fees, 0),
  }

  return {
    summary,
    quarterlyBreakdown: summaries,
    deductions,
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get current financial year (April to March)
 */
export function getCurrentFinancialYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-12

  if (month >= 4) {
    return `${year}-${(year + 1).toString().slice(2)}`
  } else {
    return `${year - 1}-${year.toString().slice(2)}`
  }
}

/**
 * Get current quarter
 */
export function getCurrentQuarter(): string {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12

  if (month >= 4 && month <= 6) return 'Q1'
  if (month >= 7 && month <= 9) return 'Q2'
  if (month >= 10 && month <= 12) return 'Q3'
  return 'Q4' // January to March
}

/**
 * Validate PAN number format
 */
export function validatePAN(pan: string): boolean {
  // PAN format: ABCDE1234F
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan.toUpperCase())
}

/**
 * Validate GSTIN format
 */
export function validateGSTIN(gstin: string): boolean {
  // GSTIN format: 22AAAAA0000A1Z5
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstinRegex.test(gstin.toUpperCase())
}

/**
 * Format amount from paise to rupees with formatting
 */
export function formatINR(amountInPaise: number): string {
  const rupees = amountInPaise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees)
}
