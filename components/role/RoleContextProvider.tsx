'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { getInitialRole, persistRole, getRoleFromQuery, type UserRole } from '@/lib/utils/roleAwareLinks'
import { trackRoleSelected, trackRoleChange, type RoleSource } from '@/lib/analytics/roleEvents'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'

interface RoleContextValue {
  role: UserRole | null
  setRole: (role: UserRole, source?: RoleSource) => void
  persisted: boolean
  clearRole: () => void
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export function RoleContextProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [role, setRoleState] = useState<UserRole | null>(null)
  const [persisted, setPersisted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize role on mount
  useEffect(() => {
    if (!isRoleHomeEnabled()) {
      setIsInitialized(true)
      return
    }

    // Check query param first (highest precedence)
    const queryRole = getRoleFromQuery()
    if (queryRole) {
      setRoleState(queryRole)
      setPersisted(false) // Query param doesn't count as persisted
      setIsInitialized(true)
      trackRoleSelected(queryRole, 'query')
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
  }, [searchParams])

  // Update role when query param changes
  useEffect(() => {
    if (!isRoleHomeEnabled()) return

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
  }, [searchParams, role])

  const setRole = useCallback((newRole: UserRole, source: RoleSource = 'hero') => {
    if (!isRoleHomeEnabled()) return

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
  }, [role, searchParams, pathname, router])

  const clearRole = useCallback(() => {
    if (!isRoleHomeEnabled()) return

    setRoleState(null)
    setPersisted(false)
    
    // Remove role from URL
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.delete('role')
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [searchParams, pathname, router])

  // Don't render children until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return null
  }

  return (
    <RoleContext.Provider value={{ role, setRole, persisted, clearRole }}>
      {children}
    </RoleContext.Provider>
  )
}

/**
 * Hook to access role context
 */
export function useRole(): RoleContextValue {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleContextProvider')
  }
  return context
}
