'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Monitor, Radio, Shield, Palette, Film, Megaphone, Calculator,
  Scale, Users, Briefcase, Heart, Building, ShoppingBag, GraduationCap,
  BookOpen, Wrench, Factory, Car, Leaf, Zap, Truck, Landmark,
  HeartHandshake, MoreHorizontal, Search, ArrowRight, Star
} from 'lucide-react'
import type { Industry } from '@/types/categories'

// Icon mapping
const ICONS: Record<string, React.ComponentType<any>> = {
  Monitor, Radio, Shield, Palette, Film, Megaphone, Calculator,
  Scale, Users, Briefcase, Heart, Building, ShoppingBag, GraduationCap,
  BookOpen, Wrench, Factory, Car, Leaf, Zap, Truck, Landmark,
  HeartHandshake, MoreHorizontal, Hotel: Building, Pill: Heart,
}

// Color mapping for backgrounds
const BG_COLORS: Record<string, string> = {
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  red: 'bg-red-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  emerald: 'bg-emerald-500',
  slate: 'bg-slate-500',
  cyan: 'bg-cyan-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  teal: 'bg-teal-500',
  yellow: 'bg-yellow-500',
  stone: 'bg-stone-500',
  fuchsia: 'bg-fuchsia-500',
  indigo: 'bg-indigo-500',
  blue: 'bg-blue-500',
  zinc: 'bg-zinc-500',
  neutral: 'bg-neutral-500',
  gray: 'bg-gray-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
}

const FEATURED_INDUSTRIES = ['it', 'design', 'marketing', 'finance', 'healthcare', 'engineering']

export default function IndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
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

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredIndustries = industries.filter(i => FEATURED_INDUSTRIES.includes(i.slug))
  const otherIndustries = filteredIndustries.filter(i => !FEATURED_INDUSTRIES.includes(i.slug))

  const getIcon = (iconName: string | null) => {
    if (!iconName) return MoreHorizontal
    return ICONS[iconName] || MoreHorizontal
  }

  const getBgColor = (colorName: string | null) => {
    if (!colorName) return BG_COLORS.slate
    return BG_COLORS[colorName] || BG_COLORS.slate
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Professionals by Industry
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Browse verified professionals across 25+ industries. From IT to Healthcare, 
            find the right expertise for your project.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Industries */}
      {searchQuery === '' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Popular Industries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredIndustries.map((industry) => {
              const Icon = getIcon(industry.icon)
              return (
                <Link
                  key={industry.id}
                  href={`/workers?industry=${industry.slug}`}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                >
                  <div className={`h-3 ${getBgColor(industry.color)}`} />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl ${getBgColor(industry.color)} bg-opacity-10 flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${getBgColor(industry.color).replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                          {industry.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {industry.description || `Find ${industry.name} professionals`}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">4.8</span>
                          </div>
                          <span className="text-sm text-slate-500">
                            {industry.professional_count || 'Many'} professionals
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-sm text-slate-500">Browse professionals</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* All Industries */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {searchQuery ? 'Search Results' : 'All Industries'}
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredIndustries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No industries found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(searchQuery ? filteredIndustries : otherIndustries).map((industry) => {
              const Icon = getIcon(industry.icon)
              return (
                <Link
                  key={industry.id}
                  href={`/workers?industry=${industry.slug}`}
                  className="group bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg ${getBgColor(industry.color)} bg-opacity-10 flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${getBgColor(industry.color).replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors text-sm">
                    {industry.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {industry.professional_count || 0} pros
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't find your industry?
          </h2>
          <p className="text-slate-300 mb-8">
            We're constantly adding new industries and categories. 
            Suggest one and we'll review it within 24 hours.
          </p>
          <Link
            href="/register?type=worker"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 rounded-lg font-medium hover:bg-sky-700 transition-colors"
          >
            Join as a Professional
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
