'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { User, LogOut } from 'lucide-react'
import type { User as UserType } from '@/types/database.types'

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)

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
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              2ndShift
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href={`/${user.user_type}`}
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Dashboard
                </Link>
                {user.user_type === 'client' && (
                  <Link
                    href="/projects/create"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    Post Project
                  </Link>
                )}
                {user.user_type === 'worker' && (
                  <Link
                    href="/projects"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    Browse Projects
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user.full_name}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
