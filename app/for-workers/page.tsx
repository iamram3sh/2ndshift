'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, Shield, Clock, Users, CheckCircle, BadgeCheck, 
  Zap, TrendingUp, FileText, IndianRupee, Star, Building2,
  Award, Target, Briefcase, Lock, CreditCard, Wallet, 
  Calendar, ChevronDown, ChevronUp, Layers, Receipt,
  Calculator, MessageSquare, Send, Globe, Gift, Crown,
  Clock3, Sparkles, UserPlus, Play, Heart,
  ThumbsUp, XCircle, MinusCircle, AlertCircle, Timer,
  Phone, Mail, BookOpen
} from 'lucide-react'

// Benefits for professionals
const PLATFORM_BENEFITS = [
  {
    icon: Lock,
    title: 'Payment Always Secured',
    description: 'Every project is escrow-protected. Money is locked before work starts. You never work for free.',
    highlight: '100% payment guarantee',
  },
  {
    icon: Receipt,
    title: 'Tax Compliance Done',
    description: 'We handle TDS, generate GST invoices, and provide Form 16A. Focus on work, not paperwork.',
    highlight: 'Zero compliance hassle',
  },
  {
    icon: Calendar,
    title: 'Weekly Payments',
    description: 'Get paid every week for completed work. No waiting for month-end. No chasing clients.',
    highlight: 'Regular cash flow',
  },
  {
    icon: Target,
    title: 'Quality Clients',
    description: 'Clients are verified and rated. See their payment history before you accept. Work with serious clients only.',
    highlight: 'Know before you commit',
  },
  {
    icon: Star,
    title: 'Build Your Reputation',
    description: 'Every project builds your profile. Ratings, reviews, and verified skills attract more clients.',
    highlight: 'Compound your credibility',
  },
  {
    icon: Globe,
    title: 'Work From Anywhere',
    description: 'Choose remote projects that fit your schedule. Whether 2 hours or 20 hours a week, you decide.',
    highlight: 'Complete flexibility',
  },
]

// How Shifts work for workers
const WORKER_SHIFTS_USES = [
  {
    icon: TrendingUp,
    title: 'Boost Your Profile',
    shifts: 5,
    description: 'Appear at the top of search results when clients look for your skills. 3x more profile views guaranteed.',
    result: 'More interview requests',
  },
  {
    icon: Send,
    title: 'Priority Applications',
    shifts: 2,
    description: 'Your proposal goes to the top of the client\'s inbox. Stand out from dozens of other applicants.',
    result: 'Higher response rate',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messages',
    shifts: 3,
    description: 'Message clients even if they haven\'t posted a job. Pitch for work proactively. Create opportunities.',
    result: 'Hidden opportunities',
  },
  {
    icon: BadgeCheck,
    title: 'Skill Verification',
    shifts: 10,
    description: 'Take our skill assessment. Verified badge proves your expertise. Clients pay more for verified professionals.',
    result: 'Higher rates',
  },
  {
    icon: Crown,
    title: 'Featured Pro Badge',
    shifts: 15,
    description: 'Get the exclusive "Featured Pro" badge for 30 days. Premium visibility in client searches.',
    result: 'Premium clients',
  },
  {
    icon: Sparkles,
    title: 'AI Job Matching',
    shifts: 1,
    description: 'Get personalized job recommendations based on your skills and preferences. Never miss a good fit.',
    result: 'Perfect matches',
  },
]

// How to earn Shifts
const EARN_SHIFTS = [
  {
    method: 'Complete Projects',
    shifts: '1-5',
    description: 'Earn Shifts based on project value when you successfully complete work.',
    icon: CheckCircle,
  },
  {
    method: '5-Star Reviews',
    shifts: '2',
    description: 'Every 5-star review from a client adds 2 Shifts to your balance.',
    icon: Star,
  },
  {
    method: 'Refer Friends',
    shifts: '10',
    description: 'Invite other professionals. Earn 10 Shifts when they complete their first project.',
    icon: UserPlus,
  },
  {
    method: 'Free Monthly',
    shifts: '5',
    description: 'All verified professionals get 5 free Shifts every month.',
    icon: Gift,
  },
]

// Comparison with freelancing alone
const FREELANCE_COMPARISON = [
  {
    factor: 'Finding Clients',
    alone: { value: 'Cold outreach, networking', pain: 'Time-consuming, low conversion' },
    '2ndshift': { value: 'Clients come to you', benefit: 'Verified clients actively posting projects' },
  },
  {
    factor: 'Payment Security',
    alone: { value: 'Trust-based', pain: 'Risk of non-payment, chasing clients' },
    '2ndshift': { value: 'Escrow guaranteed', benefit: 'Money locked before work starts' },
  },
  {
    factor: 'Tax Compliance',
    alone: { value: 'Self-managed', pain: 'CA fees, paperwork, GST filing' },
    '2ndshift': { value: 'Fully automatic', benefit: 'TDS, GST, Form 16A handled' },
  },
  {
    factor: 'Contracts & Legal',
    alone: { value: 'Create your own', pain: 'Need lawyer for disputes' },
    '2ndshift': { value: 'Auto-generated', benefit: 'Professional contracts, dispute resolution' },
  },
  {
    factor: 'Credibility',
    alone: { value: 'Build from scratch', pain: 'Hard to prove skills to new clients' },
    '2ndshift': { value: 'Verified profile', benefit: 'Ratings, reviews, skill badges' },
  },
  {
    factor: 'Pricing',
    alone: { value: 'Negotiate every time', pain: 'Race to the bottom' },
    '2ndshift': { value: 'Set your rate', benefit: 'Market data helps you price right' },
  },
]

