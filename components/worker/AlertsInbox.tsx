'use client'

import { useState, useEffect } from 'react'
import { Bell, Zap, CheckCircle, X, Loader2 } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { formatCurrency } from '@/lib/utils/formatCurrency'

interface Alert {
  id: string
  job_id: string
  job?: {
    id: string
    title: string
    price_fixed: number
  }
  channel: string
  delivered_at: string
  responded_at: string | null
  created_at: string
}

export function AlertsInbox({ userId }: { userId: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState<string | null>(null)

  useEffect(() => {
    fetchAlerts()
  }, [userId])

  const fetchAlerts = async () => {
    try {
      const result = await apiClient.getAlerts()
      if (result.data && typeof result.data === 'object' && 'alerts' in result.data) {
        setAlerts((result.data as any).alerts || [])
      } else {
        setAlerts([])
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFastApply = async (alert: Alert) => {
    if (!alert.job_id) return

    setResponding(alert.id)
    try {
      const result = await apiClient.respondToAlert({
        alert_id: alert.id,
        job_id: alert.job_id,
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to apply')
      }

      // Refresh alerts
      await fetchAlerts()
      alert('Application submitted successfully!')
    } catch (error: any) {
      alert(error.message || 'Failed to apply')
    } finally {
      setResponding(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="animate-pulse">Loading alerts...</div>
      </div>
    )
  }

  const unreadAlerts = alerts.filter(a => !a.responded_at)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Job Alerts</h3>
          {unreadAlerts.length > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
              {unreadAlerts.length}
            </span>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>No alerts yet</p>
          <p className="text-sm mt-1">You'll receive alerts for jobs matching your skills</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${
                alert.responded_at
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-sky-200 bg-sky-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-slate-900">
                      {alert.job?.title || 'New Job Match'}
                    </span>
                  </div>
                  {alert.job?.price_fixed && (
                    <p className="text-sm text-slate-600 mb-2">
                      {formatCurrency(alert.job.price_fixed)}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    Delivered via {alert.channel} • {new Date(alert.delivered_at).toLocaleDateString()}
                  </p>
                </div>
                {!alert.responded_at ? (
                  <button
                    onClick={() => handleFastApply(alert)}
                    disabled={responding === alert.id}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {responding === alert.id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Fast Apply
                      </>
                    )}
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Applied
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
