import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(request, async (req) => {
    try {
      const { id } = await params
      const userId = id
      const currentUserId = req.userId!

      // Users can view their own profile or admins can view any
      if (userId !== currentUserId && req.userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      // Get user with profile
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          email,
          full_name,
          user_type,
          email_verified,
          phone_verified,
          profile:profiles(
            id,
            headline,
            bio,
            location,
            hourly_rate_min,
            hourly_rate_max,
            verified_level,
            score,
            skills,
            portfolio_links
          )
        `)
        .eq('id', userId)
        .single()

      if (userError || !user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Get verification status
      const { data: verifications } = await supabaseAdmin
        .from('verifications')
        .select('type, status')
        .eq('user_id', userId)

      const verificationStatus = {
        identity: verifications?.find((v) => v.type === 'identity')?.status || 'not_started',
        skill: verifications?.find((v) => v.type === 'skill')?.status || 'not_started',
      }

      return NextResponse.json({
        user: {
          ...user,
          verificationStatus,
        },
      })
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { error: 'Failed to fetch profile', message: error.message },
        { status: 500 }
      )
    }
  })
}
