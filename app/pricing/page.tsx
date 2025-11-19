'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, Check, X, Zap, Building, Phone } from 'lucide-react'

export default function PricingPage() {
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
              <Link href="/employers" className="text-slate-600 hover:text-indigo-600 font-medium transition">For Employers</Link>
              <Link href="/pricing" className="text-indigo-600 font-semibold">Pricing</Link>
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
            Simple, Transparent
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Pay only when you hire. No subscriptions, no hidden fees. Complete tax compliance included.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Worker Pricing */}
            <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 hover:border-purple-300 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">For Workers</h3>
              <div className="text-4xl font-bold text-slate-900 mb-6">
                Free
                <span className="text-lg font-normal text-slate-500 ml-2">to join</span>
              </div>
              <p className="text-slate-600 mb-8">
                Join for free and start earning. We only take a small fee when you get paid.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Free registration & profile',
                  'Unlimited job applications',
                  'Background verification',
                  'Professional contracts & NDAs',
                  'Automatic TDS & Form 16A',
                  'Instant payments',
                  'Build your reputation',
                  'Access to all projects'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-8">
                <div className="text-sm font-semibold text-slate-900 mb-2">How Payment Works:</div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Project Value</span>
                    <span className="font-semibold">₹25,000</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Platform Fee (10%)</span>
                    <span className="font-semibold">- ₹2,500</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>TDS (10%)</span>
                    <span className="font-semibold">- ₹2,500</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-300 pt-2 mt-2 text-slate-900 font-bold">
                    <span>You Receive</span>
                    <span className="text-green-600">₹20,000</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">Form 16A provided for tax filing</p>
              </div>

              <Link
                href="/register?type=worker"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-center hover:shadow-xl transition"
              >
                Join as Worker
              </Link>
            </div>

            {/* Employer Pricing - Featured */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-white transform lg:scale-105 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">For Employers</h3>
              <div className="text-4xl font-bold mb-6">
                10% + GST
                <span className="text-lg font-normal text-indigo-200 ml-2">per hire</span>
              </div>
              <p className="text-indigo-100 mb-8">
                Pay only when you successfully hire. All compliance handled automatically.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Unlimited job postings',
                  'Access all verified professionals',
                  'Auto TDS & GST compliance',
                  'Digital contracts & NDAs',
                  'Form 16A auto-generation',
                  'Escrow payment protection',
                  'Milestone management',
                  'Priority support',
                  'Invoice generation',
                  'Audit-ready records'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
                <div className="text-sm font-semibold mb-2">Example (₹25,000 project):</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-indigo-100">Project Value</span>
                    <span className="font-semibold">₹25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-100">Platform Fee (10%)</span>
                    <span className="font-semibold">+ ₹2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-100">GST on Fee (18%)</span>
                    <span className="font-semibold">+ ₹450</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2 mt-2 font-bold text-lg">
                    <span>Total Cost</span>
                    <span className="text-yellow-300">₹27,950</span>
                  </div>
                </div>
                <p className="text-xs text-indigo-200 mt-3">All compliance included. No extra charges.</p>
              </div>

              <Link
                href="/register?type=client"
                className="block w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-center hover:bg-indigo-50 transition"
              >
                Post a Job
              </Link>
            </div>

            {/* Enterprise Pricing */}
            <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 hover:border-indigo-300 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mb-6">
                <Building className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-slate-900 mb-6">
                Custom
                <span className="text-lg font-normal text-slate-500 ml-2">pricing</span>
              </div>
              <p className="text-slate-600 mb-8">
                For large teams with high-volume hiring needs. Dedicated support and custom terms.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Everything in Standard',
                  'Dedicated account manager',
                  'Custom contract templates',
                  'API access',
                  'Priority matching',
                  'Bulk hiring discounts',
                  'Advanced analytics',
                  'White-label options',
                  'Custom integrations',
                  '24/7 phone support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                <div className="text-sm font-semibold text-slate-900 mb-3">Perfect for:</div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                    Companies hiring 10+ workers/month
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                    Large project outsourcing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                    Custom compliance needs
                  </li>
                </ul>
              </div>

              <Link
                href="/contact?type=enterprise"
                className="block w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-center hover:bg-slate-800 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Feature Comparison</h2>
            <p className="text-xl text-slate-600">See what&apos;s included in each plan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-6 font-bold text-slate-900">Feature</th>
                  <th className="text-center p-6 font-bold text-slate-900">Workers</th>
                  <th className="text-center p-6 font-bold text-slate-900 bg-indigo-50">Employers</th>
                  <th className="text-center p-6 font-bold text-slate-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { feature: 'Job Postings/Applications', worker: 'Unlimited', employer: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Background Verification', worker: true, employer: true, enterprise: true },
                  { feature: 'TDS & GST Compliance', worker: true, employer: true, enterprise: true },
                  { feature: 'Digital Contracts', worker: true, employer: true, enterprise: true },
                  { feature: 'Payment Protection', worker: true, employer: true, enterprise: true },
                  { feature: 'Form 16A Generation', worker: true, employer: true, enterprise: true },
                  { feature: 'Priority Support', worker: false, employer: true, enterprise: true },
                  { feature: 'Dedicated Manager', worker: false, employer: false, enterprise: true },
                  { feature: 'API Access', worker: false, employer: false, enterprise: true },
                  { feature: 'Custom Integrations', worker: false, employer: false, enterprise: true }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-6 font-medium text-slate-700">{row.feature}</td>
                    <td className="text-center p-6">
                      {typeof row.worker === 'boolean' ? (
                        row.worker ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-slate-700">{row.worker}</span>
                      )}
                    </td>
                    <td className="text-center p-6 bg-indigo-50/50">
                      {typeof row.employer === 'boolean' ? (
                        row.employer ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-slate-700">{row.employer}</span>
                      )}
                    </td>
                    <td className="text-center p-6">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-slate-700">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Pricing FAQs</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Are there any hidden fees?',
                a: 'No. Workers pay 10% platform fee + 10% TDS. Employers pay 10% + GST on that fee. That\'s it.'
              },
              {
                q: 'When do I get charged?',
                a: 'Workers: Fee is deducted when you receive payment. Employers: Charged when you make payment to worker.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. There are no lock-in periods or contracts. Join and leave whenever you want.'
              },
              {
                q: 'Is TDS really handled automatically?',
                a: 'Yes. We deduct TDS, file with the government, and provide Form 16A to workers. Completely automated.'
              },
              {
                q: 'What about GST registration?',
                a: 'We handle all GST calculations and compliance. You don\'t need GST registration to use 2ndShift.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/faq" className="text-indigo-600 font-semibold hover:text-indigo-700">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Phone className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Have Questions?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our team is here to help you find the perfect plan for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              Talk to Sales
            </Link>
            <Link
              href="/register"
              className="bg-indigo-500/30 backdrop-blur text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/20 hover:bg-indigo-500/50 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">© 2024 2ndShift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
