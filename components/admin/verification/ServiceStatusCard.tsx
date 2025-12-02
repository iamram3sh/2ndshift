/**
 * Service Status Card
 * Shows production service integration status
 */

'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface ServiceStatus {
  faceMatch: {
    provider: string
    configured: boolean
    status: string
  }
  payment: {
    provider: string
    configured: boolean
    status: string
  }
  sms: {
    provider: string
    configured: boolean
    status: string
  }
}

export default function ServiceStatusCard() {
  const [status, setStatus] = useState<ServiceStatus | null>(null)

  useEffect(() => {
    // This would call an API endpoint that checks service status
    // For now, we'll use a mock
    setStatus({
      faceMatch: {
        provider: process.env.NEXT_PUBLIC_FACE_MATCH_PROVIDER || 'mock',
        configured: false,
        status: 'demo'
      },
      payment: {
        provider: process.env.NEXT_PUBLIC_PAYMENT_VERIFICATION_PROVIDER || 'mock',
        configured: false,
        status: 'demo'
      },
      sms: {
        provider: 'twilio',
        configured: false,
        status: 'demo'
      }
    })
  }, [])

  if (!status) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'production-ready':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case 'demo':
        return <Clock className="w-5 h-5 text-amber-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-[#111] mb-4">Production Services Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.faceMatch.status)}
            <div>
              <p className="font-medium text-[#111]">Face Match</p>
              <p className="text-xs text-[#333]">Provider: {status.faceMatch.provider}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status.faceMatch.status === 'production-ready'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {status.faceMatch.status === 'production-ready' ? 'Production' : 'Demo'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.payment.status)}
            <div>
              <p className="font-medium text-[#111]">Payment Verification</p>
              <p className="text-xs text-[#333]">Provider: {status.payment.provider}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status.payment.status === 'production-ready'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {status.payment.status === 'production-ready' ? 'Production' : 'Demo'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status.sms.status)}
            <div>
              <p className="font-medium text-[#111]">SMS OTP</p>
              <p className="text-xs text-[#333]">Provider: {status.sms.provider}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status.sms.status === 'production-ready'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {status.sms.status === 'production-ready' ? 'Production' : 'Demo'}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <strong>Note:</strong> All services are currently in demo mode. See{' '}
          <a
            href="/docs/INVESTOR_READY_INTEGRATION_GUIDE.md"
            target="_blank"
            className="underline font-medium"
          >
            Integration Guide
          </a>{' '}
          for production setup.
        </p>
      </div>
    </div>
  )
}

