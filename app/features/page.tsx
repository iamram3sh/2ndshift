'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles, Shield, Zap, TrendingUp, Lock, DollarSign,
  FileText, Users, Star, CheckCircle, ArrowRight, Target,
  Clock, Award, Brain, CreditCard, BarChart3, UserCheck,
  Briefcase, Scale, Receipt, PiggyBank, Layers, Crown,
  BadgeCheck, Rocket, GitBranch, Heart, ThumbsUp
} from 'lucide-react'

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<'workers' | 'clients'>('workers')

  const workerFeatures = [
    {
      icon: Brain,
      title: 'Smart Match AI',
      description: 'Our AI analyzes your skills, experience, and success rate to recommend the best-fit projects. No more endless scrolling.',
      highlight: '92% Match Accuracy',
      benefits: [
        'Personalized job recommendations',
        'Skills gap analysis',
        'Career path suggestions',
        'Real-time opportunity alerts',
      ],
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Shield,
      title: 'Payment Protection',
      description: 'Your payment is secured in escrow before work begins. Milestone-based releases ensure you get paid for completed work.',
      highlight: '100% Payment Guarantee',
      benefits: [
        'Escrow protection on all projects',
        'Milestone-based payments',
        'Dispute resolution support',
        'Instant release on approval',
      ],
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Zap,
      title: 'EarlyPay Access',
      description: 'Need money before milestone completion? Access up to 80% of your earned money instantly with EarlyPay.',
      highlight: 'Get Paid Today',
      benefits: [
        'Access earned money early',
        'Just 2.5% advance fee',
        'Instant bank transfer',
        'Build eligibility with good work',
      ],
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Receipt,
      title: 'TaxMate Compliance',
      description: 'Automatic TDS calculations, GST handling, and Form 16A generation. Stay compliant without the headache.',
      highlight: 'Auto Tax Filing',
      benefits: [
        'Automatic TDS deduction tracking',
        'Quarterly tax summaries',
        'Form 16A auto-generation',
        'GST invoice support',
      ],
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: Star,
      title: 'Two-Way Trust Score',
      description: 'Build your reputation with verified reviews. Plus, see client ratings before you apply - know who you\'re working with.',
      highlight: 'Rate Clients Too',
      benefits: [
        'See client payment reliability',
        'Build verifiable reputation',
        'Earn badges: Verified → Elite → Champion',
        'Public portfolio showcase',
      ],
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: BadgeCheck,
      title: 'Skill Verification',
      description: 'Prove your expertise with skill challenges. Verified skills = higher match scores and better opportunities.',
      highlight: 'Verified Expert Badge',
      benefits: [
        'Take skill assessments',
        'Earn verification badges',
        'Stand out in search results',
        'Access premium projects',
      ],
      color: 'from-violet-500 to-purple-600',
    },
  ]

  const clientFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Our AI finds the perfect professionals for your project based on skills, experience, and proven track record.',
      highlight: '5x Faster Hiring',
      benefits: [
        'Smart talent recommendations',
        'Skill-verified candidates',
        'Success prediction scoring',
        'Team composition suggestions',
      ],
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Lock,
      title: 'Escrow Protection',
      description: 'Your money is protected until you\'re satisfied. Release payments only when milestones are completed.',
      highlight: 'Risk-Free Hiring',
      benefits: [
        'Funds secured in escrow',
        'Milestone-based releases',
        'Full refund on disputes',
        '24/7 dispute support',
      ],
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Scale,
      title: 'Full Tax Compliance',
      description: 'We handle TDS deduction, GST, and all compliance automatically. Hire without legal worries.',
      highlight: 'Zero Compliance Risk',
      benefits: [
        'Automatic TDS deduction',
        'GST invoicing handled',
        'Form 16A generation',
        'Audit-ready records',
      ],
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: ThumbsUp,
      title: 'Verified Professionals',
      description: 'Every professional on our platform has verified identity, skills, and a transparent work history.',
      highlight: 'Trust Verified',
      benefits: [
        'ID-verified professionals',
        'Skill-tested experts',
        'Transparent reviews',
        'Work history visible',
      ],
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Users,
      title: 'Hire Teams',
      description: 'Need multiple skills? Hire pre-formed teams with proven collaboration history for complex projects.',
      highlight: 'One Click, Full Team',
      benefits: [
        'Pre-vetted team formations',
        'Proven collaboration history',
        'Single point of contact',
        'Bundled team rates',
      ],
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: Target,
      title: 'Project Brief AI',
      description: 'Not sure how to describe your project? Our AI helps you create perfect job descriptions that attract top talent.',
      highlight: '3x More Applications',
      benefits: [
        'AI-written job descriptions',
        'Budget suggestions',
        'Skill recommendations',
        'Deliverable templates',
      ],
      color: 'from-violet-500 to-purple-600',
    },
  ]

  const comparisonData = [
    { feature: 'Escrow Protection', us: true, upwork: true, freelancer: false },
    { feature: 'Automatic TDS Compliance', us: true, upwork: false, freelancer: false },
    { feature: 'Workers Rate Clients', us: true, upwork: false, freelancer: false },
    { feature: 'Early Wage Access', us: true, upwork: false, freelancer: false },
    { feature: 'Skill Verification Tests', us: true, upwork: true, freelancer: false },
    { feature: 'Team Hiring', us: true, upwork: false, freelancer: false },
    { feature: 'AI Job Matching', us: true, upwork: true, freelancer: false },
    { feature: 'Form 16A Generation', us: true, upwork: false, freelancer: false },
    { feature: 'GST Invoicing', us: true, upwork: false, freelancer: false },
    { feature: 'Platform Fee', us: '5-10%', upwork: '10-20%', freelancer: '10-20%' },
  ]

  const activeFeatures = activeTab === 'workers' ? workerFeatures : clientFeatures

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 text-sky-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              India's Most Feature-Rich Work Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-6">
              Features that actually
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                help you succeed
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              We built the features that workers and clients actually need. Not just another marketplace, 
              but a complete platform for success.
            </p>

            {/* Tab Toggle */}
            <div className="inline-flex items-center p-1 bg-slate-800 rounded-xl">
              <button
                onClick={() => setActiveTab('workers')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'workers'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Workers
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'clients'
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Clients
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeFeatures.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
                <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  </div>
                  
                  <div className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium mb-3">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {feature.highlight}
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              How We Compare
            </h2>
            <p className="text-lg text-slate-600">
              See why 2ndShift is the better choice for Indian freelancers and businesses
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 text-slate-600 font-medium">Feature</th>
                  <th className="text-center py-4 px-4">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <Layers className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900">2ndShift</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-slate-500">Upwork</th>
                  <th className="text-center py-4 px-4 text-slate-500">Freelancer</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-4 px-4 text-slate-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.us === 'boolean' ? (
                        row.us ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )
                      ) : (
                        <span className="text-emerald-600 font-semibold">{row.us}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.upwork === 'boolean' ? (
                        row.upwork ? (
                          <CheckCircle className="w-5 h-5 text-slate-400 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )
                      ) : (
                        <span className="text-slate-500">{row.upwork}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.freelancer === 'boolean' ? (
                        row.freelancer ? (
                          <CheckCircle className="w-5 h-5 text-slate-400 mx-auto" />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )
                      ) : (
                        <span className="text-slate-500">{row.freelancer}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Unique Value Props */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Built for India, Built for Success
            </h2>
            <p className="text-lg text-slate-400">
              Features designed specifically for the Indian market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                TDS & GST Compliant
              </h3>
              <p className="text-slate-400">
                Automatic tax deduction, GST invoicing, and Form 16A generation. 
                Stay legal without any effort.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                INR Payments
              </h3>
              <p className="text-slate-400">
                All transactions in Indian Rupees. Instant bank transfers via 
                Razorpay. No forex hassles.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Fair for Everyone
              </h3>
              <p className="text-slate-400">
                Workers rate clients. Transparent fees. No hidden charges. 
                A platform that respects both sides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Ready to experience the difference?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of professionals and businesses who've made the switch.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-slate-800 transition-all"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-slate-700 px-8 py-4 rounded-xl text-lg font-medium hover:text-slate-900 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-slate-900" />
              </div>
              <span className="text-lg font-semibold text-white">2ndShift</span>
            </div>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} 2ndShift. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
