'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { ConversationList } from '@/components/messaging/ConversationList'
import { ChatInterface } from '@/components/messaging/ChatInterface'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import type { User } from '@/types/database.types'

function MessagesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string
    otherUserId: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    checkAuth()
    checkMobile()
    
    // Handle URL parameters for starting new conversations
    const withUserId = searchParams?.get('with')
    if (withUserId && user) {
      startConversation(withUserId)
    }

    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024)
  }

  const checkAuth = async () => {
    try {
      // Use v1 API for authentication
      const result = await apiClient.getCurrentUser()
      
      if (result.error || !result.data?.user) {
        router.push('/login')
        setIsLoading(false)
        return
      }

      const currentUser = result.data.user
      
      // Fetch full profile from database
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (profile) {
        setUser(profile)
      } else {
        // Fallback to API user data
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.name || '',
          user_type: currentUser.role as 'worker' | 'client' | 'admin',
        } as any)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const startConversation = async (otherUserId: string) => {
    if (!user) return

    try {
      // Check if conversation already exists
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('conversation_id')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .limit(1)
        .single()

      if (existingMessages) {
        setSelectedConversation({
          id: existingMessages.conversation_id,
          otherUserId: otherUserId
        })
      } else {
        // Create new conversation ID
        const newConversationId = `${[user.id, otherUserId].sort().join('_')}`
        setSelectedConversation({
          id: newConversationId,
          otherUserId: otherUserId
        })
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  const handleSelectConversation = (conversationId: string, otherUserId: string) => {
    setSelectedConversation({ id: conversationId, otherUserId })
  }

  const handleBack = () => {
    setSelectedConversation(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Navigation */}
        <nav className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              {selectedConversation && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
                Messages
              </h1>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="h-[calc(100vh-65px)]">
          {selectedConversation ? (
            <ChatInterface
              conversationId={selectedConversation.id}
              currentUserId={user!.id}
              otherUserId={selectedConversation.otherUserId}
              onBack={handleBack}
            />
          ) : (
            <div className="bg-white dark:bg-slate-800 h-full">
              <ConversationList
                currentUserId={user!.id}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // Desktop view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (user?.user_type === 'worker') {
                    router.push('/worker')
                  } else if (user?.user_type === 'client') {
                    router.push('/client')
                  } else {
                    router.push('/')
                  }
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
                Messages
              </h1>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {user?.full_name}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          <div className="grid grid-cols-12 h-full">
            {/* Conversation List - Left Sidebar */}
            <div className="col-span-4 border-r border-gray-200 dark:border-slate-700 h-full">
              <ConversationList
                currentUserId={user!.id}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* Chat Interface - Main Area */}
            <div className="col-span-8 h-full">
              {selectedConversation ? (
                <ChatInterface
                  conversationId={selectedConversation.id}
                  currentUserId={user!.id}
                  otherUserId={selectedConversation.otherUserId}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Your Messages
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Select a conversation from the list to start chatting, or start a new conversation from a project page
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading messages...</div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}
