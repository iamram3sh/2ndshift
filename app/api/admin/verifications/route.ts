/**
 * GET /api/admin/verifications
 * List all verifications (admin only)
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
      const userId = req.userId!

      // Verify admin access
      const { data: user } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single()

      if (!user || !['admin', 'superadmin'].includes(user.user_type)) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      const status = req.nextUrl.searchParams.get('status')
      const verificationType = req.nextUrl.searchParams.get('type')
      const tier = req.nextUrl.searchParams.get('tier')
      const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
      const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50')
      const offset = (page - 1) * limit

      let query = supabase
        .from('verifications_v2')
        .select(`
          *,
          user:users!verifications_v2_user_id_fkey (
            id,
            full_name,
            email,
            user_type
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      if (verificationType) {
        query = query.eq('verification_type', verificationType)
      }

      if (tier) {
        query = query.eq('tier', parseInt(tier))
      }

      const { data, error } = await query

      if (error) throw error

      // Get total count
      let countQuery = supabase.from('verifications_v2').select('*', { count: 'exact', head: true })
      if (status) countQuery = countQuery.eq('status', status)
      if (verificationType) countQuery = countQuery.eq('verification_type', verificationType)
      if (tier) countQuery = countQuery.eq('tier', parseInt(tier))

      const { count } = await countQuery

      return NextResponse.json({
        success: true,
        verifications: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      })
    } catch (error: any) {
      console.error('Error fetching verifications:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch verifications' },
        { status: 500 }
      )
    }
  })
}

