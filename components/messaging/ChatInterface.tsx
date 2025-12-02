'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Send, Paperclip, MoreVertical, Flag, ArrowLeft, User } from 'lucide-react'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message_text: string
  attachment_urls?: string[]
  is_read: boolean
  created_at: string
}

interface ChatUser {
  id: string
  full_name: string
  user_type: string
}

interface ChatInterfaceProps {
  conversationId: string
  currentUserId: string
  otherUserId: string
  onBack?: () => void
}

export function ChatInterface({ conversationId, currentUserId, otherUserId, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null)
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetchOtherUser()
    fetchMessages()
    markMessagesAsRead()

    // Subscribe to new messages in real-time
    const subscription = supabase
      .channel(`conversation-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
        scrollToBottom()
        
        // Mark as read if we're the receiver
        if (payload.new.receiver_id === currentUserId) {
          markMessageAsRead(payload.new.id)
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [conversationId, currentUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchOtherUser = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, user_type')
        .eq('id', otherUserId)
        .single()

      if (error) throw error
      setOtherUser(data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', currentUserId)
        .eq('is_read', false)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('receiver_id', currentUserId)
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageText.trim() || isSending) return

    setIsSending(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          receiver_id: otherUserId,
          message_text: messageText.trim(),
          is_read: false
        })

      if (error) throw error

      // Create notification for receiver
      await supabase
        .from('notifications')
        .insert({
          user_id: otherUserId,
          type: 'message',
          title: 'New Message',
          message: `${otherUser?.full_name} sent you a message`,
          link: `/messages/${conversationId}`
        })

      setMessageText('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Error sending message:', error)
      window.alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e as any)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value)
    
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
            otherUser?.user_type === 'worker'
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
              : 'bg-gradient-to-br from-green-500 to-teal-600'
          }`}>
            {otherUser ? getInitials(otherUser.full_name) : <User className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {otherUser?.full_name || 'User'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {otherUser?.user_type}
            </p>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Start a conversation
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Send a message to {otherUser?.full_name} to start discussing your project
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUserId
            const showDateSeparator = index === 0 || 
              new Date(messages[index - 1].created_at).toDateString() !== new Date(message.created_at).toDateString()

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <span className="px-3 py-1 text-xs bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {new Date(message.created_at).toLocaleDateString([], { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.message_text}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 px-2 ${
                      isCurrentUser ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(message.created_at)}
                      </span>
                      {isCurrentUser && message.is_read && (
                        <span className="text-xs text-indigo-600 dark:text-indigo-400">Read</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-slate-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition flex-shrink-0"
            title="Attach file (coming soon)"
          >
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white resize-none min-h-[44px] max-h-[150px]"
            rows={1}
          />

          <button
            type="submit"
            disabled={!messageText.trim() || isSending}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
