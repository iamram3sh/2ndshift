'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Briefcase, Activity, Users, Building2, 
  DollarSign, Settings, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface SidebarProps {
  role?: 'worker' | 'client' | 'admin'
  className?: string
}

const workerNavItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/worker', icon: LayoutDashboard },
  { label: 'Tasks', href: '/worker/discover', icon: Briefcase },
  { label: 'Activity', href: '/worker/activity', icon: Activity },
  { label: 'Clients', href: '/clients', icon: Building2 },
  { label: 'Pricing', href: '/pricing', icon: DollarSign },
  { label: 'Settings', href: '/worker/settings', icon: Settings },
]

const clientNavItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/client', icon: LayoutDashboard },
  { label: 'Tasks', href: '/client/tasks', icon: Briefcase },
  { label: 'Activity', href: '/client/activity', icon: Activity },
  { label: 'Workers', href: '/workers', icon: Users },
  { label: 'Pricing', href: '/pricing', icon: DollarSign },
  { label: 'Settings', href: '/client/settings', icon: Settings },
]

export function Sidebar({ role = 'worker', className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  const navItems = role === 'client' ? clientNavItems : workerNavItems

  const isActive = (href: string) => {
    if (href === '/worker' || href === '/client') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-lg shadow-sm"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-slate-900">2ndShift</span>
              </Link>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mx-auto">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'text-slate-900')} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-900 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
