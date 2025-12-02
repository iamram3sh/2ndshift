'use client'

import { Calculator, Info, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import apiClient from '@/lib/apiClient'
import { useTranslation, tString } from '@/lib/i18n'

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
  const { t } = useTranslation()
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

      if (result.data && typeof result.data === 'object') {
        // Handle new API response structure with breakdown object
        const calcData = ('breakdown' in result.data && result.data.breakdown) ? result.data : {
          breakdown: result.data
        }
        setCalculation(calcData as any)
        onCalculationChange?.(calcData as any)
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
        <h4 className="font-semibold text-slate-900">{t('pricing.breakdown')}</h4>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Job Price:</span>
          <span className="font-medium text-slate-900">₹{calculation.breakdown?.job_price?.toLocaleString() || price.toLocaleString()}</span>
        </div>

        {calculation.breakdown?.escrow_fee > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              {t('pricing.escrowFee', { 
                escrow_fee: calculation.breakdown.escrow_fee.toFixed(2),
                escrow_percent: calculation.breakdown.escrow_fee_percent?.toFixed(1) || '0'
              })}:
              <span title={tString('pricing.tooltips.escrowBody')}>
                <Info className="w-3 h-3" />
              </span>
            </span>
            <span className="font-medium text-red-600">
              +₹{calculation.breakdown.escrow_fee.toFixed(2)}
            </span>
          </div>
        )}

        {calculation.breakdown?.client_commission > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Client Commission {calculation.breakdown.client_commission_percent ? `(${calculation.breakdown.client_commission_percent.toFixed(1)}%)` : '(Flat ₹49)'}:
              <span title="Added to client payment">
                <Info className="w-3 h-3" />
              </span>
            </span>
            <span className="font-medium text-red-600">
              +₹{calculation.breakdown.client_commission.toFixed(2)}
            </span>
          </div>
        )}

        {calculation.breakdown?.worker_commission > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Worker Commission ({calculation.breakdown.worker_commission_percent?.toFixed(1)}%):
              <span title="Deducted from worker payout">
                <Info className="w-3 h-3" />
              </span>
            </span>
            <span className="font-medium text-red-600">
              -₹{calculation.breakdown.worker_commission.toFixed(2)}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-900">{t('pricing.workerReceives', { worker_payout: calculation.breakdown?.worker_receives?.toFixed(2) || '0.00' })}</span>
            <span className="font-bold text-emerald-600 text-lg">
              ₹{calculation.breakdown?.worker_receives?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900">{t('pricing.clientPays', { total: calculation.breakdown?.client_pays?.toFixed(2) || '0.00' })}</span>
            <span className="font-bold text-slate-900 text-lg">
              ₹{calculation.breakdown?.client_pays?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {calculation.breakdown?.worker_commission_percent > 0 && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-800">
                <strong>Tip:</strong> Get verified or subscribe to reduce commission to{' '}
                {calculation.breakdown.worker_commission_percent >= 10 ? '5%' : '0%'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
