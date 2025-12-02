/**
 * Feature Flag for Role-Targeted Homepage
 * Controls the role-based content filtering on homepage
 * 
 * Default: true (enabled)
 * To disable: Set FEATURE_ROLE_HOME=false in environment variables
 */

export const FEATURE_ROLE_HOME = process.env.FEATURE_ROLE_HOME !== 'false'

/**
 * Feature Flag for Role-Separated Pages
 * Controls the dedicated /client and /worker route pages with SSR role separation
 * 
 * Default: false (disabled)
 * To enable: Set FEATURE_ROLE_PAGES=true in environment variables
 */
export const FEATURE_ROLE_PAGES = process.env.FEATURE_ROLE_PAGES === 'true'

/**
 * Check if role-targeted homepage is enabled
 */
export function isRoleHomeEnabled(): boolean {
  return FEATURE_ROLE_HOME
}

/**
 * Check if role-separated pages are enabled
 */
export function isRolePagesEnabled(): boolean {
  return FEATURE_ROLE_PAGES
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

/**
 * Get role pages feature flag status
 */
export function getRolePagesStatus() {
  return {
    enabled: FEATURE_ROLE_PAGES,
    message: FEATURE_ROLE_PAGES
      ? 'Role-separated pages are enabled'
      : 'Role-separated pages are disabled. Set FEATURE_ROLE_PAGES=true to enable.',
  }
}
