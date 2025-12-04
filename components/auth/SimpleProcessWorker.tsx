'use client'

import { Briefcase, Target, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRole } from '@/components/role/RoleContextProvider'

export function SimpleProcessWorker() {
  const { role, setRole } = useRole()

  return (
    <section className="py-20 lg:py-28 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            Simple process
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            Get started in minutes. No complicated onboarding.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Create your profile',
              description: 'Add your skills, experience, and portfolio. Get verified to boost visibility.',
              icon: Briefcase,
            },
            {
              step: '02',
              title: 'Browse & apply',
              description: 'Find jobs that match your skills. Apply with Shift Credits. Get matched instantly.',
              icon: Target,
            },
            {
              step: '03',
              title: 'Get paid fast',
              description: 'Complete work, get paid within 24 hours. All compliance handled automatically.',
              icon: Zap,
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-slate-600 mb-4">{item.step}</div>
              <div className="w-14 h-14 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{item.title}</h3>
              <p style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/register?type=worker"
            onClick={() => setRole('worker', 'cta')}
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

