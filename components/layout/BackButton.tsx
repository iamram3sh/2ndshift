'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export function BackButton({ href, label = 'Back', className = '' }: BackButtonProps) {
  const router = useRouter()

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors ${className}`}
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </Link>
    )
  }

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
