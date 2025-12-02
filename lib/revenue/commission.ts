/**
 * Commission Calculation Utilities
 * Handles worker and client commission calculations
 */

export interface CommissionCalculationParams {
  contractAmount: number
  workerId: string
  isWorkerVerified: boolean
  isFirstThreeJobs: boolean
  clientHasSubscription: boolean
  isMicroTask: boolean
  paymentAmount?: number
}

export interface CommissionResult {
  workerCommissionPercent: number
  workerCommissionAmount: number
  clientCommissionPercent: number
  clientCommissionAmount: number
  escrowFeePercent: number
  escrowFeeAmount: number
  netWorkerPayout: number
  netClientPayment: number
  totalPlatformRevenue: number
}

/**
 * Calculate worker commission
 * - First 3 jobs: 0%
 * - Verified workers: 5%
 * - Unverified workers: 10%
 */
export function calculateWorkerCommission(
  contractAmount: number,
  isVerified: boolean,
  isFirstThreeJobs: boolean
): { percent: number; amount: number } {
  if (isFirstThreeJobs) {
    return { percent: 0, amount: 0 }
  }

  const percent = isVerified ? 5 : 10
  const amount = (contractAmount * percent) / 100

  return { percent, amount }
}

/**
 * Calculate client commission
 * - Subscribers: 0%
 * - Micro tasks: ₹49 flat fee
 * - Regular: 4% per payment
 */
export function calculateClientCommission(
  paymentAmount: number,
  hasSubscription: boolean,
  isMicroTask: boolean
): { percent: number; amount: number } {
  if (hasSubscription) {
    return { percent: 0, amount: 0 }
  }

  if (isMicroTask) {
    return { percent: 0, amount: 49 } // Flat fee
  }

  const percent = 4
  const amount = (paymentAmount * percent) / 100

  return { percent, amount }
}

/**
 * Calculate escrow fee
 * - 2% from clients
 */
export function calculateEscrowFee(paymentAmount: number): number {
  return (paymentAmount * 2) / 100
}

/**
 * Calculate complete commission breakdown
 */
export function calculateCommissions(params: CommissionCalculationParams): CommissionResult {
  const {
    contractAmount,
    isWorkerVerified,
    isFirstThreeJobs,
    clientHasSubscription,
    isMicroTask,
    paymentAmount = contractAmount,
  } = params

  // Worker commission
  const workerCommission = calculateWorkerCommission(
    contractAmount,
    isWorkerVerified,
    isFirstThreeJobs
  )

  // Client commission
  const clientCommission = calculateClientCommission(
    paymentAmount,
    clientHasSubscription,
    isMicroTask
  )

  // Escrow fee
  const escrowFeeAmount = calculateEscrowFee(paymentAmount)
  const escrowFeePercent = 2

  // Net amounts
  const netWorkerPayout = contractAmount - workerCommission.amount
  const netClientPayment = paymentAmount + clientCommission.amount + escrowFeeAmount

  // Total platform revenue
  const totalPlatformRevenue =
    workerCommission.amount + clientCommission.amount + escrowFeeAmount

  return {
    workerCommissionPercent: workerCommission.percent,
    workerCommissionAmount: workerCommission.amount,
    clientCommissionPercent: clientCommission.percent,
    clientCommissionAmount: clientCommission.amount,
    escrowFeePercent,
    escrowFeeAmount,
    netWorkerPayout,
    netClientPayment,
    totalPlatformRevenue,
  }
}

/**
 * Check if worker is in first 3 jobs
 */
export async function isFirstThreeJobs(
  workerId: string,
  supabase: any
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('worker_job_counts')
      .select('completed_jobs_count, first_three_jobs_completed')
      .eq('worker_id', workerId)
      .single()

    if (error || !data) {
      // If no record exists, assume first job
      return true
    }

    return !data.first_three_jobs_completed && data.completed_jobs_count < 3
  } catch (error) {
    console.error('Error checking first three jobs:', error)
    return false
  }
}

