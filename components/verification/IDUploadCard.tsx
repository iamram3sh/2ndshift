/**
 * ID Upload Card Component
 */

'use client'

import { useState } from 'react'
import { Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react'

interface IDUploadCardProps {
  userId: string
  onComplete?: () => void
}

export default function IDUploadCard({ userId, onComplete }: IDUploadCardProps) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState<{ government_id?: boolean; address_proof?: boolean }>({})
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (type: 'government_id' | 'address_proof', file: File) => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', type)

      const response = await fetch('/api/verification/identity/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploaded(prev => ({ ...prev, [type]: true }))
      if (onComplete) onComplete()
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
      <h4 className="text-lg font-semibold text-[#111] flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Upload ID Documents
      </h4>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Government ID */}
      <div>
        <label className="block text-sm font-medium text-[#111] mb-2">
          Government ID <span className="text-red-600">*</span>
        </label>
        {uploaded.government_id ? (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Government ID uploaded</span>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <input
              type="file"
              id="gov-id-upload"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload('government_id', file)
              }}
              disabled={uploading}
            />
            <label
              htmlFor="gov-id-upload"
              className="inline-block px-6 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
            <p className="text-xs text-[#333] mt-2">PDF, JPG, PNG. Max 10MB</p>
          </div>
        )}
      </div>

      {/* Address Proof (Optional) */}
      <div>
        <label className="block text-sm font-medium text-[#111] mb-2">
          Address Proof (Optional)
        </label>
        {uploaded.address_proof ? (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Address proof uploaded</span>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <input
              type="file"
              id="address-proof-upload"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload('address_proof', file)
              }}
              disabled={uploading}
            />
            <label
              htmlFor="address-proof-upload"
              className="inline-block px-6 py-2 bg-white text-[#111] border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
            <p className="text-xs text-[#333] mt-2">PDF, JPG, PNG. Max 10MB</p>
          </div>
        )}
      </div>
    </div>
  )
}

