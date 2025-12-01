import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workerId = searchParams.get('workerId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!workerId) {
      return NextResponse.json({ error: 'Worker ID is required' }, { status: 400 })
    }

    // Return mock data for development
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        matches: [
          {
            id: '1',
            match_score: 92,
            skill_match_score: 95,
            experience_match_score: 85,
            rate_match_score: 90,
            is_featured: true,
            project: {
              id: 'p1',
              title: 'Build a React Dashboard',
              budget: 50000,
              required_skills: ['React', 'TypeScript', 'Tailwind'],
              duration_hours: 40,
            },
          },
          {
            id: '2',
            match_score: 87,
            skill_match_score: 90,
            experience_match_score: 80,
            rate_match_score: 85,
            is_featured: false,
            project: {
              id: 'p2',
              title: 'E-commerce API Development',
              budget: 75000,
              required_skills: ['Node.js', 'PostgreSQL', 'REST API'],
              duration_hours: 60,
            },
          },
        ],
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('smart_matches')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('worker_id', workerId)
      .gte('match_score', 50)
      .order('match_score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching matches:', error)
      return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
    }

    return NextResponse.json({ matches: data || [] })
  } catch (error) {
    console.error('Error in matches API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
