'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, AlertCircle } from 'lucide-react'
import { useRole } from './RoleContextProvider'
import { trackRoleChange } from '@/lib/analytics/roleEvents'

interface RoleSwitchModalProps {
  isOpen: boolean
  onClose: () => void
  targetRole: 'worker' | 'client'
}

export function RoleSwitchModal({ isOpen, onClose, targetRole }: RoleSwitchModalProps) {
  const router = useRouter()
  const { role, setRole } = useRole()
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

  const handleConfirm = () => {
    if (role) {
      trackRoleChange(role, targetRole)
    }
    setRole(targetRole, 'header')
    const targetRoute = targetRole === 'worker' ? '/work' : '/clients'
    router.push(targetRoute)
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

  const roleLabel = targetRole === 'worker' ? 'Worker' : 'Client'

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
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-transform duration-200 ${
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

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Switch to {roleLabel}?</h2>
          <p className="text-slate-600">
            This will change your dashboard and content. You can switch back anytime.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Switch to {roleLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
