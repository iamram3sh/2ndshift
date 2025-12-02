'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { 
  Shield, 
  Users, 
  UserPlus, 
  Settings, 
  Activity,
  Lock,
  Crown
} from 'lucide-react'

interface StaffMember {
  id: string
  email: string
  full_name: string
  user_type: string
  is_staff: boolean
  staff_role?: string
  created_at: string
}

export default function SuperAdminPage() {
  const router = useRouter()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [newStaffEmail, setNewStaffEmail] = useState('')

  useEffect(() => {
    checkSuperAdmin()
  }, [])

  const checkSuperAdmin = async () => {
    try {
      // Use v1 API for authentication
      const result = await apiClient.getCurrentUser()
      
      if (result.error || !result.data?.user) {
        router.push('/login')
        return
      }

      const currentUser = result.data.user
      
      // Only allow super admin
      if (currentUser.role !== 'superadmin') {
        const routes: Record<string, string> = {
          worker: '/worker',
          client: '/client',
          admin: '/dashboard/admin',
        }
        router.push(routes[currentUser.role] || '/')
        return
      }

      setIsSuperAdmin(true)
      fetchStaff()
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    }
  }

  const fetchStaff = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('user_type', 'admin')
      .order('created_at', { ascending: false })

    if (data) {
      setStaff(data)
    }
    setIsLoading(false)
  }

  const handleAddStaff = async () => {
    if (!newStaffEmail) {
      alert('Please enter an email address')
      return
    }

    // Update user to make them admin staff
    const { error } = await supabase
      .from('users')
      .update({ user_type: 'admin', is_staff: true })
      .eq('email', newStaffEmail)

    if (error) {
      alert('Error adding staff: ' + error.message)
    } else {
      alert('Staff member added successfully!')
      setNewStaffEmail('')
      setShowAddStaff(false)
      fetchStaff()
    }
  }

  const handleRemoveStaff = async (userId: string) => {
    if (!confirm('Remove this staff member?')) return

    const { error } = await supabase
      .from('users')
      .update({ user_type: 'worker', is_staff: false })
      .eq('id', userId)

    if (error) {
      alert('Error removing staff: ' + error.message)
    } else {
      alert('Staff member removed')
      fetchStaff()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Super Admin access required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Super Admin Portal</h1>
          </div>
          <p className="text-purple-100">Platform Owner Dashboard</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <Activity className="w-10 h-10 text-indigo-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">Platform Dashboard</h3>
            <p className="text-sm text-gray-600 mt-1">View overall platform metrics</p>
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <Users className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">User Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage all platform users</p>
          </button>

          <button
            onClick={() => router.push('/admin/analytics')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <Settings className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">View detailed analytics</p>
          </button>
        </div>

        {/* Staff Management */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Admin Staff Management</h2>
            </div>
            <button
              onClick={() => setShowAddStaff(!showAddStaff)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <UserPlus className="w-4 h-4" />
              Add Staff
            </button>
          </div>

          {/* Add Staff Form */}
          {showAddStaff && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Add New Admin Staff</h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Staff member email (must be registered user)"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleAddStaff}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddStaff(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: The user must already be registered. They will be upgraded to Admin Staff.
              </p>
            </div>
          )}

          {/* Staff List */}
          <div className="space-y-3">
            {staff.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No admin staff members yet</p>
                <p className="text-sm">Add staff members to help manage the platform</p>
              </div>
            ) : (
              staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.full_name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full">
                      Admin Staff
                    </span>
                    <button
                      onClick={() => handleRemoveStaff(member.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Security Notice</h3>
              <p className="text-sm text-amber-800">
                Only you (Super Admin) can access this portal. Admin staff members can access the regular admin dashboard 
                but cannot manage other admins or access super admin features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
