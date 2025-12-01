'use client'

import Link from 'next/link'
import { 
  ArrowRight, Shield, Clock, Users, CheckCircle, BadgeCheck, 
  Zap, TrendingUp, FileText, DollarSign, Building2, Star,
  Play, ChevronRight, Layers, Menu, X, Award, Target,
  Briefcase, Lock, CreditCard, Headphones, BarChart3, Globe,
  Calculator, AlertCircle, ChevronDown, ChevronUp, UserPlus,
  Search, Handshake, Send, Wallet, Receipt, Calendar, Timer,
  ThumbsUp, XCircle, MinusCircle
} from 'lucide-react'
import { useState } from 'react'

// Hiring Process Steps
const HIRING_STEPS = [
  {
    step: 1,
    title: 'Post Your Requirement',
    description: 'Describe what you need - skills, timeline, budget. Takes less than 10 minutes.',
    time: '10 minutes',
    icon: FileText,
    details: [
      'Clear job description template',
      'AI helps write better descriptions',
      'Set budget and timeline',
      'Choose project type (fixed/hourly)',
    ],
  },
  {
    step: 2,
    title: 'Receive Proposals',
    description: 'Verified professionals apply within hours. Review profiles, ratings, and past work.',
    time: 'Same day',
    icon: Users,
    details: [
      'Only verified professionals can apply',
      'See skill assessments and ratings',
      'Compare rates and experience',
      'Chat before hiring',
    ],
  },
  {
    step: 3,
    title: 'Lock Payment in Escrow',
    description: 'Agree on terms and lock payment. Professional can see the money is secured.',
    time: 'Instant',
    icon: Lock,
    details: [
      'Payment is safe in escrow',
      'Professional sees guarantee',
      'Work begins with confidence',
      'Contract auto-generated',
    ],
  },
  {
    step: 4,
    title: 'Work & Collaborate',
    description: 'Track progress through milestones. Communicate via built-in messaging.',
    time: 'Project duration',
    icon: Target,
    details: [
      'Milestone tracking',
      'Time logs for hourly work',
      'File sharing built-in',
      'Regular updates',
    ],
  },
  {
    step: 5,
    title: 'Review & Release Payment',
    description: 'Review completed work. Approve to release payment. Rate the professional.',
    time: 'On completion',
    icon: CheckCircle,
    details: [
      '7 days to review',
      'Request revisions if needed',
      'Rate and review',
      'Payment released automatically',
    ],
  },
]

// Comparison with alternatives
const COMPARISON_POINTS = [
  {
    factor: 'Time to Hire',
    icon: Clock,
    traditional: { value: '4-8 weeks', status: 'bad' },
    agency: { value: '2-3 weeks', status: 'neutral' },
    '2ndshift': { value: '24-48 hours', status: 'good' },
  },
  {
    factor: 'Cost Structure',
    icon: DollarSign,
    traditional: { value: 'Salary + 40% overhead (PF, insurance, office)', status: 'bad' },
    agency: { value: '25-40% markup on billing', status: 'neutral' },
    '2ndshift': { value: '10% platform fee only', status: 'good' },
  },
  {
    factor: 'Tax Compliance',
    icon: Receipt,
    traditional: { value: 'Manual - need accountant', status: 'bad' },
    agency: { value: 'Their responsibility', status: 'neutral' },
    '2ndshift': { value: 'Fully automatic - TDS, GST, Form 16A', status: 'good' },
  },
  {
    factor: 'Flexibility',
    icon: Calendar,
    traditional: { value: 'Notice periods, long-term commitment', status: 'bad' },
    agency: { value: 'Minimum contract periods', status: 'neutral' },
    '2ndshift': { value: 'Hire for hours, days, or months', status: 'good' },
  },
  {
    factor: 'Quality Assurance',
    icon: Award,
    traditional: { value: 'Interviews only', status: 'bad' },
    agency: { value: 'Varies by agency', status: 'neutral' },
    '2ndshift': { value: 'Verified + Rated + Skill-tested', status: 'good' },
  },
  {
    factor: 'Payment Security',
    icon: Shield,
    traditional: { value: 'Pay salary regardless of output', status: 'bad' },
    agency: { value: 'Upfront retainers', status: 'neutral' },
    '2ndshift': { value: 'Pay only when satisfied (escrow)', status: 'good' },
  },
  {
    factor: 'Contracts & Legal',
    icon: FileText,
    traditional: { value: 'Need lawyer (₹10K-50K per contract)', status: 'bad' },
    agency: { value: 'Agency\'s standard terms', status: 'neutral' },
    '2ndshift': { value: 'Professional contracts included free', status: 'good' },
  },
  {
    factor: 'Scaling Up/Down',
    icon: TrendingUp,
    traditional: { value: 'Very difficult - legal processes', status: 'bad' },
    agency: { value: 'Some flexibility', status: 'neutral' },
    '2ndshift': { value: 'Scale instantly - no commitments', status: 'good' },
  },
]

