'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useJob, useCurrentUser, useAcceptBid } from '@/lib/queries'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, ArrowRight, Clock, DollarSign, Shield, BadgeCheck, CheckCircle,
  User, Calendar, FileText, Loader2, AlertCircle, Layers
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Application } from '@/types/jobs'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params?.id as string
  
  const { data: task, isLoading } = useJob(taskId)
  const { data: currentUser } = useCurrentUser()
  const acceptBid = useAcceptBid()

  const isClient = currentUser && task && currentUser.id === task.client_id
  const applications = task?.applications || []
  const pendingBids = applications.filter((app: Application) => app.status === 'pending')

  const handleAcceptBid = async (applicationId: string) => {
    if (!taskId) return
    
    try {
      await acceptBid.mutateAsync({ jobId: taskId, applicationId })
      // Refetch will happen automatically via React Query
    } catch (err: any) {
      alert(err.message || 'Failed to accept bid')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0b63ff]" />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#111] dark:text-white mb-2">Task not found</h2>
          <Link href="/worker" className="text-[#0b63ff] hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const price = task.price_fixed || 0
  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: task.price_currency || 'INR',
    maximumFractionDigits: 0,
  }).format(price)

  const isVerified = task.client?.trust_score && task.client.trust_score > 80

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#111] dark:hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-[#111] dark:text-white">2ndShift</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-[#111] dark:text-white">
                  {task.title}
                </h1>
                {isVerified && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Verified Employer</span>
                  </div>
                )}
              </div>
              
              {task.category && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {task.category.name}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 text-right">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {priceFormatted}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Task Budget</div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 pb-6 border-b border-slate-200 dark:border-slate-700">
            {task.delivery_window && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {task.delivery_window === 'sixTo24h' && '6-24 hours'}
                  {task.delivery_window === 'threeTo7d' && '3-7 days'}
                  {task.delivery_window === 'oneTo4w' && '1-4 weeks'}
                  {task.delivery_window === 'oneTo6m' && '1-6 months'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Posted {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
            </div>
            {task.client && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{task.client.full_name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#111] dark:text-white mb-3">Description</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>

          {/* Skills */}
          {task.required_skills && task.required_skills.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[#111] dark:text-white mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {task.required_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bids Section */}
        {isClient && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#111] dark:text-white">
                Bids ({pendingBids.length})
              </h2>
              {task.status === 'open' && (
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                  Accepting Bids
                </span>
              )}
            </div>

            {pendingBids.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No bids yet. Share this task to attract professionals.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBids.map((bid: Application) => (
                  <div
                    key={bid.id}
                    className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-[#0b63ff] dark:hover:border-blue-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0b63ff] to-[#0a56e6] rounded-full flex items-center justify-center text-white font-semibold">
                          {bid.worker?.full_name?.charAt(0).toUpperCase() || 'W'}
                        </div>
                        <div>
                          <div className="font-semibold text-[#111] dark:text-white">
                            {bid.worker?.full_name || 'Anonymous'}
                          </div>
                          {bid.worker?.trust_score && (
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              Trust Score: {bid.worker.trust_score}
                            </div>
                          )}
                        </div>
                      </div>
                      {bid.proposed_price && (
                        <div className="text-right">
                          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{bid.proposed_price.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Proposed</div>
                        </div>
                      )}
                    </div>

                    {bid.cover_text && (
                      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {bid.cover_text}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDistanceToNow(new Date(bid.submitted_at), { addSuffix: true })}
                      </span>
                      <Button
                        onClick={() => handleAcceptBid(bid.id)}
                        variant="primary"
                        size="sm"
                        disabled={acceptBid.isPending}
                      >
                        {acceptBid.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Accepting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Accept Bid
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Worker View - Place Bid CTA */}
        {!isClient && task.status === 'open' && (
          <div className="mt-6 bg-gradient-to-r from-[#0b63ff] to-[#0a56e6] rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Interested in this task?</h3>
            <p className="text-blue-100 mb-6">Place your bid and get started</p>
            <Link href={`/worker?bid=${task.id}`}>
              <Button variant="secondary" size="lg">
                View on Dashboard to Bid
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
