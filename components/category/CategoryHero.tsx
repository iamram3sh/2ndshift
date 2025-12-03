'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORY_CONFIG, CategorySlug, getCategoryConfig } from '@/lib/config/categoryConfig'
import { HIGH_VALUE_CATEGORIES, getCategoryBySlug } from '@/lib/constants/highValueCategories'

type CategoryHeroProps = {
  slug: CategorySlug | string
}

export function CategoryHero({ slug }: CategoryHeroProps) {
  const config = getCategoryConfig(slug)
  const category = getCategoryBySlug(slug)

  if (!config || !category) {
    return null
  }

  return (
    <section className="bg-[#050b1a] text-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm mb-6">
          <category.icon className="w-4 h-4" />
          {config.heroTags[0] || config.title}
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
          {config.title}
        </h1>

        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8">
          {config.subtitle}
        </p>

        {config.heroTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {config.heroTags.map((tag, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm"
              >
                <span className="font-medium">{tag}</span>
              </div>
            ))}
          </div>
        )}

        <Link
          href={config.heroCtaHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-6 py-3 text-sm md:text-base font-semibold shadow-lg hover:bg-slate-100 transition"
        >
          {config.heroCtaLabel}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
