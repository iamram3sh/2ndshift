'use client'

import { Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import apiClient from '@/lib/apiClient'
import { PLATFORM_FEE_CONFIG, getPlatformFee } from '@/lib/config/pricing'

interface PriceBreakdownProps {
  price: number
  jobId?: string
  workerId?: string
  clientId?: string
  isMicrotask?: boolean
  compact?: boolean
}

export function PriceBreakdown({
  price,
  jobId,
  workerId,
  clientId,
  isMicrotask = false,
  compact = false,
}: PriceBreakdownProps) {
  const [breakdown, setBreakdown] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (price > 0) {
      fetchBreakdown()
    }
  }, [price, jobId, workerId, clientId, isMicrotask])

  const fetchBreakdown = async () => {
    setLoading(true)
    try {
      const result = await apiClient.calculateCommission({
        price,
        job_id: jobId,
        worker_id: workerId,
        client_id: clientId,
        is_microtask: isMicrotask,
      })

      if (result.data && typeof result.data === 'object' && 'breakdown' in result.data) {
        const backendBreakdown = (result.data as any).breakdown
        
        // Apply fallback if commission is zero or null
        if (backendBreakdown.client_commission_percent == null || backendBreakdown.client_commission_percent === 0) {
          const fallbackFee = getPlatformFee({ difficulty: 'medium' })
          backendBreakdown.client_commission_percent = fallbackFee
          backendBreakdown.client_commission = (backendBreakdown.job_price || price) * fallbackFee
          backendBreakdown.client_pays = (backendBreakdown.job_price || price) + (backendBreakdown.escrow_fee || 0) + backendBreakdown.client_commission
        }
        
        setBreakdown(backendBreakdown)
      }
    } catch (err) {
      console.error('Failed to fetch breakdown:', err)
      // Use fallback on error
      const fallbackFee = getPlatformFee({ difficulty: 'medium' })
      const escrowFee = price * 0.02
      const clientCommission = price * fallbackFee
      setBreakdown({
        job_price: price,
        escrow_fee: escrowFee,
        escrow_fee_percent: 2,
        client_commission: clientCommission,
        client_commission_percent: fallbackFee,
        client_pays: price + escrowFee + clientCommission,
        worker_receives: price,
        worker_commission: 0,
        worker_commission_percent: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading || !breakdown) {
    return (
      <div className="text-xs text-slate-500">
        Calculating breakdown...
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span>Client pays: ₹{breakdown.client_pays?.toFixed(0)}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          Platform fee: {breakdown.client_commission_percent ? `${breakdown.client_commission_percent.toFixed(0)}%` : '₹49'}
          <span title="Platform commission and escrow fee">
            <Info className="w-3 h-3" />
          </span>
        </span>
        <span>•</span>
        <span>Worker receives: ₹{breakdown.worker_receives?.toFixed(0)}</span>
      </div>
    )
  }

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Job Price:</span>
          <span className="font-medium text-slate-900">₹{breakdown.job_price?.toLocaleString()}</span>
        </div>
        
        {breakdown.escrow_fee > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Escrow Fee ({breakdown.escrow_fee_percent?.toFixed(1)}%):
              <span title="Payment protection fee">
                <Info className="w-3 h-3" />
              </span>
            </span>
            <span className="text-xs">+₹{breakdown.escrow_fee.toFixed(2)}</span>
          </div>
        )}

        {(breakdown.client_commission > 0 || breakdown.client_commission_percent > 0) && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Platform Fee {breakdown.client_commission_percent ? `(${(breakdown.client_commission_percent * 100).toFixed(0)}%)` : '(Flat ₹49)'}:
              <span title="Platform fee includes escrow, compliance & payment processing. First 3 jobs: 0% (promo).">
                <Info className="w-3 h-3" />
              </span>
            </span>
            <span className="text-xs">+₹{breakdown.client_commission?.toFixed(2) || '0.00'}</span>
          </div>
        )}

        {breakdown.worker_commission > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Worker Commission ({breakdown.worker_commission_percent?.toFixed(1)}%):
              <span title="Deducted from worker payout">
                <Info className="w-3 h-3" />
              </span>
            </span>
            <span className="text-xs">-₹{breakdown.worker_commission.toFixed(2)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900">Client Pays:</span>
            <span className="font-bold text-slate-900">₹{breakdown.client_pays?.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900">Worker Receives:</span>
            <span className="font-bold text-emerald-600">₹{breakdown.worker_receives?.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
