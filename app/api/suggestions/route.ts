import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ suggestions: [] })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('category_suggestions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching suggestions:', error)
      return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
    }

    return NextResponse.json({ suggestions: data || [] })
  } catch (error) {
    console.error('Error in suggestions API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      suggestion_type,
      parent_id,
      suggested_name,
      suggested_description,
      reason,
    } = body

    if (!user_id || !suggestion_type || !suggested_name) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, suggestion_type, suggested_name' },
        { status: 400 }
      )
    }

    if (!['industry', 'category', 'skill'].includes(suggestion_type)) {
      return NextResponse.json(
        { error: 'Invalid suggestion_type. Must be: industry, category, or skill' },
        { status: 400 }
      )
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        message: 'Suggestion submitted for review (mock)',
        suggestion: {
          id: 'mock-id',
          user_id,
          suggestion_type,
          parent_id,
          suggested_name,
          suggested_description,
          reason,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('category_suggestions')
      .insert({
        user_id,
        suggestion_type,
        parent_id,
        suggested_name,
        suggested_description,
        reason,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error submitting suggestion:', error)
      return NextResponse.json({ error: 'Failed to submit suggestion' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Suggestion submitted for review. We\'ll notify you once it\'s processed.',
      suggestion: data,
    })
  } catch (error) {
    console.error('Error in suggestions POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
