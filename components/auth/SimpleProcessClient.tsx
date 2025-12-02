'use client'

import { Briefcase, Target, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRole } from '@/components/role/RoleContextProvider'

export function SimpleProcessClient() {
  const { role, setRole } = useRole()

  return (
    <section className="py-20 lg:py-28 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
            Simple process
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Get started in minutes. No complicated onboarding.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Post your requirement',
              description: 'Describe what you need. Set budget and timeline. Use AI Job Wizard for instant job specs.',
              icon: Briefcase,
            },
            {
              step: '02',
              title: 'Get matched',
              description: 'Our AI finds the best matches. Review profiles, chat, and decide. All workers are verified.',
              icon: Target,
            },
            {
              step: '03',
              title: 'Start working',
              description: 'Agree on terms, we handle the paperwork. Get work done. Replacement guarantee included.',
              icon: Zap,
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-slate-600 mb-4">{item.step}</div>
              <div className="w-14 h-14 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/90">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/register?type=client"
            onClick={() => setRole('client', 'cta')}
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <CheckCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

