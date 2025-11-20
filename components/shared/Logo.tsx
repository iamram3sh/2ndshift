import React from 'react'

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8 text-base', text: 'text-lg', tagline: 'text-[10px]' },
    md: { icon: 'w-10 h-10 text-lg', text: 'text-xl', tagline: 'text-xs' },
    lg: { icon: 'w-14 h-14 text-2xl', text: 'text-3xl', tagline: 'text-sm' }
  }

  const sizes = sizeClasses[size]

  // Icon only version
  if (variant === 'icon') {
    return (
      <div className={`${sizes.icon} bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md ${className}`}>
        <span className={`text-white font-bold ${sizes.text}`}>2S</span>
      </div>
    )
  }

  // Horizontal version (compact)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${sizes.icon} bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md`}>
          <span className={`text-white font-bold ${sizes.text}`}>2S</span>
        </div>
        <span className={`font-bold text-gray-900 ${sizes.text}`}>2ndShift</span>
      </div>
    )
  }

  // Full version with tagline (default)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizes.icon} bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md`}>
        <span className={`text-white font-bold ${sizes.text}`}>2S</span>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-gray-900 ${sizes.text} leading-tight`}>2ndShift</span>
        <span className={`text-gray-600 ${sizes.tagline} font-medium`}>Legal Talent Platform</span>
      </div>
    </div>
  )
}
