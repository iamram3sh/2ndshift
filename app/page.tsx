'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Professional Conversion-Focused */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Hero CTAs - Single Source of Role Selection - Always show on homepage */}
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111] tracking-tight mb-6 leading-tight">
                Hire verified, senior IT pros for high-value technical work.
              </h1>
              <p className="text-lg lg:text-xl text-[#333] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                DevOps, Cloud, Networking, Security, AI, Data, SRE, DB & Programming — delivered by certified Indian professionals.
              </p>

              {/* CTAs - Only two buttons, no sign-in form */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 justify-center mb-8">
                <Link 
                  href="/work?role=worker"
                  onClick={(e) => {
                    handleCTAClick('I want to work', 'worker')
                    setRole('worker', 'hero')
                    // Let Next.js Link handle navigation - don't prevent default
                  }}
                  aria-label="I want to work — show worker signup"
                  className="inline-flex items-center justify-center gap-2 bg-[#0b63ff] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0a56e6] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  I want to work
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/clients?role=client"
                  onClick={(e) => {
                    handleCTAClick('I want to hire', 'client')
                    setRole('client', 'hero')
                    // Let Next.js Link handle navigation - don't prevent default
                  }}
                  aria-label="I want to hire — show client signup"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-[#0b1220] px-8 py-4 rounded-lg font-semibold border-2 border-[#0b1220] hover:bg-[#0b1220] hover:text-white transition-all"
                >
                  I want to hire
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <RoleSection role="both">
      <section className="py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-sm font-medium text-[#333]">
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
              Verified Professionals
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#333]">
              <Award className="w-5 h-5 text-sky-600" />
              Certifications Validated
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#333]">
              <Shield className="w-5 h-5 text-purple-600" />
              Secure Escrow Protection
            </div>
          </div>
        </div>
      </section>
      </RoleSection>

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
                      <p className="text-xs text-slate-600 mt-1">
                        Commission: 8-18% based on complexity
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


      {/* Featured Experts Carousel */}
      <RoleSection role="both">
      <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
              Featured Experts
            </h2>
            <p className="text-lg text-[#333] max-w-2xl mx-auto">
              Verified senior professionals ready to deliver high-value technical work
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Rajesh Kumar',
                title: 'Senior DevOps Engineer',
                skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
                rating: 4.9,
                verified: true,
                rate: '₹1,500/hr',
                badge: 'DevOps Expert'
              },
              {
                name: 'Priya Sharma',
                title: 'Cloud Architect',
                skills: ['AWS', 'Azure', 'GCP', 'Serverless'],
                rating: 4.8,
                verified: true,
                rate: '₹2,000/hr',
                badge: 'Cloud Expert'
              },
              {
                name: 'Amit Patel',
                title: 'Senior Backend Engineer',
                skills: ['Python', 'Java', 'Golang', 'Microservices'],
                rating: 4.9,
                verified: true,
                rate: '₹1,800/hr',
                badge: 'Programming Expert'
              },
              {
                name: 'Sneha Reddy',
                title: 'Cybersecurity Specialist',
                skills: ['Penetration Testing', 'Security Audit', 'Compliance'],
                rating: 4.9,
                verified: true,
                rate: '₹2,200/hr',
                badge: 'Security Expert'
              },
              {
                name: 'Vikram Singh',
                title: 'AI/LLM Engineer',
                skills: ['RAG', 'Vector DB', 'LLM Fine-tuning', 'OpenAI'],
                rating: 4.8,
                verified: true,
                rate: '₹2,500/hr',
                badge: 'AI Expert'
              },
              {
                name: 'Deepa Joshi',
                title: 'Data Engineering Lead',
                skills: ['ETL', 'Spark', 'Kafka', 'Data Warehousing'],
                rating: 4.9,
                verified: true,
                rate: '₹2,000/hr',
                badge: 'Data Expert'
              }
            ].map((expert, i) => (
              <div
                key={i}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-semibold">
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#111]">{expert.name}</h3>
                        {expert.verified && (
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-sm text-[#333]">{expert.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-[#111]">{expert.rating}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium text-sky-700 bg-sky-50 rounded-md mb-2">
                    {expert.badge}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {expert.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-lg font-semibold text-[#111]">{expert.rate}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/workers"
              className="inline-flex items-center gap-2 text-[#111] font-semibold hover:text-sky-600 transition-colors"
            >
              View All Experts
              <ArrowRight className="w-4 h-4" />
            </Link>
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


      {/* CTA Section - Worker */}
      <RoleSection role="worker">
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-800 relative" data-role="worker">
        {/* Removed dark overlay - background is already dark enough */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            Ready to start earning?
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto font-semibold" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
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
        {/* Removed dark overlay - background is already dark enough */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            Ready to hire talent?
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto font-semibold" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
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
