'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, CheckCircle, Shield, Clock, Users, Building2, 
  Briefcase, FileText, CreditCard, BadgeCheck, Star, Zap,
  Layers, UserPlus, Search, Send, Handshake, DollarSign,
  Play, ChevronRight, Target, Award, Lock
} from 'lucide-react'

const WORKER_STEPS = [
  {
    step: 1,
    title: 'Create Your Profile',
    description: 'Sign up in 2 minutes. Add your skills, experience, portfolio, and set your hourly rate. Upload your resume for better visibility.',
    icon: UserPlus,
    details: [
      'Fill in your professional details',
      'Add skills and certifications',
      'Set your availability and rate',
      'Upload portfolio samples',
    ],
    time: '5 minutes',
  },
  {
    step: 2,
    title: 'Get Verified',
    description: 'Our team verifies your identity, skills, and background. This builds trust with clients and unlocks premium opportunities.',
    icon: BadgeCheck,
    details: [
      'Identity verification (Aadhaar/PAN)',
      'Skills assessment (optional)',
      'Background check',
      'Receive "Verified" badge',
    ],
    time: '24-48 hours',
  },
  {
    step: 3,
    title: 'Browse & Apply',
    description: 'Explore projects that match your skills. Use filters to find the perfect opportunities. Apply with custom proposals.',
    icon: Search,
    details: [
      'AI-powered job matching',
      'Filter by skill, rate, duration',
      'Get notified for new matches',
      'Submit tailored proposals',
    ],
    time: 'Ongoing',
  },
  {
    step: 4,
    title: 'Work & Deliver',
    description: 'Once hired, deliver quality work. Communicate with clients, track time, and submit milestones through the platform.',
    icon: Briefcase,
    details: [
      'Built-in messaging',
      'Time tracking tools',
      'Milestone management',
      'File sharing & collaboration',
    ],
    time: 'Project duration',
  },
  {
    step: 5,
    title: 'Get Paid Weekly',
    description: 'Receive payments directly to your bank account every week. All taxes handled automatically - you get full Form 16A.',
    icon: DollarSign,
    details: [
      'Weekly direct bank transfers',
      'Automatic TDS deduction',
      'GST invoicing handled',
      'Full compliance documentation',
    ],
    time: 'Every Friday',
  },
]

const CLIENT_STEPS = [
  {
    step: 1,
    title: 'Post Your Project',
    description: 'Describe your project, required skills, timeline, and budget. Our AI helps you write better job descriptions.',
    icon: FileText,
    details: [
      'Describe requirements clearly',
      'Set budget and timeline',
      'Specify required skills',
      'Choose project type (fixed/hourly)',
    ],
    time: '10 minutes',
  },
  {
    step: 2,
    title: 'Review Proposals',
    description: 'Receive proposals from verified professionals within hours. Review profiles, ratings, and past work to find the best fit.',
    icon: Users,
    details: [
      'Get proposals in hours',
      'View verified profiles',
      'Check ratings & reviews',
      'Compare rates & experience',
    ],
    time: 'Same day',
  },
  {
    step: 3,
    title: 'Hire & Contract',
    description: 'Select your preferred professional. We automatically generate a legal contract with clear terms and compliance built-in.',
    icon: Handshake,
    details: [
      'One-click hiring',
      'Auto-generated contracts',
      'NDA included if needed',
      'Clear payment terms',
    ],
    time: 'Instant',
  },
  {
    step: 4,
    title: 'Manage & Collaborate',
    description: 'Work together through our platform. Set milestones, communicate, share files, and track progress in real-time.',
    icon: Target,
    details: [
      'Project dashboard',
      'Milestone tracking',
      'Built-in messaging',
      'Time logs & reports',
    ],
    time: 'Project duration',
  },
  {
    step: 5,
    title: 'Pay Securely',
    description: 'Release milestone payments when satisfied. All compliance (TDS, invoices) is automatic. No paperwork for you.',
    icon: CreditCard,
    details: [
      'Escrow protection',
      'Milestone-based releases',
      'Automatic TDS handling',
      'GST invoices generated',
    ],
    time: 'On completion',
  },
]

const COMPLIANCE_FEATURES = [
  {
    title: 'TDS Deduction',
    description: 'We automatically calculate and deduct TDS at applicable rates, deposit it with the government, and provide challan details.',
    icon: Shield,
  },
  {
    title: 'GST Invoicing',
    description: 'Proper GST invoices are generated for every transaction. Both clients and workers receive compliant invoices.',
    icon: FileText,
  },
  {
    title: 'Form 16A',
    description: 'Workers receive Form 16A certificates quarterly, making income tax filing simple and hassle-free.',
    icon: Award,
  },
  {
    title: 'Legal Contracts',
    description: 'Professional service agreements are auto-generated with clear terms, IP rights, and confidentiality clauses.',
    icon: Handshake,
  },
]

export default function HowItWorksPage() {
  const [userType, setUserType] = useState<'worker' | 'client'>('client')

  const steps = userType === 'worker' ? WORKER_STEPS : CLIENT_STEPS

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
              <Link href="/how-it-works" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                How It Works
              </Link>
              <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
            How 2ndShift Works
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            From signup to getting paid — everything is designed to be simple, fast, and 100% compliant.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setUserType('client')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                userType === 'client'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                I want to hire
              </span>
            </button>
            <button
              onClick={() => setUserType('worker')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                userType === 'worker'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                I want to work
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-full bg-slate-200 -z-10" />
                )}
                
                <div className="flex gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-semibold">
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-12">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-4">{step.description}</p>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {step.details.map((detail, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              {userType === 'worker' ? 'Start Earning Today' : 'Post Your First Project'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 lg:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              100% Compliant
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
              We handle all the compliance
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              No more spreadsheets, no more paperwork. Every transaction is fully compliant with Indian tax laws.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPLIANCE_FEATURES.map((feature, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10">
                <feature.icon className="w-10 h-10 text-sky-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '48hrs', label: 'Average time to first hire' },
              { value: '100%', label: 'Tax compliant' },
              { value: '24/7', label: 'Platform availability' },
              { value: 'Weekly', label: 'Payment cycles' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join professionals and companies building the future of work on 2ndShift.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=worker"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              Find Work
            </Link>
            <Link
              href="/register?type=client"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <Building2 className="w-4 h-4" />
              Hire Talent
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">2ndShift</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <Link href="/about" className="hover:text-slate-900">About</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link href="/contact" className="hover:text-slate-900">Contact</Link>
            </div>
            <p className="text-sm text-slate-500">© 2025 2ndShift</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
