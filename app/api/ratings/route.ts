import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType') // 'worker' or 'client'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Return mock data for development
    if (!supabaseUrl || !supabaseServiceKey) {
      const mockRatings = userType === 'worker' ? [
        {
          id: '1',
          overall_rating: 5,
          quality_rating: 5,
          communication_rating: 5,
          timeliness_rating: 4,
          professionalism_rating: 5,
          review_title: 'Excellent developer!',
          review_text: 'Delivered high-quality work on time. Great communication throughout the project.',
          would_hire_again: true,
          skills_demonstrated: ['React', 'TypeScript', 'Node.js'],
          created_at: new Date().toISOString(),
          client: { id: 'c1', full_name: 'Priya Sharma', company_name: 'TechCorp' },
        },
        {
          id: '2',
          overall_rating: 4,
          quality_rating: 4,
          communication_rating: 5,
          timeliness_rating: 4,
          professionalism_rating: 4,
          review_title: 'Great work',
          review_text: 'Very professional and easy to work with.',
          would_hire_again: true,
          skills_demonstrated: ['Python', 'AWS'],
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          client: { id: 'c2', full_name: 'Amit Kumar', company_name: 'DataDriven' },
        },
      ] : [
        {
          id: '1',
          overall_rating: 5,
          payment_rating: 5,
          communication_rating: 5,
          requirements_clarity_rating: 4,
          respect_rating: 5,
          review_title: 'Great client to work with',
          review_text: 'Clear requirements, prompt payments, respectful communication.',
          would_work_again: true,
          paid_on_time: true,
          created_at: new Date().toISOString(),
          professional: { id: 'p1', full_name: 'Rahul Dev' },
        },
      ]

      const mockSummary = {
        overall_rating: 4.7,
        total_reviews: mockRatings.length,
        avg_quality: 4.5,
        avg_communication: 5.0,
        avg_timeliness: 4.0,
        avg_professionalism: 4.5,
        avg_value: 4.5,
        avg_payment: 5.0,
        avg_clarity: 4.0,
        avg_respect: 5.0,
        five_star_count: 1,
        four_star_count: 1,
        three_star_count: 0,
        two_star_count: 0,
        one_star_count: 0,
        would_recommend_percent: 100,
        on_time_payment_percent: 100,
      }

      return NextResponse.json({
        ratings: mockRatings,
        summary: mockSummary,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch ratings based on user type
    let ratings = []
    if (userType === 'worker') {
      const { data, error } = await supabase
        .from('professional_ratings')
        .select(`
          *,
          client:users!professional_ratings_client_id_fkey(id, full_name)
        `)
        .eq('professional_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching professional ratings:', error)
      } else {
        ratings = data || []
      }
    } else {
      const { data, error } = await supabase
        .from('company_ratings')
        .select(`
          *,
          professional:users!company_ratings_professional_id_fkey(id, full_name)
        `)
        .eq('company_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching company ratings:', error)
      } else {
        ratings = data || []
      }
    }

    // Fetch summary
    const { data: summary, error: summaryError } = await supabase
      .from('user_rating_summary')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (summaryError && summaryError.code !== 'PGRST116') {
      console.error('Error fetching rating summary:', summaryError)
    }

    return NextResponse.json({
      ratings,
      summary: summary || {
        overall_rating: 0,
        total_reviews: 0,
      },
    })
  } catch (error) {
    console.error('Error in ratings API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      target_user_id,
      target_user_type, // 'worker' or 'client'
      contract_id,
      reviewer_id,
      overall_rating,
      ...ratingDetails
    } = body

    if (!target_user_id || !reviewer_id || !overall_rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        message: 'Rating submitted (mock)',
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (target_user_type === 'worker') {
      // Client rating a professional
      const { data, error } = await supabase
        .from('professional_ratings')
        .insert({
          professional_id: target_user_id,
          client_id: reviewer_id,
          contract_id,
          overall_rating,
          quality_rating: ratingDetails.quality_rating,
          communication_rating: ratingDetails.communication_rating,
          timeliness_rating: ratingDetails.timeliness_rating,
          professionalism_rating: ratingDetails.professionalism_rating,
          value_rating: ratingDetails.value_rating,
          review_title: ratingDetails.review_title,
          review_text: ratingDetails.review_text,
          would_hire_again: ratingDetails.would_hire_again,
          skills_demonstrated: ratingDetails.skills_demonstrated || [],
          is_public: ratingDetails.is_public !== false,
        })
        .select()
        .single()

      if (error) {
        console.error('Error submitting professional rating:', error)
        return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 })
      }

      return NextResponse.json({ success: true, rating: data })
    } else {
      // Professional rating a client/company
      const { data, error } = await supabase
        .from('company_ratings')
        .insert({
          company_id: target_user_id,
          professional_id: reviewer_id,
          contract_id,
          overall_rating,
          payment_rating: ratingDetails.payment_rating,
          communication_rating: ratingDetails.communication_rating,
          requirements_clarity_rating: ratingDetails.requirements_clarity_rating,
          respect_rating: ratingDetails.respect_rating,
          review_title: ratingDetails.review_title,
          review_text: ratingDetails.review_text,
          would_work_again: ratingDetails.would_work_again,
          paid_on_time: ratingDetails.paid_on_time,
          payment_issues: ratingDetails.payment_issues,
          is_public: ratingDetails.is_public !== false,
        })
        .select()
        .single()

      if (error) {
        console.error('Error submitting company rating:', error)
        return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 })
      }

      return NextResponse.json({ success: true, rating: data })
    }
  } catch (error) {
    console.error('Error in ratings POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
