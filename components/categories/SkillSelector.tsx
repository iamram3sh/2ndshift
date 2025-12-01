'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search, Plus, Check, Loader2 } from 'lucide-react'

interface Skill {
  id: string
  name: string
  slug: string
}

interface SkillSelectorProps {
  selectedSkills: string[]
  onSkillsChange: (skills: string[]) => void
  industrySlug?: string
  maxSkills?: number
  onSuggestNew?: () => void
  placeholder?: string
}

export function SkillSelector({
  selectedSkills,
  onSkillsChange,
  industrySlug,
  maxSkills = 20,
  onSuggestNew,
  placeholder = 'Search skills...',
}: SkillSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchSkills()
  }, [industrySlug])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSkills = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (industrySlug) params.append('industry', industrySlug)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/skills?${params.toString()}`)
      const data = await response.json()
      setSkills(data.skills || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 1) {
        fetchSkills()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedSkills.includes(skill.name)
  )

  const handleAddSkill = (skillName: string) => {
    if (selectedSkills.length >= maxSkills) return
    if (!selectedSkills.includes(skillName)) {
      onSkillsChange([...selectedSkills, skillName])
    }
    setSearchQuery('')
  }

  const handleRemoveSkill = (skillName: string) => {
    onSkillsChange(selectedSkills.filter((s) => s !== skillName))
  }

  const handleAddCustomSkill = () => {
    if (searchQuery.trim() && !selectedSkills.includes(searchQuery.trim())) {
      handleAddSkill(searchQuery.trim())
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-sm font-medium border border-sky-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-sky-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={selectedSkills.length >= maxSkills}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
        )}
      </div>

      {/* Count */}
      <div className="mt-2 text-xs text-slate-500 text-right">
        {selectedSkills.length}/{maxSkills} skills selected
      </div>

      {/* Dropdown */}
      {isOpen && (selectedSkills.length < maxSkills) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
          <div className="overflow-y-auto max-h-56">
            {filteredSkills.length > 0 ? (
              <div className="p-2">
                {filteredSkills.slice(0, 20).map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleAddSkill(skill.name)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <span>{skill.name}</span>
                    <Plus className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="p-4">
                <p className="text-sm text-slate-500 mb-3">
                  No skills found for "{searchQuery}"
                </p>
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 text-sky-700 rounded-lg font-medium hover:bg-sky-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add "{searchQuery.trim()}"
                </button>
                {onSuggestNew && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      onSuggestNew()
                    }}
                    className="w-full mt-2 text-sm text-slate-500 hover:text-slate-700"
                  >
                    or suggest it as a new skill
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">
                Start typing to search skills
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact skill tags for display
export function SkillTags({ skills, maxVisible = 5 }: { skills: string[]; maxVisible?: number }) {
  const visibleSkills = skills.slice(0, maxVisible)
  const remainingCount = skills.length - maxVisible

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleSkills.map((skill) => (
        <span
          key={skill}
          className="px-2 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 rounded border border-slate-200"
        >
          {skill}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="px-2 py-0.5 text-xs font-medium text-sky-600 bg-sky-50 rounded border border-sky-200">
          +{remainingCount} more
        </span>
      )}
    </div>
  )
}
