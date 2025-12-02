'use client'

import Link from 'next/link'
import { 
  ArrowRight, Briefcase, Shield, CheckCircle, Users, TrendingUp, 
  Award, Star, Zap, Lock, FileCheck, ChevronRight, Mail, Phone, 
  MapPin, Linkedin, Twitter, ArrowUpRight, Target, Building2, 
  Globe, Clock, BadgeCheck, Play, ChevronDown, Menu, X, 
  BarChart3, CreditCard, FileText, Headphones, Layers, Timer,
  Wallet, Calendar, Coffee, Sparkles, Heart, IndianRupee
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRole } from '@/components/role/RoleContextProvider'
import { WORKER_QUICK_TASKS, CLIENT_QUICK_PACKS } from '@/data/highValueTasks'
import { RoleSection } from '@/components/role/RoleSection'
import { RoleAwareNav } from '@/components/role/RoleAwareNav'
import { withRoleParam } from '@/lib/utils/roleAwareLinks'
import { trackRoleCTA } from '@/lib/analytics/roleEvents'
import { isRoleHomeEnabled } from '@/lib/role/feature-flag'
import { HIGH_VALUE_CATEGORIES } from '@/lib/constants/highValueCategories'
import { RolePickerModal } from '@/components/auth/RolePickerModal'

// What makes us different
const VALUE_PROPS = [
  { icon: Shield, label: 'TDS & GST Handled' },
  { icon: Lock, label: 'Secure Escrow Payments' },
  { icon: Clock, label: 'Flexible: Hourly to Full-time' },
  { icon: Star, label: 'Verified Professionals' },
]

