'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type BottomCTAProps = {
  categoryName?: string
}

export function BottomCTA({ categoryName }: BottomCTAProps) {
  const categoryText = categoryName ? ` ${categoryName.toLowerCase()}` : ''

  return (
    <section className="bg-[#050b1a] text-white py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Ready to start earning?
        </h2>
        <p className="text-white/80 mb-8">
          Join 2ndShift today. It&apos;s free to create an account and start
          working on high-value{categoryText} technical projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register?type=worker"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-6 py-3 text-sm font-semibold shadow hover:bg-slate-100 transition"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
          >
            Browse Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
