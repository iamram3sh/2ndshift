'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, Shield, Clock, Users, Building2, CheckCircle, X,
  Zap, Star, Lock, FileText, CreditCard, Headphones, Target,
  TrendingUp, Award, BadgeCheck, DollarSign, Calculator, Gift,
  Sparkles, ChevronDown, ChevronUp, Layers, Briefcase, UserCheck,
  Receipt, BarChart3, MessageSquare, Calendar, Search, Send,
  ThumbsUp, AlertCircle, RefreshCw, Wallet, IndianRupee, Crown
} from 'lucide-react'

// Shifts explanation for Workers
const WORKER_SHIFTS_USES = [
  {
    icon: TrendingUp,
    title: 'Boost Your Profile',
    shifts: 5,
    description: 'Get featured in search results for 7 days. Clients see you first when searching for your skills.',
    benefit: '3x more profile views',
  },
  {
    icon: Send,
    title: 'Priority Applications',
    shifts: 2,
    description: 'Your proposal appears at the top of the client\'s inbox. Stand out from other applicants.',
    benefit: '2x higher response rate',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messages',
    shifts: 3,
    description: 'Message clients directly even if they haven\'t posted a job. Pitch your services proactively.',
    benefit: 'Unlock hidden opportunities',
  },
  {
    icon: BadgeCheck,
    title: 'Skill Verification',
    shifts: 10,
    description: 'Take our skill assessment and get a verified badge. Proves your expertise to clients.',
    benefit: 'Higher trust, better rates',
  },
  {
    icon: Award,
    title: 'Featured Badge',
    shifts: 15,
    description: 'Get the "Featured Pro" badge on your profile for 30 days. Premium visibility.',
    benefit: 'Premium client access',
  },
]

// Shifts explanation for Clients
const CLIENT_SHIFTS_USES = [
  {
    icon: Sparkles,
    title: 'Feature Your Job',
    shifts: 10,
    description: 'Your job appears at the top of search results. Get seen by the best professionals first.',
    benefit: '5x more applications',
  },
  {
    icon: Target,
    title: 'AI Recommendations',
    shifts: 5,
    description: 'Get AI-curated list of best-fit professionals for your project. Saves hours of searching.',
    benefit: 'Perfect matches, faster',
  },
  {
    icon: Send,
    title: 'Invite Professionals',
    shifts: 2,
    description: 'Directly invite top-rated professionals to apply. Don\'t wait for them to find you.',
    benefit: 'Reach top talent directly',
  },
  {
    icon: UserCheck,
    title: 'Priority Verification',
    shifts: 8,
    description: 'Get faster verification for your company. Post jobs within hours, not days.',
    benefit: '24-hour verification',
  },
  {
    icon: Crown,
    title: 'Premium Listing',
    shifts: 20,
    description: 'Your job is highlighted with a gold badge. Attracts serious, high-quality professionals.',
    benefit: 'Quality over quantity',
  },
]

// Hiring Comparison Data
const HIRING_COMPARISON = [
  {
    factor: 'Time to First Hire',
    traditional: { value: '4-8 weeks', pain: 'Long recruitment cycles' },
    agency: { value: '2-3 weeks', pain: 'Agency processing time' },
    '2ndshift': { value: '24-48 hours', benefit: 'Pre-verified professionals ready to start' },
  },
  {
    factor: 'Total Cost',
    traditional: { value: 'Salary + 40% overhead', pain: 'PF, gratuity, insurance, office space' },
    agency: { value: '25-40% markup', pain: 'Hidden fees, minimum commitments' },
    '2ndshift': { value: '10% platform fee only', benefit: 'No hidden costs, pay per project' },
  },
  {
    factor: 'Tax Compliance',
    traditional: { value: 'Manual handling', pain: 'HR overhead, compliance risk' },
    agency: { value: 'Partial', pain: 'Unclear responsibility' },
    '2ndshift': { value: '100% Automatic', benefit: 'TDS, GST, Form 16A - all handled' },
  },
  {
    factor: 'Flexibility',
    traditional: { value: 'Full-time only', pain: 'Locked into long-term commitments' },
    agency: { value: 'Limited options', pain: 'Minimum contract periods' },
    '2ndshift': { value: 'Hourly to Full-time', benefit: 'Scale up or down anytime' },
  },
  {
    factor: 'Quality Assurance',
    traditional: { value: 'Interview based', pain: 'Bad hires cost time & money' },
    agency: { value: 'Varies widely', pain: 'No standardized vetting' },
    '2ndshift': { value: 'Verified + Rated', benefit: 'Background check, skill verification, reviews' },
  },
  {
    factor: 'Payment Security',
    traditional: { value: 'Monthly salary', pain: 'Paid even if performance is poor' },
    agency: { value: 'Upfront fees', pain: 'Pay before seeing results' },
    '2ndshift': { value: 'Escrow Protection', benefit: 'Pay only when satisfied' },
  },
  {
    factor: 'Legal Contracts',
    traditional: { value: 'Complex, needs lawyer', pain: '₹10K-50K per contract' },
    agency: { value: 'Their standard terms', pain: 'Limited negotiation' },
    '2ndshift': { value: 'Auto-generated', benefit: 'Professional contracts included free' },
  },
  {
    factor: 'Support',
    traditional: { value: 'Internal HR', pain: 'Additional headcount' },
    agency: { value: 'Account manager', pain: 'Slow response times' },
    '2ndshift': { value: '24/7 Platform + Human', benefit: 'Self-serve + dedicated support' },
  },
]

