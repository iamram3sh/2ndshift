'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, AlertCircle } from 'lucide-react'
import { useCreateJob, useCategories } from '@/lib/queries'
import type { DeliveryWindow } from '@/types/jobs'

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

const IT_CATEGORIES = [
  { id: 'frontend', name: 'Frontend Development' },
  { id: 'backend', name: 'Backend Development' },
  { id: 'devops', name: 'DevOps & Infrastructure' },
  { id: 'ml-ai', name: 'ML/AI Engineering' },
  { id: 'security', name: 'Security & Penetration Testing' },
  { id: 'database', name: 'Database Administration' },
  { id: 'cloud', name: 'Cloud Architecture' },
  { id: 'mobile', name: 'Mobile Development' },
]

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

  if (!isOpen) return null

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-[#111] dark:text-white">
            Post a High-Value Task
          </h2>
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
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none dark:bg-slate-900 dark:text-white"
              placeholder="e.g., Code Review for React Performance Optimization"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category_id')}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none dark:bg-slate-900 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={8}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none resize-none dark:bg-slate-900 dark:text-white"
              placeholder="Provide a detailed description of the task, requirements, expected deliverables, and any specific technologies or frameworks needed..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {watch('description')?.length || 0} / 5000 characters
            </p>
          </div>

          {/* Price and Delivery */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
                Budget (₹) <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">
                  Min ₹50
                </span>
              </label>
              <input
                type="number"
                min="50"
                step="10"
                {...register('price_fixed', { valueAsNumber: true })}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none dark:bg-slate-900 dark:text-white"
                placeholder="500"
              />
              {errors.price_fixed && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.price_fixed.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
                Delivery Timeline
              </label>
              <select
                {...register('delivery_window')}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none dark:bg-slate-900 dark:text-white"
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
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0b63ff] hover:bg-[#0a56e6] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting Task...
                </>
              ) : (
                'Post Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
