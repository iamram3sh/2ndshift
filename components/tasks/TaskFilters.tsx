'use client'

import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { JobFilters } from '@/types/jobs'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6 mb-8"
    >
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters || activeFiltersCount > 0 ? 'primary' : 'secondary'}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-white text-primary-600">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-6"
        >
          {/* Min Price Slider */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Minimum Price: ₹{filters.minPrice || 50}
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={filters.minPrice || 50}
              onChange={(e) => handleMinPriceChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>₹50</span>
              <span>₹1000+</span>
            </div>
          </div>

          {/* Category Chips */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !filters.category_id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.category_id === cat.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
