'use client'

import { X, AlertCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RoleMismatchModalProps {
  isOpen: boolean
  currentRole: 'worker' | 'client'
  attemptedRole: 'worker' | 'client'
  onClose: () => void
  onSwitchRole: () => void
}

export function RoleMismatchModal({
  isOpen,
  currentRole,
  attemptedRole,
  onClose,
  onSwitchRole,
}: RoleMismatchModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const roleLabels = {
    worker: 'Worker',
    client: 'Client',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Role Mismatch
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-700 mb-6">
            You&apos;re logged in as a <strong>{roleLabels[currentRole]}</strong>, but you&apos;re trying to access the <strong>{roleLabels[attemptedRole]}</strong> page.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                onSwitchRole()
                router.push(attemptedRole === 'worker' ? '/work?role=worker' : '/clients?role=client')
                onClose()
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all"
            >
              Switch to {roleLabels[attemptedRole]} view
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                router.push(currentRole === 'worker' ? '/work?role=worker' : '/clients?role=client')
                onClose()
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-all"
            >
              Continue as {roleLabels[currentRole]}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
