'use client'

import { Shield, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface VerificationBadgeProps {
  userId: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  showAll?: boolean // Show all verification types or just overall status
}

interface VerificationStatus {
  email: 'pending' | 'verified' | 'rejected' | 'none'
  phone: 'pending' | 'verified' | 'rejected' | 'none'
  pan: 'pending' | 'verified' | 'rejected' | 'none'
  aadhar: 'pending' | 'verified' | 'rejected' | 'none'
  bank_account: 'pending' | 'verified' | 'rejected' | 'none'
}

export function VerificationBadge({ userId, size = 'md', showText = true, showAll = false }: VerificationBadgeProps) {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    email: 'none',
    phone: 'none',
    pan: 'none',
    aadhar: 'none',
    bank_account: 'none'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVerificationStatus()
  }, [userId])

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('verification_type, status')
        .eq('user_id', userId)

      if (error) throw error

      const statusMap: VerificationStatus = {
        email: 'none',
        phone: 'none',
        pan: 'none',
        aadhar: 'none',
        bank_account: 'none'
      }

      data?.forEach((v) => {
        statusMap[v.verification_type as keyof VerificationStatus] = v.status as any
      })

      setVerificationStatus(statusMap)
    } catch (error) {
      console.error('Error fetching verification status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFullyVerified = () => {
    return verificationStatus.email === 'verified' && 
           verificationStatus.phone === 'verified' &&
           verificationStatus.pan === 'verified'
  }

  const hasAnyVerification = () => {
    return Object.values(verificationStatus).some(status => status === 'verified')
  }

  const hasPendingVerification = () => {
    return Object.values(verificationStatus).some(status => status === 'pending')
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  if (isLoading) return null

  // Show detailed verification status
  if (showAll) {
    return (
      <div className={`space-y-2 ${sizeClasses[size]}`}>
        {Object.entries(verificationStatus).map(([type, status]) => {
          if (status === 'none') return null
          
          const icons = {
            verified: <CheckCircle className={`${iconSizes[size]} text-green-500`} />,
            pending: <Clock className={`${iconSizes[size]} text-amber-500`} />,
            rejected: <XCircle className={`${iconSizes[size]} text-red-500`} />
          }

          return (
            <div key={type} className="flex items-center gap-2">
              {icons[status as keyof typeof icons]}
              <span className="capitalize">{type.replace('_', ' ')}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                status === 'verified' ? 'bg-green-100 text-green-700' :
                status === 'pending' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {status}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  // Show simple badge
  if (isFullyVerified()) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full ${sizeClasses[size]}`}>
        <Shield className={iconSizes[size]} />
        {showText && <span className="font-semibold">Verified</span>}
      </div>
    )
  }

  if (hasAnyVerification()) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full ${sizeClasses[size]}`}>
        <CheckCircle className={iconSizes[size]} />
        {showText && <span className="font-semibold">Partially Verified</span>}
      </div>
    )
  }

  if (hasPendingVerification()) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full ${sizeClasses[size]}`}>
        <Clock className={iconSizes[size]} />
        {showText && <span className="font-semibold">Verification Pending</span>}
      </div>
    )
  }

  return null
}
