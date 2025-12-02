/**
 * Analytics Events for Role Selection
 * Tracks user role selection and role-based content engagement
 */

import { event } from '@/lib/analytics'
import type { UserRole } from '@/lib/utils/roleAwareLinks'

export type RoleSource = 'hero' | 'header' | 'query' | 'login' | 'cta'

/**
 * Track when a user selects a role
 */
export function trackRoleSelected(role: UserRole, source: RoleSource): void {
  event({
    action: 'role_selected',
    category: 'Role',
    label: `${role}_${source}`,
  })
  
  // Also track as custom event with more details
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'role_selected', {
      event_category: 'Role',
      event_label: role,
      role: role,
      source: source,
    })
  }
}

/**
 * Track when a role-specific section becomes visible
 */
export function trackRoleSectionView(role: UserRole, sectionId: string): void {
  event({
    action: 'role_section_view',
    category: 'Role',
    label: `${role}_${sectionId}`,
  })
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'role_section_view', {
      event_category: 'Role',
      event_label: sectionId,
      role: role,
      section_id: sectionId,
    })
  }
}

/**
 * Track CTA clicks with role context
 */
export function trackRoleCTA(role: UserRole, ctaName: string): void {
  event({
    action: 'cta_clicked',
    category: 'Conversion',
    label: `${ctaName}_${role}`,
  })
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_clicked', {
      event_category: 'Conversion',
      event_label: ctaName,
      role: role,
      cta_name: ctaName,
    })
  }
}

/**
 * Track role change (when user switches from one role to another)
 */
export function trackRoleChange(fromRole: UserRole | null, toRole: UserRole): void {
  event({
    action: 'role_changed',
    category: 'Role',
    label: `${fromRole || 'none'}_to_${toRole}`,
  })
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'role_changed', {
      event_category: 'Role',
      from_role: fromRole || 'none',
      to_role: toRole,
    })
  }
}
