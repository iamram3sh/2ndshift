import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Badge thresholds
const BADGE_THRESHOLDS: Record<string, { minScore: number; minReviews: number }> = {
  new: { minScore: 0, minReviews: 0 },
  verified: { minScore: 4.0, minReviews: 3 },
  trusted: { minScore: 4.3, minReviews: 10 },
  elite: { minScore: 4.6, minReviews: 25 },
  champion: { minScore: 4.8, minReviews: 50 },
}

// GET - Fetch trust score for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Mock data for development
    if (!supabaseUrl || !supabaseServiceKey) {
      const mockScore = generateMockTrustScore(userId)
      return NextResponse.json(mockScore)
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get trust score
    let { data: score, error } = await supabase
      .from('trust_scores')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Create new trust score if doesn't exist
      const { data: user } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single()

      const { data: newScore, error: createError } = await supabase
        .from('trust_scores')
        .insert({
          user_id: userId,
          user_type: user?.user_type || 'worker',
          overall_score: 5.0,
          badge_level: 'new',
          total_reviews: 0,
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: 'Failed to create trust score' }, { status: 500 })
      }
      score = newScore
    } else if (error) {
      return NextResponse.json({ error: 'Failed to fetch trust score' }, { status: 500 })
    }

    // Get recent reviews
    const { data: reviews } = await supabase
      .from('trust_reviews')
      .select(`
        *,
        reviewer:users!trust_reviews_reviewer_id_fkey(id, full_name)
      `)
      .eq('reviewee_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(5)

    // Calculate next badge info
    const badgeInfo = calculateBadgeProgress(score)

    return NextResponse.json({
      score,
      reviews: reviews || [],
      badgeInfo,
    })
  } catch (error) {
    console.error('Error in trust-score GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Submit review from escrow completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      contractId,
      escrowId,
      milestoneId,
      reviewerId,
      revieweeId,
      reviewerType,
      rating,
      feedback,
      ratings, // Detailed ratings object
    } = body

    if (!reviewerId || !revieweeId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock for development
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        review: {
          id: `mock-review-${Date.now()}`,
          reviewerId,
          revieweeId,
          rating,
          feedback,
        },
        newBadgeLevel: rating >= 4.5 ? 'verified' : 'new',
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check for existing review
    const existingQuery = supabase
      .from('trust_reviews')
      .select('id')
      .eq('reviewer_id', reviewerId)
      .eq('reviewee_id', revieweeId)

    if (contractId) {
      existingQuery.eq('contract_id', contractId)
    }
    if (milestoneId) {
      existingQuery.eq('milestone_id', milestoneId)
    }

    const { data: existing } = await existingQuery.single()

    if (existing) {
      return NextResponse.json(
        { error: 'Review already submitted' },
        { status: 400 }
      )
    }

    // Create review
    const reviewData: Record<string, any> = {
      contract_id: contractId || null,
      escrow_id: escrowId || null,
      milestone_id: milestoneId || null,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      reviewer_type: reviewerType,
      overall_rating: rating,
      review_text: feedback || null,
      is_public: true,
    }

    // Add detailed ratings if provided
    if (ratings) {
      if (reviewerType === 'client') {
        reviewData.work_quality = ratings.workQuality
        reviewData.communication = ratings.communication
        reviewData.timeliness = ratings.timeliness
        reviewData.professionalism = ratings.professionalism
        reviewData.would_hire_again = ratings.wouldHireAgain
      } else {
        reviewData.payment_reliability = ratings.paymentReliability
        reviewData.requirement_clarity = ratings.requirementClarity
        reviewData.responsiveness = ratings.responsiveness
        reviewData.fair_treatment = ratings.fairTreatment
        reviewData.would_work_again = ratings.wouldWorkAgain
      }
    }

    const { data: review, error: reviewError } = await supabase
      .from('trust_reviews')
      .insert(reviewData)
      .select()
      .single()

    if (reviewError) {
      console.error('Error creating review:', reviewError)
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }

    // Recalculate trust score
    await recalculateTrustScore(supabase, revieweeId)

    // Get updated score
    const { data: updatedScore } = await supabase
      .from('trust_scores')
      .select('badge_level, overall_score')
      .eq('user_id', revieweeId)
      .single()

    return NextResponse.json({
      success: true,
      review,
      newBadgeLevel: updatedScore?.badge_level || 'new',
      newScore: updatedScore?.overall_score || 5.0,
    })
  } catch (error) {
    console.error('Error in trust-score POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Recalculate trust score for a user
async function recalculateTrustScore(supabase: any, userId: string) {
  // Get all reviews for this user
  const { data: reviews, error } = await supabase
    .from('trust_reviews')
    .select('*')
    .eq('reviewee_id', userId)

  if (error || !reviews || reviews.length === 0) {
    return
  }

  // Get user type
  const { data: user } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', userId)
    .single()

  const isWorker = user?.user_type === 'worker'

  // Calculate averages
  const totalReviews = reviews.length
  const overallAvg = reviews.reduce((sum: number, r: any) => sum + r.overall_rating, 0) / totalReviews

  const updateData: Record<string, any> = {
    overall_score: Math.round(overallAvg * 100) / 100,
    total_reviews: totalReviews,
    last_calculated_at: new Date().toISOString(),
  }

  // Calculate detailed scores
  if (isWorker) {
    const clientReviews = reviews.filter((r: any) => r.reviewer_type === 'client')
    if (clientReviews.length > 0) {
      updateData.quality_score = avgOfField(clientReviews, 'work_quality')
      updateData.communication_score = avgOfField(clientReviews, 'communication')
      updateData.timeliness_score = avgOfField(clientReviews, 'timeliness')
      updateData.professionalism_score = avgOfField(clientReviews, 'professionalism')
      
      const wouldHireAgain = clientReviews.filter((r: any) => r.would_hire_again).length
      updateData.repeat_hire_rate = (wouldHireAgain / clientReviews.length) * 100
    }
  } else {
    const workerReviews = reviews.filter((r: any) => r.reviewer_type === 'worker')
    if (workerReviews.length > 0) {
      updateData.payment_reliability_score = avgOfField(workerReviews, 'payment_reliability')
      updateData.clarity_score = avgOfField(workerReviews, 'requirement_clarity')
      updateData.responsiveness_score = avgOfField(workerReviews, 'responsiveness')
      updateData.fairness_score = avgOfField(workerReviews, 'fair_treatment')
      
      const wouldWorkAgain = workerReviews.filter((r: any) => r.would_work_again).length
      updateData.repeat_hire_rate = (wouldWorkAgain / workerReviews.length) * 100
    }
  }

  // Determine badge level
  updateData.badge_level = determineBadgeLevel(updateData.overall_score, totalReviews)

  // Update or insert trust score
  const { data: existing } = await supabase
    .from('trust_scores')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (existing) {
    await supabase
      .from('trust_scores')
      .update(updateData)
      .eq('user_id', userId)
  } else {
    await supabase
      .from('trust_scores')
      .insert({
        user_id: userId,
        user_type: isWorker ? 'worker' : 'client',
        ...updateData,
      })
  }
}

function avgOfField(reviews: any[], field: string): number {
  const values = reviews.filter(r => r[field] != null).map(r => r[field])
  if (values.length === 0) return 5.0
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100
}

function determineBadgeLevel(score: number, reviewCount: number): string {
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

function calculateBadgeProgress(score: any) {
  if (!score) {
    return {
      current: 'new',
      nextLevel: 'verified',
      reviewsNeeded: 3,
      scoreNeeded: 4.0,
      progressPercent: 0,
    }
  }

  const levels = ['new', 'verified', 'trusted', 'elite', 'champion']
  const currentIndex = levels.indexOf(score.badge_level)

  if (currentIndex >= levels.length - 1) {
    return {
      current: score.badge_level,
      nextLevel: null,
      reviewsNeeded: 0,
      scoreNeeded: 0,
      progressPercent: 100,
    }
  }

  const nextLevel = levels[currentIndex + 1]
  const threshold = BADGE_THRESHOLDS[nextLevel]
  const reviewsNeeded = Math.max(0, threshold.minReviews - score.total_reviews)
  const scoreNeeded = Math.max(0, threshold.minScore - score.overall_score)

  // Calculate progress percentage
  const reviewProgress = score.total_reviews / threshold.minReviews
  const scoreProgress = score.overall_score / threshold.minScore
  const progressPercent = Math.min(100, Math.round((reviewProgress + scoreProgress) / 2 * 100))

  return {
    current: score.badge_level,
    nextLevel,
    reviewsNeeded,
    scoreNeeded: Math.round(scoreNeeded * 10) / 10,
    progressPercent,
  }
}

function generateMockTrustScore(userId: string) {
  const levels = ['new', 'verified', 'trusted', 'elite', 'champion']
  const randomLevel = levels[Math.floor(Math.random() * 3)] // Mostly lower levels
  const randomScore = 3.5 + Math.random() * 1.5

  return {
    score: {
      id: `mock-${userId}`,
      user_id: userId,
      user_type: 'worker',
      overall_score: Math.round(randomScore * 10) / 10,
      badge_level: randomLevel,
      total_reviews: Math.floor(Math.random() * 20),
      quality_score: Math.round((4 + Math.random()) * 10) / 10,
      communication_score: Math.round((4 + Math.random()) * 10) / 10,
      timeliness_score: Math.round((4 + Math.random()) * 10) / 10,
      professionalism_score: Math.round((4 + Math.random()) * 10) / 10,
      repeat_hire_rate: Math.round(Math.random() * 100),
    },
    reviews: [
      {
        id: 'mock-review-1',
        reviewer: { id: 'mock-reviewer-1', full_name: 'Priya Sharma' },
        overall_rating: 5,
        work_quality: 5,
        review_text: 'Excellent work! Very professional and delivered on time.',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-review-2',
        reviewer: { id: 'mock-reviewer-2', full_name: 'Rahul Kumar' },
        overall_rating: 4,
        work_quality: 4,
        review_text: 'Good quality work. Would recommend.',
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    badgeInfo: calculateBadgeProgress({
      badge_level: randomLevel,
      total_reviews: Math.floor(Math.random() * 20),
      overall_score: randomScore,
    }),
  }
}
