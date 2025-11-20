'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Search, X, Tag, TrendingUp, Sparkles } from 'lucide-react'

interface SkillSuggestion {
  skill_name: string
  category: string
  usage_count: number
  source: string
}

interface SkillAutocompleteProps {
  selectedSkills: string[]
  onSkillsChange: (skills: string[]) => void
  placeholder?: string
  maxSkills?: number
  showCategories?: boolean
}

export default function SkillAutocomplete({ 
  selectedSkills, 
  onSkillsChange,
  placeholder = "Type to search skills...",
  maxSkills = 20,
  showCategories = true
}: SkillAutocompleteProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .rpc('get_skill_suggestions', {
            search_term: input,
            limit_count: 20
          })

        if (error) throw error
        
        // Filter out already selected skills
        const filteredData = (data || []).filter(
          (skill: SkillSuggestion) => !selectedSkills.includes(skill.skill_name)
        )
        
        setSuggestions(filteredData)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching skill suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [input, selectedSkills])

  const handleAddSkill = (skillName: string) => {
    if (selectedSkills.length >= maxSkills) {
      window.alert(`Maximum ${maxSkills} skills allowed`)
      return
    }

    if (!selectedSkills.includes(skillName)) {
      onSkillsChange([...selectedSkills, skillName])
    }
    setInput('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleRemoveSkill = (skillName: string) => {
    onSkillsChange(selectedSkills.filter(s => s !== skillName))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      
      // If there are suggestions, add the first one
      if (suggestions.length > 0) {
        handleAddSkill(suggestions[0].skill_name)
      } else {
        // Otherwise, add the custom skill
        handleAddSkill(input.trim())
      }
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'popular':
        return <Tag className="w-3 h-3 text-blue-500" />
      case 'learned':
        return <Sparkles className="w-3 h-3 text-purple-500" />
      case 'projects':
      case 'workers':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      default:
        return <Tag className="w-3 h-3 text-gray-500" />
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'popular':
        return 'Popular'
      case 'learned':
        return 'Trending'
      case 'projects':
        return 'From Projects'
      case 'workers':
        return 'From Workers'
      default:
        return ''
    }
  }

  return (
    <div ref={wrapperRef} className="w-full">
      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm flex items-center gap-2 font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input with Suggestions */}
      <div className="relative">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => input.length >= 2 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
            disabled={selectedSkills.length >= maxSkills}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAddSkill(suggestion.skill_name)}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getSourceIcon(suggestion.source)}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {suggestion.skill_name}
                    </div>
                    {showCategories && suggestion.category && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {suggestion.category}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {suggestion.usage_count > 0 && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Used {suggestion.usage_count}x
                    </span>
                  )}
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded opacity-0 group-hover:opacity-100 transition">
                    {getSourceLabel(suggestion.source)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No suggestions but user typed something */}
        {showSuggestions && input.length >= 2 && suggestions.length === 0 && !isLoading && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              No existing skills found. Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded text-xs">Enter</kbd> to add "{input}" as a new skill.
            </p>
            <button
              type="button"
              onClick={() => handleAddSkill(input.trim())}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              + Add "{input}" as new skill
            </button>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {selectedSkills.length}/{maxSkills} skills selected. 
        {selectedSkills.length < maxSkills && (
          <> Type to search or add custom skills. Press Enter to add.</>
        )}
      </p>
    </div>
  )
}
