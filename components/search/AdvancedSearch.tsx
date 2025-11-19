'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface SearchFilters {
  query: string
  skills: string[]
  minBudget: number
  maxBudget: number
  duration: string
  projectType: string[]
  sortBy: string
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
}

const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'Design', 'Marketing', 'Content Writing', 'Data Analysis', 'SEO',
  'Video Editing', 'Graphic Design', 'Excel', 'SQL', 'AWS'
]

const DURATION_OPTIONS = [
  { label: 'Any Duration', value: '' },
  { label: 'Less than 1 week', value: 'week' },
  { label: '1-4 weeks', value: 'month' },
  { label: '1-3 months', value: 'quarter' },
  { label: '3+ months', value: 'long' },
]

const PROJECT_TYPES = [
  'Fixed Price',
  'Hourly',
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance'
]

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    skills: [],
    minBudget: 0,
    maxBudget: 200000,
    duration: '',
    projectType: [],
    sortBy: 'recent'
  })

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleProjectType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      projectType: prev.projectType.includes(type)
        ? prev.projectType.filter(t => t !== type)
        : [...prev.projectType, type]
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      skills: [],
      minBudget: 0,
      maxBudget: 200000,
      duration: '',
      projectType: [],
      sortBy: 'recent'
    })
    onSearch({
      query: '',
      skills: [],
      minBudget: 0,
      maxBudget: 200000,
      duration: '',
      projectType: [],
      sortBy: 'recent'
    })
  }

  const activeFiltersCount = 
    filters.skills.length + 
    filters.projectType.length + 
    (filters.duration ? 1 : 0) + 
    (filters.minBudget > 0 ? 1 : 0)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search projects by title, description, or skills..."
            className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 transition outline-none dark:bg-slate-900 dark:text-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition ${
            showFilters
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-white text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl transition"
        >
          Search
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-top">
          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Skills Required
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filters.skills.includes(skill)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Budget Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Min Budget</label>
                <input
                  type="number"
                  value={filters.minBudget}
                  onChange={(e) => setFilters({ ...filters, minBudget: Number(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-900 dark:text-white"
                  placeholder="₹0"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Max Budget</label>
                <input
                  type="number"
                  value={filters.maxBudget}
                  onChange={(e) => setFilters({ ...filters, maxBudget: Number(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-900 dark:text-white"
                  placeholder="₹200,000"
                />
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              ₹{filters.minBudget.toLocaleString()} - ₹{filters.maxBudget.toLocaleString()}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Project Duration
            </label>
            <select
              value={filters.duration}
              onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-900 dark:text-white"
            >
              {DURATION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Project Type
            </label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleProjectType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filters.projectType.includes(type)
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-900 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="budget-high">Highest Budget</option>
              <option value="budget-low">Lowest Budget</option>
              <option value="deadline">Closest Deadline</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
