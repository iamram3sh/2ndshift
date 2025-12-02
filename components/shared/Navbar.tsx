'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { User, LogOut, Layers, Bell, Zap, Menu, X, Home, Briefcase, Users, ChevronDown } from 'lucide-react'
import { ShiftsHeaderIndicator } from '@/components/revenue/ShiftsHeaderIndicator'
import { useRole } from '@/components/role/RoleContextProvider'
import type { User as UserType } from '@/types/database.types'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { role } = useRole()
  const [user, setUser] = useState<UserType | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  const getDashboardLink = () => {
    if (!user) return '/'
    return user.user_type === 'client' ? '/client' : '/worker'
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">2ndShift</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {user ? (
                <>
                  {/* Logged in navigation */}
                  <Link
                    href={getDashboardLink()}
                    className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                      isActive(getDashboardLink())
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Link>
                  
                  {user.user_type === 'client' && (
                    <>
                      <Link
                        href="/workers"
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive('/workers')
                            ? 'text-slate-900 bg-slate-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Find Talent
                      </Link>
                      <Link
                        href="/projects/create"
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive('/projects/create')
                            ? 'text-slate-900 bg-slate-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Post Project
                      </Link>
                    </>
                  )}
                  
                  {user.user_type === 'worker' && (
                    <>
                      <Link
                        href="/worker/discover"
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive('/worker/discover')
                            ? 'text-slate-900 bg-slate-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Find Work
                      </Link>
                      <Link
                        href="/worker/profile/edit"
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive('/worker/profile/edit')
                            ? 'text-slate-900 bg-slate-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        My Profile
                      </Link>
                    </>
                  )}
                  
                  <Link
                    href="/messages"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pathname?.includes('/messages')
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Messages
                  </Link>
                </>
              ) : (
                <>
                  {/* Logged out navigation */}
                  <Link
                    href="/workers"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/workers')
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Find Talent
                  </Link>
                  <Link
                    href="/employers"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/employers')
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    For Employers
                  </Link>
                  <Link
                    href="/for-workers"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/for-workers')
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    For Professionals
                  </Link>
                  <Link
                    href="/features"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/features')
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Features
                  </Link>
                  <Link
                    href="/pricing"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/pricing')
                        ? 'text-slate-900 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Pricing
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Shifts Indicator for Workers */}
                {user.user_type === 'worker' && (
                  <>
                    <ShiftsHeaderIndicator userId={user.id} />
                    <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                  </>
                )}
                
                <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                
                <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
                >
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">{user.full_name?.split(' ')[0]}</span>
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href={role ? `/login?role=${role}` : '/login'}
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                  onClick={() => {
                    if (!role && typeof window !== 'undefined') {
                      if (window.gtag) {
                        window.gtag('event', 'login_shown', { role: null })
                      }
                    }
                  }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.user_type === 'client' && (
                  <>
                    <Link
                      href="/workers"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Find Talent
                    </Link>
                    <Link
                      href="/projects/create"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post Project
                    </Link>
                  </>
                )}
                {user.user_type === 'worker' && (
                  <>
                    <Link
                      href="/worker/discover"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Find Work
                    </Link>
                    <Link
                      href="/worker/profile/edit"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  </>
                )}
                <Link
                  href="/messages"
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/workers"
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Talent
                </Link>
                <Link
                  href="/employers"
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Employers
                </Link>
                <Link
                  href="/for-workers"
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Professionals
                </Link>
                <Link
                  href="/features"
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="pt-4 border-t border-slate-200 mt-4">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg mt-2 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
