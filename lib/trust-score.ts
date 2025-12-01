// ============================================
// 2NDSHIFT - TRUST SCORE SERVICE
// Two-way rating system - Workers rate clients too!
// ============================================

import { supabaseAdmin } from './supabase/admin'
import type { TrustScore, TrustReview, BadgeLevel } from '@/types/features'

// Badge thresholds
const BADGE_THRESHOLDS: Record<BadgeLevel, { minScore: number; minReviews: number }> = {
  new: { minScore: 0, minReviews: 0 },
  verified: { minScore: 4.0, minReviews: 3 },
  trusted: { minScore: 4.3, minReviews: 10 },
  elite: { minScore: 4.6, minReviews: 25 },
  champion: { minScore: 4.8, minReviews: 50 },
}

/**
 * Get or initialize trust score for user
 */
export async function getTrustScore(userId: string): Promise<TrustScore | null> {
  let { data, error } = await supabaseAdmin
    .from('trust_scores')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // Get user type
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('user_type')
      .eq('id', userId)
      .single()

    // Initialize if doesn't exist
    const { data: newScore, error: createError } = await supabaseAdmin
      .from('trust_scores')
      .insert({
        user_id: userId,
        user_type: user?.user_type || 'worker',
        overall_score: 5.00,
        badge_level: 'new',
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating trust score:', createError)
      return null
    }
    return newScore
  }

  if (error) {
    console.error('Error fetching trust score:', error)
    return null
  }

  return data
}

/**
 * Submit a review
 */