// FAQ
const WORKER_FAQ = [
  {
    q: 'Is it really free to join?',
    a: 'Yes, completely free. No subscription fees, no hidden costs. We only charge a 10% service fee when you get paid. So we succeed only when you succeed.',
  },
  {
    q: 'How does escrow protect me?',
    a: 'When a client hires you, they lock the agreed amount in escrow. This money is reserved for you. Once you submit work and they approve, payment releases to you. If they don\'t respond in 7 days, payment releases automatically.',
  },
  {
    q: 'How quickly do I get paid?',
    a: 'Payments are processed weekly. Once a milestone is approved, your payment is queued for the next weekly payout (every Thursday). Bank transfers typically arrive within 1-2 business days.',
  },
  {
    q: 'What if a client is unhappy?',
    a: 'Clients can request up to 2 revisions per milestone. If there\'s still a dispute, our support team mediates. We review the work against the original requirements and make a fair decision.',
  },
  {
    q: 'Do I need GST registration?',
    a: 'Not necessarily. If you earn under ₹20 lakhs/year, GST registration is optional. We deduct TDS at source (10%) regardless. If you do have GST, you can add it to your invoices and we\'ll include it in billing.',
  },
  {
    q: 'Can I work with clients outside 2ndShift?',
    a: 'Yes, your existing clients are yours. 2ndShift is an additional channel. However, once you connect with a client on our platform, that relationship should stay on-platform for everyone\'s protection.',
  },
]

// Success stories
const SUCCESS_STORIES = [
  {
    name: 'Rahul S.',
    role: 'Full Stack Developer',
    location: 'Bangalore',
    quote: 'I left my job at a service company to freelance. 2ndShift gave me the clients I needed. Now I earn more than my old salary working fewer hours.',
    earnings: '₹1.8L/month average',
    avatar: 'RS',
  },
  {
    name: 'Priya M.',
    role: 'Cloud Security Specialist',
    location: 'Mumbai',
    quote: 'The escrow system is a game-changer. I used to waste so much time chasing payments. Now I just focus on delivering quality security audits.',
    earnings: '₹2.5L/month average',
    avatar: 'PM',
  },
  {
    name: 'Amit K.',
    role: 'DevOps Engineer',
    location: 'Hyderabad',
    quote: 'As a part-timer alongside my job, 2ndShift is perfect. I pick projects that fit my schedule and earn extra income.',
    earnings: '₹60K/month part-time',
    avatar: 'AK',
  },
]

