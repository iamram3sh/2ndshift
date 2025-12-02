'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { getInitialRole, persistRole, getRoleFromQuery, type UserRole } from '@/lib/utils/roleAwareLinks'
import { trackRoleSelected, trackRoleChange, type RoleSource } from '@/lib/analytics/roleEvents'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'

export interface RoleContextValue {
  role: UserRole | null
  setRole: (role: UserRole, source?: RoleSource) => void
  persisted: boolean
  clearRole: () => void
}

// Default context value for SSR/initial render
export const defaultContextValue: RoleContextValue = {
  role: null,
  setRole: () => {},
  persisted: false,
  clearRole: () => {},
}

export const RoleContext = createContext<RoleContextValue>(defaultContextValue)

interface RoleContextProviderProps {
  children: React.ReactNode
  initialRole?: UserRole | null // SSR-injected role (from route or server)
}

export function RoleContextProvider({ children, initialRole }: RoleContextProviderProps) {
  // This component should only be rendered when feature is enabled
  // RoleProviderWrapper ensures this
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  // Initialize with initialRole if provided (SSR), otherwise null
  const [role, setRoleState] = useState<UserRole | null>(initialRole ?? null)
  const [persisted, setPersisted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const isEnabled = isRoleHomeEnabled()

  // Initialize role on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsInitialized(true)
      return
    }

    if (!isEnabled) {
      setIsInitialized(true)
      return
    }

    // Precedence: query param (highest) > initialRole (SSR) > localStorage > null
    // Check query param first (highest precedence)
    const queryRole = getRoleFromQuery()
    if (queryRole) {
      setRoleState(queryRole)
      setPersisted(false) // Query param doesn't count as persisted
      setIsInitialized(true)
      trackRoleSelected(queryRole, 'query')
      return
    }

    // If no query param, use initialRole if provided (from SSR/route)
    if (initialRole) {
      setRoleState(initialRole)
      setPersisted(false) // SSR role doesn't count as persisted
      setIsInitialized(true)
      return
    }

    // Fall back to localStorage
    const storedRole = getInitialRole()
    if (storedRole) {
      setRoleState(storedRole)
      setPersisted(true)
      setIsInitialized(true)
      return
    }

    setIsInitialized(true)
  }, [isEnabled, searchParams, initialRole])

  // Update role when query param changes (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isEnabled) return

    const queryRole = getRoleFromQuery()
    if (queryRole && queryRole !== role) {
      const previousRole = role
      setRoleState(queryRole)
      setPersisted(false)
      if (previousRole) {
        trackRoleChange(previousRole, queryRole)
      } else {
        trackRoleSelected(queryRole, 'query')
      }
    }
  }, [isEnabled, searchParams, role])

  const setRole = useCallback((newRole: UserRole, source: RoleSource = 'hero') => {
    if (typeof window === 'undefined') return
    if (!isEnabled) return

    const previousRole = role
    setRoleState(newRole)
    persistRole(newRole)
    setPersisted(true)

    // Update URL with role query param (without page reload)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('role', newRole)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })

    // Track analytics
    if (previousRole && previousRole !== newRole) {
      trackRoleChange(previousRole, newRole)
    } else {
      trackRoleSelected(newRole, source)
    }
  }, [isEnabled, role, searchParams, pathname, router])

  const clearRole = useCallback(() => {
    if (typeof window === 'undefined') return
    if (!isEnabled) return

    setRoleState(null)
    setPersisted(false)
    
    // Remove role from URL
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.delete('role')
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [isEnabled, searchParams, pathname, router])

  // Always provide context, even during initialization
  // This prevents SSR errors while still allowing proper initialization
  const contextValue: RoleContextValue = isInitialized
    ? { role, setRole, persisted, clearRole }
    : defaultContextValue

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  )
}

/**
 * Hook to access role context
 */
export function useRole(): RoleContextValue {
  return useContext(RoleContext)
}
