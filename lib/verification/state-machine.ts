/**
 * Verification State Machine
 * Ensures valid state transitions
 */

export type VerificationStatus =
  | 'not_started'
  | 'pending'
  | 'in_review'
  | 'verified'
  | 'rejected'
  | 'expired'

export type VerificationType = 'identity' | 'skill' | 'microtask' | 'video' | 'delivery'

// Valid state transitions
const validTransitions: Record<VerificationStatus, VerificationStatus[]> = {
  not_started: ['pending', 'not_started'],
  pending: ['in_review', 'verified', 'rejected', 'pending'],
  in_review: ['verified', 'rejected', 'in_review'],
  verified: ['verified'], // Terminal state
  rejected: ['pending', 'rejected'], // Can resubmit
  expired: ['pending', 'expired'] // Can resubmit
}

/**
 * Check if a state transition is valid
 */
export function isValidTransition(
  currentStatus: VerificationStatus,
  newStatus: VerificationStatus
): boolean {
  const allowed = validTransitions[currentStatus] || []
  return allowed.includes(newStatus)
}

/**
 * Validate and transition verification status
 */
export function transitionStatus(
  currentStatus: VerificationStatus,
  newStatus: VerificationStatus,
  reason?: string
): { valid: boolean; error?: string } {
  if (!isValidTransition(currentStatus, newStatus)) {
    return {
      valid: false,
      error: `Invalid transition from ${currentStatus} to ${newStatus}`
    }
  }

  // Additional validation rules
  if (newStatus === 'rejected' && !reason) {
    return {
      valid: false,
      error: 'Rejection reason is required when rejecting verification'
    }
  }

  return { valid: true }
}

/**
 * Get next valid states for a given status
 */
export function getNextValidStates(currentStatus: VerificationStatus): VerificationStatus[] {
  return validTransitions[currentStatus] || []
}

