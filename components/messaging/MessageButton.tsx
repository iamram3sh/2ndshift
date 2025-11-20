'use client'

import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MessageButtonProps {
  userId: string
  userName?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function MessageButton({ 
  userId, 
  userName, 
  className = '',
  variant = 'primary',
  size = 'md'
}: MessageButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/messages?with=${userId}`)
  }

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
    ghost: 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-lg transition ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <MessageSquare className={iconSizes[size]} />
      <span>{userName ? `Message ${userName}` : 'Send Message'}</span>
    </button>
  )
}
