/**
 * Outcome-Based Skills Section
 * IT-focused, proof-based skills presentation for workers
 */

'use client'

import { useState } from 'react'
import { Plus, X, CheckCircle, ExternalLink, Zap, Clock, Calendar, TrendingUp, Code, Server, Cloud, Database } from 'lucide-react'

interface SkillDeliverable {
  id: string
  deliverable: string // e.g., "Build REST APIs using Node.js"
  proficiency: 'beginner' | 'intermediate' | 'advanced'
  proofType: 'github' | 'deployment' | 'verified_task' | 'portfolio' | 'code_walkthrough'
  proofUrl: string
  deliveryTime: string // e.g., "24 hours"
}

interface OutcomeBasedSkillsSectionProps {
  skills: SkillDeliverable[]
  onSkillsChange: (skills: SkillDeliverable[]) => void
  workingPattern: 'night' | 'weekend' | 'task_based' | 'flexible'
  onWorkingPatternChange: (pattern: 'night' | 'weekend' | 'task_based' | 'flexible') => void
  availability: string // e.g., "2-3 technical micro tasks per week"
  onAvailabilityChange: (availability: string) => void
}

const IT_DELIVERABLE_TEMPLATES = [
  { icon: Code, category: 'Backend', items: [
    'Build REST APIs using Node.js / FastAPI',
    'Fix React/Next.js component issues',
    'Implement authentication (JWT/OAuth/Firebase Auth)',
    'Database query optimization and migrations',
    'Microservice fixes and debugging'
  ]},
  { icon: Server, category: 'DevOps', items: [
    'Set up CI/CD pipelines (GitHub Actions/Jenkins)',
    'Configure Docker containers & write Dockerfiles',
    'Deploy apps on AWS/Azure/Vercel',
    'Cloud setup (VM provisioning, firewall rules, DNS)',
    'DevOps tasks (SSL installation, Nginx config)'
  ]},
  { icon: Cloud, category: 'Cloud & Infrastructure', items: [
    'Deploy apps on AWS/Azure/Vercel',
    'Cloud setup (VM provisioning, firewall rules, DNS)',
    'Remote infrastructure management',
    'Container orchestration (Docker/Kubernetes)'
  ]},
  { icon: Database, category: 'Database & Data', items: [
    'Database query optimization',
    'Schema migrations and updates',
    'Data pipeline setup',
    'Database performance tuning'
  ]},
  { icon: TrendingUp, category: 'Frontend & UI', items: [
    'Frontend fixes (responsiveness, UI alignment)',
    'React/Next.js component debugging',
    'UI/UX improvements',
    'Cross-browser compatibility fixes'
  ]}
]

