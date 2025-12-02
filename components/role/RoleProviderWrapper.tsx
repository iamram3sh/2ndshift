'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { RoleContextProvider, RoleContext, defaultContextValue } from './RoleContextProvider'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'
import type { UserRole } from '@/lib/utils/roleAwareLinks'

/**
 * Wrapper component to handle Suspense boundary for RoleContextProvider
 * since it uses useSearchParams which requires Suspense in Next.js 13+
 * 
 * Only wraps with Suspense when feature is enabled to avoid SSR issues
 * on pages that don't need the role context.
 * 
 * Automatically detects route-based role:
 * - /clients → initialRole='client'
 * - /work → initialRole='worker'
 * - / → initialRole=null (neutral homepage)
 */
export function RoleProviderWrapper({ children }: { children: React.ReactNode }) {
  const isEnabled = isRoleHomeEnabled()
  const pathname = usePathname()
  
  // Detect route-based role for SSR hydration
  // This allows /clients and /work routes to have correct initial role
  const getInitialRoleFromRoute = (): UserRole | null => {
    if (pathname === '/clients') return 'client'
    if (pathname === '/work') return 'worker'
    return null
  }
  
  const initialRole = getInitialRoleFromRoute()
  
  // If feature is disabled, just render children without provider
  // This avoids useSearchParams() being called unnecessarily
  if (!isEnabled) {
    return <>{children}</>
  }
  
  // When enabled, wrap with Suspense for useSearchParams
  // Fallback provides default context without calling useSearchParams
  return (
    <Suspense fallback={
      <RoleContext.Provider value={defaultContextValue}>
        {children}
      </RoleContext.Provider>
    }>
      <RoleContextProvider initialRole={initialRole}>{children}</RoleContextProvider>
    </Suspense>
  )
}