'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { 
  ArrowLeft, Briefcase, Shield, Lock, ChevronRight, 
  CheckCircle, Info, Zap, Clock, Star, Plus, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CATEGORY_CONFIG, CategorySlug, getCategoryConfig } from '@/lib/config/categoryConfig'

const GENERIC_SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'Data Analysis', 'SQL', 'AWS', 'DevOps', 'Kubernetes', 'Terraform', 
  'Docker', 'CI/CD', 'Cloud Architecture', 'Security', 'Database Design'
]

const PROJECT_TYPES = [
  { id: 'fixed', label: 'Fixed Price', desc: 'Pay a set amount for the project' },
  { id: 'hourly', label: 'Hourly', desc: 'Pay based on hours worked' },
  { id: 'milestone', label: 'Milestone', desc: 'Split into funded phases' },
]

interface Milestone {
  title: string
  description: string
  amount: number
  dueDate: string
}

export default function CreateProjectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration_hours: '',
    required_skills: [] as string[],
    deadline: '',
    projectType: 'fixed',
    escrowEnabled: true,
    paymentVerified: false,
    urgencyLevel: 'normal' as 'normal' | 'urgent' | 'rush',
  })
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get category from query params and determine skills to show
  const categoryParam = searchParams.get('category')
  const categoryConfig = categoryParam ? getCategoryConfig(categoryParam) : null
  const skillOptions = categoryConfig?.skills || GENERIC_SKILL_OPTIONS

  // Calculate platform fee and escrow amounts
  const budget = parseFloat(formData.budget) || 0
  const platformFee = budget * 0.10 // 10%
  const totalWithFee = budget + platformFee

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter(s => s !== skill)
        : [...prev.required_skills, skill]
    }))
  }

  const addMilestone = () => {
    setMilestones([...milestones, {
      title: `Milestone ${milestones.length + 1}`,
      description: '',
      amount: 0,
      dueDate: '',
    }])
  }

  const updateMilestone = (index: number, updates: Partial<Milestone>) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], ...updates }
    setMilestones(updated)
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const distributeMilestonesEvenly = () => {
    if (milestones.length === 0 || !budget) return
    const amountPerMilestone = Math.floor(budget / milestones.length)
    const remainder = budget - (amountPerMilestone * milestones.length)
    
    setMilestones(milestones.map((m, i) => ({
      ...m,
      amount: amountPerMilestone + (i === milestones.length - 1 ? remainder : 0)
    })))
  }

  const validateStep = (stepNum: number) => {
    const newErrors: Record<string, string> = {}
    
    if (stepNum === 1) {
      if (!formData.title) newErrors.title = 'Title is required'
      if (!formData.description) newErrors.description = 'Description is required'
      if (formData.required_skills.length === 0) {
        newErrors.required_skills = 'Select at least one skill'
      }
    }
    
    if (stepNum === 2) {
      if (!formData.budget || parseFloat(formData.budget) <= 0) {
        newErrors.budget = 'Valid budget is required'
      }
      if (formData.projectType === 'milestone' && milestones.length === 0) {
        newErrors.milestones = 'Add at least one milestone'
      }
      if (formData.projectType === 'milestone') {
        const totalMilestone = milestones.reduce((sum, m) => sum + m.amount, 0)
        if (Math.abs(totalMilestone - budget) > 1) {
          newErrors.milestones = `Milestone total (₹${totalMilestone.toLocaleString()}) must equal budget (₹${budget.toLocaleString()})`
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(2)) return
    
    setIsLoading(true)
    setMessage('')

    // Use v1 API for authentication
    const result = await apiClient.getCurrentUser()
    
    if (result.error || !result.data?.user) {
      router.push('/login')
      setIsLoading(false)
      return
    }

    const currentUser = result.data.user
    
    // Check if user is a client
    if (currentUser.role !== 'client') {
      router.push('/login')
      setIsLoading(false)
      return
    }

    // Create project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        client_id: currentUser.id,
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        duration_hours: parseFloat(formData.duration_hours) || null,
        required_skills: formData.required_skills,
        deadline: formData.deadline || null,
        status: 'open',
        project_type: formData.projectType,
        escrow_enabled: formData.escrowEnabled,
        urgency_level: formData.urgencyLevel,
      })
      .select()
      .single()

    if (error) {
      setIsLoading(false)
      setMessage(error.message)
      return
    }

    // Create escrow if enabled
    if (formData.escrowEnabled && project) {
      await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          amount: parseFloat(formData.budget),
          clientId: currentUser.id,
          hasMilestones: formData.projectType === 'milestone',
          milestones: formData.projectType === 'milestone' ? milestones : undefined,
        }),
      })
    }

    setIsLoading(false)
    setMessage('Project created successfully!')
    
    setTimeout(() => {
      router.push('/client')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex items-center ${s < 3 ? 'gap-2' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s 
                      ? 'bg-sky-600 text-white' 
                      : step > s 
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-12 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-3 ${
            message.includes('success') 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <CheckCircle className="w-5 h-5" />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Project Details</h1>
                  <p className="text-slate-500">Tell us about your project</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="Project Title"
                  placeholder="e.g., Need a React Developer for E-commerce Website"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={errors.title}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    placeholder="Describe your project requirements in detail. Include deliverables, timeline expectations, and any technical specifications..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Required Skills
                    {categoryConfig && (
                      <span className="ml-2 text-xs text-slate-500 font-normal">
                        ({categoryConfig.title} skills)
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-lg border-2 transition font-medium ${
                          formData.required_skills.includes(skill)
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
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

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'normal', label: 'Normal', desc: 'Regular timeline', icon: Clock },
                      { id: 'urgent', label: 'Urgent', desc: 'Priority listing', icon: Zap },
                      { id: 'rush', label: 'Rush', desc: 'Top priority', icon: Star },
                    ].map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, urgencyLevel: level.id as any })}
                        className={`p-4 rounded-xl border-2 transition text-left ${
                          formData.urgencyLevel === level.id
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <level.icon className={`w-5 h-5 mb-2 ${
                          formData.urgencyLevel === level.id ? 'text-sky-600' : 'text-slate-400'
                        }`} />
                        <p className={`font-medium ${
                          formData.urgencyLevel === level.id ? 'text-sky-700' : 'text-slate-700'
                        }`}>
                          {level.label}
                        </p>
                        <p className="text-xs text-slate-500">{level.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={handleNext}>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Budget & Payment</h1>
                    <p className="text-slate-500">Set your budget and payment terms</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Project Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {PROJECT_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: type.id })}
                          className={`p-4 rounded-xl border-2 transition text-left ${
                            formData.projectType === type.id
                              ? 'border-sky-500 bg-sky-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <p className={`font-medium ${
                            formData.projectType === type.id ? 'text-sky-700' : 'text-slate-700'
                          }`}>
                            {type.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <Input
                      label="Budget (₹)"
                      type="number"
                      placeholder="25000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      error={errors.budget}
                    />

                    <Input
                      label="Estimated Duration (hours)"
                      type="number"
                      placeholder="40"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Deadline (optional)"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />

                  {/* Milestones (if milestone type selected) */}
                  {formData.projectType === 'milestone' && (
                    <div className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Payment Milestones</h3>
                        <button
                          type="button"
                          onClick={addMilestone}
                          className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Milestone
                        </button>
                      </div>

                      {milestones.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <p>No milestones added yet</p>
                          <p className="text-sm">Add milestones to split payment into phases</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {milestones.map((milestone, index) => (
                            <div key={index} className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-medium text-slate-600 shrink-0">
                                  {index + 1}
                                </div>
                                <div className="flex-1 grid gap-3">
                                  <input
                                    type="text"
                                    value={milestone.title}
                                    onChange={(e) => updateMilestone(index, { title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    placeholder="Milestone title"
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                      <span className="absolute left-3 top-2 text-slate-400 text-sm">₹</span>
                                      <input
                                        type="number"
                                        value={milestone.amount || ''}
                                        onChange={(e) => updateMilestone(index, { amount: parseInt(e.target.value) || 0 })}
                                        className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        placeholder="Amount"
                                      />
                                    </div>
                                    <input
                                      type="date"
                                      value={milestone.dueDate}
                                      onChange={(e) => updateMilestone(index, { dueDate: e.target.value })}
                                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeMilestone(index)}
                                  className="p-2 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <button
                              type="button"
                              onClick={distributeMilestonesEvenly}
                              className="text-sm text-sky-600 hover:text-sky-700"
                            >
                              Distribute evenly
                            </button>
                            <div className="text-sm">
                              <span className="text-slate-500">Total: </span>
                              <span className={`font-medium ${
                                Math.abs(milestones.reduce((sum, m) => sum + m.amount, 0) - budget) > 1
                                  ? 'text-red-600'
                                  : 'text-emerald-600'
                              }`}>
                                ₹{milestones.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
                              </span>
                              <span className="text-slate-400"> / ₹{budget.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {errors.milestones && (
                        <p className="mt-2 text-sm text-red-600">{errors.milestones}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Escrow Protection Card */}
              <div className={`rounded-2xl border-2 p-6 ${
                formData.escrowEnabled 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-slate-200 bg-white'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.escrowEnabled ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                    <Shield className={`w-6 h-6 ${
                      formData.escrowEnabled ? 'text-emerald-600' : 'text-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">2ndShift Payment Protection</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.escrowEnabled}
                          onChange={(e) => setFormData({ ...formData, escrowEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      Your payment is held securely until you approve the work. Professionals get paid only when you're satisfied.
                    </p>
                    
                    {formData.escrowEnabled && budget > 0 && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-emerald-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Project Budget</span>
                            <span className="font-medium text-slate-900">₹{budget.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Platform Fee (10%)</span>
                            <span className="font-medium text-slate-900">₹{platformFee.toLocaleString()}</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex justify-between">
                            <span className="font-medium text-slate-900">Total to Fund</span>
                            <span className="font-bold text-emerald-600">₹{totalWithFee.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-start gap-2">
                      <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-500">
                        Escrow-protected projects get 3x more responses and show a "Payment Verified" badge to attract top professionals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="button" onClick={handleNext}>
                  Review Project
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Review & Post</h1>
                    <p className="text-slate-500">Confirm your project details</p>
                  </div>
                </div>

                {/* Project Summary */}
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2">{formData.title}</h3>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{formData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500">Budget</p>
                      <p className="text-xl font-bold text-slate-900">₹{budget.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500">Project Type</p>
                      <p className="text-xl font-bold text-slate-900 capitalize">{formData.projectType}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.required_skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {formData.escrowEnabled && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
                        <Shield className="w-5 h-5" />
                        Payment Protection Enabled
                      </div>
                      <p className="text-sm text-emerald-600">
                        Total to fund: ₹{totalWithFee.toLocaleString()} (includes 10% platform fee)
                      </p>
                    </div>
                  )}

                  {formData.projectType === 'milestone' && milestones.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="font-medium text-slate-900 mb-3">Milestones</p>
                      <div className="space-y-2">
                        {milestones.map((m, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{i + 1}. {m.title}</span>
                            <span className="font-medium text-slate-900">₹{m.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {formData.escrowEnabled ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Post & Fund Project
                    </>
                  ) : (
                    'Post Project'
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
