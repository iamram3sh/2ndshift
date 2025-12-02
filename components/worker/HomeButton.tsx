/**
 * Home Button Component for Worker Subpages
 * Navigates back to /worker dashboard
 */

'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

interface HomeButtonProps {
  variant?: 'icon' | 'text' | 'full'
  className?: string
  href?: string
  label?: string
}

export default function HomeButton({ 
  variant = 'full', 
  className = '',
  href = '/worker',
  label = 'Dashboard'
}: HomeButtonProps) {
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-md"
  
  const variants = {
    icon: "bg-white text-[#111] border border-slate-200 hover:bg-slate-50 p-2",
    text: "bg-white text-[#111] border border-slate-200 hover:bg-slate-50",
    full: "bg-[#111] text-white hover:bg-[#333] shadow-lg"
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {variant === 'icon' ? (
        <Home className="w-5 h-5" />
      ) : (
        <>
          <ArrowLeft className="w-4 h-4" />
          <Home className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </Link>
  )
}

