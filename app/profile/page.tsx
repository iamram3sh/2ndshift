'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { User, Mail, Shield, ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { User as UserType } from '@/types/database.types'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    pan_number: ''
  })

  const checkAuth = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profile) {
      setUser(profile)
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        pan_number: profile.pan_number || ''
      })
    }
    setIsLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    setIsSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('users')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        pan_number: formData.pan_number,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    setIsSaving(false)

    if (error) {
      setMessage('Failed to update profile')
    } else {
      setMessage('Profile updated successfully!')
      checkAuth() // Refresh user data
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${
            message.includes('success') 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{user?.full_name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    user?.user_type === 'worker' 
                      ? 'bg-purple-100 text-purple-800'
                      : user?.user_type === 'client'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {user?.user_type?.toUpperCase()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email Verified</span>
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Profile Visibility</span>
                  <span className="capitalize">{user?.profile_visibility}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <Input
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />

                  <Input
                    label="PAN Number"
                    value={formData.pan_number}
                    onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    helperText="Required for tax compliance and payments"
                    maxLength={10}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      isLoading={isSaving}
                      className="flex-1"
                    >
                      <Save className="w-5 h-5 mr-2 inline" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {user?.user_type === 'worker' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Worker Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Complete your worker profile to start receiving project opportunities
                  </p>
                  <Button variant="outline">
                    Complete Worker Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
