'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Briefcase, Users, ArrowRight } from 'lucide-react'
import { useRole } from '@/components/role/RoleContextProvider'
import { trackRoleSelected } from '@/lib/analytics/roleEvents'

interface RolePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onRoleSelected?: (role: 'worker' | 'client') => void
}

export function RolePickerModal({ isOpen, onClose, onRoleSelected }: RolePickerModalProps) {
  const router = useRouter()
  const { setRole } = useRole()
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleRoleSelect = (role: 'worker' | 'client') => {
    setRole(role, 'header')
    trackRoleSelected(role, 'header')
    onRoleSelected?.(role)
    router.push(`/login?role=${role}`)
    handleClose()
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  if (!isOpen && !isClosing) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isOpen && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-transform duration-200 ${
          isOpen && !isClosing ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose your role</h2>
          <p className="text-slate-600">Select how you want to use 2ndShift</p>
        </div>

        {/* Role options */}
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('worker')}
            className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="I want to work — show worker signup"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">I want to work</h3>
                <p className="text-sm text-slate-600">Find remote jobs and earn money</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('client')}
            className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="I want to hire — show client signup"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">I want to hire</h3>
                <p className="text-sm text-slate-600">Post jobs and find talent</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
