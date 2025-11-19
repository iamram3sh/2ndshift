'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (type: ToastType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, type, message, duration }
    
    setToasts((prev) => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  }

  return (
    <div
      className={`${styles[toast.type]} border-2 rounded-xl p-4 shadow-lg animate-in slide-in-from-bottom flex items-start gap-3 min-w-[320px]`}
    >
      <div className={iconColors[toast.type]}>{icons[toast.type]}</div>
      <div className="flex-1">
        <p className="font-medium">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Helper hooks for specific toast types
export const toast = {
  success: (message: string, duration?: number) => {
    const context = useContext(ToastContext)
    if (context) context.showToast('success', message, duration)
  },
  error: (message: string, duration?: number) => {
    const context = useContext(ToastContext)
    if (context) context.showToast('error', message, duration)
  },
  info: (message: string, duration?: number) => {
    const context = useContext(ToastContext)
    if (context) context.showToast('info', message, duration)
  },
  warning: (message: string, duration?: number) => {
    const context = useContext(ToastContext)
    if (context) context.showToast('warning', message, duration)
  },
}
