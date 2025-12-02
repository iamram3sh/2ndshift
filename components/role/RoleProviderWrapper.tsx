'use client'

import { Suspense } from 'react'
import { RoleContextProvider } from './RoleContextProvider'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'

/**
 * Wrapper component to handle Suspense boundary for RoleContextProvider
 * since it uses useSearchParams which requires Suspense in Next.js 13+
 * 
 * Only wraps with Suspense when feature is enabled to avoid SSR issues
 * on pages that don't need the role context.
 */
export function RoleProviderWrapper({ children }: { children: React.ReactNode }) {
  const isEnabled = isRoleHomeEnabled()
  
  // If feature is disabled, just render children without provider
  // This avoids useSearchParams() being called unnecessarily
  if (!isEnabled) {
    return <>{children}</>
  }
  
  // When enabled, wrap with Suspense for useSearchParams
  const providerContent = <RoleContextProvider>{children}</RoleContextProvider>
  
  return (
    <Suspense fallback={providerContent}>
      {providerContent}
    </Suspense>
  )
}
