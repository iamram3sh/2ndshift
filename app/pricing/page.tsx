'use client'

import Link from 'next/link'
import { ArrowRight, Check, CheckCircle, Zap, Shield, Users, Building2, Clock, DollarSign, AlertCircle } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            <span>Transparent Pricing</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Pay only for
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              completed work
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            No hidden fees. No subscriptions. Pay per shift.
          </p>

          {/* For Workers - Transparent Pricing */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 max-w-2xl mx-auto mb-16 border-2 border-purple-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-slate-900">For Professionals</h3>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">Keep 95%</div>
              <div className="text-slate-600 mb-6 text-lg">Only 5% platform fee - One of India's lowest</div>
              <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">Zero registration fees</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">Only 5% on completed projects</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">Weekly payouts directly to your bank</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">100% remote work opportunities</span>
                </li>
              </ul>
              <div className="mt-6 bg-white p-4 rounded-xl border-2 border-purple-300">
                <div className="text-sm text-slate-600 mb-2">Example Earnings:</div>
                <div className="text-lg font-bold text-slate-900">
                  You bill ₹1,00,000 → You get ₹95,000
                </div>
                <div className="text-xs text-slate-500 mt-1">Platform fee: ₹5,000 (5%)</div>
              </div>
              <Link href="/register?type=worker" className="mt-6 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all">
                Join as Professional
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Company Pricing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
              <h2 className="text-4xl font-bold text-slate-900">For Companies</h2>
            </div>
            <p className="text-xl text-slate-600">Simple per-shift pricing. No contracts.</p>
          </div>

          {/* Pricing Table */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200 mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <th className="px-6 py-4 text-left font-bold">Role Type</th>
                    <th className="px-6 py-4 text-center font-bold">Hourly Rate</th>
                    <th className="px-6 py-4 text-center font-bold">Billing</th>
                    <th className="px-6 py-4 text-right font-bold">What's Included</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { role: 'Software Developer', cost: '₹900-1,600', duration: 'Per Hour', icon: '💻' },
                    { role: 'QA/Test Engineer', cost: '₹700-1,100', duration: 'Per Hour', icon: '🧪' },
                    { role: 'DevOps Engineer', cost: '₹1,000-1,900', duration: 'Per Hour', icon: '⚙️' },
                    { role: 'Cloud Architect', cost: '₹1,300-2,100', duration: 'Per Hour', icon: '☁️' },
                    { role: 'Security Auditor', cost: '₹1,100-1,900', duration: 'Per Hour', icon: '🔒' },
                    { role: 'IT Consultant', cost: '₹800-1,300', duration: 'Per Hour', icon: '📊' }
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-semibold text-slate-900">{item.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-green-600 text-lg">{item.cost}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        {item.duration}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-slate-600">All features included</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* What's Included */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Replacement Guarantee</h3>
              <p className="text-slate-600 mb-4">Worker doesn't show up? We send an immediate replacement at no extra cost.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>24/7 support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Same-day replacement</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Workers Only</h3>
              <p className="text-slate-600 mb-4">All workers are background-checked, ID verified, and skill-assessed.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Police verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Reference checks</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pay After Work Done</h3>
              <p className="text-slate-600 mb-4">Only pay when the shift is completed and you've verified the work.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Attendance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Secure payments</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Comparison with Traditional Hiring */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-8 mb-12 border-2 border-indigo-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">60% Cheaper Than Traditional Recruitment</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Traditional IT Recruitment
                </h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>₹1,500-3,000 per hour (agency markup)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Long-term contracts mandatory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>20-30% recruitment fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Weeks to find talent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Limited talent pool access</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-green-600 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  2ndShift Platform
                </h4>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>₹700-2,000 per hour (no markup)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Hire per hour/project, no contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Zero recruitment fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Find talent in minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Access 2,500+ verified professionals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/register?type=client" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Start Hiring Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-slate-600">No credit card required • Setup in 5 minutes</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Pricing FAQs</h2>
          <div className="space-y-6">
            {[
              {
                q: "Is there a setup fee or subscription?",
                a: "No. We don't charge any setup fees, monthly subscriptions, or platform fees. You only pay per shift."
              },
              {
                q: "When do I pay?",
                a: "You pay only after the shift is completed and you've verified the worker's attendance. Payment is processed securely through our platform."
              },
              {
                q: "What if I need to cancel a shift?",
                a: "You can cancel up to 4 hours before the shift starts for free. Cancellations within 4 hours may incur a small cancellation fee paid to the worker."
              },
              {
                q: "Are there any hidden costs?",
                a: "No hidden costs. The price you see is what you pay. GST is included in the shift cost."
              },
              {
                q: "Do you offer discounts for bulk hiring?",
                a: "Yes! Companies hiring 20+ workers per month get special volume discounts. Contact our sales team for custom pricing."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept UPI, Credit/Debit cards, Net Banking, and company accounts. All payments are secure and instant."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border-2 border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-slate-300 mb-8">Join thousands of workers and companies on 2ndShift</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=worker" className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105">
              Join as Worker
            </Link>
            <Link href="/register?type=client" className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg border-2 border-white hover:bg-slate-100 transition-all hover:scale-105">
              Hire Workers
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
