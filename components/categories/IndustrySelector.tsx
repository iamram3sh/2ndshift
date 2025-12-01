'use client'

import { useState, useEffect } from 'react'
import {
  Monitor, Radio, Shield, Palette, Film, Megaphone, Calculator,
  Scale, Users, Briefcase, Heart, Building, ShoppingBag, GraduationCap,
  BookOpen, Wrench, Factory, Car, Leaf, Zap, Truck, Landmark,
  HeartHandshake, MoreHorizontal, Check, Search, Plus, ChevronDown, X
} from 'lucide-react'
import type { Industry } from '@/types/categories'

// Icon mapping
const ICONS: Record<string, React.ComponentType<any>> = {
  Monitor, Radio, Shield, Palette, Film, Megaphone, Calculator,
  Scale, Users, Briefcase, Heart, Building, ShoppingBag, GraduationCap,
  BookOpen, Wrench, Factory, Car, Leaf, Zap, Truck, Landmark,
  HeartHandshake, MoreHorizontal, Hotel: Building, Pill: Heart,
}

// Color mapping
const COLORS: Record<string, string> = {
  sky: 'bg-sky-100 text-sky-700 border-sky-200',
  violet: 'bg-violet-100 text-violet-700 border-violet-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  pink: 'bg-pink-100 text-pink-700 border-pink-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  stone: 'bg-stone-100 text-stone-700 border-stone-200',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  zinc: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  lime: 'bg-lime-100 text-lime-700 border-lime-200',
  green: 'bg-green-100 text-green-700 border-green-200',
}

interface IndustrySelectorProps {
  selected: string | null
  onSelect: (industryId: string | null) => void
  onSuggestNew?: () => void
  showSuggestOption?: boolean
  multiple?: boolean
  selectedMultiple?: string[]
  onSelectMultiple?: (ids: string[]) => void
}

export function IndustrySelector({
  selected,
  onSelect,
  onSuggestNew,
  showSuggestOption = true,
  multiple = false,
  selectedMultiple = [],
  onSelectMultiple,
}: IndustrySelectorProps) {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchIndustries()
  }, [])

  const fetchIndustries = async () => {
    try {
      const response = await fetch('/api/industries')
      const data = await response.json()
      setIndustries(data.industries || [])
    } catch (error) {
      console.error('Error fetching industries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedIndustry = industries.find(i => i.id === selected)

  const handleSelect = (industryId: string) => {
    if (multiple && onSelectMultiple) {
      if (selectedMultiple.includes(industryId)) {
        onSelectMultiple(selectedMultiple.filter(id => id !== industryId))
      } else {
        onSelectMultiple([...selectedMultiple, industryId])
      }
    } else {
      onSelect(industryId === selected ? null : industryId)
      setIsOpen(false)
    }
  }

  const getIcon = (iconName: string | null) => {
    if (!iconName) return MoreHorizontal
    return ICONS[iconName] || MoreHorizontal
  }

  const getColor = (colorName: string | null) => {
    if (!colorName) return COLORS.slate
    return COLORS[colorName] || COLORS.slate
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-left hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
      >
        {selectedIndustry ? (
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getIcon(selectedIndustry.icon)
              return <Icon className="w-5 h-5 text-slate-600" />
            })()}
            <span className="font-medium text-slate-900">{selectedIndustry.name}</span>
          </div>
        ) : multiple && selectedMultiple.length > 0 ? (
          <span className="font-medium text-slate-900">
            {selectedMultiple.length} industries selected
          </span>
        ) : (
          <span className="text-slate-500">Select your industry</span>
        )}
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Industry List */}
          <div className="overflow-y-auto max-h-64">
            {isLoading ? (
              <div className="p-4 text-center text-slate-500">Loading...</div>
            ) : filteredIndustries.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No industries found</div>
            ) : (
              <div className="p-2">
                {filteredIndustries.map((industry) => {
                  const Icon = getIcon(industry.icon)
                  const colorClasses = getColor(industry.color)
                  const isSelected = multiple 
                    ? selectedMultiple.includes(industry.id)
                    : industry.id === selected

                  return (
                    <button
                      key={industry.id}
                      type="button"
                      onClick={() => handleSelect(industry.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-sky-50 border border-sky-200'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorClasses}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`flex-1 text-left text-sm ${isSelected ? 'font-medium text-slate-900' : 'text-slate-700'}`}>
                        {industry.name}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-sky-600" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Suggest New */}
          {showSuggestOption && onSuggestNew && (
            <div className="p-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onSuggestNew()
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Suggest a new industry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Grid view for displaying all industries
export function IndustryGrid({
  onSelect,
  selected,
}: {
  onSelect: (industryId: string) => void
  selected?: string | null
}) {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchIndustries()
  }, [])

  const fetchIndustries = async () => {
    try {
      const response = await fetch('/api/industries')
      const data = await response.json()
      setIndustries(data.industries || [])
    } catch (error) {
      console.error('Error fetching industries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = (iconName: string | null) => {
    if (!iconName) return MoreHorizontal
    return ICONS[iconName] || MoreHorizontal
  }

  const getColor = (colorName: string | null) => {
    if (!colorName) return COLORS.slate
    return COLORS[colorName] || COLORS.slate
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {industries.map((industry) => {
        const Icon = getIcon(industry.icon)
        const colorClasses = getColor(industry.color)
        const isSelected = industry.id === selected

        return (
          <button
            key={industry.id}
            onClick={() => onSelect(industry.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              isSelected
                ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-2 ${colorClasses}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium text-center ${isSelected ? 'text-sky-700' : 'text-slate-700'}`}>
              {industry.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
