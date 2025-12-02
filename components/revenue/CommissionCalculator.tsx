'use client'

import { Calculator, Info, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import apiClient from '@/lib/apiClient'

interface CommissionCalculatorProps {
  price: number
  jobId?: string
  workerId?: string
  clientId?: string
  isMicroTask?: boolean
  onCalculationChange?: (calc: any) => void
}

export function CommissionCalculator({
  price,
  jobId,
  workerId,
  clientId,
  isMicroTask = false,
  onCalculationChange,
}: CommissionCalculatorProps) {
  const [calculation, setCalculation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (price > 0) {
      calculateCommission()
    }
  }, [price, jobId, workerId, clientId, isMicroTask])

  const calculateCommission = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.calculateCommission({
        price,
        job_id: jobId,
        worker_id: workerId,
        client_id: clientId,
        is_microtask: isMicroTask,
      })

      if (result.error) {
        setError(result.error.message || 'Failed to calculate')
        return
      }

      if (result.data) {
        setCalculation(result.data)
        onCalculationChange?.(result.data)
      }
    } catch (err: any) {
      setError(err.message || 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2 text-slate-600">
          <Calculator className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Calculating...</span>
        </div>
      </div>
    )
  }

  if (error || !calculation) {
    return null
  }

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-5 h-5 text-slate-600" />
        <h4 className="font-semibold text-slate-900">Payout Breakdown</h4>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Job Price:</span>
          <span className="font-medium text-slate-900">₹{price.toLocaleString()}</span>
        </div>

        {calculation.workerCommissionAmount > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Worker Commission ({calculation.workerCommissionPercent}%):
              <Info className="w-3 h-3" title="Deducted from worker payout" />
            </span>
            <span className="font-medium text-red-600">
              -₹{calculation.workerCommissionAmount.toFixed(2)}
            </span>
          </div>
        )}

        {calculation.clientCommissionAmount > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Client Commission ({calculation.clientCommissionPercent}%):
              <Info className="w-3 h-3" title="Added to client payment" />
            </span>
            <span className="font-medium text-red-600">
              +₹{calculation.clientCommissionAmount.toFixed(2)}
            </span>
          </div>
        )}

        {calculation.escrowFeeAmount > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Escrow Fee ({calculation.escrowFeePercent}%):
              <Info className="w-3 h-3" title="Payment protection fee" />
            </span>
            <span className="font-medium text-red-600">
              +₹{calculation.escrowFeeAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-900">Worker Receives:</span>
            <span className="font-bold text-emerald-600 text-lg">
              ₹{calculation.netWorkerPayout.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900">Client Pays:</span>
            <span className="font-bold text-slate-900 text-lg">
              ₹{calculation.netClientPayment.toFixed(2)}
            </span>
          </div>
        </div>

        {calculation.workerCommissionPercent > 0 && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-800">
                <strong>Tip:</strong> Get verified or subscribe to reduce commission to{' '}
                {calculation.workerCommissionPercent === 10 ? '5%' : '0%'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
