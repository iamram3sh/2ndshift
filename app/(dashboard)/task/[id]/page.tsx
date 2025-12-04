'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useJob, useCurrentUser, useAcceptBid } from '@/lib/queries'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { 
  ArrowLeft, Clock, DollarSign, Shield, BadgeCheck, CheckCircle,
  User, Calendar, FileText, Loader2, AlertCircle, Layers, Sparkles, ArrowRight
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
    } catch (err: any) {
      alert(err.message || 'Failed to accept bid')
    }
  }

  const getDeliveryWindowText = () => {
    if (!task?.delivery_window) return null
    const dw = task.delivery_window
    if (dw === 'sixTo24h' || dw === '6-24h') return '6-24 hours'
    if (dw === 'threeTo7d' || dw === '3-7d') return '3-7 days'
    if (dw === 'oneTo4w' || dw === '1-4w') return '1-4 weeks'
    if (dw === 'oneTo6m' || dw === '1-6m') return '1-6 months'
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <span className="text-slate-600 dark:text-slate-300">Loading task...</span>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Task not found</h2>
          <Link href="/worker" className="text-primary-600 hover:underline">
            Back to Dashboard
          </Link>
        </motion.div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center shadow-md">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                2ndShift
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Task Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-8 mb-8"
        >
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {task.title}
                </h1>
                {isVerified && (
                  <Badge variant="success" className="gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Verified Client
                  </Badge>
                )}
              </div>
              
              {task.category && (
                <Badge variant="secondary" className="mb-4">
                  {task.category.name}
                </Badge>
              )}

              <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-6">
                {getDeliveryWindowText() && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{getDeliveryWindowText()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                </div>
                {applications.length > 0 && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{applications.length} {applications.length === 1 ? 'bid' : 'bids'}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md"
              >
                <DollarSign className="w-5 h-5 text-white" />
                <span className="text-2xl font-bold text-white">{priceFormatted}</span>
              </motion.div>
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Skills */}
          {task.required_skills && task.required_skills.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {task.required_skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Client Info */}
        {task.client && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Client Information</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                {task.client.full_name?.charAt(0) || 'C'}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {task.client.full_name || 'Anonymous Client'}
                </div>
                {isVerified && (
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Verified Employer
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bids Section (Client View) */}
        {isClient && pendingBids.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Pending Bids ({pendingBids.length})
            </h2>
            <div className="space-y-4">
              {pendingBids.map((bid: Application, index: number) => (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white mb-2">
                        {bid.worker?.full_name || 'Anonymous Worker'}
                      </div>
                      {bid.proposed_price && (
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{bid.proposed_price.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAcceptBid(bid.id)}
                      disabled={acceptBid.isPending}
                      className="flex items-center gap-2"
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
                  {bid.cover_text && (
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {bid.cover_text}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Worker CTA */}
        {!isClient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl border border-primary-200 dark:border-primary-800 p-8 text-center"
          >
            <Sparkles className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Interested in this task?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Place your bid and get started on this high-value project.
            </p>
            <Link href="/worker">
              <Button className="inline-flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
