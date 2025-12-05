'use client'

import { useState } from 'react'
import { Search, Bell, User, ChevronDown, Plus } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface TopbarProps {
  role?: 'worker' | 'client'
  onSearch?: (query: string) => void
  onQuickAction?: () => void
  quickActionLabel?: string
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
  notificationCount?: number
  className?: string
}

export function Topbar({
  role = 'worker',
  onSearch,
  onQuickAction,
  quickActionLabel,
  user,
  notificationCount = 0,
  className,
}: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const defaultQuickActionLabel = role === 'client' ? 'Post Project' : 'Find Work'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-white border-b border-slate-200',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            />
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-4">
          {/* Quick Action Button */}
          {onQuickAction && (
            <Button
              onClick={onQuickAction}
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
            >
              {quickActionLabel || defaultQuickActionLabel}
            </Button>
          )}

          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                  <div className="p-3 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded">
                      Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded">
                      Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
