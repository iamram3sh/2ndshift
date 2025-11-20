'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Circle } from 'lucide-react'

interface OnlineStatusIndicatorProps {
  userId?: string
  isOnline?: boolean
  lastSeen?: string
  availabilityStatus?: 'online' | 'away' | 'offline' | 'busy' | 'available'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showLastSeen?: boolean
}

export default function OnlineStatusIndicator({
  userId,
  isOnline: propIsOnline,
  lastSeen: propLastSeen,
  availabilityStatus: propAvailabilityStatus,
  size = 'md',
  showLabel = false,
  showLastSeen = false
}: OnlineStatusIndicatorProps) {
  const [isOnline, setIsOnline] = useState(propIsOnline || false)
  const [lastSeen, setLastSeen] = useState(propLastSeen)
  const [availabilityStatus, setAvailabilityStatus] = useState(propAvailabilityStatus || 'offline')

  useEffect(() => {
    if (!userId) return

    // Fetch initial status
    fetchStatus()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`user-status-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          setIsOnline(payload.new.is_online)
          setLastSeen(payload.new.last_seen)
          setAvailabilityStatus(payload.new.availability_status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const fetchStatus = async () => {
    if (!userId) return

    const { data } = await supabase
      .from('users')
      .select('is_online, last_seen, availability_status')
      .eq('id', userId)
      .single()

    if (data) {
      setIsOnline(data.is_online)
      setLastSeen(data.last_seen)
      setAvailabilityStatus(data.availability_status)
    }
  }

  const getStatusColor = () => {
    switch (availabilityStatus) {
      case 'online':
      case 'available':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusLabel = () => {
    switch (availabilityStatus) {
      case 'online':
        return 'Online'
      case 'available':
        return 'Available'
      case 'away':
        return 'Away'
      case 'busy':
        return 'Busy'
      default:
        return 'Offline'
    }
  }

  const getLastSeenText = () => {
    if (!lastSeen) return null

    const now = new Date()
    const lastSeenDate = new Date(lastSeen)
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / 60000)

    if (diffMinutes < 5) return 'Active now'
    if (diffMinutes < 60) return `Active ${diffMinutes} min ago`
    if (diffMinutes < 1440) return `Active ${Math.floor(diffMinutes / 60)} hr ago`
    return `Active ${Math.floor(diffMinutes / 1440)} days ago`
  }

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative inline-flex">
        <span className={`${sizeClasses[size]} ${getStatusColor()} rounded-full border-2 border-white dark:border-slate-800`}></span>
        {isOnline && (
          <span className={`absolute inset-0 ${sizeClasses[size]} ${getStatusColor()} rounded-full animate-ping opacity-75`}></span>
        )}
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {getStatusLabel()}
        </span>
      )}
      {showLastSeen && !isOnline && (
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {getLastSeenText()}
        </span>
      )}
    </div>
  )
}

// Status Toggle Component (for user's own profile)
interface StatusToggleProps {
  userId: string
  currentStatus: string
}

export function StatusToggle({ userId, currentStatus }: StatusToggleProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isOpen, setIsOpen] = useState(false)

  const statuses = [
    { value: 'available', label: 'Available', color: 'bg-green-500', icon: '✓' },
    { value: 'online', label: 'Online', color: 'bg-green-500', icon: '●' },
    { value: 'away', label: 'Away', color: 'bg-yellow-500', icon: '◐' },
    { value: 'busy', label: 'Busy', color: 'bg-red-500', icon: '⊗' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-400', icon: '○' }
  ]

  const updateStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          availability_status: newStatus,
          is_online: newStatus !== 'offline',
          last_seen: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      setStatus(newStatus)
      setIsOpen(false)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const currentStatusObj = statuses.find(s => s.value === status) || statuses[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
      >
        <span className={`w-3 h-3 ${currentStatusObj.color} rounded-full`}></span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentStatusObj.label}
        </span>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-20 py-1 min-w-[180px]">
            {statuses.map((statusOption) => (
              <button
                key={statusOption.value}
                onClick={() => updateStatus(statusOption.value)}
                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition ${
                  status === statusOption.value ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <span className={`w-3 h-3 ${statusOption.color} rounded-full`}></span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {statusOption.label}
                </span>
                {status === statusOption.value && (
                  <span className="ml-auto text-indigo-600 dark:text-indigo-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
