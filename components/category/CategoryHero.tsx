'use client'

import { ArrowRight } from 'lucide-react'
import { CATEGORY_CONFIG, CategorySlug, getCategoryConfig } from '@/lib/config/categoryConfig'
import { HIGH_VALUE_CATEGORIES, getCategoryBySlug } from '@/lib/constants/highValueCategories'
import { Button } from '@/components/ui/Button'

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
    <section className="category-hero relative bg-[#050b1a] py-16 md:py-20">
      {/* Removed dark overlay - background is already dark enough */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm mb-6">
          <category.icon className="w-4 h-4 text-white" />
          <span className="text-white font-medium">{config.heroTags[0] || config.title}</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          {config.title}
        </h1>

        <p className="text-base md:text-lg max-w-2xl mx-auto mb-8" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
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

        <Button
          href={config.heroCtaHref}
          variant="secondary"
          size="lg"
          icon={<ArrowRight className="w-5 h-5" />}
          iconPosition="right"
          className="relative z-20 !bg-white !text-slate-900 hover:!bg-slate-50 border-white/20"
        >
          {config.heroCtaLabel}
        </Button>
      </div>
    </section>
  )
}
