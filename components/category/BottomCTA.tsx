'use client'

import { ArrowRight } from 'lucide-react'
import { useRole } from '@/components/role/RoleContextProvider'
import { withRoleParam } from '@/lib/utils/roleAwareLinks'
import { Button } from '@/components/ui/Button'

type BottomCTAProps = {
  categoryName?: string
  role?: 'worker' | 'client' | 'both'
}

export function BottomCTA({ categoryName, role = 'both' }: BottomCTAProps) {
  const { role: currentRole } = useRole()
  const categoryText = categoryName ? ` ${categoryName.toLowerCase()}` : ''
  const effectiveRole = role === 'both' ? currentRole : role

  // Worker CTA
  if (effectiveRole === 'worker' || (!effectiveRole && role === 'both')) {
    return (
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            Ready to start earning?
          </h2>
          <p className="mb-8" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            Join 2ndShift today. It&apos;s free to create an account and start
            working on high-value{categoryText} technical projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={withRoleParam("/register?type=worker", 'worker')}
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Get Started Free
            </Button>
            <Button
              href={withRoleParam("/worker/discover", 'worker')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Browse Jobs
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Client CTA
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          Ready to hire talent?
        </h2>
        <p className="mb-8" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
          Join 2ndShift today. It&apos;s free to create an account.
        </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={withRoleParam("/register?type=client", 'client')}
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Get Started Free
            </Button>
            <Button
              href={withRoleParam("/workers", 'client')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Browse Talent
            </Button>
          </div>
      </div>
    </section>
  )
}