const COMMON_CONCERNS = [
  {
    concern: 'Will the quality be good enough?',
    answer: 'All professionals go through identity verification, skill assessments, and have public ratings. You can see their past work, read client reviews, and chat before hiring. Plus, escrow protection means you only pay when satisfied.',
    icon: Award,
  },
  {
    concern: 'How do I handle tax compliance?',
    answer: 'We handle everything automatically. TDS is deducted at source, GST invoices are generated, and professionals receive Form 16A. You get compliant documentation for your books - zero extra work.',
    icon: Receipt,
  },
  {
    concern: 'What if the professional doesn\'t deliver?',
    answer: 'Escrow protection ensures you never lose money. If work isn\'t delivered, payment stays in escrow. You can request revisions (up to 2 times) or escalate to our support team for resolution.',
    icon: Shield,
  },
  {
    concern: 'Is it really cheaper than hiring?',
    answer: 'Yes. A full-time hire costs salary + 40% overhead (PF, insurance, office, equipment). With 2ndShift, you pay only for actual work + 10% platform fee. For projects and part-time needs, savings are 50-70%.',
    icon: Calculator,
  },
  {
    concern: 'Can I hire for long-term?',
    answer: 'Absolutely. Start with a project, then extend to part-time or even full-time. Many clients convert successful contractors to longer engagements. We make the transition seamless.',
    icon: Calendar,
  },
]

