'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Bell, IndianRupee, Clock, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface JobAlert {
  id?: string
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
}

interface JobAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  userId: string
}

export default function JobAlertModal({ isOpen, onClose, onSave, userId }: JobAlertModalProps) {
  const [alert, setAlert] = useState<JobAlert>({
    alert_name: '',
    keywords: [],
    required_skills: [],
    min_budget: null,
    max_budget: null,
    min_duration_hours: null,
    max_duration_hours: null,
    is_active: true,
    notification_enabled: true,
    email_enabled: false,
  })
  const [keywordInput, setKeywordInput] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setAlert(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setAlert(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setAlert(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }))
  }

  const handleRemoveSkill = (index: number) => {
    setAlert(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    if (!alert.alert_name.trim()) {
      window.alert('Please enter an alert name')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('job_alerts')
        .insert({
          user_id: userId,
          ...alert
        })

      if (error) throw error

      onSave()
      onClose()
      
      // Reset form
      setAlert({
        alert_name: '',
        keywords: [],
        required_skills: [],
        min_budget: null,
        max_budget: null,
        min_duration_hours: null,
        max_duration_hours: null,
        is_active: true,
        notification_enabled: true,
        email_enabled: false,
      })
    } catch (error) {
      console.error('Error creating job alert:', error)
      window.alert('Failed to create job alert')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Job Alert</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when matching projects are posted</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alert Name *
            </label>
            <input
              type="text"
              value={alert.alert_name}
              onChange={(e) => setAlert(prev => ({ ...prev, alert_name: e.target.value }))}
              placeholder="e.g., React Development Projects"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="Add keyword..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
              <button
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {alert.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm flex items-center gap-2"
                >
                  {keyword}
                  <button onClick={() => handleRemoveKeyword(index)}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add skill..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {alert.required_skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button onClick={() => handleRemoveSkill(index)}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Min Budget (₹)
              </label>
              <input
                type="number"
                value={alert.min_budget || ''}
                onChange={(e) => setAlert(prev => ({ 
                  ...prev, 
                  min_budget: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                placeholder="e.g., 5000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Budget (₹)
              </label>
              <input
                type="number"
                value={alert.max_budget || ''}
                onChange={(e) => setAlert(prev => ({ 
                  ...prev, 
                  max_budget: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                placeholder="e.g., 50000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Duration Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Min Duration (hours)
              </label>
              <input
                type="number"
                value={alert.min_duration_hours || ''}
                onChange={(e) => setAlert(prev => ({ 
                  ...prev, 
                  min_duration_hours: e.target.value ? parseInt(e.target.value) : null 
                }))}
                placeholder="e.g., 10"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Duration (hours)
              </label>
              <input
                type="number"
                value={alert.max_duration_hours || ''}
                onChange={(e) => setAlert(prev => ({ 
                  ...prev, 
                  max_duration_hours: e.target.value ? parseInt(e.target.value) : null 
                }))}
                placeholder="e.g., 160"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notification Settings
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="notification_enabled"
                checked={alert.notification_enabled}
                onChange={(e) => setAlert(prev => ({ ...prev, notification_enabled: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="notification_enabled" className="text-sm text-gray-700 dark:text-gray-300">
                In-app notifications
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="email_enabled"
                checked={alert.email_enabled}
                onChange={(e) => setAlert(prev => ({ ...prev, email_enabled: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="email_enabled" className="text-sm text-gray-700 dark:text-gray-300">
                Email notifications
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Creating...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Create Alert
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
