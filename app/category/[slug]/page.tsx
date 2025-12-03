'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Server } from 'lucide-react'
import { HIGH_VALUE_CATEGORIES, getCategoryBySlug } from '@/lib/constants/highValueCategories'
import { getMicrotasksByCategory, type HighValueMicrotask } from '@/data/highValueMicrotasks'

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

  // Category-specific hero content
  const categoryHeroContent: Record<string, { badge: string; tags: string[] }> = {
    'devops': {
      badge: 'CI/CD & Infrastructure Automation',
      tags: ['Docker & Kubernetes', 'CI/CD Pipelines', 'Infrastructure as Code']
    },
    'cloud': {
      badge: 'Multi-Cloud Solutions',
      tags: ['AWS, Azure, GCP', 'Serverless Architecture', 'Cloud Security']
    },
    'networking': {
      badge: 'Enterprise Network Infrastructure',
      tags: ['Network Architecture', 'VPN & Security', 'Load Balancing']
    },
    'security': {
      badge: 'Enterprise Security & Compliance',
      tags: ['Security Audits', 'Penetration Testing', 'Compliance & Hardening']
    },
    'ai': {
      badge: 'AI & LLM Engineering',
      tags: ['LLM Fine-tuning', 'RAG Pipelines', 'Vector Databases']
    },
    'data': {
      badge: 'Big Data & Analytics',
      tags: ['ETL Pipelines', 'Data Warehousing', 'Real-time Streaming']
    },
    'sre': {
      badge: 'Site Reliability & Observability',
      tags: ['Monitoring & Alerting', 'Incident Response', 'System Reliability']
    },
    'db': {
      badge: 'Database Architecture & Optimization',
      tags: ['Query Optimization', 'Database Migrations', 'Replication & Scaling']
    },
    'database': {
      badge: 'Database Architecture & Optimization',
      tags: ['Query Optimization', 'Database Migrations', 'Replication & Scaling']
    },
    'programming': {
      badge: 'Senior Backend & Systems Programming',
      tags: ['Complex Backend APIs', 'Performance & Architecture', 'Production-Critical Fixes']
    }
  }

  const heroContent = categoryHeroContent[category.id] || categoryHeroContent[category.slug] || {
    badge: category.name,
    tags: []
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 backdrop-blur-sm border border-sky-500/30 text-sky-300 rounded-full text-sm font-medium mb-6">
              <category.icon className="w-4 h-4" />
              {heroContent.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              {category.name}
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed">
              {category.description}
            </p>
            
            {heroContent.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {heroContent.tags.map((tag, index) => (
                  <div key={index} className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm">
                    <span className="font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            )}

            <Link
              href={`/projects/create?category=${category.slug}`}
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Post a {category.name} Task
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to start earning?
          </h2>
          <p className="text-lg text-white/95 mb-8 max-w-2xl mx-auto">
            Join 2ndShift today. It's free to create an account and start working on high-value {category.name.toLowerCase()} projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=worker"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-all shadow-lg hover:shadow-xl"
            >
              Browse Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
