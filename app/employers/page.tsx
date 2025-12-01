'use client'

import Link from 'next/link'
import { 
  ArrowRight, Shield, Clock, Users, CheckCircle, BadgeCheck, 
  Zap, TrendingUp, FileText, DollarSign, Building2, Star,
  Play, ChevronRight, Layers, Menu, X, Award, Target,
  Briefcase, Lock, CreditCard, Headphones, BarChart3, Globe
} from 'lucide-react'
import { useState } from 'react'

const CASE_STUDIES = [
  {
    company: 'TechScale Solutions',
    logo: 'TS',
    industry: 'FinTech',
    challenge: 'Needed to scale engineering team from 5 to 25 in 3 months for a product launch.',
    solution: 'Used 2ndShift to hire 20 verified developers with automatic compliance handling.',
    results: [
      { metric: '40%', label: 'Cost savings vs agencies' },
      { metric: '2 weeks', label: 'Time to first hire' },
      { metric: '100%', label: 'Compliance handled' },
    ],
    quote: '"2ndShift made scaling our team incredibly simple. No compliance headaches, just results."',
    author: 'Vikram Mehta, CTO',
  },
  {
    company: 'DataFirst Analytics',
    logo: 'DF',
    industry: 'Data & AI',
    challenge: 'Required specialized data scientists for a 6-month project without permanent hiring.',
    solution: 'Engaged 5 data scientists through 2ndShift with milestone-based contracts.',
    results: [
      { metric: '₹18L', label: 'Saved vs hiring' },
      { metric: '5 experts', label: 'Onboarded in 10 days' },
      { metric: '98%', label: 'Project success rate' },
    ],
    quote: '"The quality of professionals and the compliance automation exceeded our expectations."',
    author: 'Priya Sharma, VP Engineering',
  },
  {
    company: 'CloudNine SaaS',
    logo: 'CN',
    industry: 'Enterprise SaaS',
    challenge: 'Needed DevOps expertise for cloud migration without long-term commitments.',
    solution: 'Hired 3 DevOps architects through 2ndShift on 4-month contracts.',
    results: [
      { metric: '60%', label: 'Faster migration' },
      { metric: 'Zero', label: 'Compliance issues' },
      { metric: '₹25L', label: 'Infrastructure savings' },
    ],
    quote: '"Professional, compliant, and efficient. Exactly what enterprise clients need."',
    author: 'Rahul Gupta, Head of Infrastructure',
  },
]

const FEATURES = [
  {
    icon: BadgeCheck,
    title: 'Pre-Vetted Professionals',
    description: 'All professionals go through skill assessments, background checks, and identity verification.',
  },
  {
    icon: Shield,
    title: 'Full Compliance Handled',
    description: 'Automatic TDS deduction, GST invoicing, contracts, and Form 16A. Zero paperwork for you.',
  },
  {
    icon: Clock,
    title: 'Hire in 48 Hours',
    description: 'Post a project and receive proposals from verified professionals within hours.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Escrow-protected payments. Pay only when milestones are completed to your satisfaction.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Enterprise clients get a dedicated account manager for seamless hiring experience.',
  },
  {
    icon: BarChart3,
    title: 'Transparent Pricing',
    description: 'No hidden fees. Clear breakdown of all costs including taxes and platform fees upfront.',
  },
]

const COMPARISON = [
  { feature: 'Time to hire', traditional: '4-6 weeks', agency: '2-3 weeks', '2ndshift': '48 hours' },
  { feature: 'Compliance handling', traditional: 'Manual', agency: 'Partial', '2ndshift': 'Automatic' },
  { feature: 'Cost', traditional: 'High salary + benefits', agency: '20-30% markup', '2ndshift': 'Pay per project' },
  { feature: 'Flexibility', traditional: 'Long-term only', agency: 'Limited', '2ndshift': 'Fully flexible' },
  { feature: 'Quality assurance', traditional: 'Interviews only', agency: 'Varies', '2ndshift': 'Verified + rated' },
  { feature: 'Risk', traditional: 'High (bad hire)', agency: 'Medium', '2ndshift': 'Low (escrow + ratings)' },
]

