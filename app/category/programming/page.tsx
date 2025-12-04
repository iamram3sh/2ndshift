'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Code, Database, Zap, Shield, 
  Clock, IndianRupee, CheckCircle, Filter, Search,
  Coffee, Globe, Layers
} from 'lucide-react'
import { PROGRAMMING_MICROTASKS } from '@/data/highValueProgrammingTasks'
import { HIGH_VALUE_CATEGORIES } from '@/lib/constants/highValueCategories'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { CategoryHero } from '@/components/category/CategoryHero'
import { BottomCTA } from '@/components/category/BottomCTA'

export default function ProgrammingCategoryPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedFramework, setSelectedFramework] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedDelivery, setSelectedDelivery] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const category = HIGH_VALUE_CATEGORIES.find(c => c.slug === 'programming')
  
  const languages = ['Python', 'Java', 'Golang', 'Node.js', 'Rust', 'C++']
  const frameworks = ['Django', 'Spring', 'NestJS', 'FastAPI', 'Express', 'Gin']
  const difficulties = ['low', 'medium', 'high']
  const deliveryWindows = ['6-24h', '3-7d', '1-4w']

  const filteredTasks = PROGRAMMING_MICROTASKS.filter(task => {
    if (selectedLanguage !== 'all' && !task.description.toLowerCase().includes(selectedLanguage.toLowerCase())) return false
    if (selectedFramework !== 'all' && !task.description.toLowerCase().includes(selectedFramework.toLowerCase())) return false
    if (selectedDifficulty !== 'all' && task.complexity !== selectedDifficulty) return false
    if (selectedDelivery !== 'all' && task.delivery_window !== selectedDelivery) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li>
              <Link href="/category" className="text-slate-600 hover:text-slate-900 transition-colors">
                Category
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-medium" aria-current="page">
              Programming
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <CategoryHero slug="programming" />

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#111] mb-2">{PROGRAMMING_MICROTASKS.length}+</div>
              <div className="text-sm text-[#333]">Available Microtasks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#111] mb-2">₹4,000 - ₹60,000</div>
              <div className="text-sm text-[#333]">Price Range</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#111] mb-2">6h - 4w</div>
              <div className="text-sm text-[#333]">Delivery Window</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search programming tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            {/* Framework Filter */}
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Frameworks</option>
              {frameworks.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
              ))}
            </select>

            {/* Delivery Window Filter */}
            <select
              value={selectedDelivery}
              onChange={(e) => setSelectedDelivery(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Delivery Times</option>
              {deliveryWindows.map(dw => (
                <option key={dw} value={dw}>{dw}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Microtasks Grid */}
      <section className="py-16 md:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#111] mb-2">
              Available Programming Microtasks
            </h2>
            <p className="text-[#333]">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <div
                key={index}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#111] mb-2">
                      {task.title}
                    </h3>
                    <p className="text-sm text-[#333] mb-4 line-clamp-3">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                    task.complexity === 'high' 
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : task.complexity === 'medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {task.complexity.charAt(0).toUpperCase() + task.complexity.slice(1)}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg">
                    {task.delivery_window}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-lg font-bold text-[#111]">
                      {formatCurrency(task.price_min)} - {formatCurrency(task.price_max)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Commission: {task.default_commission_percent}%
                    </div>
                  </div>
                  <Link
                    href={`/projects/create?category=programming&microtask=${encodeURIComponent(task.title)}`}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                  >
                    Post Task
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#333] mb-4">No tasks found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedLanguage('all')
                  setSelectedFramework('all')
                  setSelectedDifficulty('all')
                  setSelectedDelivery('all')
                  setSearchQuery('')
                }}
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <BottomCTA categoryName={category?.name} />
    </div>
  )
}
