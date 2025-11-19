'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'Design', 'Marketing', 'Content Writing', 'Data Analysis', 'SEO',
  'Video Editing', 'Graphic Design', 'Excel', 'SQL'
]

export default function CreateProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration_hours: '',
    required_skills: [] as string[],
    deadline: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter(s => s !== skill)
        : [...prev.required_skills, skill]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title) newErrors.title = 'Title is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Valid budget is required'
    }
    if (!formData.duration_hours || parseFloat(formData.duration_hours) <= 0) {
      newErrors.duration_hours = 'Valid duration is required'
    }
    if (formData.required_skills.length === 0) {
      newErrors.required_skills = 'Select at least one skill'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('projects')
      .insert({
        client_id: user.id,
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        duration_hours: parseFloat(formData.duration_hours),
        required_skills: formData.required_skills,
        deadline: formData.deadline || null,
        status: 'open'
      })

    setIsLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Project created successfully!')
      setTimeout(() => {
        router.push('/client')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Post a New Project</h1>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Project Title"
              placeholder="e.g., Need a React Developer for E-commerce Website"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe your project in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Budget (₹)"
                type="number"
                placeholder="25000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                error={errors.budget}
              />

              <Input
                label="Duration (hours)"
                type="number"
                placeholder="40"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                error={errors.duration_hours}
              />
            </div>

            <Input
              label="Deadline (optional)"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      formData.required_skills.includes(skill)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {errors.required_skills && (
                <p className="mt-2 text-sm text-red-600">{errors.required_skills}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                Post Project
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
