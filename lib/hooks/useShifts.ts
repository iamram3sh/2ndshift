'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ShiftsBalance, ShiftsTransaction, ShiftsPackage } from '@/types/shifts'

interface UseShiftsOptions {
  userId: string | null
  userType?: 'worker' | 'client'
}

interface UseShiftsReturn {
  balance: number
  freeBalance: number
  lifetimePurchased: number
  lifetimeUsed: number
  isLoading: boolean
  error: string | null
  packages: ShiftsPackage[]
  transactions: ShiftsTransaction[]
  refetchBalance: () => Promise<void>
  refetchTransactions: () => Promise<void>
  useShifts: (action: string, referenceId?: string, referenceType?: string) => Promise<{ success: boolean; newBalance?: number; error?: string }>
  purchaseShifts: (packageId: string) => Promise<{ success: boolean; orderId?: string; error?: string }>
}

export function useShifts({ userId, userType = 'worker' }: UseShiftsOptions): UseShiftsReturn {
  const [balance, setBalance] = useState(0)
  const [freeBalance, setFreeBalance] = useState(0)
  const [lifetimePurchased, setLifetimePurchased] = useState(0)
  const [lifetimeUsed, setLifetimeUsed] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [packages, setPackages] = useState<ShiftsPackage[]>([])
  const [transactions, setTransactions] = useState<ShiftsTransaction[]>([])

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/shifts/balance?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setBalance(data.balance || 0)
        setFreeBalance(data.free_balance || 0)
        setLifetimePurchased(data.lifetime_purchased || 0)
        setLifetimeUsed(data.lifetime_used || 0)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch balance')
      }
    } catch (err) {
      setError('Failed to fetch balance')
      console.error('Error fetching Shifts balance:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    try {
      const response = await fetch(`/api/shifts/packages?userType=${userType}`)
      const data = await response.json()

      if (response.ok) {
        setPackages(data.packages || [])
      }
    } catch (err) {
      console.error('Error fetching Shifts packages:', err)
    }
  }, [userType])

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/shifts/transactions?userId=${userId}&limit=20`)
      const data = await response.json()

      if (response.ok) {
        setTransactions(data.transactions || [])
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
    }
  }, [userId])

  // Use Shifts
  const useShifts = useCallback(async (
    action: string,
    referenceId?: string,
    referenceType?: string
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'Not logged in' }
    }

    try {
      const response = await fetch('/api/shifts/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action,
          reference_id: referenceId,
          reference_type: referenceType,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBalance(data.new_balance)
        setLifetimeUsed(prev => prev + data.shifts_used)
        await fetchTransactions()
        return { success: true, newBalance: data.new_balance }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      console.error('Error using Shifts:', err)
      return { success: false, error: 'Failed to use Shifts' }
    }
  }, [userId, fetchTransactions])

  // Purchase Shifts
  const purchaseShifts = useCallback(async (
    packageId: string
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'Not logged in' }
    }

    try {
      const response = await fetch('/api/shifts/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: packageId,
          user_id: userId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, orderId: data.order_id }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      console.error('Error purchasing Shifts:', err)
      return { success: false, error: 'Failed to initiate purchase' }
    }
  }, [userId])

  // Initial fetch
  useEffect(() => {
    fetchBalance()
    fetchPackages()
  }, [fetchBalance, fetchPackages])

  // Fetch transactions when userId changes
  useEffect(() => {
    if (userId) {
      fetchTransactions()
    }
  }, [userId, fetchTransactions])

  return {
    balance,
    freeBalance,
    lifetimePurchased,
    lifetimeUsed,
    isLoading,
    error,
    packages,
    transactions,
    refetchBalance: fetchBalance,
    refetchTransactions: fetchTransactions,
    useShifts,
    purchaseShifts,
  }
}

// Shifts costs for quick reference
export const SHIFTS_COSTS = {
  boost_application: 2,
  boost_profile: 5,
  direct_message: 1,
  feature_job: 3,
  urgent_badge: 2,
  direct_invite: 1,
  ai_recommendation: 5,
} as const

export type ShiftsAction = keyof typeof SHIFTS_COSTS
