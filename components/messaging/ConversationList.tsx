'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MessageSquare, Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Conversation {
  id: string
  otherUser: {
    id: string
    full_name: string
    user_type: string
  }
  lastMessage: {
    text: string
    timestamp: string
    isRead: boolean
  }
  unreadCount: number
  projectTitle?: string
}

interface ConversationListProps {
  currentUserId: string
  onSelectConversation?: (conversationId: string, otherUserId: string) => void
}

export function ConversationList({ currentUserId, onSelectConversation }: ConversationListProps) {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`
      }, () => {
        fetchConversations()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [currentUserId])

  const fetchConversations = async () => {
    try {
      // Get all messages involving current user
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          receiver_id,
          message_text,
          is_read,
          created_at,
          project_id,
          sender:users!messages_sender_id_fkey(id, full_name, user_type),
          receiver:users!messages_receiver_id_fkey(id, full_name, user_type)
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group by conversation_id and get unique conversations
      const conversationMap = new Map<string, any>()

      messages?.forEach((msg: any) => {
        const conversationId = msg.conversation_id
        const isReceiver = msg.receiver_id === currentUserId
        const otherUser = isReceiver ? msg.sender : msg.receiver

        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            otherUser: otherUser,
            lastMessage: {
              text: msg.message_text,
              timestamp: msg.created_at,
              isRead: msg.is_read
            },
            unreadCount: 0,
            messages: []
          })
        }

        // Count unread messages
        if (isReceiver && !msg.is_read) {
          conversationMap.get(conversationId)!.unreadCount++
        }
      })

      setConversations(Array.from(conversationMap.values()))
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getTimeAgo = (timestamp: string) => {
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

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading conversations...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
              {searchQuery ? 'Try a different search' : 'Start a conversation from a project'}
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
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                  conversation.otherUser.user_type === 'worker' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : 'bg-gradient-to-br from-green-500 to-teal-600'
                }`}>
                  {getInitials(conversation.otherUser.full_name)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`font-semibold truncate ${
                      conversation.unreadCount > 0 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {conversation.otherUser.full_name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                      {getTimeAgo(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {conversation.lastMessage.text}
                  </p>

                  {conversation.unreadCount > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-2 text-xs font-bold text-white bg-indigo-600 rounded-full">
                        {conversation.unreadCount}
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