export default function EmployersPage() {
  const [expandedConcern, setExpandedConcern] = useState<number | null>(null)
  const [projectCost, setProjectCost] = useState(50000)
  const [projectDuration, setProjectDuration] = useState(1)

  // ROI Calculator
  const calculateSavings = () => {
    // Traditional: Salary + 40% overhead for X months
    // Assuming equivalent monthly salary for the project
    const monthlySalary = projectCost / projectDuration
    const traditionalCost = (monthlySalary * 1.4) * projectDuration // 40% overhead
    
    // Agency: 30% markup
    const agencyCost = projectCost * 1.3
    
    // 2ndShift: 10% platform fee
    const shiftCost = projectCost * 1.1
    
    return {
      traditional: Math.round(traditionalCost),
      agency: Math.round(agencyCost),
      shift: Math.round(shiftCost),
      savingsVsTraditional: Math.round(traditionalCost - shiftCost),
      savingsVsAgency: Math.round(agencyCost - shiftCost),
    }
  }

  const savings = calculateSavings()

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
                <Link href="/workers" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  Find Talent
                </Link>
                <Link href="/employers" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                  For Employers
                </Link>
                <Link href="/features" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  How It Works
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
                Post a Project Free
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Hire in 48 Hours, Not 48 Days
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight">
                The smart way to hire professionals in India
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Skip the recruitment hassle. Access verified professionals, 
                with automatic tax compliance and escrow payment protection.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
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
                  Browse Talent First
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  100% Tax Compliant
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Escrow Protection
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Verified Professionals
                </span>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Why companies choose 2ndShift</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">10x Faster Hiring</div>
                    <div className="text-sm text-slate-600">Hire in 48 hours vs. 4-8 weeks traditional</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">50-70% Cost Savings</div>
                    <div className="text-sm text-slate-600">No overhead, no retainers, pay per project</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Zero Compliance Risk</div>
                    <div className="text-sm text-slate-600">TDS, GST, contracts - all automated</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Pay Only When Satisfied</div>
                    <div className="text-sm text-slate-600">Escrow protection on every payment</div>
                  </div>
                </div>
              </div>

              <Link
                href="/register?type=client"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Detailed */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              How hiring on 2ndShift works
            </h2>
            <p className="text-lg text-slate-600">
              From posting to payment - simple, fast, and fully compliant.
            </p>
          </div>

          <div className="space-y-8">
            {HIRING_STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white font-semibold text-xl">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                      <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-4">{step.description}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-2">
                      {step.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex flex-shrink-0">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register?type=client"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              Start Your First Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Compare your options
            </h2>
            <p className="text-lg text-slate-600">
              See how 2ndShift compares to traditional hiring and staffing agencies.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-5 text-left text-sm font-semibold text-slate-900 bg-slate-100 rounded-tl-xl w-48">
                    Factor
                  </th>
                  <th className="p-5 text-center text-sm font-semibold text-slate-500 bg-slate-100">
                    <div className="flex flex-col items-center gap-1">
                      <Building2 className="w-5 h-5" />
                      <span>Traditional Hiring</span>
                    </div>
                  </th>
                  <th className="p-5 text-center text-sm font-semibold text-slate-500 bg-slate-100">
                    <div className="flex flex-col items-center gap-1">
                      <Users className="w-5 h-5" />
                      <span>Staffing Agency</span>
                    </div>
                  </th>
                  <th className="p-5 text-center text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-tr-xl">
                    <div className="flex flex-col items-center gap-1">
                      <Layers className="w-5 h-5" />
                      <span>2ndShift</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_POINTS.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <row.icon className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-900">{row.factor}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-slate-600">{row.traditional.value}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <MinusCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-slate-600">{row.agency.value}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center bg-emerald-50/50">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-700">{row['2ndshift'].value}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" />
              Cost Calculator
            </div>
            <h2 className="text-3xl font-semibold text-white mb-4">
              See how much you can save
            </h2>
            <p className="text-lg text-slate-400">
              Enter your project details to compare costs.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Budget (₹)
                </label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={projectCost}
                  onChange={(e) => setProjectCost(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-slate-500">₹10,000</span>
                  <span className="text-xl font-bold text-slate-900">₹{projectCost.toLocaleString()}</span>
                  <span className="text-sm text-slate-500">₹5,00,000</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Duration (months)
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={projectDuration}
                  onChange={(e) => setProjectDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-slate-500">1 month</span>
                  <span className="text-xl font-bold text-slate-900">{projectDuration} month{projectDuration > 1 ? 's' : ''}</span>
                  <span className="text-sm text-slate-500">12 months</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-5 bg-red-50 rounded-xl border border-red-200">
                <div className="text-sm text-red-600 font-medium mb-1">Traditional Hire</div>
                <div className="text-2xl font-bold text-red-700">₹{savings.traditional.toLocaleString()}</div>
                <div className="text-xs text-red-500 mt-1">Salary + 40% overhead</div>
              </div>
              
              <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-sm text-amber-600 font-medium mb-1">Staffing Agency</div>
                <div className="text-2xl font-bold text-amber-700">₹{savings.agency.toLocaleString()}</div>
                <div className="text-xs text-amber-500 mt-1">Base + 30% markup</div>
              </div>
              
              <div className="p-5 bg-emerald-50 rounded-xl border-2 border-emerald-400">
                <div className="text-sm text-emerald-600 font-medium mb-1">2ndShift</div>
                <div className="text-2xl font-bold text-emerald-700">₹{savings.shift.toLocaleString()}</div>
                <div className="text-xs text-emerald-500 mt-1">Base + 10% platform fee</div>
              </div>
            </div>

            <div className="bg-emerald-100 rounded-xl p-6 text-center">
              <div className="text-emerald-700 font-medium mb-2">Your Potential Savings</div>
              <div className="text-4xl font-bold text-emerald-800 mb-1">
                ₹{savings.savingsVsTraditional.toLocaleString()}
              </div>
              <div className="text-sm text-emerald-600">
                vs traditional hiring ({Math.round((savings.savingsVsTraditional / savings.traditional) * 100)}% saved)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Concerns */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Questions you might have
            </h2>
            <p className="text-lg text-slate-600">
              Honest answers to common concerns about hiring through 2ndShift.
            </p>
          </div>

          <div className="space-y-4">
            {COMMON_CONCERNS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedConcern(expandedConcern === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-medium text-slate-900">{item.concern}</span>
                  </div>
                  {expandedConcern === i ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedConcern === i && (
                  <div className="px-5 pb-5 text-slate-600 ml-[52px]">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-6">
            Ready to hire smarter?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join companies saving time, money, and headaches with 2ndShift. 
            Your first project is free to post.
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
              href="/workers"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-medium border border-slate-600 hover:bg-slate-800 transition-all"
            >
              Browse Professionals
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-slate-500">
            No credit card required. No commitment.
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
              <Link href="/features" className="hover:text-slate-900 transition-colors">Features</Link>
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
