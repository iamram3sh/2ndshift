'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MessageSquare, Search, Briefcase, ShieldCheck, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ConversationListItem {
  id: string
  otherUser: {
    id: string
    full_name: string
    user_type: string
  }
  lastMessage?: {
    text: string
    timestamp: string
    isMine: boolean
  }
  unreadCount: number
  title?: string | null
  projectTitle?: string | null
  updatedAt?: string | null
}

interface ConversationListProps {
  currentUserId: string
  onSelectConversation?: (conversationId: string, otherUserId: string) => void
}

export function ConversationList({ currentUserId, onSelectConversation }: ConversationListProps) {
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConversations()

    const receiverChannel = supabase
      .channel(`messages-receiver-${currentUserId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`
      }, fetchConversations)
      .subscribe()

    const senderChannel = supabase
      .channel(`messages-sender-${currentUserId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${currentUserId}`
      }, fetchConversations)
      .subscribe()

    return () => {
      receiverChannel.unsubscribe()
      senderChannel.unsubscribe()
    }
  }, [currentUserId])

  const fetchConversations = async () => {
    try {
      const { data: memberships, error: membershipError } = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          joined_at,
          conversation:conversations(
            id,
            title,
            project_id,
            updated_at,
            project:projects(title)
          )
        `)
        .eq('user_id', currentUserId)

      if (membershipError) throw membershipError

      const conversationIds = memberships?.map((m) => m.conversation_id) ?? []

      if (conversationIds.length === 0) {
        setConversations([])
        setIsLoading(false)
        return
      }

      const [participantsRes, messagesRes, unreadRes] = await Promise.all([
        supabase
          .from('conversation_members')
          .select('conversation_id, user_id, users:users(id, full_name, user_type)')
          .in('conversation_id', conversationIds)
          .neq('user_id', currentUserId),
        supabase
          .from('messages')
          .select('conversation_id, sender_id, message_text, created_at')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: false })
          .limit(Math.max(conversationIds.length * 5, 20)),
        supabase
          .from('messages')
          .select('conversation_id')
          .eq('receiver_id', currentUserId)
          .eq('is_read', false)
          .in('conversation_id', conversationIds)
      ])

      const { data: conversationMeta, error: conversationError } = await supabase
        .from('conversations')
        .select('id, title, project(title), updated_at')
        .in('id', conversationIds)

      if (conversationError) throw conversationError
      const conversationMap = new Map(
        (conversationMeta || []).map((row) => [row.id, row])
      ])

      if (participantsRes.error) throw participantsRes.error
      if (messagesRes.error) throw messagesRes.error
      if (unreadRes.error) throw unreadRes.error

      const participantMap = new Map<string, ConversationListItem['otherUser']>()
      participantsRes.data?.forEach((row) => {
        const userRecord = Array.isArray(row.users) ? row.users[0] : row.users
        if (userRecord) {
          participantMap.set(row.conversation_id, userRecord as ConversationListItem['otherUser'])
        }
      })

      const lastMessageMap = new Map<string, ConversationListItem['lastMessage']>()
      messagesRes.data?.forEach((msg) => {
        if (!lastMessageMap.has(msg.conversation_id)) {
          lastMessageMap.set(msg.conversation_id, {
            text: msg.message_text,
            timestamp: msg.created_at,
            isMine: msg.sender_id === currentUserId
          })
        }
      })

      const unreadMap = new Map<string, number>()
      unreadRes.data?.forEach((row) => {
        unreadMap.set(row.conversation_id, (unreadMap.get(row.conversation_id) || 0) + 1)
      })

      const formatted: ConversationListItem[] = (memberships ?? []).reduce((acc: ConversationListItem[], membership) => {
        const conversationId = membership.conversation_id
        const otherUser = participantMap.get(conversationId)
        if (!otherUser) {
          return acc
        }

        const lastMessage = lastMessageMap.get(conversationId)
        const projectRelation = Array.isArray(membership.conversation?.project)
          ? membership.conversation?.project?.[0]
          : membership.conversation?.project

        const conversationRecord = conversationMap.get(conversationId)

        acc.push({
          id: conversationId,
          otherUser,
          lastMessage,
          unreadCount: unreadMap.get(conversationId) || 0,
          title: conversationRecord?.title,
          projectTitle: projectRelation?.title ?? null,
          updatedAt: conversationRecord?.updated_at ?? lastMessage?.timestamp ?? membership.joined_at
        })
        return acc
      }, []).sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return bTime - aTime
      })

      setConversations(formatted)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const getTimeAgo = (timestamp?: string | null) => {
    if (!timestamp) return ''
    const now = new Date()
    const msgTime = new Date(timestamp)
    const diffMs = now.getTime() - msgTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return msgTime.toLocaleDateString()
  }

  const filteredConversations = useMemo(() => (
    conversations.filter((conv) => {
      const query = searchQuery.toLowerCase()
      return (
        conv.otherUser.full_name.toLowerCase().includes(query) ||
        (conv.title || '').toLowerCase().includes(query) ||
        (conv.projectTitle || '').toLowerCase().includes(query)
      )
    })
  ), [conversations, searchQuery])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading conversations...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by teammate, project, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {searchQuery ? 'Try a different search' : 'Start a conversation from a project page'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  if (onSelectConversation) {
                    onSelectConversation(conversation.id, conversation.otherUser.id)
                  } else {
                    router.push(`/messages/${conversation.id}`)
                  }
                }}
                className="w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition flex items-start gap-3 text-left"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                  conversation.otherUser.user_type === 'worker'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : 'bg-gradient-to-br from-green-500 to-teal-600'
                }`}>
                  {getInitials(conversation.otherUser.full_name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className={`font-semibold truncate ${
                        conversation.unreadCount > 0
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {conversation.otherUser.full_name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                        {conversation.title || conversation.projectTitle || conversation.otherUser.user_type}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {getTimeAgo(conversation.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1 flex-wrap">
                    {conversation.projectTitle && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                        <Briefcase className="w-3 h-3" />
                        {conversation.projectTitle}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Escrow protected
                    </span>
                  </div>

                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {conversation.lastMessage?.text || 'No messages yet'}
                  </p>

                  {conversation.unreadCount > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-2 text-xs font-bold text-white bg-indigo-600 rounded-full">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
