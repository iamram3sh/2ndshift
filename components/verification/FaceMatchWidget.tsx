/**
 * Face Match Widget
 * Selfie capture and face matching
 */

'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react'

interface FaceMatchWidgetProps {
  userId: string
  onComplete?: () => void
}

export default function FaceMatchWidget({ userId, onComplete }: FaceMatchWidgetProps) {
  const [uploading, setUploading] = useState(false)
  const [matched, setMatched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [similarityScore, setSimilarityScore] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      // Get verification status to find ID document URL
      const statusResponse = await fetch(`/api/verification/status/${userId}`)
      const statusData = await statusResponse.json()
      
      // Get ID document URL from verification evidence
      // We need to fetch the actual verification record to get the signed URL
      const verificationResponse = await fetch(`/api/admin/verifications?status=pending&type=identity`)
      // For now, we'll use a placeholder and let the API handle it
      // The API should fetch the ID document URL from the verification record
      
      const formData = new FormData()
      formData.append('selfieFile', file)
      // The API will fetch the ID document URL from the verification record
      formData.append('idDocumentUrl', 'auto-fetch') // API will handle this

      const response = await fetch('/api/verification/identity/face-match', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Face match failed')
      }

      setSimilarityScore(data.similarityScore)
      setMatched(data.verified)
      
      if (data.verified) {
        if (onComplete) onComplete()
      } else if (data.requiresManualReview) {
        setError('Face match requires manual review. We\'ll notify you once reviewed.')
      } else {
        setError('Face match failed. Please try again with a clearer photo.')
      }
    } catch (err: any) {
      setError(err.message || 'Face match failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h4 className="text-lg font-semibold text-[#111] flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5" />
        Face Match Verification
      </h4>

      {matched ? (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Face match verified!</span>
          {similarityScore && (
            <span className="text-sm text-emerald-600 ml-auto">
              Similarity: {(similarityScore * 100).toFixed(1)}%
            </span>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-[#333] mb-4">
            Take a selfie to match with your ID document. Ensure good lighting and face the camera directly.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              disabled={uploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-6 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition disabled:opacity-50"
            >
              {uploading ? 'Processing...' : 'Take Selfie'}
            </button>
            <p className="text-xs text-[#333] mt-2">JPG, PNG. Max 10MB</p>
          </div>
        </>
      )}
    </div>
  )
}

