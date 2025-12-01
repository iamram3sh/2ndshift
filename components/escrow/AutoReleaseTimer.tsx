'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface AutoReleaseTimerProps {
  submittedAt: string
  autoReleaseDays?: number
  onAutoRelease?: () => void
  userType: 'client' | 'professional'
}

export function AutoReleaseTimer({
  submittedAt,
  autoReleaseDays = 7,
  onAutoRelease,
  userType,
}: AutoReleaseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTime = () => {
      const submitted = new Date(submittedAt)
      const autoReleaseDate = new Date(submitted)
      autoReleaseDate.setDate(autoReleaseDate.getDate() + autoReleaseDays)
      
      const now = new Date()
      const diff = autoReleaseDate.getTime() - now.getTime()

      if (diff <= 0) {
        setIsExpired(true)
        setTimeRemaining(null)
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [submittedAt, autoReleaseDays])

  useEffect(() => {
    if (isExpired && onAutoRelease) {
      onAutoRelease()
    }
  }, [isExpired, onAutoRelease])

  if (isExpired) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-emerald-800">Auto-Release Triggered</p>
            <p className="text-sm text-emerald-600">
              {userType === 'professional' 
                ? 'Payment has been automatically released to you'
                : 'Review period expired - payment was released automatically'
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!timeRemaining) return null

  const isUrgent = timeRemaining.days <= 1
  const percentage = ((autoReleaseDays * 24 * 60 * 60 * 1000) - 
    ((timeRemaining.days * 24 * 60 * 60) + (timeRemaining.hours * 60 * 60) + 
    (timeRemaining.minutes * 60) + timeRemaining.seconds) * 1000) / 
    (autoReleaseDays * 24 * 60 * 60 * 1000) * 100

  return (
    <div className={`rounded-xl p-4 border ${
      isUrgent 
        ? 'bg-amber-50 border-amber-200' 
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isUrgent ? 'bg-amber-100' : 'bg-slate-100'
        }`}>
          {isUrgent ? (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          ) : (
            <Clock className="w-5 h-5 text-slate-600" />
          )}
        </div>
        <div className="flex-1">
          <p className={`font-medium ${isUrgent ? 'text-amber-800' : 'text-slate-800'}`}>
            {userType === 'client' 
              ? 'Review Period Active'
              : 'Awaiting Client Review'
            }
          </p>
          <p className={`text-sm ${isUrgent ? 'text-amber-600' : 'text-slate-500'}`}>
            {userType === 'client' 
              ? `Payment will auto-release if you don't respond in time`
              : `Payment will auto-release if client doesn't respond`
            }
          </p>
          
          {/* Timer Display */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            <div className={`p-2 rounded-lg ${isUrgent ? 'bg-amber-100' : 'bg-white'}`}>
              <div className={`text-xl font-bold ${isUrgent ? 'text-amber-700' : 'text-slate-800'}`}>
                {timeRemaining.days}
              </div>
              <div className={`text-xs ${isUrgent ? 'text-amber-600' : 'text-slate-500'}`}>Days</div>
            </div>
            <div className={`p-2 rounded-lg ${isUrgent ? 'bg-amber-100' : 'bg-white'}`}>
              <div className={`text-xl font-bold ${isUrgent ? 'text-amber-700' : 'text-slate-800'}`}>
                {timeRemaining.hours}
              </div>
              <div className={`text-xs ${isUrgent ? 'text-amber-600' : 'text-slate-500'}`}>Hours</div>
            </div>
            <div className={`p-2 rounded-lg ${isUrgent ? 'bg-amber-100' : 'bg-white'}`}>
              <div className={`text-xl font-bold ${isUrgent ? 'text-amber-700' : 'text-slate-800'}`}>
                {String(timeRemaining.minutes).padStart(2, '0')}
              </div>
              <div className={`text-xs ${isUrgent ? 'text-amber-600' : 'text-slate-500'}`}>Mins</div>
            </div>
            <div className={`p-2 rounded-lg ${isUrgent ? 'bg-amber-100' : 'bg-white'}`}>
              <div className={`text-xl font-bold ${isUrgent ? 'text-amber-700' : 'text-slate-800'}`}>
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
              <div className={`text-xs ${isUrgent ? 'text-amber-600' : 'text-slate-500'}`}>Secs</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                isUrgent ? 'bg-amber-500' : 'bg-sky-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Info Note */}
      {userType === 'client' && (
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500">
            Review the work and approve to release payment, or request revisions. 
            If no action is taken within {autoReleaseDays} days, payment will be released automatically.
          </p>
        </div>
      )}
    </div>
  )
}

// Compact version for listings
export function AutoReleaseIndicator({ 
  daysRemaining,
  size = 'sm' 
}: { 
  daysRemaining: number
  size?: 'sm' | 'md' 
}) {
  const isUrgent = daysRemaining <= 2

  return (
    <span className={`inline-flex items-center gap-1 ${
      isUrgent 
        ? 'text-amber-600' 
        : 'text-slate-500'
    } ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>
        {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} to review
      </span>
    </span>
  )
}
