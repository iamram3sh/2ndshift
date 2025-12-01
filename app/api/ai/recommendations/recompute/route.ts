import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { withAuthAndRateLimit } from '@/lib/api-middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { recomputeRecommendations } from '@/lib/ai-match'

const payloadSchema = z.object({
  projectId: z.string().uuid().optional(),
  limit: z.number().min(1).max(25).optional()
})

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    request,
    async (authRequest) => {
      const body = await request.json().catch(() => null)
      const parse = payloadSchema.safeParse(body)

      if (!parse.success) {
        return NextResponse.json(
          { error: 'Invalid payload', details: parse.error.flatten() },
          { status: 400 }
        )
      }

      const requesterId = authRequest.userId
      if (!requesterId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { data: userProfile, error: userError } = await supabaseAdmin
        .from('users')
        .select('user_type')
        .eq('id', requesterId)
        .single()

      if (userError || userProfile?.user_type !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const { projectId, limit = 10 } = parse.data
      let projectIds: string[] = []

      if (projectId) {
        projectIds = [projectId]
      } else {
        const { data, error } = await supabaseAdmin
          .from('projects')
          .select('id')
          .in('status', ['open', 'assigned', 'in_progress'])
          .order('updated_at', { ascending: false })
          .limit(limit)

        if (error) {
          console.error('Project fetch error:', error)
          return NextResponse.json({ error: 'Unable to fetch projects' }, { status: 500 })
        }

        projectIds = data?.map((row) => row.id) ?? []
      }

      for (const id of projectIds) {
        await recomputeRecommendations(id)
      }

      return NextResponse.json({ success: true, projectCount: projectIds.length })
    },
    'api'
  )
}
