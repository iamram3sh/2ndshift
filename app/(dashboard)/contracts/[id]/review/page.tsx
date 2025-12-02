'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import type { Contract, User } from '@/types/database.types'

export default function ContractReviewPage() {
  const router = useRouter()
  const params = useParams()
  const contractId = params.id as string

  const [contract, setContract] = useState<Contract | null>(null)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [userType, setUserType] = useState<'worker' | 'client' | null>(null)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const getDashboardPath = () => {
    if (userType === 'worker') return '/worker'
    if (userType === 'client') return '/client'
    return '/'
  }

  useEffect(() => {
    checkAuthAndFetchContract()
  }, [contractId])

  const checkAuthAndFetchContract = async () => {
    try {
      // Use v1 API for authentication
      const result = await apiClient.getCurrentUser()
      if (result.error || !result.data?.user) {
        router.push('/login')
        return
      }
      const currentUser = result.data.user
      setCurrentUserId(currentUser.id)

      // Get contract details
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select(`
          *,
          project:projects(client_id, title)
        `)
        .eq('id', contractId)
        .single()

      if (contractError) throw contractError
      if (!contractData) {
        alert('Contract not found')
        // Redirect based on user role
        const routes: Record<string, string> = {
          worker: '/worker',
          client: '/client',
          admin: '/dashboard/admin',
        }
        router.push(routes[currentUser.role] || '/')
        return
      }

      // Check if contract is completed
      if (contractData.status !== 'completed') {
        alert('You can only review completed contracts')
        const isWorker = contractData.worker_id === currentUser.id
        router.push(isWorker ? '/worker' : '/client')
        return
      }

      setContract(contractData as any)

      // Determine who to review (the other party)
      const isWorker = contractData.worker_id === currentUser.id
      setUserType(isWorker ? 'worker' : 'client')
      const revieweeId = isWorker ? (contractData as any).project.client_id : contractData.worker_id

      // Get the other user's details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', revieweeId)
        .single()

      if (userError) throw userError
      setOtherUser(userData)

      // Check if user has already reviewed
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('contract_id', contractId)
        .eq('reviewer_id', authUser.id)
        .single()

      if (existingReview) {
        setHasReviewed(true)
      }

    } catch (error) {
      console.error('Error:', error)
      alert('Error loading contract details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async (data: { rating: number; review_text: string }) => {
    try {
      const isWorker = contract?.worker_id === currentUserId
      const revieweeId = isWorker ? (contract as any).project.client_id : contract?.worker_id

      const { error } = await supabase
        .from('reviews')
        .insert({
          contract_id: contractId,
          reviewer_id: currentUserId,
          reviewee_id: revieweeId,
          rating: data.rating,
          review_text: data.review_text,
          is_visible: true,
          is_flagged: false
        })

      if (error) throw error

      // Create notification for the reviewed user
      await supabase
        .from('notifications')
        .insert({
          user_id: revieweeId,
          type: 'review',
          title: 'New Review Received',
          message: `You received a ${data.rating}-star review`,
          link: `/profile/${revieweeId}`
        })

      setReviewSubmitted(true)
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (reviewSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Review Submitted!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Thank you for taking the time to review {otherUser?.full_name}. 
              Your feedback helps build trust in our community.
            </p>
            <button
              onClick={() => router.push(getDashboardPath())}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (hasReviewed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
            <CheckCircle className="w-20 h-20 text-blue-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Already Reviewed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You have already submitted a review for this contract.
            </p>
            <button
              onClick={() => router.push(getDashboardPath())}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Leave a Review
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your experience working with {otherUser?.full_name}
          </p>
        </div>

        {/* Contract Info */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {(contract as any)?.project?.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Contract Amount: ₹{contract?.contract_amount.toLocaleString()}</span>
            <span>•</span>
            <span>Completed: {contract?.completed_at ? new Date(contract.completed_at).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        {/* Review Form */}
        <ReviewForm
          contractId={contractId}
          revieweeId={otherUser?.id || ''}
          onSubmit={handleSubmitReview}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  )
}
