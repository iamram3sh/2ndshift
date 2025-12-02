'use client'

import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

interface ShiftsHeaderIndicatorProps {
  userId?: string
  className?: string
}

export function ShiftsHeaderIndicator({ userId, className = '' }: ShiftsHeaderIndicatorProps) {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      // Try to get user from auth
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          fetchBalance(user.id)
        } else {
          setLoading(false)
        }
      })
    } else {
      fetchBalance(userId)
    }
  }, [userId])

  const fetchBalance = async (uid: string) => {
    try {
      const response = await fetch(`/api/shifts/balance?userId=${uid}`)
      if (response.ok) {
        const data = await response.json()
        setBalance(data.balance || 0)
      }
    } catch (error) {
      console.error('Error fetching Shifts balance:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't show if no user or loading
  if (loading || balance === null) {
    return null
  }

  return (
    <Link
      href="/worker?tab=shifts"
      className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all ${className}`}
    >
      <Zap className="w-4 h-4" />
      <span>{balance} Shifts</span>
    </Link>
  )
}