const LOGOS = [
  { name: 'TechCorp', initial: 'TC' },
  { name: 'FinanceHub', initial: 'FH' },
  { name: 'DataDriven', initial: 'DD' },
  { name: 'CloudFirst', initial: 'CF' },
  { name: 'SecureNet', initial: 'SN' },
  { name: 'ScaleUp', initial: 'SU' },
]

export default function EmployersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState(0)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-slate-900">2ndShift</span>
              </Link>
              
              <div className="hidden lg:flex items-center gap-1">
                <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  Browse Jobs
                </Link>
                <Link href="/workers" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  Find Talent
                </Link>
                <Link href="/employers" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                  For Employers
                </Link>
                <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Sign in
              </Link>
              <Link 
                href="/register?type=client" 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              For Employers & Enterprises
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight">
              Scale your team without the compliance headaches
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Access 5,000+ verified professionals. Automatic TDS, contracts, and payments. 
              Focus on building — we handle everything else.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/register?type=client"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3.5 rounded-xl font-medium hover:bg-slate-100 transition-all"
              >
                Post Your First Project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/workers"
                className="inline-flex items-center gap-2 text-white px-6 py-3.5 rounded-xl font-medium border border-slate-600 hover:bg-slate-800 transition-all"
              >
                Browse Talent
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                100% Compliant
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Hire in 48hrs
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                Verified Talent
              </span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Secure Payments
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Bar */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 mb-8">
            TRUSTED BY 500+ COMPANIES ACROSS INDIA
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {LOGOS.map((company, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                  {company.initial}
                </div>
                <span className="font-medium">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Everything you need to hire confidently
            </h2>
            <p className="text-lg text-slate-600">
              We&apos;ve built the infrastructure so you can focus on what matters — your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Why companies choose 2ndShift
            </h2>
            <p className="text-lg text-slate-600">
              Compare us with traditional hiring and staffing agencies.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500">Traditional Hiring</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500">Staffing Agency</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 bg-emerald-50">2ndShift</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{row.traditional}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{row.agency}</td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-600 text-center bg-emerald-50/50">
                      {row['2ndshift']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Success stories from our clients
            </h2>
            <p className="text-lg text-slate-600">
              See how companies are scaling their teams with 2ndShift.
            </p>
          </div>

          {/* Case Study Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {CASE_STUDIES.map((study, i) => (
              <button
                key={i}
                onClick={() => setSelectedCase(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  selectedCase === i
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                  selectedCase === i ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {study.logo}
                </div>
                <div className="text-left">
                  <div className="font-medium">{study.company}</div>
                  <div className={`text-xs ${selectedCase === i ? 'text-slate-300' : 'text-slate-500'}`}>
                    {study.industry}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Case Study */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium mb-6">
                  Case Study
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                  {CASE_STUDIES[selectedCase].challenge}
                </h3>
                <p className="text-slate-600 mb-6">
                  <strong>Solution:</strong> {CASE_STUDIES[selectedCase].solution}
                </p>
                
                <div className="p-6 bg-slate-50 rounded-xl border-l-4 border-slate-900 mb-6">
                  <p className="text-slate-700 italic mb-4">
                    {CASE_STUDIES[selectedCase].quote}
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    — {CASE_STUDIES[selectedCase].author}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-6">Results</h4>
                <div className="grid gap-4">
                  {CASE_STUDIES[selectedCase].results.map((result, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                      <div className="text-3xl font-bold text-emerald-600">{result.metric}</div>
                      <div className="text-slate-700">{result.label}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/register?type=client"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium mt-8 hover:bg-slate-800 transition-all"
                >
                  Get Similar Results
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
            Ready to scale your team?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join 500+ companies hiring compliant contract talent on 2ndShift.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=client"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-medium hover:bg-slate-100 transition-all"
            >
              Post Your First Project - Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-medium border border-slate-700 hover:bg-slate-800 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-slate-500">
            No credit card required. Post unlimited projects.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">2ndShift</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
              <Link href="/workers" className="hover:text-slate-900 transition-colors">For Professionals</Link>
              <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
              <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-slate-500">© 2025 2ndShift Technologies</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
