import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { withAuthAndRateLimit } from '@/lib/api-middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'

const payloadSchema = z.object({
  targetUserId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  contractId: z.string().uuid().optional(),
  title: z.string().min(1).max(140).optional()
})

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    request,
    async (authRequest) => {
      const body = await request.json().catch(() => null)
      const parseResult = payloadSchema.safeParse(body)

      if (!parseResult.success) {
        return NextResponse.json(
          { error: 'Invalid payload', details: parseResult.error.flatten() },
          { status: 400 }
        )
      }

      const userId = authRequest.userId
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { targetUserId, projectId, contractId, title } = parseResult.data

      if (userId === targetUserId) {
        return NextResponse.json(
          { error: 'Cannot start a conversation with yourself.' },
          { status: 400 }
        )
      }

      // Find existing conversation between both users
      const { data: myConversations, error: myConvError } = await supabaseAdmin
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', userId)

      if (myConvError) {
        console.error('Conversation lookup error:', myConvError)
        return NextResponse.json({ error: 'Unable to check conversations' }, { status: 500 })
      }

      const myConversationIds = myConversations?.map((row) => row.conversation_id) ?? []

      if (myConversationIds.length > 0) {
        const { data: mutual, error: mutualError } = await supabaseAdmin
          .from('conversation_members')
          .select('conversation_id')
          .eq('user_id', targetUserId)
          .in('conversation_id', myConversationIds)
          .limit(1)

        if (mutualError) {
          console.error('Mutual conversation error:', mutualError)
          return NextResponse.json({ error: 'Unable to check conversations' }, { status: 500 })
        }

        if (mutual && mutual.length > 0) {
          return NextResponse.json({
            conversationId: mutual[0].conversation_id,
            existing: true
          })
        }
      }

      // Create new conversation
      const { data: conversation, error: conversationError } = await supabaseAdmin
        .from('conversations')
        .insert({
          title: title || 'Private Collaboration',
          created_by: userId,
          visibility: 'participants',
          project_id: projectId,
          contract_id: contractId
        })
        .select('id')
        .single()

      if (conversationError || !conversation) {
        console.error('Conversation creation error:', conversationError)
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        )
      }

      const memberPayload = [
        { conversation_id: conversation.id, user_id: userId, role: 'participant' },
        { conversation_id: conversation.id, user_id: targetUserId, role: 'participant' }
      ]

      const { error: memberError } = await supabaseAdmin
        .from('conversation_members')
        .upsert(memberPayload, { onConflict: 'conversation_id,user_id' })

      if (memberError) {
        console.error('Conversation member error:', memberError)
        return NextResponse.json(
          { error: 'Failed to enroll participants' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        conversationId: conversation.id,
        created: true
      })
    },
    'api'
  )
}