export default function ForWorkersPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'benefits' | 'shifts' | 'comparison'>('benefits')

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
                <span className="text-lg font-semibold text-[#111]">2ndShift</span>
              </Link>
              
              <div className="hidden lg:flex items-center gap-1">
                <Link href="/worker/discover" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  Browse Jobs
                </Link>
                <Link href="/for-workers" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                  For Professionals
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
              <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-[#333] hover:text-[#111]">
                Sign in
              </Link>
              <Link 
                href="/register?type=worker" 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
              >
                Join as Professional
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Escrow Protected Payments
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-semibold mb-6 leading-tight" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                Freelance with peace of mind
              </h1>
              
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                No more chasing payments. No more tax headaches. 
                Get verified clients, guaranteed payments, and focus on what you do best.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/register?type=worker"
                  className="inline-flex items-center gap-2 bg-white text-emerald-900 px-6 py-3.5 rounded-xl font-medium hover:bg-emerald-50 transition-all"
                >
                  Join Free Today
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/worker/discover"
                  className="inline-flex items-center gap-2 text-white px-6 py-3.5 rounded-xl font-medium border border-emerald-600 hover:bg-emerald-800 transition-all"
                >
                  Browse Available Projects
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 text-sm" style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Free to join
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Weekly payouts
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Tax handled
                </span>
              </div>
            </div>

            {/* Earnings Preview */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-lg font-bold text-[#111] mb-6">How professionals earn on 2ndShift</h3>
              
              <div className="space-y-5">
                {SUCCESS_STORIES.map((story, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-lg font-semibold text-emerald-700">
                      {story.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-900">{story.name}</div>
                        <div className="text-sm font-medium text-emerald-600">{story.earnings}</div>
                      </div>
                      <div className="text-sm text-slate-500">{story.role} • {story.location}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/register?type=worker"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all"
              >
                Start Earning Today
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'benefits'
                  ? 'bg-white text-[#111] shadow-sm'
                  : 'text-[#333] hover:text-[#111]'
              }`}
            >
              Why Join?
            </button>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'shifts'
                  ? 'bg-white text-[#111] shadow-sm'
                  : 'text-[#333] hover:text-[#111]'
              }`}
            >
              Shifts Credits
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white text-[#111] shadow-sm'
                  : 'text-[#333] hover:text-[#111]'
              }`}
            >
              Compare Options
            </button>
          </div>
        </div>
      </section>

      {/* BENEFITS TAB */}
      {activeTab === 'benefits' && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111] mb-4">
                Why professionals choose 2ndShift
              </h2>
              <p className="text-lg text-[#333] max-w-2xl mx-auto">
                We handle the hard parts of freelancing so you can focus on doing great work.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLATFORM_BENEFITS.map((benefit, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111] mb-2">{benefit.title}</h3>
                  <p className="text-[#333] text-sm mb-3">{benefit.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    {benefit.highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SHIFTS TAB */}
      {activeTab === 'shifts' && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Premium Currency
              </div>
              <h2 className="text-3xl font-bold text-[#111] mb-4">
                What are Shifts?
              </h2>
              <p className="text-lg text-[#333] max-w-2xl mx-auto">
                Shifts are credits that help you stand out, get more visibility, and land better projects. 
                Think of them as your competitive edge.
              </p>
            </div>

            {/* What You Can Do with Shifts */}
            <div className="mb-16">
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-8">
                What Shifts Can Do For You
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WORKER_SHIFTS_USES.map((item, i) => (
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
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-600 text-sm mb-3">{item.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      {item.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Get Shifts */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-8">
                How to Get Shifts (Free & Paid)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {EARN_SHIFTS.map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <item.icon className="w-8 h-8 text-emerald-500" />
                      <span className="text-lg font-bold text-amber-600">+{item.shifts}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">{item.method}</h4>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-slate-600 mb-4">
                  Need more Shifts? Buy packs starting at ₹99 for 10 Shifts.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  View Shift Packages
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMPARISON TAB */}
      {activeTab === 'comparison' && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                Freelancing Alone vs. With 2ndShift
              </h2>
              <p className="text-lg text-slate-600">
                See how we make freelancing easier, safer, and more profitable.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-5 text-left text-sm font-semibold text-slate-900 bg-slate-100 rounded-tl-xl">
                      Challenge
                    </th>
                    <th className="p-5 text-center text-sm font-semibold text-slate-500 bg-slate-100">
                      Freelancing Alone
                    </th>
                    <th className="p-5 text-center text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-tr-xl">
                      With 2ndShift
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FREELANCE_COMPARISON.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="p-5 font-medium text-slate-900">{row.factor}</td>
                      <td className="p-5 text-center">
                        <div className="text-sm text-slate-600">{row.alone.value}</div>
                        <div className="text-xs text-red-500 mt-1 flex items-center justify-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {row.alone.pain}
                        </div>
                      </td>
                      <td className="p-5 text-center bg-emerald-50/50">
                        <div className="text-sm font-medium text-emerald-700">{row['2ndshift'].value}</div>
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

            <div className="text-center mt-12">
              <Link
                href="/register?type=worker"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-emerald-700 transition-all"
              >
                Join 2ndShift Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How Payment Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              How You Get Paid
            </h2>
            <p className="text-slate-600">
              Simple, transparent, and always on time.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Get Hired', desc: 'Client accepts your proposal', icon: Briefcase },
              { step: 2, title: 'Money Locked', desc: 'Payment goes into escrow', icon: Lock },
              { step: 3, title: 'Submit Work', desc: 'Complete and deliver work', icon: Send },
              { step: 4, title: 'Get Paid', desc: 'Weekly payout to your bank', icon: Wallet },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-slate-700" />
                </div>
                <div className="text-xs font-medium text-slate-400 uppercase mb-1">Step {item.step}</div>
                <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">Every Thursday</div>
                <div className="text-sm text-slate-600">Weekly payment cycle</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">1-2 days</div>
                <div className="text-sm text-slate-600">Bank transfer time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">10%</div>
                <div className="text-sm text-slate-600">Platform fee (all-inclusive)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {WORKER_FAQ.map((faq, i) => (
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

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-6" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            Ready to freelance smarter?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            Join professionals who work with peace of mind. 
            It&apos;s free to join and takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=worker"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-xl font-medium hover:bg-emerald-50 transition-all"
            >
              Create Your Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/worker/discover"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-medium border border-emerald-600 hover:bg-emerald-800 transition-all"
            >
              Browse Available Projects
            </Link>
          </div>
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
              <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
              <Link href="/employers" className="hover:text-slate-900 transition-colors">For Employers</Link>
            </div>
            <p className="text-sm text-slate-500">© 2025 2ndShift Technologies</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
