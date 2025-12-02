/**
 * Video Uploader Component
 */

'use client'

import { useState } from 'react'
import { Video, Upload, CheckCircle, AlertCircle } from 'lucide-react'

interface VideoUploaderProps {
  userId: string
  onComplete?: () => void
}

export default function VideoUploader({ userId, onComplete }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState('')

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('videoFile', file)
      if (description) {
        formData.append('description', description)
      }

      const response = await fetch('/api/verification/video/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploaded(true)
      if (onComplete) onComplete()
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (uploaded) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-amber-600" />
          <div>
            <span className="text-amber-700 font-medium">Video uploaded successfully!</span>
            <p className="text-sm text-amber-600 mt-1">Your video is under review. We'll notify you once verified.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <h4 className="text-lg font-semibold text-[#111] flex items-center gap-2">
        <Video className="w-5 h-5" />
        Video Verification
      </h4>

      <p className="text-sm text-[#333]">
        Record a short video introducing yourself and explaining your skills. This helps build trust with clients.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#111] mb-2">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of what you'll cover in the video"
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
        />
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
        <Video className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <input
          type="file"
          id="video-upload"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
          }}
          disabled={uploading}
        />
        <label
          htmlFor="video-upload"
          className="inline-block px-6 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition cursor-pointer disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Choose Video File'}
        </label>
        <p className="text-xs text-[#333] mt-2">MP4, WebM, MOV. Max 100MB</p>
      </div>
    </div>
  )
}

