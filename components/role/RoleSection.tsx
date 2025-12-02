'use client'

import React, { useEffect, useId } from 'react'
import { useRole } from './RoleContextProvider'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'
import { trackRoleSectionView } from '@/lib/analytics/roleEvents'

interface RoleSectionProps {
  role: 'worker' | 'client' | 'both'
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
export function RoleSection({ role, fallback = null, children, className, sectionId }: RoleSectionProps) {
  const { role: currentRole } = useRole()
  const isEnabled = isRoleHomeEnabled()
  const autoSectionId = useId()
  const finalSectionId = sectionId || autoSectionId

  // Track section view when role matches and feature is enabled
  useEffect(() => {
    // Only track for worker/client roles, not 'both'
    if (isEnabled && currentRole && (role === 'worker' || role === 'client') && currentRole === role) {
      trackRoleSectionView(currentRole, finalSectionId)
    }
  }, [isEnabled, currentRole, role, finalSectionId])

  // If feature is disabled, always show content
  if (!isEnabled) {
    return <div className={className}>{children}</div>
  }

  // If role is 'both', always show
  if (role === 'both') {
    return <div className={className}>{children}</div>
  }

  // If no role selected, show fallback or nothing
  if (!currentRole) {
    return fallback ? <div className={className}>{fallback}</div> : null
  }

  // Show content only if role matches
  if (currentRole === role) {
    return <div className={className}>{children}</div>
  }

  // Role doesn't match, show fallback or nothing
  return fallback ? <div className={className}>{fallback}</div> : null
}
