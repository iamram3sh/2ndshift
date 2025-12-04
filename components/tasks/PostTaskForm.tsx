'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle, Sparkles } from 'lucide-react'
import { useCreateJob, useCategories } from '@/lib/queries'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'

const postTaskSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000, 'Description must be less than 5000 characters'),
  category_id: z.string().uuid('Please select a category'),
  price_fixed: z.number().min(50, 'Minimum price is ₹50').max(1000000, 'Maximum price is ₹10,00,000'),
  delivery_window: z.enum(['sixTo24h', 'threeTo7d', 'oneTo4w', 'oneTo6m']).optional(),
  required_skills: z.array(z.string()).optional(),
})

type PostTaskFormData = z.infer<typeof postTaskSchema>

interface PostTaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function PostTaskForm({ isOpen, onClose, onSuccess }: PostTaskFormProps) {
  const [error, setError] = useState<string | null>(null)
  const createJob = useCreateJob()
  const { data: categories = [] } = useCategories()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<PostTaskFormData>({
    resolver: zodResolver(postTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      price_fixed: 100,
      delivery_window: 'threeTo7d',
      required_skills: [],
    },
  })

  const onSubmit = async (data: PostTaskFormData) => {
    setError(null)

    try {
      await createJob.mutateAsync({
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        price_fixed: data.price_fixed,
        delivery_window: data.delivery_window,
        required_skills: data.required_skills,
      })

      reset()
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create task. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Post a High-Value Task
            </DialogTitle>
          </div>
          <DialogDescription>
            Create a new high-value IT microtask ($50–$500+) for verified professionals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Task Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g., Code Review for React Performance Optimization"
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_id">
              Category <span className="text-red-500">*</span>
            </Label>
            <select
              id="category_id"
              {...register('category_id')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select a category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Detailed Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={8}
              className="resize-none"
              placeholder="Provide a detailed description of the task, requirements, expected deliverables, and any specific technologies or frameworks needed..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {watch('description')?.length || 0} / 5000 characters
            </p>
          </div>

          {/* Price and Delivery */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price_fixed">
                Budget (₹) <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">
                  Min ₹50
                </span>
              </Label>
              <Input
                id="price_fixed"
                type="number"
                min="50"
                step="10"
                {...register('price_fixed', { valueAsNumber: true })}
                placeholder="500"
              />
              {errors.price_fixed && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.price_fixed.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_window">Delivery Timeline</Label>
              <select
                id="delivery_window"
                {...register('delivery_window')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="sixTo24h">6-24 hours</option>
                <option value="threeTo7d">3-7 days</option>
                <option value="oneTo4w">1-4 weeks</option>
                <option value="oneTo6m">1-6 months</option>
              </select>
            </div>
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
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Posting Task...
                </>
              ) : (
                'Post Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
