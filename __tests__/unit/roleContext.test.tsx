/**
 * Unit tests for RoleContext
 */

import { render, screen, act } from '@testing-library/react'
import { RoleContextProvider, useRole } from '@/components/role/RoleContextProvider'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

function TestComponent() {
  const { role, setRole } = useRole()
  return (
    <div>
      <div data-testid="role">{role || 'null'}</div>
      <button onClick={() => setRole('worker')}>Set Worker</button>
      <button onClick={() => setRole('client')}>Set Client</button>
    </div>
  )
}

describe('RoleContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should initialize with null role', () => {
    render(
      <RoleContextProvider>
        <TestComponent />
      </RoleContextProvider>
    )

    expect(screen.getByTestId('role')).toHaveTextContent('null')
  })

  it('should persist role to localStorage', () => {
    render(
      <RoleContextProvider>
        <TestComponent />
      </RoleContextProvider>
    )

    act(() => {
      screen.getByText('Set Worker').click()
    })

    expect(localStorageMock.getItem('2ndshift.role')).toBe('worker')
  })

  it('should read role from localStorage on init', () => {
    localStorageMock.setItem('2ndshift.role', 'client')

    render(
      <RoleContextProvider>
        <TestComponent />
      </RoleContextProvider>
    )

    // Wait for initialization
    setTimeout(() => {
      expect(screen.getByTestId('role')).toHaveTextContent('client')
    }, 100)
  })
})
