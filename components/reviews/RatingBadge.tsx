'use client'

import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface RatingBadgeProps {
  userId: string
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RatingBadge({ userId, showCount = true, size = 'md' }: RatingBadgeProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRating()
  }, [userId])

  const fetchRating = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', userId)
        .eq('is_visible', true)

      if (error) throw error

      if (data && data.length > 0) {
        const average = data.reduce((acc, review) => acc + review.rating, 0) / data.length
        setRating(Number(average.toFixed(1)))
        setCount(data.length)
      }
    } catch (error) {
      console.error('Error fetching rating:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || rating === null) {
    return null
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className={`inline-flex items-center gap-1 ${sizeClasses[size]}`}>
      <Star className={`${iconSizes[size]} fill-yellow-400 text-yellow-400`} />
      <span className="font-semibold text-gray-900 dark:text-white">{rating}</span>
      {showCount && (
        <span className="text-gray-500 dark:text-gray-400">
          ({count})
        </span>
      )}
    </div>
  )
}