export async function submitReview(
  contractId: string,
  reviewerId: string,
  revieweeId: string,
  reviewerType: 'worker' | 'client',
  ratings: {
    overall_rating: number
    // Worker reviewing Client
    payment_reliability?: number
    requirement_clarity?: number
    responsiveness?: number
    fair_treatment?: number
    would_work_again?: boolean
    // Client reviewing Worker
    work_quality?: number
    communication?: number
    timeliness?: number
    professionalism?: number
    would_hire_again?: boolean
    // Common
    review_text?: string
    is_public?: boolean
  }
): Promise<{ success: boolean; review?: TrustReview; error?: string }> {
  // Check if review already exists
  const { data: existing } = await supabaseAdmin
    .from('trust_reviews')
    .select('id')
    .eq('contract_id', contractId)
    .eq('reviewer_id', reviewerId)
    .single()

  if (existing) {
    return { success: false, error: 'You have already reviewed this contract' }
  }

  // Create review
  const { data: review, error } = await supabaseAdmin
    .from('trust_reviews')
    .insert({
      contract_id: contractId,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      reviewer_type: reviewerType,
      ...ratings,
      is_public: ratings.is_public !== false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating review:', error)
    return { success: false, error: 'Failed to submit review' }
  }

  // Recalculate trust score for reviewee
  await recalculateTrustScore(revieweeId)

  return { success: true, review }
}

/**
 * Recalculate trust score based on all reviews
 */
export async function recalculateTrustScore(userId: string): Promise<void> {
  // Get all reviews for this user
  const { data: reviews, error } = await supabaseAdmin
    .from('trust_reviews')
    .select('*')
    .eq('reviewee_id', userId)

  if (error || !reviews || reviews.length === 0) {
    return
  }

  // Get user type
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('user_type')
    .eq('id', userId)
    .single()

  const isWorker = user?.user_type === 'worker'

  // Calculate averages
  const totalReviews = reviews.length
  const overallAvg = reviews.reduce((sum, r) => sum + r.overall_rating, 0) / totalReviews

  let scores: Partial<TrustScore> = {
    overall_score: Math.round(overallAvg * 100) / 100,
    total_reviews: totalReviews,
  }

  if (isWorker) {
    // Worker scores (rated by clients)
    const clientReviews = reviews.filter(r => r.reviewer_type === 'client')
    if (clientReviews.length > 0) {
      scores.quality_score = avgOfField(clientReviews, 'work_quality')
      scores.communication_score = avgOfField(clientReviews, 'communication')
      scores.timeliness_score = avgOfField(clientReviews, 'timeliness')
      scores.professionalism_score = avgOfField(clientReviews, 'professionalism')
      
      // Calculate repeat hire rate
      const wouldHireAgain = clientReviews.filter(r => r.would_hire_again).length
      scores.repeat_hire_rate = (wouldHireAgain / clientReviews.length) * 100
    }
  } else {
    // Client scores (rated by workers)
    const workerReviews = reviews.filter(r => r.reviewer_type === 'worker')
    if (workerReviews.length > 0) {
      scores.payment_reliability_score = avgOfField(workerReviews, 'payment_reliability')
      scores.clarity_score = avgOfField(workerReviews, 'requirement_clarity')
      scores.responsiveness_score = avgOfField(workerReviews, 'responsiveness')
      scores.fairness_score = avgOfField(workerReviews, 'fair_treatment')
      
      // Calculate repeat work rate
      const wouldWorkAgain = workerReviews.filter(r => r.would_work_again).length
      scores.repeat_hire_rate = (wouldWorkAgain / workerReviews.length) * 100
    }
  }

  // Determine badge level
  scores.badge_level = determineBadgeLevel(scores.overall_score || 0, totalReviews)
  scores.last_calculated_at = new Date().toISOString()

  // Update trust score
  await supabaseAdmin
    .from('trust_scores')
    .update(scores)
    .eq('user_id', userId)
}

/**
 * Calculate average of a numeric field
 */
function avgOfField(reviews: any[], field: string): number {
  const values = reviews.filter(r => r[field] != null).map(r => r[field])
  if (values.length === 0) return 5.0
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100
}

/**
 * Determine badge level based on score and reviews
 */
function determineBadgeLevel(score: number, reviewCount: number): BadgeLevel {
  if (score >= BADGE_THRESHOLDS.champion.minScore && reviewCount >= BADGE_THRESHOLDS.champion.minReviews) {
    return 'champion'
  }
  if (score >= BADGE_THRESHOLDS.elite.minScore && reviewCount >= BADGE_THRESHOLDS.elite.minReviews) {
    return 'elite'
  }
  if (score >= BADGE_THRESHOLDS.trusted.minScore && reviewCount >= BADGE_THRESHOLDS.trusted.minReviews) {
    return 'trusted'
  }
  if (score >= BADGE_THRESHOLDS.verified.minScore && reviewCount >= BADGE_THRESHOLDS.verified.minReviews) {
    return 'verified'
  }
  return 'new'
}

/**
 * Get reviews for a user
 */
export async function getReviewsForUser(
  userId: string,
  limit: number = 20
): Promise<TrustReview[]> {
  const { data, error } = await supabaseAdmin
    .from('trust_reviews')
    .select(`
      *,
      reviewer:users!trust_reviews_reviewer_id_fkey(id, full_name)
    `)
    .eq('reviewee_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data || []
}

/**
 * Respond to a review
 */
export async function respondToReview(
  reviewId: string,
  userId: string,
  responseText: string
): Promise<{ success: boolean; error?: string }> {
  // Verify user is the reviewee
  const { data: review, error: fetchError } = await supabaseAdmin
    .from('trust_reviews')
    .select('reviewee_id')
    .eq('id', reviewId)
    .single()

  if (fetchError || !review || review.reviewee_id !== userId) {
    return { success: false, error: 'Review not found or unauthorized' }
  }

  const { error } = await supabaseAdmin
    .from('trust_reviews')
    .update({
      response_text: responseText,
      response_at: new Date().toISOString(),
    })
    .eq('id', reviewId)

  if (error) {
    return { success: false, error: 'Failed to submit response' }
  }

  return { success: true }
}

/**
 * Flag a review for moderation
 */
export async function flagReview(
  reviewId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('trust_reviews')
    .update({ is_flagged: true })
    .eq('id', reviewId)

  if (error) {
    return { success: false, error: 'Failed to flag review' }
  }

  // TODO: Create moderation ticket

  return { success: true }
}

/**
 * Get trust score summary with badge info
 */
export async function getTrustScoreSummary(userId: string): Promise<{
  score: TrustScore | null
  badgeInfo: {
    current: BadgeLevel
    nextLevel: BadgeLevel | null
    reviewsNeeded: number
    scoreNeeded: number
  }
  recentReviews: TrustReview[]
}> {
  const [score, reviews] = await Promise.all([
    getTrustScore(userId),
    getReviewsForUser(userId, 5),
  ])

  // Calculate progress to next badge
  let nextLevel: BadgeLevel | null = null
  let reviewsNeeded = 0
  let scoreNeeded = 0

  if (score) {
    const levels: BadgeLevel[] = ['new', 'verified', 'trusted', 'elite', 'champion']
    const currentIndex = levels.indexOf(score.badge_level)
    
    if (currentIndex < levels.length - 1) {
      nextLevel = levels[currentIndex + 1]
      const threshold = BADGE_THRESHOLDS[nextLevel]
      reviewsNeeded = Math.max(0, threshold.minReviews - score.total_reviews)
      scoreNeeded = Math.max(0, threshold.minScore - score.overall_score)
    }
  }

  return {
    score,
    badgeInfo: {
      current: score?.badge_level || 'new',
      nextLevel,
      reviewsNeeded,
      scoreNeeded: Math.round(scoreNeeded * 10) / 10,
    },
    recentReviews: reviews,
  }
}

/**
 * Get badge display info
 */
export function getBadgeInfo(level: BadgeLevel): {
  label: string
  color: string
  icon: string
  description: string
} {
  const badges: Record<BadgeLevel, { label: string; color: string; icon: string; description: string }> = {
    new: {
      label: 'New',
      color: 'slate',
      icon: '🌱',
      description: 'Just getting started',
    },
    verified: {
      label: 'Verified',
      color: 'blue',
      icon: '✓',
      description: 'Identity and skills verified',
    },
    trusted: {
      label: 'Trusted',
      color: 'emerald',
      icon: '⭐',
      description: 'Consistently excellent work',
    },
    elite: {
      label: 'Elite',
      color: 'purple',
      icon: '💎',
      description: 'Top performer on the platform',
    },
    champion: {
      label: 'Champion',
      color: 'amber',
      icon: '👑',
      description: 'Among the best of the best',
    },
  }

  return badges[level]
}
