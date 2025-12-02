'use client'

import React, { useEffect, useId } from 'react'
import { useRole } from './RoleContextProvider'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'
import { trackRoleSectionView } from '@/lib/analytics/roleEvents'

import type { UserRole } from '@/lib/utils/roleAwareLinks'

interface RoleSectionProps {
  role: 'worker' | 'client' | 'both'
  ssrRole?: UserRole | null // Optional: Server-side role for SSR optimization
  fallback?: React.ReactNode
  children: React.ReactNode
  className?: string
  sectionId?: string // Optional identifier for analytics
}

/**
 * RoleSection - Conditionally renders children based on current role
 * 
 * @param role - 'worker' | 'client' | 'both' - Which role(s) should see this content
 * @param fallback - Optional content to show when role doesn't match
 * @param children - Content to render when role matches
 * @param sectionId - Optional identifier for analytics tracking (auto-generated if not provided)
 */
export function RoleSection({ role, ssrRole, fallback = null, children, className, sectionId }: RoleSectionProps) {
  const { role: clientRole } = useRole()
  const isEnabled = isRoleHomeEnabled()
  const autoSectionId = useId()
  const finalSectionId = sectionId || autoSectionId

  // Use SSR role if provided (for server-side optimization), otherwise use client role
  // This allows server to skip rendering sections that won't be visible
  const effectiveRole = ssrRole ?? clientRole

  // Track section view when role matches and feature is enabled
  useEffect(() => {
    // Only track for worker/client roles, not 'both'
    if (isEnabled && effectiveRole && (role === 'worker' || role === 'client') && effectiveRole === role) {
      trackRoleSectionView(effectiveRole, finalSectionId)
    }
  }, [isEnabled, effectiveRole, role, finalSectionId])

  // If feature is disabled, always show content
  if (!isEnabled) {
    return <div className={className}>{children}</div>
  }

  // If role is 'both', always show
  if (role === 'both') {
    return <div className={className}>{children}</div>
  }

  // If no role selected, show fallback or nothing
  if (!effectiveRole) {
    return fallback ? <div className={className}>{fallback}</div> : null
  }

  // Show content only if role matches
  if (effectiveRole === role) {
    return <div className={className}>{children}</div>
  }

  // Role doesn't match, show fallback or nothing
  return fallback ? <div className={className}>{fallback}</div> : null
}