export default function OutcomeBasedSkillsSection({
  skills,
  onSkillsChange,
  workingPattern,
  onWorkingPatternChange,
  availability,
  onAvailabilityChange
}: OutcomeBasedSkillsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSkill, setNewSkill] = useState<Partial<SkillDeliverable>>({
    deliverable: '',
    proficiency: 'intermediate',
    proofType: 'github',
    proofUrl: '',
    deliveryTime: ''
  })

  const addSkill = () => {
    if (!newSkill.deliverable || !newSkill.proofUrl || !newSkill.deliveryTime) return
    
    const skill: SkillDeliverable = {
      id: Date.now().toString(),
      deliverable: newSkill.deliverable,
      proficiency: newSkill.proficiency || 'intermediate',
      proofType: newSkill.proofType || 'github',
      proofUrl: newSkill.proofUrl,
      deliveryTime: newSkill.deliveryTime
    }
    
    onSkillsChange([...skills, skill])
    setNewSkill({
      deliverable: '',
      proficiency: 'intermediate',
      proofType: 'github',
      proofUrl: '',
      deliveryTime: ''
    })
    setShowAddForm(false)
  }

  const removeSkill = (id: string) => {
    onSkillsChange(skills.filter(s => s.id !== id))
  }

  const updateSkill = (id: string, updates: Partial<SkillDeliverable>) => {
    onSkillsChange(skills.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-[#111] mb-2 flex items-center gap-2">
          <Zap className="w-6 h-6 text-sky-600" />
          Core Technical Skills (Outcome-Based)
        </h3>
        <p className="text-[#333] text-sm">
          List specific IT deliverables you can deliver, not just technologies. Include proof for each skill.
        </p>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-lg text-[#111]">{skill.deliverable}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    skill.proficiency === 'advanced' ? 'bg-emerald-100 text-emerald-700' :
                    skill.proficiency === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                    'bg-sky-100 text-sky-700'
                  }`}>
                    {skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1)}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#333] mb-3">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" />
                    Delivery: {skill.deliveryTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    {skill.proofType === 'github' ? 'GitHub' :
                     skill.proofType === 'deployment' ? 'Live Deployment' :
                     skill.proofType === 'verified_task' ? 'Verified Task' :
                     skill.proofType === 'portfolio' ? 'Portfolio' : 'Code Walkthrough'}
                  </span>
                </div>

                {skill.proofUrl && (
                  <a
                    href={skill.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    View Proof
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <button
                onClick={() => removeSkill(skill.id)}
                className="p-2 text-[#333] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Skill */}
        {showAddForm ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6">
            <h4 className="font-bold text-[#111] mb-4">Add New Skill Deliverable</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111] mb-2">
                  What can you deliver? *
                </label>
                <select
                  value={newSkill.deliverable}
                  onChange={(e) => setNewSkill({ ...newSkill, deliverable: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111] bg-white"
                >
                  <option value="">Select a deliverable template...</option>
                  {IT_DELIVERABLE_TEMPLATES.map((template) => (
                    <optgroup key={template.category} label={template.category}>
                      {template.items.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-xs text-[#333] mt-1 mb-2">Or type your own below:</p>
                <input
                  type="text"
                  placeholder="e.g., Build REST APIs using Node.js / FastAPI"
                  value={newSkill.deliverable}
                  onChange={(e) => setNewSkill({ ...newSkill, deliverable: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111] placeholder:text-[#333]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Proficiency Level *
                  </label>
                  <select
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value as any })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Proof Type *
                  </label>
                  <select
                    value={newSkill.proofType}
                    onChange={(e) => setNewSkill({ ...newSkill, proofType: e.target.value as any })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111]"
                  >
                    <option value="github">GitHub Repository</option>
                    <option value="deployment">Live Deployment URL</option>
                    <option value="verified_task">Verified Completed Task</option>
                    <option value="portfolio">Portfolio Project</option>
                    <option value="code_walkthrough">Code Walkthrough Video</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Proof URL *
                  </label>
                  <input
                    type="url"
                    value={newSkill.proofUrl}
                    onChange={(e) => setNewSkill({ ...newSkill, proofUrl: e.target.value })}
                    placeholder="https://github.com/username/repo or https://your-app.vercel.app"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111] placeholder:text-[#333]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Delivery Time *
                  </label>
                  <input
                    type="text"
                    value={newSkill.deliveryTime}
                    onChange={(e) => setNewSkill({ ...newSkill, deliveryTime: e.target.value })}
                    placeholder="e.g., 24 hours, 2-3 days, 1 week"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111] placeholder:text-[#333]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addSkill}
                  className="px-6 py-2.5 bg-[#111] text-white rounded-lg font-semibold hover:bg-[#333] transition-all"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewSkill({
                      deliverable: '',
                      proficiency: 'intermediate',
                      proofType: 'github',
                      proofUrl: '',
                      deliveryTime: ''
                    })
                  }}
                  className="px-6 py-2.5 bg-white text-[#111] border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl text-[#333] hover:border-sky-400 hover:bg-sky-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Skill Deliverable
          </button>
        )}
      </div>

      {/* Working Pattern */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h4 className="font-bold text-lg text-[#111] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600" />
          Working Pattern
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['night', 'weekend', 'task_based', 'flexible'] as const).map((pattern) => (
            <button
              key={pattern}
              onClick={() => onWorkingPatternChange(pattern)}
              className={`p-4 rounded-lg border-2 transition-all font-medium ${
                workingPattern === pattern
                  ? 'border-[#111] bg-[#111] text-white'
                  : 'border-slate-200 text-[#333] hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {pattern === 'night' ? 'Night Worker' :
               pattern === 'weekend' ? 'Weekend Worker' :
               pattern === 'task_based' ? 'Task-Based' : 'Flexible'}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h4 className="font-bold text-lg text-[#111] mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-600" />
          Availability
        </h4>
        <div>
          <label className="block text-sm font-semibold text-[#111] mb-2">
            How many technical micro tasks can you take per week? *
          </label>
          <input
            type="text"
            value={availability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
            placeholder="e.g., 2-3 technical micro tasks per week"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-[#111] placeholder:text-[#333]"
          />
          <p className="text-sm text-[#333] mt-2">
            Be specific. Example: "I can take up to 2-3 technical micro tasks per week" or "Available for 1-2 quick debugging tasks per week"
          </p>
        </div>
      </div>

      {/* Market Relevance Info */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
        <h4 className="font-bold text-lg text-[#111] mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-600" />
          2025 IT Market Relevance
        </h4>
        <p className="text-sm text-[#333] mb-3">
          Your skills are automatically matched with current hiring demand for:
        </p>
        <ul className="space-y-2 text-sm text-[#333]">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            API integrations and microservices
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Cloud deployments (AWS/Azure/Vercel)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Automation scripts and CI/CD
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Quick debugging and fixes
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Remote infrastructure management
          </li>
        </ul>
      </div>
    </div>
  )
}

