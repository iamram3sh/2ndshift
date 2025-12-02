'use client'

import { useState, useEffect } from 'react'
import { Info, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import apiClient from '@/lib/apiClient'

interface CommissionBreakdownProps {
  price: number
  workerId?: string
  clientId?: string
  isMicrotask?: boolean
  showTooltips?: boolean
}

export function CommissionBreakdown({
  price,
  workerId,
  clientId,
  isMicrotask = false,
  showTooltips = true,
}: CommissionBreakdownProps) {
  const [breakdown, setBreakdown] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBreakdown = async () => {
      setLoading(true)
      const result = await apiClient.calculateCommission({
        price,
        worker_id: workerId,
        client_id: clientId,
        is_microtask: isMicrotask,
      })
      if (result.data && typeof result.data === 'object' && 'breakdown' in result.data) {
        setBreakdown((result.data as any).breakdown)
      }
      setLoading(false)
    }

    if (price > 0) {
      fetchBreakdown()
    }
  }, [price, workerId, clientId, isMicrotask])

  if (loading || !breakdown) {
    return (
      <div className="text-sm text-slate-500">Calculating breakdown...</div>
    )
  }

  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-slate-600" />
        <h4 className="font-semibold text-slate-900">Price Breakdown</h4>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Job Price</span>
          <span className="font-medium text-slate-900">₹{breakdown.job_price.toLocaleString()}</span>
        </div>

        {breakdown.escrow_fee > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-slate-600">Escrow Fee</span>
              {showTooltips && (
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                    Secure payment protection fee
                  </div>
                </div>
              )}
            </div>
            <span className="font-medium text-slate-600">
              +₹{breakdown.escrow_fee.toFixed(2)} ({breakdown.escrow_fee_percent.toFixed(1)}%)
            </span>
          </div>
        )}

        {breakdown.client_commission > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-slate-600">Platform Fee</span>
              {showTooltips && (
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                    {isMicrotask
                      ? 'Flat fee for microtasks'
                      : 'Platform service fee'}
                  </div>
                </div>
              )}
            </div>
            <span className="font-medium text-slate-600">
              +₹{breakdown.client_commission.toFixed(2)}
              {breakdown.client_commission_percent && (
                ` (${breakdown.client_commission_percent.toFixed(1)}%)`
              )}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Client Pays</span>
            <span className="font-bold text-lg text-slate-900">
              ₹{breakdown.client_pays.toFixed(2)}
            </span>
          </div>
        </div>

        {breakdown.worker_commission > 0 && (
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <span className="text-slate-600">Platform Commission</span>
                {showTooltips && (
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg z-10">
                      Deducted from worker payout
                    </div>
                  </div>
                )}
              </div>
              <span className="font-medium text-slate-600">
                -₹{breakdown.worker_commission.toFixed(2)} ({breakdown.worker_commission_percent.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Worker Receives</span>
              <span className="font-bold text-lg text-emerald-600">
                ₹{breakdown.worker_receives.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
