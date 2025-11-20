'use client'

import { useEffect, useState } from 'react'
import { Bell, Edit2, Trash2, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface JobAlert {
  id: string
  alert_name: string
  keywords: string[]
  required_skills: string[]
  min_budget: number | null
  max_budget: number | null
  min_duration_hours: number | null
  max_duration_hours: number | null
  is_active: boolean
  notification_enabled: boolean
  email_enabled: boolean
  last_triggered_at: string | null
  created_at: string
}

interface JobAlertsManagerProps {
  userId: string
  onCreateAlert: () => void
}

export default function JobAlertsManager({ userId, onCreateAlert }: JobAlertsManagerProps) {
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [userId])

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAlerts(data || [])
    } catch (error) {
      console.error('Error fetching job alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAlert = async (alertId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('job_alerts')
        .update({ is_active: !currentStatus })
        .eq('id', alertId)

      if (error) throw error
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_active: !currentStatus } : alert
      ))
    } catch (error) {
      console.error('Error toggling alert:', error)
    }
  }

  const deleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return

    try {
      const { error } = await supabase
        .from('job_alerts')
        .delete()
        .eq('id', alertId)

      if (error) throw error
      
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Job Alerts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your job notifications</p>
          </div>
        </div>
        <button
          onClick={onCreateAlert}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
          <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No job alerts yet</p>
          <button
            onClick={onCreateAlert}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 transition ${
                alert.is_active
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/10'
                  : 'border-gray-200 dark:border-slate-600 bg-gray-50/30 dark:bg-slate-700/30'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {alert.alert_name}
                    </h4>
                    {alert.is_active ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Paused
                      </span>
                    )}
                  </div>
                  
                  {alert.keywords.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Keywords: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {alert.required_skills.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Skills: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.required_skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {(alert.min_budget || alert.max_budget) && (
                      <span>
                        Budget: ₹{alert.min_budget?.toLocaleString() || '0'} - ₹{alert.max_budget?.toLocaleString() || '∞'}
                      </span>
                    )}
                    {(alert.min_duration_hours || alert.max_duration_hours) && (
                      <span>
                        Duration: {alert.min_duration_hours || '0'}h - {alert.max_duration_hours || '∞'}h
                      </span>
                    )}
                  </div>

                  {alert.last_triggered_at && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last triggered: {new Date(alert.last_triggered_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleAlert(alert.id, alert.is_active)}
                    className={`p-2 rounded-lg transition ${
                      alert.is_active
                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-400'
                        : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400'
                    }`}
                    title={alert.is_active ? 'Pause alert' : 'Activate alert'}
                  >
                    {alert.is_active ? '⏸' : '▶'}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 rounded-lg transition"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                {alert.notification_enabled && (
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Bell className="w-3 h-3" />
                    In-app notifications
                  </span>
                )}
                {alert.email_enabled && (
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    ✉️ Email notifications
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
