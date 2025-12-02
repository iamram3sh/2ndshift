/**
 * GET /api/verification/microtask/list
 * List available microtasks
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-middleware'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const difficulty = req.nextUrl.searchParams.get('difficulty')
      const skillCategory = req.nextUrl.searchParams.get('skillCategory')

      let query = supabase
        .from('microtasks')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (difficulty) {
        query = query.eq('difficulty', difficulty)
      }

      if (skillCategory) {
        query = query.eq('skill_category', skillCategory)
      }

      const { data, error } = await query

      if (error) throw error

      // Remove grader script from response (security)
      const sanitized = (data || []).map(({ grader_script, ...rest }) => rest)

      return NextResponse.json({
        success: true,
        microtasks: sanitized
      })
    } catch (error: any) {
      console.error('Error fetching microtasks:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch microtasks' },
        { status: 500 }
      )
    }
  })
}

