'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from './RoleContextProvider'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'
import { Briefcase, Users } from 'lucide-react'

interface RoleToggleProps {
  variant?: 'hero' | 'header'
  onRoleChange?: (role: 'worker' | 'client') => void
  className?: string
}

/**
 * RoleToggle - Accessible role selector component
 * Supports hero (large buttons) and header (compact pill) variants
 */
export function RoleToggle({ variant = 'hero', onRoleChange, className = '' }: RoleToggleProps) {
  const router = useRouter()
  const { role, setRole } = useRole()
  const isEnabled = isRoleHomeEnabled()
  const announcementRef = useRef<HTMLDivElement>(null)
  const workerButtonRef = useRef<HTMLButtonElement>(null)
  const clientButtonRef = useRef<HTMLButtonElement>(null)

  // Handle SSR - return null if feature disabled or during initial render
  if (!isEnabled) {
    return null
  }

  // Announce role changes to screen readers
  useEffect(() => {
    if (announcementRef.current && role) {
      const message = role === 'worker' 
        ? 'Showing content for workers' 
        : 'Showing content for clients'
      announcementRef.current.textContent = message
    }
  }, [role])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, targetRole: 'worker' | 'client') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleRoleSelect(targetRole)
    } else if (e.key === 'ArrowLeft' && targetRole === 'client') {
      e.preventDefault()
      workerButtonRef.current?.focus()
    } else if (e.key === 'ArrowRight' && targetRole === 'worker') {
      e.preventDefault()
      clientButtonRef.current?.focus()
    }
  }

  const handleRoleSelect = (selectedRole: 'worker' | 'client') => {
    if (!isEnabled) return
    
    const source = variant === 'hero' ? 'hero' : 'header'
    
    // Navigate to role-specific route for better SEO and SSR
    const targetRoute = selectedRole === 'worker' ? '/work' : '/clients'
    router.push(targetRoute)
    
    // Also set role for context (will be overridden by route-based detection)
    setRole(selectedRole, source)
    onRoleChange?.(selectedRole)
  }

  // Hero variant - large side-by-side buttons
  if (variant === 'hero') {
    return (
      <>
        {/* Screen reader announcement */}
        <div
          ref={announcementRef}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        <div 
          role="tablist" 
          aria-label="Select your role"
          className={`flex justify-center ${className}`}
        >
          <button
            ref={workerButtonRef}
            role="tab"
            aria-selected={role === 'worker'}
            aria-controls="worker-content"
            id="worker-tab"
            onClick={() => handleRoleSelect('worker')}
            onKeyDown={(e) => handleKeyDown(e, 'worker')}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-100 flex items-center gap-3 ${
              role === 'worker'
                ? '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50'
                : '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            I Want to Work
          </button>
          
          <button
            ref={clientButtonRef}
            role="tab"
            aria-selected={role === 'client'}
            aria-controls="client-content"
            id="client-tab"
            onClick={() => handleRoleSelect('client')}
            onKeyDown={(e) => handleKeyDown(e, 'client')}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-100 flex items-center gap-3 ${
              role === 'client'
                ? '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50'
                : '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50'
            }`}
          >
            <Users className="w-5 h-5" />
            I Want to Hire
          </button>
        </div>
      </>
    )
  }

  // Header variant - compact pill toggle
  return (
    <>
      {/* Screen reader announcement */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div 
        role="tablist" 
        aria-label="Switch role view"
        className={`inline-flex items-center bg-slate-100 rounded-lg p-1 shadow-sm ${className}`}
      >
        <button
          ref={workerButtonRef}
          role="tab"
          aria-selected={role === 'worker'}
          aria-controls="worker-content"
          id="worker-tab-header"
          onClick={() => handleRoleSelect('worker')}
          onKeyDown={(e) => handleKeyDown(e, 'worker')}
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-300 ease-out transform hover:scale-105 active:scale-100 flex items-center gap-2 ${
            role === 'worker'
              ? '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50'
              : '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50'
          }`}
          title="View as worker"
        >
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline">Worker</span>
        </button>
        
        <button
          ref={clientButtonRef}
          role="tab"
          aria-selected={role === 'client'}
          aria-controls="client-content"
          id="client-tab-header"
          onClick={() => handleRoleSelect('client')}
          onKeyDown={(e) => handleKeyDown(e, 'client')}
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-300 ease-out transform hover:scale-105 active:scale-100 flex items-center gap-2 ${
            role === 'client'
              ? '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50'
              : '!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50'
          }`}
          title="View as client"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Client</span>
        </button>
      </div>
    </>
  )
}
