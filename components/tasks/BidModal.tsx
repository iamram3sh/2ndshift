'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DollarSign, Clock, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import type { Job } from '@/types/jobs'
import { usePlaceBid, useCreditsBalance } from '@/lib/queries'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

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
  const creditsRequired = 3

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

  if (!task) return null

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

  const getDeliveryWindowText = () => {
    const dw = task.delivery_window
    if (dw === 'sixTo24h' || dw === '6-24h') return '6-24 hours'
    if (dw === 'threeTo7d' || dw === '3-7d') return '3-7 days'
    if (dw === 'oneTo4w' || dw === '1-4w') return '1-4 weeks'
    if (dw === 'oneTo6m' || dw === '1-6m') return '1-6 months'
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#1E40AF] dark:text-blue-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Place Your Bid
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
            {task.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Task Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Task Budget
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                ₹{task.price_fixed?.toLocaleString() || 'Negotiable'}
              </span>
            </div>
            {getDeliveryWindowText() && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Expected: {getDeliveryWindowText()}</span>
              </div>
            )}
          </motion.div>

          {/* Credits Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              creditsBalance >= creditsRequired
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${
                creditsBalance >= creditsRequired
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`} />
              <span className={`text-sm font-medium ${
                creditsBalance >= creditsRequired
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-amber-800 dark:text-amber-300'
              }`}>
                Credits Required: {creditsRequired}
              </span>
            </div>
            <Badge variant={creditsBalance >= creditsRequired ? 'success' : 'warning'}>
              Balance: {creditsBalance}
            </Badge>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Proposed Price */}
          <div className="space-y-2">
            <Label htmlFor="proposed_price" className="text-sm font-semibold text-slate-900 dark:text-white">
              Proposed Price (₹)
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">
                Optional - leave empty to use task budget
              </span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="proposed_price"
                type="number"
                min="50"
                step="10"
                {...register('proposed_price', { valueAsNumber: true })}
                className="pl-10"
                placeholder={task.price_fixed?.toString() || 'Enter amount (min ₹50)'}
              />
            </div>
            {errors.proposed_price && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.proposed_price.message}
              </p>
            )}
          </div>

          {/* Proposal Text */}
          <div className="space-y-2">
            <Label htmlFor="cover_text" className="text-sm font-semibold text-slate-900 dark:text-white">
              Your Proposal <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cover_text"
              {...register('cover_text')}
              rows={6}
              className="resize-none"
              placeholder="Explain why you're the right fit for this task. Include your relevant experience, approach, and timeline..."
            />
            {errors.cover_text && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.cover_text.message}
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {watch('cover_text')?.length || 0} / 1000 characters
            </p>
          </div>

          {/* Proposed Delivery */}
          <div className="space-y-2">
            <Label htmlFor="proposed_delivery" className="text-sm font-semibold text-slate-900 dark:text-white">
              Proposed Delivery Timeline
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">
                Optional
              </span>
            </Label>
            <Input
              id="proposed_delivery"
              type="datetime-local"
              {...register('proposed_delivery')}
            />
            {errors.proposed_delivery && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.proposed_delivery.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || creditsBalance < creditsRequired}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Placing Bid...
                </>
              ) : (
                <>
                  Place Bid ({creditsRequired} Credits)
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
