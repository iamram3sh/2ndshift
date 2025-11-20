'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Shield, Upload, CheckCircle, AlertCircle, X } from 'lucide-react'

interface VerificationFormProps {
  userId: string
  onSuccess?: () => void
}

type VerificationType = 'email' | 'phone' | 'pan' | 'aadhar' | 'bank_account' | 'address'

export function VerificationForm({ userId, onSuccess }: VerificationFormProps) {
  const [selectedType, setSelectedType] = useState<VerificationType>('pan')
  const [documents, setDocuments] = useState<File[]>([])
  const [formData, setFormData] = useState({
    panNumber: '',
    aadharNumber: '',
    accountNumber: '',
    ifscCode: '',
    address: '',
    phoneNumber: '',
    emailOtp: '',
    phoneOtp: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const verificationTypes = [
    { id: 'pan', name: 'PAN Card', description: 'Tax identification document', required: true },
    { id: 'aadhar', name: 'Aadhar Card', description: 'Government ID proof', required: false },
    { id: 'bank_account', name: 'Bank Account', description: 'For payment processing', required: true },
    { id: 'address', name: 'Address Proof', description: 'Utility bill or bank statement', required: false }
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setDocuments([...documents, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const uploadDocuments = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const file of documents) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${selectedType}/${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName)

      uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (documents.length === 0 && !['email', 'phone'].includes(selectedType)) {
        throw new Error('Please upload at least one document')
      }

      // Upload documents if any
      const documentUrls = documents.length > 0 ? await uploadDocuments() : []

      // Prepare verification data based on type
      let verificationData: any = {}
      
      switch (selectedType) {
        case 'pan':
          verificationData = { pan_number: formData.panNumber }
          break
        case 'aadhar':
          verificationData = { aadhar_number: formData.aadharNumber }
          break
        case 'bank_account':
          verificationData = { 
            account_number: formData.accountNumber,
            ifsc_code: formData.ifscCode
          }
          break
        case 'address':
          verificationData = { address: formData.address }
          break
        case 'phone':
          verificationData = { phone_number: formData.phoneNumber }
          break
        case 'email':
          verificationData = { email_otp: formData.emailOtp }
          break
      }

      // Submit verification request
      const { error: insertError } = await supabase
        .from('verifications')
        .insert({
          user_id: userId,
          verification_type: selectedType,
          status: 'pending',
          document_urls: documentUrls,
          verification_data: verificationData
        })

      if (insertError) throw insertError

      // Create notification for admins
      const { data: admins } = await supabase
        .from('users')
        .select('id')
        .eq('user_type', 'admin')

      if (admins) {
        for (const admin of admins) {
          await supabase
            .from('notifications')
            .insert({
              user_id: admin.id,
              type: 'verification',
              title: 'New Verification Request',
              message: `User submitted ${selectedType} verification`,
              link: `/admin/verifications`
            })
        }
      }

      setSuccess(true)
      setDocuments([])
      setFormData({
        panNumber: '',
        aadharNumber: '',
        accountNumber: '',
        ifscCode: '',
        address: '',
        phoneNumber: '',
        emailOtp: '',
        phoneOtp: ''
      })

      if (onSuccess) onSuccess()

    } catch (err: any) {
      setError(err.message || 'Failed to submit verification. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Verification Submitted!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your {selectedType.replace('_', ' ')} verification has been submitted for review.
          We'll notify you once it's processed.
        </p>
        <button
          onClick={() => {
            setSuccess(false)
            if (onSuccess) onSuccess()
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Verify Your Account
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Verification Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Verification Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {verificationTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id as VerificationType)}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  selectedType === type.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {type.name}
                  </h4>
                  {type.required && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields Based on Type */}
        {selectedType === 'pan' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              PAN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
              placeholder="ABCDE1234F"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              maxLength={10}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
        )}

        {selectedType === 'aadhar' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Aadhar Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.aadharNumber}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              placeholder="1234 5678 9012"
              pattern="[0-9]{12}"
              maxLength={12}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
        )}

        {selectedType === 'bank_account' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Enter account number"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                placeholder="SBIN0001234"
                pattern="[A-Z]{4}0[A-Z0-9]{6}"
                maxLength={11}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
          </>
        )}

        {selectedType === 'address' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your complete address"
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white resize-none"
            />
          </div>
        )}

        {/* Document Upload */}
        {!['email', 'phone'].includes(selectedType) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Documents <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                PDF, JPG, PNG (Max 5MB per file)
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition"
              >
                Choose Files
              </label>
            </div>

            {/* Selected Files */}
            {documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          🔒 <strong>Secure & Private:</strong> Your documents are encrypted and only accessible to authorized admins for verification purposes.
        </p>
      </div>
    </div>
  )
}
