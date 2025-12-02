/**
 * Unit Tests for RoleContext
 * 
 * To run these tests, install testing dependencies:
 * npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { RoleContextProvider, useRole } from '@/components/role/RoleContextProvider'
import { ReactNode } from 'react'

// Mock Next.js router
const mockRouter = {
  replace: vi.fn(),
  push: vi.fn(),
  pathname: '/',
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock feature flag
vi.mock('@/lib/role/feature-flag', () => ({
  isRoleHomeEnabled: vi.fn(() => true),
}))

// Mock analytics
vi.mock('@/lib/analytics/roleEvents', () => ({
  trackRoleSelected: vi.fn(),
  trackRoleChange: vi.fn(),
}))

// Mock roleAwareLinks
vi.mock('@/lib/utils/roleAwareLinks', () => ({
  getInitialRole: vi.fn(() => null),
  persistRole: vi.fn(),
  getRoleFromQuery: vi.fn(() => null),
}))

describe('RoleContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('provides null role initially', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RoleContextProvider>{children}</RoleContextProvider>
    )

    const { result } = renderHook(() => useRole(), { wrapper })

    expect(result.current.role).toBeNull()
    expect(result.current.persisted).toBe(false)
  })

  it('allows setting role', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RoleContextProvider>{children}</RoleContextProvider>
    )

    const { result } = renderHook(() => useRole(), { wrapper })

    act(() => {
      result.current.setRole('worker', 'hero')
    })

    expect(result.current.role).toBe('worker')
    expect(result.current.persisted).toBe(true)
  })

  it('persists role to localStorage', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RoleContextProvider>{children}</RoleContextProvider>
    )

    const { result } = renderHook(() => useRole(), { wrapper })

    act(() => {
      result.current.setRole('client', 'header')
    })

    expect(localStorage.getItem('2ndshift.role')).toBe('client')
  })

  it('updates URL with role query param', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RoleContextProvider>{children}</RoleContextProvider>
    )

    const { result } = renderHook(() => useRole(), { wrapper })

    act(() => {
      result.current.setRole('worker', 'hero')
    })

    expect(mockRouter.replace).toHaveBeenCalledWith(
      expect.stringContaining('?role=worker'),
      { scroll: false }
    )
  })

  it('allows clearing role', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RoleContextProvider>{children}</RoleContextProvider>
    )

    const { result } = renderHook(() => useRole(), { wrapper })

    act(() => {
      result.current.setRole('worker', 'hero')
    })

    expect(result.current.role).toBe('worker')

    act(() => {
      result.current.clearRole()
    })

    expect(result.current.role).toBeNull()
    expect(result.current.persisted).toBe(false)
  })
})
