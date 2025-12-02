/**
 * Feature Flag for Role-Targeted Homepage
 * Controls the role-based content filtering on homepage
 */

export const FEATURE_ROLE_HOME = process.env.FEATURE_ROLE_HOME === 'true' || false

/**
 * Check if role-targeted homepage is enabled
 */
export function isRoleHomeEnabled(): boolean {
  return FEATURE_ROLE_HOME
}

/**
 * Get feature flag status
 */
export function getRoleHomeStatus() {
  return {
    enabled: FEATURE_ROLE_HOME,
    message: FEATURE_ROLE_HOME
      ? 'Role-targeted homepage is enabled'
      : 'Role-targeted homepage is disabled. Set FEATURE_ROLE_HOME=true to enable.',
  }
}
