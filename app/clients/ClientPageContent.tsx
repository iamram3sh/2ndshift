'use client'

import Link from 'next/link'
import { 
  ArrowRight, Briefcase, Shield, CheckCircle, Users, 
  Zap, Lock, Star, Building2, Layers, Timer,
  Calendar, Coffee, Sparkles, Heart, IndianRupee,
  Mail, MapPin, Linkedin, Twitter, Target, Menu, X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '@/components/role/RoleContextProvider'
import { RolePickerModal } from '@/components/auth/RolePickerModal'
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

export function ClientPageContent({ initialRole }: { initialRole?: 'client' | 'worker' | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showRolePicker, setShowRolePicker] = useState(false)
  const router = useRouter()
  const { role, setRole } = useRole()
  const isRoleEnabled = isRoleHomeEnabled()

  // Enforce client role - redirect if mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isRoleEnabled) return

    const currentRole = role || initialRole
    if (currentRole && currentRole !== 'client') {
      // Role mismatch - redirect to home with correct role
      router.push(`/?role=${currentRole}`)
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
                className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-all shadow-sm"
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
                <Link 
                  href={withRoleParam("/register?type=client", 'client')}
                  onClick={() => handleCTAClick('Hire a Worker', 'client')}
                  className="inline-flex items-center justify-center gap-2 bg-[#111] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#333] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Hire a Worker
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href={withRoleParam("/workers", 'client')}
                  onClick={() => handleCTAClick('Browse Talent', 'client')}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#111] px-8 py-4 rounded-lg font-semibold border-2 border-[#111] hover:bg-slate-50 transition-all"
                >
                  Browse Talent
                  <ArrowRight className="w-5 h-5" />
                </Link>
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
              <h3 className="text-lg font-semibold text-white mb-2">High-Value Microtasks</h3>
              <p className="text-white text-sm">
                CI/CD fixes, API debugging, cloud audits, security hardening. Premium technical tasks delivered fast.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Complex Projects</h3>
              <p className="text-white text-sm">
                Architecture refactoring, system migrations, AI/LLM implementations. Fixed price, clear timeline, expert delivery.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Consultation</h3>
              <p className="text-white text-sm">
                Ongoing expert guidance and consultation. Part-time or full-time engagement with all compliance handled.
              </p>
            </div>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Client Opportunities Section */}
      <RoleSection role="client" ssrRole={initialRole || 'client'}>
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200" data-role="client">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
              Ready to hire talent?
            </h2>
            <p className="text-[#333] text-lg">
              Post your first job and get proposals from verified professionals.
            </p>
          </div>
          <div className="text-center">
            <Link
              href={withRoleParam("/projects/create", 'client')}
              onClick={() => handleCTAClick('Post a Job', 'client')}
              className="inline-flex items-center gap-2 bg-[#111] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#333] transition-all shadow-lg hover:shadow-xl"
            >
              Post Your First Job
              <ArrowRight className="w-5 h-5" />
            </Link>
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

      {/* Simple Process - Client Only */}
      <SimpleProcessClient />

      {/* CTA Section - Client-Specific */}
      <RoleSection role="client" ssrRole={initialRole || 'client'}>
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-800" data-role="client">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Ready to hire talent?
          </h2>
          <p className="text-lg text-white/95 mb-10 max-w-2xl mx-auto font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            Join 2ndShift today. It&apos;s free to create an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={withRoleParam("/register?type=client", 'client')}
              onClick={() => handleCTAClick('I want to hire', 'client')}
              className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href={withRoleParam("/workers", 'client')}
              onClick={() => handleCTAClick('Browse Talent', 'client')}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#111] px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Browse Talent
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-[#111]">2ndShift</span>
              </Link>
              <p className="text-sm text-[#333] mb-4">
                Work on your terms.<br />Get paid with confidence.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[#333] hover:bg-slate-200 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[#333] hover:bg-slate-200 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#111] mb-4">For Employers</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/employers" className="text-[#333] hover:text-[#111] transition-colors">Why 2ndShift</Link></li>
                <li><Link href={withRoleParam("/workers", 'client')} className="text-[#333] hover:text-[#111] transition-colors">Find Talent</Link></li>
                <li><Link href="/features" className="text-[#333] hover:text-[#111] transition-colors">How It Works</Link></li>
                <li><Link href="/about" className="text-[#333] hover:text-[#111] transition-colors">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#111] mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms" className="text-[#333] hover:text-[#111] transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="text-[#333] hover:text-[#111] transition-colors">Privacy</Link></li>
                <li><Link href="/security" className="text-[#333] hover:text-[#111] transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#111] mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-[#333]">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  hello@2ndshift.in
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Hyderabad, India
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#333]">
              © 2025 2ndShift. All rights reserved.
            </p>
            <p className="text-sm text-[#333]">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>

      {/* Role Picker Modal */}
      <RolePickerModal
        isOpen={showRolePicker}
        onClose={() => setShowRolePicker(false)}
        onRoleSelected={() => setShowRolePicker(false)}
      />
    </div>
  )
}

