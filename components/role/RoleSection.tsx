'use client'

import React from 'react'
import { useRole } from './RoleContextProvider'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'

interface RoleSectionProps {
  role: 'worker' | 'client' | 'both'
  fallback?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * RoleSection - Conditionally renders children based on current role
 * 
 * @param role - 'worker' | 'client' | 'both' - Which role(s) should see this content
 * @param fallback - Optional content to show when role doesn't match
 * @param children - Content to render when role matches
 */
export function RoleSection({ role, fallback = null, children, className }: RoleSectionProps) {
  const { role: currentRole } = useRole()
  const isEnabled = isRoleHomeEnabled()

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
