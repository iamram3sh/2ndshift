/**
 * Feature Flag for Verification System V2
 */

export const FEATURE_VERIFICATION_V2 = process.env.FEATURE_VERIFICATION_V2 === 'true' || false

/**
 * Check if verification V2 is enabled
 */
export function isVerificationV2Enabled(): boolean {
  return FEATURE_VERIFICATION_V2
}

/**
 * Get feature flag status
 */
export function getVerificationFeatureStatus() {
  return {
    enabled: FEATURE_VERIFICATION_V2,
    message: FEATURE_VERIFICATION_V2
      ? 'Verification System V2 is enabled'
      : 'Verification System V2 is disabled. Set FEATURE_VERIFICATION_V2=true to enable.'
  }
}

