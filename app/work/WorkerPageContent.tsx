'use client'

import Link from 'next/link'
import { 
  ArrowRight, Briefcase, Shield, CheckCircle, Users, 
  Zap, Lock, Star, Building2, Layers, Timer,
  Calendar, Coffee, Sparkles, Heart, IndianRupee,
  Mail, MapPin, Linkedin, Twitter, Target, Menu, X, ArrowUpRight
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRole } from '@/components/role/RoleContextProvider'
import { RoleToggle } from '@/components/role/RoleToggle'
import { RoleAwareNav } from '@/components/role/RoleAwareNav'
import { withRoleParam } from '@/lib/utils/roleAwareLinks'
import { trackRoleCTA } from '@/lib/analytics/roleEvents'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'
import { RoleSection } from '@/components/role/RoleSection'
import { 
  StarterPacksSection, 
  VerificationExplainerSection, 
  EarningsCalculatorSection,
  WorkerSuccessStoriesSection
} from '@/components/role/WorkerSpecificModules'

const SAMPLE_JOBS = [
  {
    title: 'React Native Developer',
    skills: ['React Native', 'TypeScript', 'Firebase'],
    budget: '₹40,000 - ₹60,000',
    duration: '2-3 weeks',
    type: 'Project',
    posted: 'Just now',
  },
  {
    title: 'UI/UX Designer',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    budget: '₹25,000 - ₹40,000',
    duration: '1-2 weeks',
    type: 'Project',
    posted: '1h ago',
  },
  {
    title: 'Backend Developer',
    skills: ['Node.js', 'PostgreSQL', 'AWS'],
    budget: '₹800 - ₹1,200/hr',
    duration: 'Ongoing',
    type: 'Part-time',
    posted: '2h ago',
  },
  {
    title: 'Full Stack Engineer',
    skills: ['React', 'Python', 'Docker'],
    budget: '₹1.2L - ₹1.8L/month',
    duration: '6+ months',
    type: 'Full-time',
    posted: '3h ago',
  },
]

