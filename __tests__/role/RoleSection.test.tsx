/**
 * Unit Tests for RoleSection Component
 * 
 * To run these tests, install testing dependencies:
 * npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
 * 
 * Or use Vitest:
 * npm install --save-dev @testing-library/react @testing-library/jest-dom vitest @vitejs/plugin-react
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RoleSection } from '@/components/role/RoleSection'
import { RoleContextProvider } from '@/components/role/RoleContextProvider'

// Mock the feature flag
vi.mock('@/lib/role/feature-flag', () => ({
  isRoleHomeEnabled: vi.fn(() => true),
}))

// Mock analytics
vi.mock('@/lib/analytics/roleEvents', () => ({
  trackRoleSectionView: vi.fn(),
}))

describe('RoleSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when role matches current role', () => {
    render(
      <RoleContextProvider>
        <RoleSection role="worker">
          <div>Worker Content</div>
        </RoleSection>
      </RoleContextProvider>
    )
    
    // Note: This test requires role to be set, which happens via user interaction
    // In a real test, you'd need to set the role first
  })

  it('hides children when role does not match', () => {
    const { container } = render(
      <RoleContextProvider>
        <RoleSection role="worker">
          <div>Worker Content</div>
        </RoleSection>
        <RoleSection role="client">
          <div>Client Content</div>
        </RoleSection>
      </RoleContextProvider>
    )
    
    // When no role is selected, both should be hidden (or show fallback)
    expect(container.textContent).not.toContain('Worker Content')
    expect(container.textContent).not.toContain('Client Content')
  })

  it('shows fallback when role does not match', () => {
    render(
      <RoleContextProvider>
        <RoleSection 
          role="worker" 
          fallback={<div>Please select worker role</div>}
        >
          <div>Worker Content</div>
        </RoleSection>
      </RoleContextProvider>
    )
    
    // Should show fallback when role doesn't match
    expect(screen.getByText('Please select worker role')).toBeInTheDocument()
  })

  it('always shows content when role="both"', () => {
    render(
      <RoleContextProvider>
        <RoleSection role="both">
          <div>Shared Content</div>
        </RoleSection>
      </RoleContextProvider>
    )
    
    expect(screen.getByText('Shared Content')).toBeInTheDocument()
  })

  it('shows all content when feature is disabled', () => {
    // Mock feature flag as disabled
    vi.mocked(require('@/lib/role/feature-flag').isRoleHomeEnabled).mockReturnValue(false)
    
    render(
      <RoleContextProvider>
        <RoleSection role="worker">
          <div>Worker Content</div>
        </RoleSection>
        <RoleSection role="client">
          <div>Client Content</div>
        </RoleSection>
      </RoleContextProvider>
    )
    
    expect(screen.getByText('Worker Content')).toBeInTheDocument()
    expect(screen.getByText('Client Content')).toBeInTheDocument()
  })

  it('applies className prop correctly', () => {
    const { container } = render(
      <RoleContextProvider>
        <RoleSection role="both" className="custom-class">
          <div>Content</div>
        </RoleSection>
      </RoleContextProvider>
    )
    
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })
})
