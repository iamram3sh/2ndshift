'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Send,
  Paperclip,
  MoreVertical,
  ArrowLeft,
  User,
  ShieldCheck,
  Briefcase,
  Loader2,
  FileText,
  Download
} from 'lucide-react'

import type { SecureFile } from '@/types/database.types'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message_text: string
  attachment_urls?: string[]
  is_read: boolean
  created_at: string
  ai_summary?: string | null
  metadata?: Record<string, unknown> | null
}

interface ChatUser {
  id: string
  full_name: string
  user_type: string
}

interface ConversationMeta {
  title?: string | null
  projectTitle?: string | null
  contractId?: string | null
}

interface ChatInterfaceProps {
  conversationId: string
  currentUserId: string
  otherUserId: string
  onBack?: () => void
}

type SharedFile = Pick<SecureFile, 'id' | 'original_name' | 'mime_type' | 'file_size' | 'created_at' | 'storage_path'>

export function ChatInterface({ conversationId, currentUserId, otherUserId, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null)
  const [conversationMeta, setConversationMeta] = useState<ConversationMeta | null>(null)
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([])
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetchConversationMeta()
    fetchOtherUser()
    fetchMessages()
    markMessagesAsRead()
    fetchSharedFiles()

    const messageChannel = supabase
      .channel(`conversation-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
        scrollToBottom()
        if (payload.new.receiver_id === currentUserId) {
          markMessageAsRead(payload.new.id)
        }
      })
      .subscribe()

    const filesChannel = supabase
      .channel(`conversation-files-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'secure_files',
        filter: `conversation_id=eq.${conversationId}`
      }, fetchSharedFiles)
      .subscribe()

    return () => {
      messageChannel.unsubscribe()
      filesChannel.unsubscribe()
    }
  }, [conversationId, currentUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversationMeta = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, project(title), contract_id')
        .eq('id', conversationId)
        .single()

      if (error) throw error
      const projectRelation = Array.isArray(data?.project)
        ? data?.project?.[0]
        : data?.project

      setConversationMeta({
        title: data?.title,
        projectTitle: projectRelation?.title ?? null,
        contractId: data?.contract_id ?? null
      })
    } catch (error) {
      console.error('Error fetching conversation metadata:', error)
    }
  }

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
        .select('id, conversation_id, sender_id, receiver_id, message_text, attachment_urls, is_read, created_at, ai_summary, metadata')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages((data as Message[]) || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSharedFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('secure_files')
        .select('id, original_name, mime_type, file_size, created_at, storage_path')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(12)

      if (error) throw error
      setSharedFiles((data as SharedFile[]) || [])
    } catch (error) {
      console.error('Error fetching shared files:', error)
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

      await supabase
        .from('notifications')
        .insert({
          user_id: otherUserId,
          type: 'message',
          title: 'New Message',
          message: `${otherUser?.full_name ?? 'Someone'} sent you a message`,
          link: `/messages/${conversationId}`
        })

      setMessageText('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
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
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading chat...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold ${
            otherUser?.user_type === 'worker'
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
              : 'bg-gradient-to-br from-green-500 to-teal-600'
          }`}>
            {otherUser ? getInitials(otherUser.full_name) : <User className="w-5 h-5" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {otherUser?.full_name || 'User'}
              </h3>
              <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {otherUser?.user_type}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {(conversationMeta?.projectTitle || conversationMeta?.title) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                  <Briefcase className="w-3 h-3" />
                  {conversationMeta?.projectTitle || conversationMeta?.title}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Escrow protected
              </span>
            </div>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

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
              Send a message to {otherUser?.full_name} to start discussing your project.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUserId
            const showDateSeparator =
              index === 0 ||
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
                  <div className={`max-w-[75%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-4 py-2 shadow-sm ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-600 rounded-bl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.message_text}
                      </p>

                      {message.attachment_urls && message.attachment_urls.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.attachment_urls.map((url, idx) => (
                            <span key={`${message.id}-att-${idx}`} className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-white/20 border border-white/30">
                              <Paperclip className="w-3 h-3 mr-1" />
                              {url.split('/').pop()}
                            </span>
                          ))}
                        </div>
                      )}

                      {message.ai_summary && (
                        <p className="mt-2 text-xs italic text-white/80 dark:text-gray-300">
                          AI note: {message.ai_summary}
                        </p>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 mt-1 px-2 text-xs ${
                      isCurrentUser ? 'justify-end text-gray-400 dark:text-gray-500' : 'justify-start text-gray-500 dark:text-gray-400'
                    }`}>
                      <span>{formatTime(message.created_at)}</span>
                      {isCurrentUser && message.is_read && (
                        <span className="text-indigo-200 dark:text-indigo-400">Read</span>
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

      {sharedFiles.length > 0 && (
        <div className="border-t border-gray-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 px-4 py-3">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <FileText className="w-4 h-4" />
            Shared Documents
          </div>
          <div className="flex flex-wrap gap-3">
            {sharedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 text-sm text-gray-700 dark:text-gray-200"
              >
                <Download className="w-4 h-4" />
                <div className="flex flex-col">
                  <span className="truncate max-w-[160px]">{file.original_name}</span>
                  <span className="text-xs text-gray-400">{formatFileSize(file.file_size)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-white/90 dark:bg-slate-900/80">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition flex-shrink-0"
            title="Secure file sharing coming soon"
          >
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white resize-none min-h-[44px] max-h-[150px]"
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
          Press Enter to send, Shift+Enter for a new line.
        </p>
      </div>
    </div>
  )
}