export function WorkerPageContent({ initialRole }: { initialRole?: 'client' | 'worker' | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { role } = useRole()
  const isRoleEnabled = isRoleHomeEnabled()

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
              {isRoleEnabled && role && (
                <div className="hidden lg:block">
                  <RoleToggle variant="header" />
                </div>
              )}
              <Link href="/login" className="hidden sm:block px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                Sign in
              </Link>
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
              {isRoleEnabled && role && (
                <div className="mb-4 pb-4 border-b border-slate-200">
                  <RoleToggle variant="header" />
                </div>
              )}
              <RoleAwareNav isMobile onLinkClick={() => setMobileMenuOpen(false)} />
              <div className="pt-4 border-t border-slate-200 mt-4">
                <Link href="/login" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Worker-Focused Hero */}
      <RoleSection role="worker" ssrRole={initialRole || 'worker'}>
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 bg-white border-b border-slate-200" data-role="worker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <RoleToggle variant="hero" />
            </div>

            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111] tracking-tight mb-6 leading-tight">
                Earn from Anywhere.
                <br />
                <span className="text-[#111]">Build a Second Income with Skills You Already Have.</span>
              </h1>

              <p className="text-lg lg:text-xl text-[#333] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                Remote-friendly micro jobs & projects from real clients. No fake ratings. No false promises.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link 
                  href={withRoleParam("/register?type=worker", 'worker')}
                  onClick={() => handleCTAClick('Get Remote Work', 'worker')}
                  className="inline-flex items-center justify-center gap-2 bg-[#111] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#333] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Remote Work
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href={withRoleParam("/worker/discover", 'worker')}
                  onClick={() => handleCTAClick('Browse Jobs', 'worker')}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#111] px-8 py-4 rounded-lg font-semibold border-2 border-[#111] hover:bg-slate-50 transition-all"
                >
                  Browse Jobs
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#333]">
                <span className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-emerald-600" />
                  Paid within 24 hours
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Zero platform fees
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Verified clients only
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
              <h3 className="text-lg font-semibold text-white mb-2">Quick Tasks</h3>
              <p className="text-white text-sm">
                Logo design, bug fixes, content writing. Get small tasks done in hours, not days.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Project-Based</h3>
              <p className="text-white text-sm">
                App development, website redesign, marketing campaigns. Fixed price, clear timeline.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Full-Time Hire</h3>
              <p className="text-white text-sm">
                Need a dedicated team member? Hire full-time with all compliance handled.
              </p>
            </div>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Worker Opportunities Section */}
      <RoleSection role="worker" ssrRole={initialRole || 'worker'}>
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200" data-role="worker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 mb-3">
                <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
                Open Opportunities
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight">
                Work that fits your life
              </h2>
              <p className="text-[#333] mt-2">
                From quick gigs to full-time roles. Choose what works for you.
              </p>
            </div>
            <Link 
              href={withRoleParam("/worker/discover", 'worker')}
              className="inline-flex items-center gap-2 text-[#111] font-semibold hover:text-sky-600 transition-colors"
            >
              View all opportunities
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {SAMPLE_JOBS.map((job, i) => (
              <Link
                key={i}
                href={withRoleParam("/register?type=worker", 'worker')}
                onClick={() => handleCTAClick('Job Card', 'worker')}
                className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#111] group-hover:text-sky-600 transition-colors">
                        {job.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#333]">
                      <Timer className="w-3.5 h-3.5" />
                      <span>{job.duration}</span>
                      <span>•</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                    job.type === 'Full-time' 
                      ? 'text-purple-700 bg-purple-50 border border-purple-200'
                      : job.type === 'Part-time'
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : 'text-sky-700 bg-sky-50 border border-sky-200'
                  }`}>
                    {job.type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-lg font-semibold text-[#111]">{job.budget}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-[#333] mb-4">
              Sign up free to see company details and apply to opportunities
            </p>
            <Link
              href={withRoleParam("/register?type=worker", 'worker')}
              onClick={() => handleCTAClick('Create Free Account', 'worker')}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Worker-Specific Modules */}
      <RoleSection role="worker" ssrRole={initialRole || 'worker'}>
        <StarterPacksSection role={role || initialRole || 'worker'} onCTAClick={(name) => handleCTAClick(name, 'worker')} />
        <VerificationExplainerSection role={role || initialRole || 'worker'} onCTAClick={(name) => handleCTAClick(name, 'worker')} />
        <EarningsCalculatorSection role={role || initialRole || 'worker'} onCTAClick={(name) => handleCTAClick(name, 'worker')} />
        <WorkerSuccessStoriesSection role={role || initialRole || 'worker'} onCTAClick={(name) => handleCTAClick(name, 'worker')} />
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
                title: 'EarlyPay Access', 
                description: 'Workers can access earned money before project completion. Because you shouldn\'t wait to get paid.' 
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

      {/* How It Works - Shared */}
      <RoleSection role="both">
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
                title: 'Create free account',
                description: 'Sign up in 2 minutes. Add your skills or post your requirement.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Get matched',
                description: 'Our AI finds the best matches. Review profiles, chat, and decide.',
                icon: Target,
              },
              {
                step: '03',
                title: 'Start working',
                description: 'Agree on terms, we handle the paperwork. Get work done.',
                icon: Zap,
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-slate-600 mb-4">{item.step}</div>
                <div className="w-14 h-14 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-sky-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RoleSection>

      {/* CTA Section - Worker-Specific */}
      <RoleSection role="worker" ssrRole={initialRole || 'worker'}>
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-800" data-role="worker">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Ready to get started?
          </h2>
          <p className="text-lg text-white/95 mb-10 max-w-2xl mx-auto font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            Join 2ndShift today. It&apos;s free to create an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={withRoleParam("/register?type=worker", 'worker')}
              onClick={() => handleCTAClick('I want to earn', 'worker')}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#111] px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href={withRoleParam("/worker/discover", 'worker')}
              onClick={() => handleCTAClick('Browse Jobs', 'worker')}
              className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 transition-all shadow-lg hover:shadow-xl"
            >
              Browse Jobs
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
              <h4 className="font-bold text-[#111] mb-4">For Professionals</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/for-workers" className="text-[#333] hover:text-[#111] transition-colors">Why 2ndShift</Link></li>
                <li><Link href={withRoleParam("/worker/discover", 'worker')} className="text-[#333] hover:text-[#111] transition-colors">Find Work</Link></li>
                <li><Link href="/features" className="text-[#333] hover:text-[#111] transition-colors">How Shifts Work</Link></li>
                <li><Link href="/pricing" className="text-[#333] hover:text-[#111] transition-colors">Pricing</Link></li>
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
    </div>
  )
}