const SAMPLE_JOBS = [
  {
    title: 'API Memory Leak Debugging',
    skills: ['Backend', 'Performance', 'Debugging'],
    budget: '₹8,000 - ₹20,000',
    duration: '3-7 days',
    type: 'High-Value Task',
    posted: 'Just now',
  },
  {
    title: 'AWS Security Audit',
    skills: ['AWS', 'Security', 'IAM'],
    budget: '₹15,000 - ₹35,000',
    duration: '1-4 weeks',
    type: 'High-Value Task',
    posted: '1h ago',
  },
  {
    title: 'CI/CD Pipeline Fix',
    skills: ['Jenkins', 'GitHub Actions', 'Docker'],
    budget: '₹5,000 - ₹15,000',
    duration: '3-7 days',
    type: 'High-Value Task',
    posted: '2h ago',
  },
  {
    title: 'Database Query Optimization',
    skills: ['PostgreSQL', 'MySQL', 'Optimization'],
    budget: '₹12,000 - ₹30,000',
    duration: '3-7 days',
    type: 'High-Value Task',
    posted: '3h ago',
  },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showRolePicker, setShowRolePicker] = useState(false)
  const { role, setRole } = useRole()
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
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900 tracking-tight">
                2ndShift
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <RoleAwareNav />
            </div>

            {/* CTA Buttons */}
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

        {/* Mobile Menu */}
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

      {/* Hero Section - Professional Conversion-Focused */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Hero CTAs - Single Source of Role Selection */}
            {!isRoleEnabled || role === null ? (
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111] tracking-tight mb-6 leading-tight">
                  Work on Your Terms.
                  <br />
                  <span className="text-[#111]">Get Paid with Confidence.</span>
                </h1>
                <p className="text-lg lg:text-xl text-[#333] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                  DevOps, Cloud, Networking, Security, AI, Data, SRE, DB & Programming — delivered by certified Indian professionals.
                </p>

                {/* CTAs - Single Source */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 justify-center mb-8">
                  <Link 
                    href="/work?role=worker"
                    onClick={() => {
                      handleCTAClick('I want to work', 'worker')
                      setRole('worker', 'hero')
                    }}
                    aria-label="I want to work — show worker signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#0b63ff] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0a56e6] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    I want to work
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/clients?role=client"
                    onClick={() => {
                      handleCTAClick('I want to hire', 'client')
                      setRole('client', 'hero')
                    }}
                    aria-label="I want to hire — show client signup"
                    className="inline-flex items-center justify-center gap-2 bg-transparent text-[#0b1220] px-8 py-4 rounded-lg font-semibold border-2 border-[#0b1220] hover:bg-[#0b1220] hover:text-white transition-all"
                  >
                    I want to hire
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Worker-Focused Hero */}
            <RoleSection role="worker" sectionId="hero-worker" fallback={null}>
            {(
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111] tracking-tight mb-6 leading-tight">
                  Earn from Anywhere.
                  <br />
                  <span className="text-[#111]">Build a Second Income with Skills You Already Have.</span>
                </h1>

                <p className="text-lg lg:text-xl text-[#333] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                  DevOps, Cloud, Networking, Security, AI, Data, SRE, DB & Programming — delivered by certified Indian professionals.
                </p>

                {/* CTAs - Single Source */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 justify-center mb-8">
                  <Link 
                    href="/work?role=worker"
                    onClick={() => {
                      handleCTAClick('I want to work', 'worker')
                      setRole('worker', 'hero')
                    }}
                    aria-label="I want to work — show worker signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#0b63ff] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0a56e6] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    I want to work
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/clients?role=client"
                    onClick={() => {
                      handleCTAClick('I want to hire', 'client')
                      setRole('client', 'hero')
                    }}
                    aria-label="I want to hire — show client signup"
                    className="inline-flex items-center justify-center gap-2 bg-transparent text-[#0b1220] px-8 py-4 rounded-lg font-semibold border-2 border-[#0b1220] hover:bg-[#0b1220] hover:text-white transition-all"
                  >
                    I want to hire
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#333]">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Paid within 24 hours
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Zero platform fees
                  </span>
                  <span className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    Verified clients only
                  </span>
                </div>
              </div>
            )}
            </RoleSection>

            {/* Client-Focused Hero */}
            <RoleSection role="client" sectionId="hero-client">
            {(
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111] tracking-tight mb-6 leading-tight">
                  Hire Talent Fast.
                  <br />
                  <span className="text-[#111]">Zero Noise. Only Verified Workers.</span>
                </h1>

                <p className="text-lg lg:text-xl text-[#333] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                  DevOps, Cloud, Networking, Security, AI, Data, SRE, DB & Programming — delivered by certified Indian professionals.
                </p>

                {/* CTAs - Single Source */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 justify-center mb-8">
                  <Link 
                    href="/clients?role=client"
                    onClick={() => {
                      handleCTAClick('I want to hire', 'client')
                      setRole('client', 'hero')
                    }}
                    aria-label="I want to hire — show client signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#0b63ff] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0a56e6] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    I want to hire
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/work?role=worker"
                    onClick={() => {
                      handleCTAClick('I want to work', 'worker')
                      setRole('worker', 'hero')
                    }}
                    aria-label="I want to work — show worker signup"
                    className="inline-flex items-center justify-center gap-2 bg-transparent text-[#0b1220] px-8 py-4 rounded-lg font-semibold border-2 border-[#0b1220] hover:bg-[#0b1220] hover:text-white transition-all"
                  >
                    I want to work
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Trust Indicators */}
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
                    <BadgeCheck className="w-4 h-4 text-sky-600" />
                    Verified workers only
                  </span>
                </div>
              </div>
            )}
            </RoleSection>
          </div>
        </div>
      </section>

      {/* High-Value Categories */}
      <RoleSection role="both">
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
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

      {/* High-Value Microtasks */}
      <RoleSection role="both">
      <section className="py-16 bg-slate-900 border-t border-slate-800 relative">
        <div className="absolute inset-0 bg-[rgba(2,6,23,0.55)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              High-Value Technical Work
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              Premium microtasks across 9 expert categories. Complex technical challenges that require senior-level expertise.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>High-Value Microtasks</h3>
              <p className="text-white text-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                {role === 'worker' 
                  ? 'CI/CD fixes, API debugging, cloud audits, security hardening. Premium microtasks that showcase expertise.'
                  : 'DevOps fixes, cloud audits, security reviews, performance optimization. Get expert solutions fast.'
                }
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
                Need ongoing expert guidance? Hire senior professionals part-time or full-time with all compliance handled.
              </p>
            </div>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Live Opportunities - Worker View */}
      <RoleSection role="worker" sectionId="opportunities-worker">
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 mb-3">
                <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
                Open Opportunities
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight">
                High-value microtasks
              </h2>
              <p className="text-[#333] mt-2">
                Premium technical tasks across DevOps, Cloud, Security, AI, Programming, and more.
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

          {/* Jobs Grid */}
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
                    job.type === 'High-Value Task'
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : job.type === 'Project'
                      ? 'text-purple-700 bg-purple-50 border border-purple-200'
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

          {/* Sign Up CTA */}
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

      {/* Live Opportunities - Client View */}
      <RoleSection role="client" sectionId="opportunities-client">
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
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

      {/* Two-Column Value Prop - Worker */}
      <RoleSection role="worker">
      <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200" data-role="worker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 lg:p-10 rounded-2xl border border-slate-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                For Professionals
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-[#111] mb-4">
                Use your skills.
                <br />
                <span className="text-sky-600">Earn on your terms.</span>
              </h3>
              <p className="text-[#333] mb-8">
                Turn your free time into income. Work on projects you love, 
                with clients who value your expertise.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { label: 'Work when you want', desc: 'Evening, weekends, or full-time - you decide' },
                  { label: 'Get paid securely', desc: 'Escrow protection ensures you always get paid' },
                  { label: 'No tax headaches', desc: 'TDS handled, Form 16A provided automatically' },
                  { label: 'Build your reputation', desc: 'Verified reviews help you land better projects' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-[#111]">{item.label}</div>
                      <div className="text-sm text-[#333]">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link 
                href={withRoleParam("/register?type=worker", 'worker')}
                onClick={() => handleCTAClick('Start Earning', 'worker')}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-all"
              >
                Start Earning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-slate-900 p-8 lg:p-10 rounded-2xl text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Why Choose 2ndShift
              </div>

              <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
                Get paid faster.
                <br />
                <span className="text-sky-400">Zero fees.</span>
              </h3>
              <p className="text-white mb-8">
                We built the platform for workers. No platform fees, 
                instant payments, and all compliance handled.
              </p>

              <ul className="space-y-4">
                {[
                  { label: 'Paid within 24 hours', desc: 'Get your money fast, no waiting' },
                  { label: 'Zero platform fees', desc: 'Keep 100% of what you earn' },
                  { label: 'EarlyPay access', desc: 'Access earned money before project completion' },
                  { label: 'Verified clients', desc: 'Work with trusted businesses only' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-white">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Two-Column Value Prop - Client */}
      <RoleSection role="client">
      <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200" data-role="client">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-8 lg:p-10 rounded-2xl text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                For Businesses
              </div>

              <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
                Get work done.
                <br />
                <span className="text-sky-400">Stay within budget.</span>
              </h3>
              <p className="text-white mb-8">
                From one-time tasks to building your dream team. 
                Find the right talent without the recruitment overhead.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { label: 'Find talent in hours', desc: 'Browse verified professionals, hire same day' },
                  { label: 'Flexible engagement', desc: 'Project, part-time, or full-time - your choice' },
                  { label: 'Zero compliance burden', desc: 'We handle TDS, GST, contracts - everything' },
                  { label: 'Pay only for results', desc: 'Escrow ensures you pay only when satisfied' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-white">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link 
                href={withRoleParam("/register?type=client", 'client')}
                onClick={() => handleCTAClick('Post a Requirement', 'client')}
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-100 transition-all"
              >
                Post a Requirement
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-8 lg:p-10 rounded-2xl border border-slate-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                Why Choose 2ndShift
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-[#111] mb-4">
                All compliance handled.
                <br />
                <span className="text-sky-600">Zero paperwork.</span>
              </h3>
              <p className="text-[#333] mb-8">
                We handle TDS, GST, contracts, and all legal requirements. 
                You focus on getting work done.
              </p>

              <ul className="space-y-4">
                {[
                  { label: 'Automatic TDS deduction', desc: 'We handle all tax compliance' },
                  { label: 'Professional contracts', desc: 'Legally binding agreements included' },
                  { label: 'Payment protection', desc: 'Escrow ensures quality work' },
                  { label: 'Replacement guarantee', desc: 'Not satisfied? We find a replacement' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-[#111]">{item.label}</div>
                      <div className="text-sm text-[#333]">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* Why 2ndShift */}
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

      {/* How It Works */}
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

      {/* Future Vision */}
      <RoleSection role="both">
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Our Vision
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-6">
            The future of work in India
          </h2>
          
          <p className="text-lg text-[#333] mb-8 leading-relaxed">
            We believe everyone deserves the freedom to work on their own terms. 
            Whether you&apos;re a developer coding on weekends, a designer exploring freelance, 
            or a company looking for the perfect hire - 2ndShift is building the platform 
            that makes it seamless, compliant, and fair for everyone.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-[#333] font-medium">
              🎯 Skill-based matching
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-[#333] font-medium">
              🛡️ Payment protection
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-[#333] font-medium">
              📋 Full compliance
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-[#333] font-medium">
              ⭐ Trust & transparency
            </div>
          </div>

          <Link
            href={withRoleParam("/register", role)}
            onClick={() => role && handleCTAClick('Join Early Access', role)}
            className="inline-flex items-center gap-2 bg-[#111] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#333] transition-all shadow-lg hover:shadow-xl"
          >
            Join Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <p className="text-sm text-[#333] mt-4">
            Free to join. First 100 users get lifetime benefits.
          </p>
        </div>
      </section>
      </RoleSection>

      {/* CTA Section - Worker */}
      <RoleSection role="worker">
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-800 relative" data-role="worker">
        <div className="absolute inset-0 bg-[rgba(2,6,23,0.6)]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Ready to start earning?
          </h2>
          <p className="text-lg text-white mb-10 max-w-2xl mx-auto font-semibold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            Join 2ndShift today. It&apos;s free to create an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/worker?role=worker"
              onClick={() => {
                handleCTAClick('Get Started Free', 'worker')
                setRole('worker', 'hero')
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0b1220] px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/worker/discover?role=worker"
              onClick={() => {
                handleCTAClick('Browse Jobs', 'worker')
                setRole('worker', 'hero')
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0b1220] px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* CTA Section - Client */}
      <RoleSection role="client">
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-800 relative" data-role="client">
        <div className="absolute inset-0 bg-[rgba(2,6,23,0.6)]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Ready to hire talent?
          </h2>
          <p className="text-lg text-white mb-10 max-w-2xl mx-auto font-semibold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            Join 2ndShift today. It&apos;s free to create an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/client?role=client"
              onClick={() => {
                handleCTAClick('Get Started Free', 'client')
                setRole('client', 'hero')
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0b1220] px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/workers?role=client"
              onClick={() => {
                handleCTAClick('Browse Talent', 'client')
                setRole('client', 'hero')
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0b1220] px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
            >
              Browse Talent
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </RoleSection>

      {/* CTA Section - No Role Selected */}
      <RoleSection role="both" fallback={
        <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-800 relative">
          <div className="absolute inset-0 bg-[rgba(2,6,23,0.6)]"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Ready to get started?
            </h2>
            <p className="text-lg text-white mb-10 max-w-2xl mx-auto font-semibold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              Choose your path above to see personalized content.
            </p>
          </div>
        </section>
      }>
        <div></div>
      </RoleSection>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
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

            {/* Links */}
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

          {/* Bottom */}
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
