/**
 * Role-Aware Link Utilities
 * Helpers for appending role query params and managing role state
 */

export type UserRole = 'worker' | 'client'

const ROLE_STORAGE_KEY = '2ndshift.role'

/**
 * Get role from query parameters
 */
export function getRoleFromQuery(): UserRole | null {
  if (typeof window === 'undefined') return null
  
  const params = new URLSearchParams(window.location.search)
  const role = params.get('role')
  
  if (role === 'worker' || role === 'client') {
    return role
  }
  
  return null
}

/**
 * Get role from localStorage
 */
export function getRoleFromStorage(): UserRole | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY)
    if (stored === 'worker' || stored === 'client') {
      return stored
    }
  } catch (error) {
    console.warn('Failed to read role from localStorage:', error)
  }
  
  return null
}

/**
 * Persist role to localStorage
 */
export function persistRole(role: UserRole): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role)
  } catch (error) {
    console.warn('Failed to persist role to localStorage:', error)
  }
}

/**
 * Clear persisted role
 */
export function clearRole(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(ROLE_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear role from localStorage:', error)
  }
}

/**
 * Append role query parameter to a URL
 */
export function withRoleParam(href: string, role?: UserRole | null): string {
  if (!role) return href
  
  try {
    const url = new URL(href, window.location.origin)
    url.searchParams.set('role', role)
    return url.pathname + url.search
  } catch {
    // If URL parsing fails, append manually
    const separator = href.includes('?') ? '&' : '?'
    return `${href}${separator}role=${role}`
  }
}

/**
 * Get initial role with precedence: query param > localStorage > null
 */
export function getInitialRole(): UserRole | null {
  // Query param has highest precedence
  const queryRole = getRoleFromQuery()
  if (queryRole) return queryRole
  
  // Fall back to localStorage
  return getRoleFromStorage()
}
