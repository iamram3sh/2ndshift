'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MessageSquare } from 'lucide-react'

interface UnreadBadgeProps {
  userId: string
  showIcon?: boolean
  showCount?: boolean
}

export function UnreadBadge({ userId, showIcon = true, showCount = true }: UnreadBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchUnreadCount()

    // Subscribe to new messages
    const subscription = supabase
      .channel('unread-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      }, () => {
        fetchUnreadCount()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      }, () => {
        fetchUnreadCount()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false)

      if (error) throw error
      setUnreadCount(count || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  if (unreadCount === 0) {
    return showIcon ? (
      <div className="relative">
        <MessageSquare className="w-5 h-5" />
      </div>
    ) : null
  }

  return (
    <div className="relative">
      {showIcon && <MessageSquare className="w-5 h-5" />}
      {showCount && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  )
}
