import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(request.url)
      const role = searchParams.get('role') || 'worker'
      const status = searchParams.get('status') || 'open'
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')
      const industry = searchParams.get('industry')
      const skills = searchParams.get('skills')?.split(',')
      const search = searchParams.get('search')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const offset = (page - 1) * limit

      let query = supabaseAdmin
        .from('jobs')
        .select('*, client:users!jobs_client_id_fkey(id, full_name, email)', { count: 'exact' })
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (minPrice) {
        query = query.gte('price_fixed', parseFloat(minPrice))
      }
      if (maxPrice) {
        query = query.lte('price_fixed', parseFloat(maxPrice))
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data: jobs, error, count } = await query

      if (error) throw error

      // Transform to match API contract
      const tasks = (jobs || []).map((job: any) => ({
        id: job.id,
        title: job.title,
        shortDesc: job.description?.substring(0, 200) || '',
        minBudget: Number(job.price_fixed || 0),
        maxBudget: Number(job.price_fixed || 0),
        deliveryWindow: job.delivery_window || '3-7d',
        tags: [], // TODO: Extract from description or add tags field
        industry: job.category_id || null,
        difficulty: 'intermediate', // TODO: Map from complexity
        postedAt: job.created_at,
        verifiedClient: job.client?.email_verified || false,
        client: job.client,
      }))

      return NextResponse.json({
        tasks,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      })
    } catch (error: any) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tasks', message: error.message },
        { status: 500 }
      )
    }
  })
}
