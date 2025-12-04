'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/lib/constants/highValueCategories'
import { getMicrotasksByCategory, type HighValueMicrotask } from '@/data/highValueMicrotasks'
import { CategoryHero } from '@/components/category/CategoryHero'
import { BottomCTA } from '@/components/category/BottomCTA'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params)
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  // Map category id to microtask category (some categories have different id vs slug)
  const categoryIdToMicrotaskCategory: Record<string, HighValueMicrotask['category']> = {
    'devops': 'devops',
    'cloud': 'cloud',
    'networking': 'networking',
    'security': 'security',
    'ai': 'ai',
    'data': 'data',
    'sre': 'sre',
    'db': 'database', // Category id is 'db' but microtasks use 'database'
    'programming': 'programming'
  }

  const microtaskCategory = categoryIdToMicrotaskCategory[category.id] || category.slug as HighValueMicrotask['category']
  const microtasks = getMicrotasksByCategory(microtaskCategory)

  // Map category slug for CategoryHero (handle 'db' -> 'database')
  const heroSlug = category.id === 'db' ? 'database' : category.slug

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
              {category.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <CategoryHero slug={heroSlug} />

      {/* Microtasks Grid */}
      {microtasks.length > 0 && (
        <section className="py-16 md:py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
                Available {category.name} Microtasks
              </h2>
              <p className="text-lg text-[#333] max-w-2xl mx-auto">
                High-value technical tasks that showcase expertise
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {microtasks.slice(0, 12).map((task) => (
                <div
                  key={task.id}
                  className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#111] mb-1">
                      {task.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                      task.complexity === 'high'
                        ? 'text-purple-700 bg-purple-50 border border-purple-200'
                        : task.complexity === 'medium'
                        ? 'text-blue-700 bg-blue-50 border border-blue-200'
                        : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    }`}>
                      {task.complexity}
                    </span>
                  </div>
                  <p className="text-sm text-[#333] mb-4 line-clamp-3">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-lg font-semibold text-[#111]">
                        ₹{task.price_min.toLocaleString()} - ₹{task.price_max.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {task.delivery_window}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Commission: {task.default_commission_percent}% based on complexity
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Section */}
      <BottomCTA categoryName={category.name} />
    </div>
  )
}
