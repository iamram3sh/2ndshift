'use client'

import { Suspense } from 'react'
import { RoleContextProvider } from './RoleContextProvider'

/**
 * Wrapper component to handle Suspense boundary for RoleContextProvider
 * since it uses useSearchParams which requires Suspense in Next.js 13+
 */
export function RoleProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <RoleContextProvider>
        {children}
      </RoleContextProvider>
    </Suspense>
  )
}
