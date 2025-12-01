'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { 
  User, LogOut, Briefcase, Bell, Menu, X, 
  LayoutDashboard, PlusCircle, Search, ChevronDown
} from 'lucide-react'
import type { User as UserType } from '@/types/database.types'
import { Badge } from '@/components/ui/Badge'
import { clsx } from 'clsx'

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (authUser) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      if (profile) setUser(profile)
    }
  }

  useEffect(() => {
    checkUser()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    setUser(null)
    router.push('/')
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'worker':
        return 'from-purple-600 to-pink-600'
      case 'client':
        return 'from-green-600 to-emerald-600'
      case 'admin':
        return 'from-blue-600 to-cyan-600'
      case 'superadmin':
        return 'from-orange-600 to-red-600'
      default:
        return 'from-indigo-600 to-purple-600'
    }
  }

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-200 dark:border-slate-700'
          : 'bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
          >
            <div className={clsx(
              'w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300',
              'group-hover:shadow-xl group-hover:scale-110',
              user 
                ? `bg-gradient-to-br ${getUserTypeColor(user.user_type)}`
                : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700'
            )}>
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                2ndShift
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 font-medium">
                Professional Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href={`/${user.user_type}`}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
              >
                <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Dashboard</span>
              </Link>

              {user.user_type === 'client' && (
                <Link
                  href="/projects/create"
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
                >
                  <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Post Project</span>
                </Link>
              )}

              {user.user_type === 'worker' && (
                <Link
                  href="/projects"
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Browse Projects</span>
                </Link>
              )}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-ring"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md',
                        `bg-gradient-to-br ${getUserTypeColor(user.user_type)}`
                      )}>
                        {user.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.full_name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {user.user_type}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={clsx(
                      'w-4 h-4 text-slate-400 transition-transform',
                      userMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in scale-in">
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            'w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md',
                            `bg-gradient-to-br ${getUserTypeColor(user.user_type)}`
                          )}>
                            {user.full_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {user.full_name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {user.email}
                            </div>
                            <Badge variant="primary" size="sm" rounded className="mt-1">
                              {user.user_type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all group"
                        >
                          <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">View Profile</span>
                        </Link>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all group"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-5 py-2.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 animate-in slide-in-from-top">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Link
              href={`/${user.user_type}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            {user.user_type === 'client' && (
              <Link
                href="/projects/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all font-medium"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Post Project</span>
              </Link>
            )}

            {user.user_type === 'worker' && (
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all font-medium"
              >
                <Search className="w-5 h-5" />
                <span>Browse Projects</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
