'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { Shield, Upload, CheckCircle, AlertCircle, ArrowLeft, FileText, Clock, XCircle } from 'lucide-react'
import HomeButton from '@/components/worker/HomeButton'

export default function VerificationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [verificationRequest, setVerificationRequest] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Use v1 API for authentication
      const result = await apiClient.getCurrentUser()
      if (result.error || !result.data?.user) {
        router.push('/login')
        return
      }

      const currentUser = result.data.user
      
      // Check if user is a worker
      if (currentUser.role !== 'worker') {
        const routes: Record<string, string> = {
          client: '/client',
          admin: '/dashboard/admin',
          superadmin: '/dashboard/admin'
        }
        router.push(routes[currentUser.role] || '/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (userData) setUser(userData)

      // Check if there's already a verification request
      const { data: verifyData } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('verification_type', 'identity')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (verifyData) setVerificationRequest(verifyData)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (type: 'government_id' | 'address_proof', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName)

      // Update user with document URL
      if (type === 'government_id') {
        await supabase
          .from('users')
          .update({ government_id_url: publicUrl })
          .eq('id', user.id)
      } else {
        await supabase
          .from('users')
          .update({ address_proof_url: publicUrl })
          .eq('id', user.id)
      }

      window.alert('Document uploaded successfully!')
      fetchData()
    } catch (error) {
      console.error('Error uploading document:', error)
      window.alert('Failed to upload document. Storage may need configuration.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitVerification = async () => {
    if (!user.government_id_url) {
      window.alert('Please upload your Government ID first')
      return
    }

    try {
      // Create verification request
      const { error } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          verification_type: 'identity',
          status: 'pending',
          documents: JSON.stringify([
            { type: 'government_id', url: user.government_id_url },
            { type: 'address_proof', url: user.address_proof_url }
          ])
        })

      if (error) throw error

      // Update user verification status
      await supabase
        .from('users')
        .update({ verification_status: 'pending' })
        .eq('id', user.id)

      window.alert('Verification request submitted! We\'ll review it within 24 hours.')
      fetchData()
    } catch (error) {
      console.error('Error submitting verification:', error)
      window.alert('Failed to submit verification request')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
          <span className="text-[#333]">Loading...</span>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (!user.verification_status || user.verification_status === 'unverified') {
      return (
        <span className="px-3 py-1 bg-slate-100 text-[#111] rounded-full text-sm flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4" />
          Not Verified
        </span>
      )
    }
    if (user.verification_status === 'pending') {
      return (
        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-2 font-semibold">
          <Clock className="w-4 h-4" />
          Pending Review
        </span>
      )
    }
    if (user.verification_status === 'verified') {
      return (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-2 font-semibold">
          <CheckCircle className="w-4 h-4" />
          Verified
        </span>
      )
    }
    if (user.verification_status === 'rejected') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2 font-semibold">
          <XCircle className="w-4 h-4" />
          Rejected
        </span>
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-6">
          <HomeButton variant="icon" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#111] flex items-center gap-3">
              <Shield className="w-8 h-8 text-sky-600" />
              Identity Verification
            </h1>
            <p className="text-[#333] mt-1">Verify your identity to build trust with clients</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Why Verify */}
        <div className="bg-indigo-50 bg-indigo-900/20 border border-indigo-200 border-indigo-800 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-indigo-900 text-indigo-200 mb-2">Why verify your identity?</h3>
          <ul className="space-y-2 text-sm text-indigo-800 text-indigo-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Build trust with clients
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Get 3x more project invitations
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Access higher-value projects
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Mandatory for platform security
            </li>
          </ul>
        </div>

        <div className="bg-white bg-slate-800 rounded-xl shadow-sm border border-slate-200 border-slate-700 p-6 space-y-8">
          
          {/* Current Status */}
          {verificationRequest && (
            <div className="bg-yellow-50 bg-yellow-900/20 border border-yellow-200 border-yellow-800 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 text-yellow-200 mb-2">
                Verification Status: {verificationRequest.status}
              </h4>
              <p className="text-sm text-yellow-800 text-yellow-300">
                {verificationRequest.status === 'pending' && 'Your documents are under review. We\'ll notify you within 24 hours.'}
                {verificationRequest.status === 'in_review' && 'An admin is currently reviewing your documents.'}
                {verificationRequest.status === 'rejected' && `Reason: ${verificationRequest.rejection_reason || 'Please resubmit with valid documents.'}`}
              </p>
              {verificationRequest.admin_notes && (
                <p className="text-sm text-yellow-700 text-yellow-400 mt-2">
                  Admin Notes: {verificationRequest.admin_notes}
                </p>
              )}
            </div>
          )}

          {/* Government ID */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Government ID (Required)
            </h3>
            <p className="text-sm text-[#333] text-[#333] mb-4">
              Upload Aadhaar Card, PAN Card, Passport, or Driver's License
            </p>
            
            {user.government_id_url ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 bg-green-900/20 border border-green-200 border-green-800 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 text-green-200">Government ID Uploaded</p>
                  <a 
                    href={user.government_id_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 text-green-400 hover:underline"
                  >
                    View Document
                  </a>
                </div>
                <button
                  onClick={() => document.getElementById('gov-id-upload')?.click()}
                  className="px-4 py-2 text-sm border border-green-600 text-green-600 rounded-lg hover:bg-green-50 hover:bg-green-900/40 transition"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-[#333] mx-auto mb-4" />
                <p className="text-[#333] text-[#333] mb-4">
                  Click to upload your Government ID
                </p>
                <button
                  onClick={() => document.getElementById('gov-id-upload')?.click()}
                  disabled={uploading}
                  className="px-6 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </button>
                <p className="text-xs text-[#333] mt-2">PDF, JPG, PNG. Max 5MB</p>
              </div>
            )}
            <input
              type="file"
              id="gov-id-upload"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => handleFileUpload('government_id', e)}
            />
          </div>

          {/* Address Proof */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Address Proof (Optional but Recommended)
            </h3>
            <p className="text-sm text-[#333] text-[#333] mb-4">
              Upload Utility Bill, Bank Statement, or Rental Agreement
            </p>
            
            {user.address_proof_url ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 bg-green-900/20 border border-green-200 border-green-800 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 text-green-200">Address Proof Uploaded</p>
                  <a 
                    href={user.address_proof_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 text-green-400 hover:underline"
                  >
                    View Document
                  </a>
                </div>
                <button
                  onClick={() => document.getElementById('address-proof-upload')?.click()}
                  className="px-4 py-2 text-sm border border-green-600 text-green-600 rounded-lg hover:bg-green-50 hover:bg-green-900/40 transition"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-[#333] mx-auto mb-4" />
                <p className="text-[#333] text-[#333] mb-4">
                  Click to upload Address Proof
                </p>
                <button
                  onClick={() => document.getElementById('address-proof-upload')?.click()}
                  disabled={uploading}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </button>
                <p className="text-xs text-[#333] mt-2">PDF, JPG, PNG. Max 5MB</p>
              </div>
            )}
            <input
              type="file"
              id="address-proof-upload"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => handleFileUpload('address_proof', e)}
            />
          </div>

          {/* Submit */}
          {user.government_id_url && user.verification_status !== 'verified' && user.verification_status !== 'pending' && (
            <div className="pt-6 border-t">
              <button
                onClick={handleSubmitVerification}
                className="w-full px-6 py-3 bg-[#111] text-white rounded-lg hover:bg-[#333] transition flex items-center justify-center gap-2 font-semibold"
              >
                <Shield className="w-5 h-5" />
                Submit for Verification
              </button>
              <p className="text-sm text-[#333] text-[#333] text-center mt-3">
                Our team will review your documents within 24 hours
              </p>
            </div>
          )}

          {/* Already Verified */}
          {user.verification_status === 'verified' && (
            <div className="bg-green-50 bg-green-900/20 border border-green-200 border-green-800 rounded-lg p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 text-green-200 mb-2">
                Verified!
              </h3>
              <p className="text-green-700 text-green-300">
                Your identity has been verified. You now have access to all platform features!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
