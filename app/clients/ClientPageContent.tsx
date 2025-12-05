'use client'

import Link from 'next/link'
import { 
  ArrowRight, Briefcase, Shield, CheckCircle, Users, 
  Zap, Lock, Star, Building2, Layers, Timer,
  Calendar, Coffee, Sparkles, Heart, IndianRupee,
  Mail, MapPin, Linkedin, Twitter, Target, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '@/components/role/RoleContextProvider'
import { RolePickerModal } from '@/components/auth/RolePickerModal'
import { RoleMismatchModal } from '@/components/role/RoleMismatchModal'
import { RoleAwareNav } from '@/components/role/RoleAwareNav'
import { withRoleParam } from '@/lib/utils/roleAwareLinks'
import { trackRoleCTA } from '@/lib/analytics/roleEvents'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'
import { RoleSection } from '@/components/role/RoleSection'
import { 
  HiringModelsSection, 
  AIJobWizardSection, 
  EscrowExplainerSection,
  ClientTestimonialSection,
  PricingCTASection
} from '@/components/role/ClientSpecificModules'
import { PricingSection } from '@/components/revenue/PricingSection'
import { SimpleProcessClient } from '@/components/auth/SimpleProcessClient'
import { HIGH_VALUE_CATEGORIES } from '@/lib/constants/highValueCategories'
import { BackButton } from '@/components/layout/BackButton'
import { Footer } from '@/components/layout/Footer'

export function ClientPageContent({ initialRole }: { initialRole?: 'client' | 'worker' | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showRolePicker, setShowRolePicker] = useState(false)
  const [showRoleMismatch, setShowRoleMismatch] = useState(false)
  const router = useRouter()
  const { role, setRole } = useRole()
  const isRoleEnabled = isRoleHomeEnabled()

  // Enforce client role - show modal if mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isRoleEnabled) return

    const currentRole = role || initialRole
    if (currentRole && currentRole !== 'client') {
      // Role mismatch - show modal
      setShowRoleMismatch(true)
      return
    }

    // Ensure role is set to client
    if (!currentRole) {
      setRole('client', 'query')
    }
  }, [role, initialRole, isRoleEnabled, router, setRole])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCTAClick = (ctaName: string, roleType?: 'worker' | 'client') => {
    if (isRoleEnabled && roleType) {
      trackRoleCTA(roleType, ctaName)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900 tracking-tight">
                2ndShift
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <RoleAwareNav />
            </div>

            <div className="flex items-center gap-3">
              {role ? (
                <Link href={`/login?role=${role}`} className="hidden sm:block px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                  Sign in
                </Link>
              ) : (
                <button
                  onClick={() => setShowRolePicker(true)}
                  className="hidden sm:block px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                  aria-label="Sign in - choose your role"
                >
                  Sign in
                </button>
              )}
              <Link 
                href={withRoleParam("/register", role)} 
                className="!bg-white !text-[#111] border-2 border-[#111] px-4 py-2 rounded-lg font-medium text-sm hover:!bg-[#2563EB] hover:!text-white hover:border-[#2563EB] hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 ease-out transform hover:scale-105 active:scale-100"
              >
                Get Started Free
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              <RoleAwareNav isMobile onLinkClick={() => setMobileMenuOpen(false)} />
              <div className="pt-4 border-t border-slate-200 mt-4">
                {role ? (
                  <Link href={`/login?role=${role}`} className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium">
                    Sign in
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setShowRolePicker(true)
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Client-Focused Hero */}
      <RoleSection role="client" ssrRole={initialRole || 'client'}>
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 bg-white border-b border-slate-200" data-role="client">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <BackButton href="/" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111] tracking-tight mb-6 leading-tight">
                Hire Talent Fast.
                <br />
                <span className="text-[#111]">Zero Noise. Only Verified Workers.</span>
              </h1>

              <p className="text-lg lg:text-xl text-[#333] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                DevOps, Cloud, Networking, Security, AI, Data, SRE, DB & Programming — delivered by certified Indian professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  href={withRoleParam("/register?type=client", 'client')}
                  onClick={() => handleCTAClick('Hire a Worker', 'client')}
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#1E40AF] hover:!text-white hover:border-[#1E40AF] hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 ease-out transform hover:scale-105 active:scale-100"
                >
                  Hire a Worker
                </Button>
                <Button
                  href={withRoleParam("/workers", 'client')}
                  onClick={() => handleCTAClick('Browse Talent', 'client')}
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#1E40AF] hover:!text-white hover:border-[#1E40AF] hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 ease-out transform hover:scale-105 active:scale-100"
                >
                  Browse Talent
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#333]">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-600" />
                  Hire in under 1 hour
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-600" />
                  Replacement guarantee
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-600" />
                  Verified workers only
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* What You Can Do - Shared */}
      <RoleSection role="both">
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>High-Value Microtasks</h3>
              <p className="text-sm" style={{ color: '#ffffff' }}>
                CI/CD fixes, API debugging, cloud audits, security hardening. Premium technical tasks delivered fast.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>Complex Projects</h3>
              <p className="text-sm" style={{ color: '#ffffff' }}>
                Architecture refactoring, system migrations, AI/LLM implementations. Fixed price, clear timeline, expert delivery.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>Expert Consultation</h3>
              <p className="text-sm" style={{ color: '#ffffff' }}>
                Ongoing expert guidance and consultation. Part-time or full-time engagement with all compliance handled.
              </p>
            </div>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* High-Value Categories Grid */}
      <RoleSection role="client" ssrRole={initialRole || 'client'}>
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200" data-role="client">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
              High-Value Expert Categories
            </h2>
            <p className="text-lg text-[#333] max-w-2xl mx-auto">
              Hire verified, senior IT pros for high-value technical work.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIGH_VALUE_CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                      <Icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#111] mb-1 group-hover:text-sky-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[#333] mb-2">
                        {category.description}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {category.example} · {category.priceRange}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Client-Specific Modules */}
      <RoleSection role="client" ssrRole={initialRole || 'client'}>
        <HiringModelsSection role={role || initialRole || 'client'} onCTAClick={(name) => handleCTAClick(name, 'client')} />
        <AIJobWizardSection role={role || initialRole || 'client'} onCTAClick={(name) => handleCTAClick(name, 'client')} />
        <EscrowExplainerSection role={role || initialRole || 'client'} onCTAClick={(name) => handleCTAClick(name, 'client')} />
        <ClientTestimonialSection role={role || initialRole || 'client'} onCTAClick={(name) => handleCTAClick(name, 'client')} />
        <PricingSection role="client" />
        <PricingCTASection role={role || initialRole || 'client'} onCTAClick={(name) => handleCTAClick(name, 'client')} />
      </RoleSection>

      {/* Why 2ndShift - Shared */}
      <RoleSection role="both">
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
              Why choose 2ndShift?
            </h2>
            <p className="text-lg text-[#333] max-w-2xl mx-auto">
              We built the platform we wished existed. Here&apos;s what makes us different.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Shield, 
                title: 'Complete Compliance', 
                description: 'TDS, GST, Form 16A, professional contracts - all handled automatically. No legal worries.' 
              },
              { 
                icon: Lock, 
                title: 'Payment Protection', 
                description: 'Every payment secured in escrow. Workers get paid for completed work, clients pay only when satisfied.' 
              },
              { 
                icon: Star, 
                title: 'Two-Way Reviews', 
                description: 'Workers rate clients too. Know if they pay on time before you accept. Transparency for everyone.' 
              },
              { 
                icon: Zap, 
                title: 'Fast Matching', 
                description: 'Get matched with verified professionals in hours, not weeks.' 
              },
              { 
                icon: IndianRupee, 
                title: 'Fair Pricing', 
                description: 'Just 5-10% platform fee. No hidden charges. Transparent pricing for both sides.' 
              },
              { 
                icon: Heart, 
                title: 'Human Support', 
                description: 'Real people, not bots. WhatsApp, email, or call - we\'re here when you need help.' 
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
                <feature.icon className="w-10 h-10 text-sky-600 mb-4" />
                <h3 className="text-lg font-bold text-[#111] mb-2">{feature.title}</h3>
                <p className="text-[#333] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RoleSection>


      {/* CTA Section - Client-Specific */}
      <RoleSection role="client" ssrRole={initialRole || 'client'}>
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-800 relative" data-role="client">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            Ready to hire talent?
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto font-semibold" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            Join 2ndShift today. It&apos;s free to create an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={withRoleParam("/register?type=client", 'client')}
              onClick={() => handleCTAClick('Get Started Free', 'client')}
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#1E40AF] hover:!text-white hover:border-[#1E40AF] hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 ease-out transform hover:scale-105 active:scale-100"
            >
              Get Started Free
            </Button>
            <Button
              href={withRoleParam("/workers", 'client')}
              onClick={() => handleCTAClick('Browse Talent', 'client')}
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="!bg-white !text-[#111] border-2 border-[#111] hover:!bg-[#1E40AF] hover:!text-white hover:border-[#1E40AF] hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 ease-out transform hover:scale-105 active:scale-100"
            >
              Browse Talent
            </Button>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Footer */}
      <Footer />

      {/* Role Picker Modal */}
      <RolePickerModal
        isOpen={showRolePicker}
        onClose={() => setShowRolePicker(false)}
        onRoleSelected={() => setShowRolePicker(false)}
      />
      <RoleMismatchModal
        isOpen={showRoleMismatch}
        currentRole={role || 'worker'}
        attemptedRole="client"
        onClose={() => setShowRoleMismatch(false)}
        onSwitchRole={() => setRole('client', 'cta')}
      />
    </div>
  )
}

