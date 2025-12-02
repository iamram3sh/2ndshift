'use client'

import { Suspense } from 'react'
import { RoleContextProvider } from './RoleContextProvider'

/**
 * Wrapper component to handle Suspense boundary for RoleContextProvider
 * since it uses useSearchParams which requires Suspense in Next.js 13+
 * 
 * During SSR/static generation, this ensures the provider is always available
 * even if searchParams aren't ready yet.
 */
export function RoleProviderWrapper({ children }: { children: React.ReactNode }) {
  // Always wrap with provider, even in fallback
  // The provider handles SSR gracefully with default values
  const providerContent = <RoleContextProvider>{children}</RoleContextProvider>
  
  return (
    <Suspense fallback={providerContent}>
      {providerContent}
    </Suspense>
  )
}
