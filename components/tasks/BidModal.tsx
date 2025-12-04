'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, DollarSign, Clock, AlertCircle, Loader2 } from 'lucide-react'
import type { Job } from '@/types/jobs'
import { usePlaceBid, useCreditsBalance } from '@/lib/queries'

const bidSchema = z.object({
  proposed_price: z
    .number()
    .min(50, 'Minimum bid amount is ₹50')
    .optional(),
  cover_text: z
    .string()
    .min(20, 'Proposal must be at least 20 characters')
    .max(1000, 'Proposal must be less than 1000 characters'),
  proposed_delivery: z.string().optional(),
})

type BidFormData = z.infer<typeof bidSchema>

interface BidModalProps {
  isOpen: boolean
  onClose: () => void
  task: Job | null
  onSuccess?: () => void
}

export function BidModal({ isOpen, onClose, task, onSuccess }: BidModalProps) {
  const [error, setError] = useState<string | null>(null)
  const placeBid = usePlaceBid()
  const { data: creditsBalance = 0 } = useCreditsBalance()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      proposed_price: task?.price_fixed ? Number(task.price_fixed) : undefined,
      cover_text: '',
      proposed_delivery: undefined,
    },
  })

  const proposedPrice = watch('proposed_price')
  const creditsRequired = 3 // Default credits per application

  useEffect(() => {
    if (task && isOpen) {
      reset({
        proposed_price: task.price_fixed ? Number(task.price_fixed) : undefined,
        cover_text: '',
        proposed_delivery: undefined,
      })
      setError(null)
    }
  }, [task, isOpen, reset])

  if (!isOpen || !task) return null

  const onSubmit = async (data: BidFormData) => {
    if (creditsBalance < creditsRequired) {
      setError(`Insufficient credits. You need ${creditsRequired} credits to place a bid.`)
      return
    }

    setError(null)

    try {
      await placeBid.mutateAsync({
        jobId: task.id,
        payload: {
          cover_text: data.cover_text,
          proposed_price: data.proposed_price,
          proposed_delivery: data.proposed_delivery,
        },
      })

      reset()
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to place bid. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-[#111] dark:text-white">
              Place Your Bid
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {task.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Task Info */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Task Budget
              </span>
              <span className="text-lg font-bold text-[#111] dark:text-white">
                ₹{task.price_fixed?.toLocaleString() || 'Negotiable'}
              </span>
            </div>
            {task.delivery_window && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>
                  Expected: {
                    (task.delivery_window === 'sixTo24h' || task.delivery_window === '6-24h') && '6-24 hours'
                  }
                  {(task.delivery_window === 'threeTo7d' || task.delivery_window === '3-7d') && '3-7 days'}
                  {(task.delivery_window === 'oneTo4w' || task.delivery_window === '1-4w') && '1-4 weeks'}
                  {(task.delivery_window === 'oneTo6m' || task.delivery_window === '1-6m') && '1-6 months'}
                </span>
              </div>
            )}
          </div>

          {/* Credits Info */}
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Credits Required: {creditsRequired}
              </span>
            </div>
            <span className={`text-sm font-semibold ${creditsBalance >= creditsRequired ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              Your Balance: {creditsBalance}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Proposed Price */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
              Proposed Price (₹)
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">
                Optional - leave empty to use task budget
              </span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                min="50"
                step="10"
                {...register('proposed_price', { valueAsNumber: true })}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none dark:bg-slate-900 dark:text-white"
                placeholder={task.price_fixed?.toString() || 'Enter amount (min ₹50)'}
              />
            </div>
            {errors.proposed_price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.proposed_price.message}
              </p>
            )}
          </div>

          {/* Proposal Text */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
              Your Proposal <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('cover_text')}
              rows={6}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none resize-none dark:bg-slate-900 dark:text-white"
              placeholder="Explain why you're the right fit for this task. Include your relevant experience, approach, and timeline..."
            />
            {errors.cover_text && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.cover_text.message}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {watch('cover_text')?.length || 0} / 1000 characters
            </p>
          </div>

          {/* Proposed Delivery */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
              Proposed Delivery Timeline
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">
                Optional
              </span>
            </label>
            <input
              type="datetime-local"
              {...register('proposed_delivery')}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none dark:bg-slate-900 dark:text-white"
            />
            {errors.proposed_delivery && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.proposed_delivery.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || creditsBalance < creditsRequired}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0b63ff] hover:bg-[#0a56e6] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing Bid...
                </>
              ) : (
                <>
                  Place Bid ({creditsRequired} Credits)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
