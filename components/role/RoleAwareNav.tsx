'use client'

import React from 'react'
import Link from 'next/link'
import { useRole } from './RoleContextProvider'
import { withRoleParam } from '@/lib/utils/roleAwareLinks'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'
import { 
  Briefcase, Users, FileText, Zap, 
  Search, Plus, FolderOpen, BarChart3,
  ChevronDown, Menu
} from 'lucide-react'

interface RoleAwareNavProps {
  isMobile?: boolean
  onLinkClick?: () => void
}

/**
 * RoleAwareNav - Dynamic navigation based on selected role
 * Shows role-specific nav items when role is selected
 */
export function RoleAwareNav({ isMobile = false, onLinkClick }: RoleAwareNavProps) {
  const { role } = useRole()
  const isEnabled = isRoleHomeEnabled()

  // If feature disabled or no role selected, show default nav
  if (!isEnabled || !role) {
    return (
      <div className={isMobile ? 'space-y-1' : 'flex items-center gap-1'}>
        <Link 
          href="/for-workers" 
          onClick={onLinkClick}
          className={isMobile 
            ? "block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            : "px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
          }
        >
          For Professionals
        </Link>
        <Link 
          href="/employers" 
          onClick={onLinkClick}
          className={isMobile 
            ? "block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            : "px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
          }
        >
          For Employers
        </Link>
        <Link 
          href="/features" 
          onClick={onLinkClick}
          className={isMobile 
            ? "block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            : "px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
          }
        >
          How It Works
        </Link>
        <Link 
          href="/pricing" 
          onClick={onLinkClick}
          className={isMobile 
            ? "block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            : "px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
          }
        >
          Pricing
        </Link>
      </div>
    )
  }

  // Worker-specific navigation
  if (role === 'worker') {
    const workerNavItems = [
      { label: 'Jobs', href: withRoleParam('/worker/discover', role), icon: Briefcase },
      { label: 'Starter Packs', href: withRoleParam('/pricing', role), icon: Zap },
      { label: 'How It Works', href: withRoleParam('/for-workers', role), icon: FileText },
      { label: 'My Profile', href: withRoleParam('/profile', role), icon: Users },
    ]

    return (
      <div className={isMobile ? 'space-y-1' : 'flex items-center gap-1'}>
        {workerNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={isMobile
              ? "flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
              : "flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            }
          >
            {isMobile && <item.icon className="w-4 h-4" />}
            {item.label}
          </Link>
        ))}
      </div>
    )
  }

  // Client-specific navigation
  if (role === 'client') {
    const clientNavItems = [
      { label: 'Post a Job', href: withRoleParam('/projects/create', role), icon: Plus },
      { label: 'Hire Specialists', href: withRoleParam('/workers', role), icon: Search },
      { label: 'Pricing', href: withRoleParam('/pricing', role), icon: BarChart3 },
      { label: 'Client Dashboard', href: withRoleParam('/client', role), icon: FolderOpen },
    ]

    return (
      <div className={isMobile ? 'space-y-1' : 'flex items-center gap-1'}>
        {clientNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={isMobile
              ? "flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
              : "flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            }
          >
            {isMobile && <item.icon className="w-4 h-4" />}
            {item.label}
          </Link>
        ))}
      </div>
    )
  }

  return null
}
