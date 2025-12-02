/**
 * Skill Proof Uploader Component
 */

'use client'

import { useState } from 'react'
import { Upload, Link as LinkIcon, Github, Globe, FileText, CheckCircle } from 'lucide-react'

interface SkillProofUploaderProps {
  userId: string
  onComplete?: () => void
}

export default function SkillProofUploader({ userId, onComplete }: SkillProofUploaderProps) {
  const [skillName, setSkillName] = useState('')
  const [proofType, setProofType] = useState<'github' | 'deployment' | 'file' | 'link'>('github')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('skillName', skillName)
      formData.append('proofType', proofType)
      formData.append('title', title)
      
      if (proofType === 'file') {
        const fileInput = document.getElementById('skill-file') as HTMLInputElement
        const file = fileInput?.files?.[0]
        if (!file) {
          throw new Error('Please select a file')
        }
        formData.append('file', file)
      } else {
        if (!url) {
          throw new Error('Please enter a URL')
        }
        formData.append('url', url)
      }

      const response = await fetch('/api/verification/skill/upload', {
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
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Skill proof uploaded successfully!</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h4 className="text-lg font-semibold text-[#111] mb-4">Upload Skill Proof</h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#111] mb-2">Skill Name *</label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="e.g., React, Node.js, Python"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111] mb-2">Proof Type *</label>
          <select
            value={proofType}
            onChange={(e) => setProofType(e.target.value as any)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
          >
            <option value="github">GitHub Repository</option>
            <option value="deployment">Live Deployment</option>
            <option value="link">Portfolio Link</option>
            <option value="file">File Upload</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111] mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., E-commerce Website, REST API"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
            required
          />
        </div>

        {proofType === 'file' ? (
          <div>
            <label className="block text-sm font-medium text-[#111] mb-2">Upload File *</label>
            <input
              id="skill-file"
              type="file"
              accept=".pdf,.zip,.rar"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
            <p className="text-xs text-[#333] mt-1">PDF, ZIP, RAR. Max 50MB</p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-[#111] mb-2">URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                proofType === 'github'
                  ? 'https://github.com/username/repo'
                  : proofType === 'deployment'
                  ? 'https://your-app.vercel.app'
                  : 'https://your-portfolio.com'
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
              required
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full px-4 py-2 bg-[#111] text-white rounded-lg hover:bg-[#333] transition disabled:opacity-50 font-semibold"
        >
          {uploading ? 'Uploading...' : 'Upload Proof'}
        </button>
      </form>
    </div>
  )
}

