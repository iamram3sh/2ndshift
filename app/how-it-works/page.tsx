'use client'

import Link from 'next/link'
import { ArrowRight, UserPlus, CheckCircle, Briefcase, DollarSign, FileText, Shield, Clock, Award } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                2ndShift
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-slate-600 hover:text-indigo-600 font-medium transition">About</Link>
              <Link href="/how-it-works" className="text-indigo-600 font-semibold">How It Works</Link>
              <Link href="/workers" className="text-slate-600 hover:text-indigo-600 font-medium transition">For Workers</Link>
              <Link href="/employers" className="text-slate-600 hover:text-indigo-600 font-medium transition">For Employers</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition">Pricing</Link>
            </div>

            <Link
              href="/register"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Simple, Transparent,
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Completely Legal
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            From signup to payment, every step is designed to be effortless and compliant
          </p>
        </div>
      </section>

      {/* For Workers Flow */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              For Workers
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Start Earning in 4 Simple Steps
            </h2>
            <p className="text-xl text-slate-600">Get verified and start working in under 24 hours</p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                icon: UserPlus,
                title: 'Sign Up & Create Profile',
                description: 'Register with your email, phone, and PAN number. Add your skills, experience, and work preferences. Takes less than 5 minutes.',
                features: ['Quick email verification', 'PAN-based KYC', 'Skill selection', 'Portfolio upload'],
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '02',
                icon: CheckCircle,
                title: 'Get Verified',
                description: 'Our team performs background checks and skill verification. Most profiles are approved within 24 hours.',
                features: ['Identity verification', 'Skill assessment', 'Background check', 'Profile approval'],
                color: 'from-blue-500 to-indigo-500'
              },
              {
                step: '03',
                icon: Briefcase,
                title: 'Browse & Apply for Projects',
                description: 'Access hundreds of verified projects. Filter by skills, budget, and timeline. Submit proposals and get hired.',
                features: ['Smart job matching', 'Detailed project info', 'Easy proposals', 'Direct client chat'],
                color: 'from-green-500 to-emerald-500'
              },
              {
                step: '04',
                icon: DollarSign,
                title: 'Complete Work & Get Paid',
                description: 'Deliver quality work, get client approval, and receive instant payment. TDS is auto-deducted, Form 16A generated.',
                features: ['Milestone tracking', 'Instant payments', 'Auto TDS deduction', 'Digital invoices'],
                color: 'from-orange-500 to-red-500'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-3 gap-8 p-10">
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-400 mb-2">STEP {item.step}</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h4 className="font-semibold text-slate-900 mb-4">Includes:</h4>
                    <ul className="space-y-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers Flow */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              For Employers
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Hire Top Talent in 4 Easy Steps
            </h2>
            <p className="text-xl text-slate-600">From posting to payment, completely hassle-free</p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Post Your Project',
                description: 'Create a detailed job posting with requirements, budget, and timeline. Our system helps you write clear project descriptions.',
                features: ['Project templates', 'Budget calculator', 'Skill suggestions', 'Timeline planning'],
                color: 'from-green-500 to-emerald-500'
              },
              {
                step: '02',
                icon: Award,
                title: 'Review Verified Proposals',
                description: 'Receive proposals from background-checked professionals. See their ratings, past work, and skill assessments.',
                features: ['Verified profiles only', 'Rating & reviews', 'Portfolio access', 'Smart matching'],
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '03',
                icon: Shield,
                title: 'Hire with Legal Protection',
                description: 'Auto-generated contracts, NDAs, and conflict declarations. Both parties sign digitally—100% legally binding.',
                features: ['Digital contracts', 'Auto NDA generation', 'Milestone setup', 'Escrow protection'],
                color: 'from-purple-500 to-violet-500'
              },
              {
                step: '04',
                icon: Clock,
                title: 'Track & Pay Seamlessly',
                description: 'Monitor progress in real-time. Once work is approved, payment is instant with auto TDS deduction and GST compliance.',
                features: ['Progress tracking', 'Auto TDS calculation', 'GST invoicing', 'Form 16A generation'],
                color: 'from-orange-500 to-amber-500'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-3 gap-8 p-10">
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-400 mb-2">STEP {item.step}</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h4 className="font-semibold text-slate-900 mb-4">Includes:</h4>
                    <ul className="space-y-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 text-white text-center">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Every Transaction is 100% Compliant</h2>
            <p className="text-xl text-indigo-100 leading-relaxed mb-8">
              We handle all the legal complexity so you don&apos;t have to
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {[
                'Automatic TDS deduction (10%)',
                'GST compliance on platform fee',
                'Form 16A auto-generation',
                'Digital contract creation',
                'NDA & conflict declarations',
                'Invoice generation with all details',
                'Payment records for audits',
                'Full compliance with Income Tax Act'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands already working safely and legally on 2ndShift
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=worker"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition inline-flex items-center justify-center gap-2"
            >
              I Want to Work
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register?type=client"
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-indigo-600 transition inline-flex items-center justify-center gap-2"
            >
              I Want to Hire
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">
            © 2025 2ndShift India Private Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
