'use client'

import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import type { JobFilters } from '@/types/jobs'

interface TaskFiltersProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
  categories?: Array<{ id: string; name: string; slug: string }>
}

export function TaskFilters({ filters, onFiltersChange, categories = [] }: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(filters.search || '')

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleCategoryChange = (categoryId: string | null) => {
    onFiltersChange({
      ...filters,
      category_id: categoryId || undefined,
    })
  }

  const handleMinPriceChange = (minPrice: number) => {
    onFiltersChange({
      ...filters,
      minPrice: minPrice >= 50 ? minPrice : undefined,
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    onFiltersChange({
      status: 'open',
      role: 'worker',
    })
  }

  const activeFiltersCount = [
    filters.search,
    filters.category_id,
    filters.minPrice && filters.minPrice >= 50,
  ].filter(Boolean).length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0b63ff] focus:border-[#0b63ff] outline-none dark:bg-slate-900 dark:text-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition ${
            showFilters || activeFiltersCount > 0
              ? 'bg-[#0b63ff] text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-white text-[#0b63ff] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
          {/* Min Price Slider */}
          <div>
            <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
              Minimum Price: ₹{filters.minPrice || 50}
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={filters.minPrice || 50}
              onChange={(e) => handleMinPriceChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0b63ff]"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>₹50</span>
              <span>₹1000+</span>
            </div>
          </div>

          {/* Category Chips */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#111] dark:text-white mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    !filters.category_id
                      ? 'bg-[#0b63ff] text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filters.category_id === cat.id
                        ? 'bg-[#0b63ff] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#0b63ff] dark:hover:text-blue-400 transition"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