// How Escrow Works
const ESCROW_STEPS = [
  {
    step: 1,
    title: 'Client Locks Payment',
    description: 'When you hire a professional, the agreed amount is locked in our secure escrow. The money is safe but committed.',
    icon: Lock,
    who: 'Client action',
  },
  {
    step: 2,
    title: 'Professional Sees Guarantee',
    description: 'The professional can see the payment is locked. They can start work with confidence knowing payment is secured.',
    icon: Shield,
    who: 'Visible to both',
  },
  {
    step: 3,
    title: 'Work & Milestones',
    description: 'For larger projects, split into milestones. Each milestone has its own locked amount and approval.',
    icon: Target,
    who: 'Collaborative',
  },
  {
    step: 4,
    title: 'Submit Work',
    description: 'Professional submits completed work through the platform. Client gets 7 days to review.',
    icon: Send,
    who: 'Professional action',
  },
  {
    step: 5,
    title: 'Review & Approve',
    description: 'Client reviews the work. If satisfied, approve to release payment. Need changes? Request revision.',
    icon: CheckCircle,
    who: 'Client action',
  },
  {
    step: 6,
    title: 'Auto-Release Safety',
    description: 'If client doesn\'t respond in 7 days, payment releases automatically. Protects professionals from ghosting.',
    icon: Clock,
    who: 'Automatic',
  },
  {
    step: 7,
    title: 'Payment Released',
    description: 'Once approved, payment goes to professional minus platform fee. TDS handled automatically.',
    icon: Wallet,
    who: 'Automatic',
  },
]

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<'shifts' | 'escrow' | 'comparison'>('comparison')
  const [userView, setUserView] = useState<'client' | 'worker'>('client')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
              <Link href="/features" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                Features
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
      <section className="py-16 lg:py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-semibold text-white mb-6">
            How 2ndShift Works
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Everything you need to know about hiring, payments, and our premium features. 
            We've designed every detail to protect both clients and professionals.
          </p>

          {/* Tab Navigation */}
          <div className="inline-flex items-center bg-white/10 border border-white/20 rounded-xl p-1.5">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Why 2ndShift?
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'escrow'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Payment Protection
            </button>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'shifts'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Shifts Currency
            </button>
          </div>
        </div>
      </section>

      {/* COMPARISON TAB */}
      {activeTab === 'comparison' && (
        <>
          {/* Why 2ndShift Section */}
          <section className="py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                  The Smart Way to Hire Professionals
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  Stop spending weeks on hiring. Stop worrying about compliance. 
                  Compare 2ndShift with traditional hiring and agencies.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-slate-900 bg-slate-50 rounded-tl-xl">
                        Factor
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-slate-500 bg-slate-50">
                        <div className="flex flex-col items-center">
                          <Building2 className="w-5 h-5 mb-1" />
                          Traditional Hiring
                        </div>
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-slate-500 bg-slate-50">
                        <div className="flex flex-col items-center">
                          <Users className="w-5 h-5 mb-1" />
                          Staffing Agency
                        </div>
                      </th>
                      <th className="p-4 text-center text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-tr-xl">
                        <div className="flex flex-col items-center">
                          <Layers className="w-5 h-5 mb-1" />
                          2ndShift
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {HIRING_COMPARISON.map((row, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="p-4 text-sm font-medium text-slate-900 bg-slate-50/50">
                          {row.factor}
                        </td>
                        <td className="p-4 text-center">
                          <div className="text-sm text-slate-700 font-medium">{row.traditional.value}</div>
                          <div className="text-xs text-red-500 mt-1 flex items-center justify-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {row.traditional.pain}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="text-sm text-slate-700 font-medium">{row.agency.value}</div>
                          <div className="text-xs text-amber-600 mt-1 flex items-center justify-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {row.agency.pain}
                          </div>
                        </td>
                        <td className="p-4 text-center bg-emerald-50/50">
                          <div className="text-sm text-emerald-700 font-semibold">{row['2ndshift'].value}</div>
                          <div className="text-xs text-emerald-600 mt-1 flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {row['2ndshift'].benefit}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <Link
                  href="/register?type=client"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 transition-all"
                >
                  Start Hiring Smarter
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-sm text-slate-500 mt-3">Free to post. Pay only when you hire.</p>
              </div>
            </div>
          </section>

          {/* Key Benefits Cards */}
          <section className="py-16 lg:py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold text-slate-900 text-center mb-12">
                What Makes Us Different
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: '100% Tax Compliant',
                    description: 'We automatically deduct TDS, generate GST invoices, and provide Form 16A. Your finance team will love us.',
                    highlight: 'Zero compliance risk',
                  },
                  {
                    icon: Lock,
                    title: 'Escrow Protection',
                    description: 'Every payment is held in escrow until work is approved. Clients pay only for results. Professionals always get paid.',
                    highlight: 'Both sides protected',
                  },
                  {
                    icon: Clock,
                    title: '48-Hour Hiring',
                    description: 'Post a job, review verified profiles, and hire within 48 hours. No long recruitment cycles.',
                    highlight: '10x faster than traditional',
                  },
                  {
                    icon: Star,
                    title: 'Two-Way Reviews',
                    description: 'Professionals rate clients too. Know if they pay on time before you accept. Complete transparency.',
                    highlight: 'Mutual accountability',
                  },
                  {
                    icon: DollarSign,
                    title: 'Flexible Engagement',
                    description: 'Hire for 2 hours or 2 years. Fixed price or hourly. Scale up during busy periods, scale down when quiet.',
                    highlight: 'Pay for what you need',
                  },
                  {
                    icon: Headphones,
                    title: 'Human Support',
                    description: 'Not just bots. Real people available via WhatsApp, email, and phone. We help resolve any issues.',
                    highlight: 'Always there for you',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm mb-3">{item.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      {item.highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ESCROW TAB */}
      {activeTab === 'escrow' && (
        <>
          <section className="py-16 lg:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
                  <Shield className="w-4 h-4" />
                  Payment Protection
                </div>
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                  How Our Escrow System Works
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Every payment on 2ndShift is protected by escrow. This means clients only pay for completed work, 
                  and professionals always get paid for their efforts.
                </p>
              </div>

              {/* Escrow Flow */}
              <div className="space-y-6">
                {ESCROW_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-semibold text-lg">
                        {step.step}
                      </div>
                      {i < ESCROW_STEPS.length - 1 && (
                        <div className="w-0.5 h-12 bg-slate-200 ml-7 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {step.who}
                        </span>
                      </div>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                    <div className="flex-shrink-0 hidden lg:block">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-slate-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="mt-12 p-8 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h3 className="text-xl font-semibold text-emerald-800 mb-6 text-center">
                  Your Money is Always Safe
                </h3>
                <div className="grid sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-emerald-700 mb-1">Bank-Grade</div>
                    <div className="text-sm text-emerald-600">256-bit encryption</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-700 mb-1">Razorpay</div>
                    <div className="text-sm text-emerald-600">RBI-compliant escrow</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-700 mb-1">7-Day</div>
                    <div className="text-sm text-emerald-600">Auto-release protection</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Milestone Payments */}
          <section className="py-16 lg:py-20 bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  Milestone Payments for Large Projects
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  For projects over ₹50,000, we recommend splitting into milestones. 
                  Each phase has its own escrow and approval.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { phase: 'Design', percentage: 25, description: 'UI/UX designs and wireframes' },
                    { phase: 'Development', percentage: 40, description: 'Core functionality built' },
                    { phase: 'Testing', percentage: 20, description: 'QA and bug fixes' },
                    { phase: 'Launch', percentage: 15, description: 'Deployment and handover' },
                  ].map((m, i) => (
                    <div key={i} className="text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-slate-700">{m.percentage}%</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-1">{m.phase}</h4>
                      <p className="text-sm text-slate-500">{m.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">
                      <strong>Benefit:</strong> Pay only as work progresses. Review each phase before releasing next payment.
                    </p>
                  </div>
                  <Link
                    href="/register?type=client"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
                  >
                    Start a Project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* SHIFTS TAB */}
      {activeTab === 'shifts' && (
        <>
          <section className="py-16 lg:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  Premium Credits
                </div>
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                  What are Shifts?
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Shifts are our premium currency. They help you stand out, get noticed faster, 
                  and access exclusive features. Both workers and clients use Shifts differently.
                </p>
              </div>

              {/* User Type Toggle */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex items-center bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setUserView('client')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      userView === 'client'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      I'm a Client
                    </span>
                  </button>
                  <button
                    onClick={() => setUserView('worker')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      userView === 'worker'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      I'm a Professional
                    </span>
                  </button>
                </div>
              </div>

              {/* Shifts Uses */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(userView === 'worker' ? WORKER_SHIFTS_USES : CLIENT_SHIFTS_USES).map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Zap className="w-4 h-4" />
                        {item.shifts} Shifts
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm mb-3">{item.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      {item.benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* How to Get Shifts */}
              <div className="mt-16">
                <h3 className="text-2xl font-semibold text-slate-900 text-center mb-8">
                  How to Get Shifts
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
                    <Gift className="w-10 h-10 text-emerald-600 mb-4" />
                    <h4 className="font-semibold text-emerald-800 mb-2">Free Every Month</h4>
                    <p className="text-sm text-emerald-700">
                      All users get 5 free Shifts every month. Paid plan subscribers get up to 100.
                    </p>
                  </div>
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                    <CreditCard className="w-10 h-10 text-amber-600 mb-4" />
                    <h4 className="font-semibold text-amber-800 mb-2">Buy Shift Packs</h4>
                    <p className="text-sm text-amber-700">
                      Purchase Shifts as needed. Packs start from ₹99 for 10 Shifts. Bigger packs = better value.
                    </p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                    <Award className="w-10 h-10 text-purple-600 mb-4" />
                    <h4 className="font-semibold text-purple-800 mb-2">Earn Through Activity</h4>
                    <p className="text-sm text-purple-700">
                      Complete projects, get 5-star reviews, and refer friends to earn bonus Shifts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Preview */}
              <div className="mt-12 text-center">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-xl font-medium hover:bg-amber-600 transition-all"
                >
                  <Zap className="w-5 h-5" />
                  View Shift Packages
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 lg:py-20 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold text-slate-900 text-center mb-8">
                Common Questions About Shifts
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    q: 'Do Shifts expire?',
                    a: 'Purchased Shifts never expire. Free monthly Shifts expire at the end of each month if unused.',
                  },
                  {
                    q: 'Can I transfer Shifts to someone else?',
                    a: 'No, Shifts are tied to your account and cannot be transferred or sold.',
                  },
                  {
                    q: 'What happens if I use Shifts but don\'t get results?',
                    a: 'While we can\'t guarantee specific outcomes, features like profile boost and featured listings significantly increase visibility. Our data shows boosted profiles get 3x more views on average.',
                  },
                  {
                    q: 'Can I get a refund on Shifts?',
                    a: 'Unused Shifts can be refunded within 7 days of purchase. Once used, Shifts cannot be refunded.',
                  },
                ].map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-medium text-slate-900">{faq.q}</span>
                      {expandedFaq === i ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {expandedFaq === i && (
                      <div className="px-5 pb-5 text-slate-600">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Final CTA */}
      <section className="py-16 lg:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to experience the difference?
          </h2>
          <p className="text-lg text-slate-300 mb-10">
            Join 2ndShift today. It's free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=client"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-medium hover:bg-slate-100 transition-all"
            >
              <Building2 className="w-5 h-5" />
              I Want to Hire
            </Link>
            <Link
              href="/register?type=worker"
              className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-sky-700 transition-all"
            >
              <Briefcase className="w-5 h-5" />
              I Want to Work
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
