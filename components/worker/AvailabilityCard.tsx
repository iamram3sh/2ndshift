'use client'

import { useState, useEffect } from 'react'
import { Clock, Zap, Crown, CheckCircle, Edit2, Save, X } from 'lucide-react'
import apiClient from '@/lib/apiClient'
import { useTranslation } from '@/lib/i18n'

interface AvailabilityCardProps {
  userId: string
}

export function AvailabilityCard({ userId }: AvailabilityCardProps) {
  const { t } = useTranslation()
  const [availability, setAvailability] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    open_to_work: false,
    priority_tier: 'standard' as 'standard' | 'priority' | 'elite',
    hours_per_week: 20,
    timezone: 'Asia/Kolkata',
  })

  useEffect(() => {
    fetchAvailability()
  }, [userId])

  const fetchAvailability = async () => {
    try {
      const result = await apiClient.getAvailability()
      if (result.data && typeof result.data === 'object' && 'availability' in result.data) {
        const avail = (result.data as any).availability
        setAvailability(avail)
        setFormData({
          open_to_work: avail.open_to_work || false,
          priority_tier: avail.priority_tier || 'standard',
          hours_per_week: (avail.availability as any)?.hours_per_week || 20,
          timezone: (avail.availability as any)?.timezone || 'Asia/Kolkata',
        })
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const result = await apiClient.updateAvailability({
        open_to_work: formData.open_to_work,
        priority_tier: formData.priority_tier,
        availability: {
          hours_per_week: formData.hours_per_week,
          timezone: formData.timezone,
        },
      })

      if (result.data && typeof result.data === 'object' && 'availability' in result.data) {
        setAvailability((result.data as any).availability)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating availability:', error)
      window.alert('Failed to update availability')
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const tierColors = {
    standard: 'bg-slate-100 text-slate-700',
    priority: 'bg-blue-100 text-blue-700',
    elite: 'bg-amber-100 text-amber-700',
  }

  const tierIcons = {
    standard: Clock,
    priority: Zap,
    elite: Crown,
  }

  const TierIcon = tierIcons[formData.priority_tier]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Open to Work</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.open_to_work}
                onChange={(e) => setFormData({ ...formData, open_to_work: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded"
              />
              <span className="text-sm font-medium text-slate-900">I'm open to new opportunities</span>
            </label>
          </div>

          {formData.open_to_work && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority Tier
                </label>
                <select
                  value={formData.priority_tier}
                  onChange={(e) => setFormData({ ...formData, priority_tier: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="standard">Standard</option>
                  <option value="priority">Priority (Verified + Subscription)</option>
                  <option value="elite">Elite (Premium Verified + Subscription)</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Higher tiers get priority in sourcing and alerts
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hours per Week
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={formData.hours_per_week}
                  onChange={(e) => setFormData({ ...formData, hours_per_week: parseInt(e.target.value) || 20 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false)
                fetchAvailability()
              }}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {availability?.open_to_work ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <Clock className="w-5 h-5 text-slate-400" />
            )}
            <span className="font-medium text-slate-900">
              {availability?.open_to_work ? 'Open to work' : 'Not available'}
            </span>
          </div>

          {availability?.open_to_work && (
            <>
              <div className="flex items-center gap-2">
                <TierIcon className="w-4 h-4" />
                <span className={`px-2 py-1 rounded text-xs font-medium ${tierColors[formData.priority_tier]}`}>
                  {formData.priority_tier.charAt(0).toUpperCase() + formData.priority_tier.slice(1)} Tier
                </span>
              </div>

              <div className="text-sm text-slate-600">
                <p>Hours per week: {formData.hours_per_week}</p>
                <p>Timezone: {formData.timezone}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
