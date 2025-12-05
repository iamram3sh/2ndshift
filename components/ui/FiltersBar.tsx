'use client'

import { Search, Filter, X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export interface FilterOption {
  label: string
  value: string
}

interface FiltersBarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  tags?: FilterOption[]
  selectedTags?: string[]
  onTagToggle?: (tag: string) => void
  industries?: FilterOption[]
  selectedIndustry?: string
  onIndustryChange?: (industry: string) => void
  skills?: FilterOption[]
  selectedSkills?: string[]
  onSkillToggle?: (skill: string) => void
  sortOptions?: FilterOption[]
  selectedSort?: string
  onSortChange?: (sort: string) => void
  onClear?: () => void
  className?: string
}

export function FiltersBar({
  searchQuery = '',
  onSearchChange,
  tags = [],
  selectedTags = [],
  onTagToggle,
  industries = [],
  selectedIndustry,
  onIndustryChange,
  skills = [],
  selectedSkills = [],
  onSkillToggle,
  sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Price: Low to High', value: 'price_asc' },
  ],
  selectedSort,
  onSortChange,
  onClear,
  className,
}: FiltersBarProps) {
  const hasActiveFilters =
    searchQuery ||
    selectedTags.length > 0 ||
    selectedIndustry ||
    selectedSkills.length > 0 ||
    selectedSort

  return (
    <div className={cn('bg-white border border-slate-200 rounded-xl p-4', className)}>
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.value)
                return (
                  <button
                    key={tag.value}
                    onClick={() => onTagToggle?.(tag.value)}
                    className={cn(
                      'px-3 py-1 text-xs font-medium rounded-lg border transition-colors',
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Industry */}
        {industries.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Industry</label>
            <select
              value={selectedIndustry || ''}
              onChange={(e) => onIndustryChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.value)
                return (
                  <button
                    key={skill.value}
                    onClick={() => onSkillToggle?.(skill.value)}
                    className={cn(
                      'px-3 py-1 text-xs font-medium rounded-lg border transition-colors',
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {skill.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Sort */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">Sort By</label>
          <select
            value={selectedSort || ''}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && onClear && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            icon={<X className="w-4 h-4" />}
            iconPosition="left"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
