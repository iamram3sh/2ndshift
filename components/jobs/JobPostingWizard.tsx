/**
 * Outcome-Based Job Posting Wizard
 * AI converts one-line description → full job post
 * 
 * TODO: Implement full wizard functionality
 */

'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

interface JobPostingWizardProps {
  onComplete?: (jobData: any) => void
}

export default function JobPostingWizard({ onComplete }: JobPostingWizardProps) {
  const [step, setStep] = useState(1)
  const [oneLineDescription, setOneLineDescription] = useState('')
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // TODO: Call AI API to generate full job description
    // const response = await fetch('/api/jobs/generate-description', {
    //   method: 'POST',
    //   body: JSON.stringify({ description: oneLineDescription })
    // })
    // const data = await response.json()
    // setGeneratedDescription(data.description)
    setIsGenerating(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl border border-slate-200 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-sky-600" />
          <h2 className="text-2xl font-bold text-[#111]">AI Job Posting Wizard</h2>
        </div>
        <p className="text-[#333]">Describe your job in one line, and we'll create a complete job post for you.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#111] mb-2">
            What do you need? (One line description)
          </label>
          <textarea
            value={oneLineDescription}
            onChange={(e) => setOneLineDescription(e.target.value)}
            placeholder="e.g., Need a React developer to build a dashboard in 2 weeks"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[#333] focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows={3}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!oneLineDescription || isGenerating}
          className="w-full bg-[#111] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#333] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Full Job Post'}
          <ArrowRight className="w-4 h-4 inline-block ml-2" />
        </button>

        {generatedDescription && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-[#111] mb-2">Generated Job Description:</h3>
            <p className="text-[#333] whitespace-pre-wrap">{generatedDescription}</p>
          </div>
        )}
      </div>
    </div>
  )
}

