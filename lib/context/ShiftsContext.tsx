'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { ShiftsTransaction, ShiftsPackage, SubscriptionPlan } from '@/types/shifts'

interface ShiftsContextValue {
  // Balance
  balance: number
  freeBalance: number
  lifetimePurchased: number
  lifetimeUsed: number
  isLoading: boolean
  
  // Subscription
  currentPlan: SubscriptionPlan | null
  platformFee: number
  
  // Packages
  packages: ShiftsPackage[]
  
  // Transactions
  transactions: ShiftsTransaction[]
  
  // Actions
  refetchBalance: () => Promise<void>
  useShifts: (action: string, referenceId?: string, referenceType?: string) => Promise<{ success: boolean; newBalance?: number; error?: string }>
  openPurchaseModal: () => void
  closePurchaseModal: () => void
  isPurchaseModalOpen: boolean
  
  // Setters
  setBalance: (balance: number) => void
}

const ShiftsContext = createContext<ShiftsContextValue | null>(null)

interface ShiftsProviderProps {
  children: ReactNode
  userId: string | null
  userType: 'worker' | 'client'
}

export function ShiftsProvider({ children, userId, userType }: ShiftsProviderProps) {
  const [balance, setBalance] = useState(0)
  const [freeBalance, setFreeBalance] = useState(0)
  const [lifetimePurchased, setLifetimePurchased] = useState(0)
  const [lifetimeUsed, setLifetimeUsed] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [packages, setPackages] = useState<ShiftsPackage[]>([])
  const [transactions, setTransactions] = useState<ShiftsTransaction[]>([])
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

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
      }
    } catch (err) {
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

  // Fetch current subscription/plan
  const fetchCurrentPlan = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/subscriptions/current?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setCurrentPlan(data.plan || null)
      }
    } catch (err) {
      console.error('Error fetching current plan:', err)
    }
  }, [userId])

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/shifts/transactions?userId=${userId}&limit=10`)
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
        fetchTransactions()
        return { success: true, newBalance: data.new_balance }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      console.error('Error using Shifts:', err)
      return { success: false, error: 'Failed to use Shifts' }
    }
  }, [userId, fetchTransactions])

  // Modal controls
  const openPurchaseModal = useCallback(() => setIsPurchaseModalOpen(true), [])
  const closePurchaseModal = useCallback(() => setIsPurchaseModalOpen(false), [])

  // Initial fetch
  useEffect(() => {
    fetchBalance()
    fetchPackages()
    fetchCurrentPlan()
  }, [fetchBalance, fetchPackages, fetchCurrentPlan])

  useEffect(() => {
    if (userId) {
      fetchTransactions()
    }
  }, [userId, fetchTransactions])

  const platformFee = currentPlan?.platform_fee_percent || (userType === 'worker' ? 10 : 12)

  const value: ShiftsContextValue = {
    balance,
    freeBalance,
    lifetimePurchased,
    lifetimeUsed,
    isLoading,
    currentPlan,
    platformFee,
    packages,
    transactions,
    refetchBalance: fetchBalance,
    useShifts,
    openPurchaseModal,
    closePurchaseModal,
    isPurchaseModalOpen,
    setBalance,
  }

  return (
    <ShiftsContext.Provider value={value}>
      {children}
    </ShiftsContext.Provider>
  )
}

export function useShiftsContext() {
  const context = useContext(ShiftsContext)
  if (!context) {
    throw new Error('useShiftsContext must be used within a ShiftsProvider')
  }
  return context
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
