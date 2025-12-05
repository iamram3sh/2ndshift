'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from '@/components/ui/Topbar'
import apiClient from '@/lib/apiClient'
import { Save, Bell, Lock, Building2, Mail } from 'lucide-react'

export default function ClientSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    companyName: '',
    companyDescription: '',
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const userResult = await apiClient.getCurrentUser()
        if (userResult.error || !userResult.data?.user) {
          router.push('/login')
          return
        }

        const currentUser = userResult.data.user
        if (currentUser.role !== 'client') {
          router.push(currentUser.role === 'worker' ? '/worker' : '/login')
          return
        }

        setUser(currentUser)
        // Load user settings here
      } catch (err) {
        console.error('Error loading settings:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleSave = async () => {
    try {
      // Save settings API call
      console.log('Saving settings:', settings)
      // await apiClient.updateSettings(settings)
    } catch (err) {
      console.error('Error saving settings:', err)
    }
  }

  const handleSignOut = async () => {
    await apiClient.logout()
    localStorage.removeItem('access_token')
    router.push('/')
  }

  const handleQuickAction = () => {
    router.push('/projects/create')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span className="text-slate-600">Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role="client" />
      
      <div className="flex-1 lg:ml-64">
        <Topbar
          role="client"
          onQuickAction={handleQuickAction}
          quickActionLabel="Post Project"
          onSignOut={handleSignOut}
          user={{
            name: user?.name,
            email: user?.email,
          }}
        />

        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-600">Manage your account settings and preferences</p>
          </div>

          <div className="max-w-4xl space-y-6">
            {/* Company Settings */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Company</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    value={settings.companyDescription}
                    onChange={(e) => setSettings({ ...settings, companyDescription: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="Tell us about your company..."
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Push Notifications</p>
                    <p className="text-xs text-slate-500">Receive browser push notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                    className="w-5 h-5 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
