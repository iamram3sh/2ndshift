'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, Shield, Users, Clock, CheckCircle, TrendingUp, FileText, Award, Star } from 'lucide-react'

export default function EmployersPage() {
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
              <Link href="/how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition">How It Works</Link>
              <Link href="/workers" className="text-slate-600 hover:text-indigo-600 font-medium transition">For Workers</Link>
              <Link href="/employers" className="text-green-600 font-semibold">For Employers</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition">Pricing</Link>
            </div>

            <Link
              href="/register?type=client"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Award className="w-4 h-4" />
            For Companies
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Hire Verified Talent,
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Stay 100% Compliant
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-10">
            Access India&apos;s top professionals for part-time work. We handle all tax compliance, contracts, and payments.
          </p>
          <Link
            href="/register?type=client"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Post Your First Job
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-slate-900">5000+</div>
              <div className="text-sm text-slate-600">Verified Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">100%</div>
              <div className="text-sm text-slate-600">Tax Compliant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">24h</div>
              <div className="text-sm text-slate-600">Average Matching</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Top Companies Choose 2ndShift</h2>
            <p className="text-xl text-slate-600">Everything you need to hire with confidence</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Zero Compliance Risk',
                description: 'We handle TDS, GST, Form 16A, and all tax compliance automatically. Stay audit-ready without any effort.',
                highlight: 'Automatic tax compliance'
              },
              {
                icon: Users,
                title: 'Pre-Verified Talent',
                description: 'Every professional is background-checked, skill-verified, and rated by previous clients.',
                highlight: '100% verified profiles'
              },
              {
                icon: FileText,
                title: 'Legal Protection',
                description: 'Auto-generated contracts, NDAs, and conflict declarations for every hire. Legally binding digital signatures.',
                highlight: 'Professional contracts'
              },
              {
                icon: Clock,
                title: 'Faster Hiring',
                description: 'Post a job and receive proposals in hours. Review, interview, and hire within 48 hours.',
                highlight: 'Hire in 2 days'
              },
              {
                icon: TrendingUp,
                title: 'Cost Effective',
                description: 'Pay only when you hire. No subscription fees. Clear pricing with no hidden charges.',
                highlight: 'Pay per hire'
              },
              {
                icon: Award,
                title: 'Quality Guaranteed',
                description: 'Milestone-based payments and escrow protection. Pay only when satisfied with the work.',
                highlight: 'Satisfaction guaranteed'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-green-300 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{benefit.description}</p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  {benefit.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Pay only when you hire. No subscriptions.</p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-green-200">
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-slate-900 mb-2">10% + GST</div>
              <div className="text-slate-600">Platform fee on project value</div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-slate-900 text-lg">What&apos;s Included:</h3>
              {[
                'Unlimited job postings',
                'Access to all verified professionals',
                'Automatic TDS & GST handling',
                'Digital contracts & NDAs',
                'Form 16A auto-generation',
                'Escrow payment protection',
                'Dedicated support',
                'Invoice generation'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h4 className="font-bold text-slate-900 mb-3">Example Breakdown (₹25,000 project):</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Project Value</span>
                  <span className="font-semibold">₹25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Platform Fee (10%)</span>
                  <span className="font-semibold">₹2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">GST on Fee (18%)</span>
                  <span className="font-semibold">₹450</span>
                </div>
                <div className="flex justify-between border-t border-green-300 pt-2 mt-2">
                  <span className="text-slate-900 font-bold">Total You Pay</span>
                  <span className="text-green-600 font-bold text-lg">₹27,950</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">Worker receives ₹20,000 after TDS deduction. We handle all compliance.</p>
            </div>

            <Link
              href="/pricing"
              className="mt-8 block text-center text-green-600 font-semibold hover:text-green-700 transition"
            >
              View detailed pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Perfect For Every Business Need</h2>
            <p className="text-xl text-slate-600">From startups to enterprises</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Startups & SMEs',
                description: 'Get expert help without full-time commitments. Scale your team flexibly.',
                examples: ['MVP development', 'Marketing campaigns', 'Design projects', 'Content creation']
              },
              {
                title: 'Large Enterprises',
                description: 'Handle overflow work and special projects with vetted professionals.',
                examples: ['Seasonal projects', 'Consultant hiring', 'Special initiatives', 'Compliance-ready hiring']
              },
              {
                title: 'Agencies',
                description: 'Expand capacity without permanent hires. Access specialists on-demand.',
                examples: ['Client overflow', 'Specialized skills', 'Project-based work', 'Freelance management']
              },
              {
                title: 'Product Companies',
                description: 'Get specialized skills for specific features and releases.',
                examples: ['Feature development', 'Design sprints', 'QA & testing', 'Documentation']
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{useCase.title}</h3>
                <p className="text-slate-600 mb-6">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.examples.map((example, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600">See how companies are using 2ndShift</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: 'Tech Startup',
                industry: 'SaaS',
                challenge: 'Needed React developers for MVP without full-time hiring',
                result: 'Hired 3 developers, launched in 8 weeks, saved ₹12L in hiring costs',
                savings: '70% cost savings'
              },
              {
                company: 'Marketing Agency',
                industry: 'Digital Marketing',
                challenge: 'Client surge during festive season, needed extra hands',
                result: 'Onboarded 5 content writers and 2 designers in 3 days. Delivered on time.',
                savings: '48h turnaround'
              },
              {
                company: 'Manufacturing Co.',
                industry: 'Manufacturing',
                challenge: 'Required compliance consultants for new project',
                result: 'Found verified legal & tax consultants. All paperwork handled by platform.',
                savings: '100% compliant'
              }
            ].map((study, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{study.company}</h3>
                <div className="text-sm text-slate-500 mb-4">{study.industry}</div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-slate-700">Challenge:</div>
                    <div className="text-slate-600">{study.challenge}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700">Result:</div>
                    <div className="text-slate-600">{study.result}</div>
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  {study.savings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Hire Top Talent?</h2>
          <p className="text-xl text-slate-600 mb-8">
            Post your first job and receive proposals from verified professionals
          </p>
          <Link
            href="/register?type=client"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Post a Job Now
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm text-slate-500">Free to post • No subscription required • Pay only when you hire</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">© 2025 2ndShift India Private Limited. All rights reserved.</p>
          <p className="text-xs text-slate-500 mt-2 italic">Developed with passion by an Indisciplined Financial person to build financial freedom for all</p>
        </div>
      </footer>
    </div>
  )
}
