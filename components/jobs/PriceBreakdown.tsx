'use client'

import { Info, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import apiClient from '@/lib/apiClient'

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

      if (result.data?.breakdown) {
        setBreakdown(result.data.breakdown)
      }
    } catch (err) {
      console.error('Error fetching breakdown:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !breakdown) {
    return null
  }

  if (compact) {
    return (
      <div className="text-xs text-slate-600 space-y-1">
        <div className="flex items-center justify-between">
          <span>Client pays:</span>
          <span className="font-medium text-slate-900">₹{breakdown.client_pays?.toFixed(0) || price}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Worker receives:</span>
          <span className="font-medium text-emerald-600">₹{breakdown.worker_receives?.toFixed(0) || price}</span>
        </div>
        {(breakdown.worker_commission > 0 || breakdown.client_commission > 0) && (
          <div className="pt-1 border-t border-slate-200 text-slate-500">
            Platform fee: {breakdown.worker_commission_percent > 0 && `${breakdown.worker_commission_percent.toFixed(0)}% worker`}
            {breakdown.worker_commission_percent > 0 && breakdown.client_commission > 0 && ' + '}
            {breakdown.client_commission > 0 && (breakdown.client_commission_percent ? `${breakdown.client_commission_percent.toFixed(0)}% client` : '₹49 client')}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-semibold text-slate-900">Price Breakdown</span>
      </div>
      
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Job Price:</span>
          <span className="font-medium text-slate-900">₹{breakdown.job_price?.toLocaleString() || price.toLocaleString()}</span>
        </div>

        {breakdown.escrow_fee > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Escrow Fee ({breakdown.escrow_fee_percent?.toFixed(1)}%):
              <Info className="w-3 h-3" title="Payment protection fee" />
            </span>
            <span className="font-medium">+₹{breakdown.escrow_fee.toFixed(2)}</span>
          </div>
        )}

        {breakdown.client_commission > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Platform Fee {breakdown.client_commission_percent ? `(${breakdown.client_commission_percent.toFixed(1)}%)` : '(₹49)'}:
              <Info className="w-3 h-3" title="Added to client payment" />
            </span>
            <span className="font-medium">+₹{breakdown.client_commission.toFixed(2)}</span>
          </div>
        )}

        {breakdown.worker_commission > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Worker Fee ({breakdown.worker_commission_percent?.toFixed(1)}%):
              <Info className="w-3 h-3" title="Deducted from worker payout" />
            </span>
            <span className="font-medium text-red-600">-₹{breakdown.worker_commission.toFixed(2)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200 mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-900">Client Pays:</span>
            <span className="font-bold text-slate-900">₹{breakdown.client_pays?.toFixed(0) || price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900">Worker Receives:</span>
            <span className="font-bold text-emerald-600">₹{breakdown.worker_receives?.toFixed(0) || price}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
