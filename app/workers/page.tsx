'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, DollarSign, Shield, Clock, Award, TrendingUp, CheckCircle, Star, FileText } from 'lucide-react'

export default function WorkersPage() {
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
              <Link href="/workers" className="text-indigo-600 font-semibold">For Workers</Link>
              <Link href="/employers" className="text-slate-600 hover:text-indigo-600 font-medium transition">For Employers</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition">Pricing</Link>
            </div>

            <Link
              href="/register?type=worker"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            For Professionals
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Turn Your Skills Into
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Extra Income
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-10">
            Find verified, legal part-time work that fits your schedule. Earn extra while staying 100% tax compliant.
          </p>
          <Link
            href="/register?type=worker"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Start Earning Today
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-slate-900">24h</div>
              <div className="text-sm text-slate-600">Average Approval</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">100%</div>
              <div className="text-sm text-slate-600">Legal & Compliant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">90%</div>
              <div className="text-sm text-slate-600">You Keep</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Workers Love 2ndShift</h2>
            <p className="text-xl text-slate-600">Everything you need to succeed in freelance work</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Higher Earnings',
                description: 'You keep 90% of project value. Only 10% platform fee + auto TDS deduction. No hidden charges.',
                highlight: '₹20,000 take-home on ₹25,000 project'
              },
              {
                icon: Shield,
                title: 'Complete Tax Compliance',
                description: 'Automatic TDS deduction, Form 16A generation, and proper invoicing. No tax notices, ever.',
                highlight: 'Form 16A auto-generated'
              },
              {
                icon: Clock,
                title: 'Instant Payments',
                description: 'Get paid immediately after project approval. No 30-day waiting. Money in your bank within hours.',
                highlight: 'Same-day payments'
              },
              {
                icon: FileText,
                title: 'Legal Protection',
                description: 'Every project comes with professional contracts, NDAs, and clear terms. You&apos;re legally protected.',
                highlight: 'Signed digital contracts'
              },
              {
                icon: Award,
                title: 'Verified Clients Only',
                description: 'Work with background-checked companies. No fraud, no scams. Every client is verified.',
                highlight: '100% verified employers'
              },
              {
                icon: TrendingUp,
                title: 'Build Your Reputation',
                description: 'Get ratings, reviews, and build a professional portfolio. Higher ratings = more opportunities.',
                highlight: 'Rating & review system'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{benefit.description}</p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  {benefit.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Who Can Join?</h2>
            <p className="text-xl text-slate-600">Simple requirements to get started</p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">You Must Have:</h3>
                <ul className="space-y-4">
                  {[
                    'Valid PAN card (for tax compliance)',
                    'Indian bank account',
                    'Professional skills (tech, design, marketing, etc.)',
                    'Portfolio or work samples',
                    'Clean background verification'
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Perfect For:</h3>
                <ul className="space-y-4">
                  {[
                    'Full-time employees wanting extra income',
                    'Freelancers seeking legal protection',
                    'Students with marketable skills',
                    'Stay-at-home professionals',
                    'Consultants & advisors'
                  ].map((type, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span className="text-slate-700">{type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Gigs */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular Project Categories</h2>
            <p className="text-xl text-slate-600">Find work that matches your expertise</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { category: 'Software Development', examples: 'React, Python, Node.js', budget: '₹25,000 - ₹75,000', color: 'from-blue-500 to-indigo-500' },
              { category: 'Design & Creative', examples: 'UI/UX, Graphics, Video', budget: '₹15,000 - ₹50,000', color: 'from-purple-500 to-pink-500' },
              { category: 'Marketing & Sales', examples: 'SEO, Content, Ads', budget: '₹10,000 - ₹40,000', color: 'from-green-500 to-emerald-500' },
              { category: 'Business Consulting', examples: 'Strategy, Finance, Legal', budget: '₹30,000 - ₹1,00,000', color: 'from-orange-500 to-red-500' },
              { category: 'Data & Analytics', examples: 'SQL, Excel, Reports', budget: '₹20,000 - ₹60,000', color: 'from-cyan-500 to-blue-500' },
              { category: 'Writing & Content', examples: 'Blogs, Copy, Technical', budget: '₹8,000 - ₹30,000', color: 'from-violet-500 to-purple-500' },
              { category: 'Admin & Support', examples: 'VA, Data Entry, Support', budget: '₹5,000 - ₹20,000', color: 'from-yellow-500 to-orange-500' },
              { category: 'Teaching & Training', examples: 'Coaching, Courses, Mentoring', budget: '₹10,000 - ₹50,000', color: 'from-rose-500 to-pink-500' }
            ].map((gig, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group">
                <div className={`w-12 h-12 bg-gradient-to-br ${gig.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}></div>
                <h3 className="font-bold text-slate-900 mb-2">{gig.category}</h3>
                <p className="text-sm text-slate-600 mb-3">{gig.examples}</p>
                <div className="text-sm font-semibold text-green-600">{gig.budget}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600">Hear from workers earning on 2ndShift</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'UI/UX Designer',
                quote: 'I earn an extra ₹40,000/month while working my full-time job. The automatic tax compliance means no stress during filing season.',
                earnings: '₹2.4L in 6 months'
              },
              {
                name: 'Rahul Verma',
                role: 'Software Developer',
                quote: 'Finally, a platform that takes care of TDS and Form 16A. I can focus on coding instead of paperwork. Payments are instant too!',
                earnings: '₹3.8L in 8 months'
              },
              {
                name: 'Anjali Desai',
                role: 'Content Writer',
                quote: 'As a stay-at-home mom, 2ndShift lets me earn on my schedule. Professional contracts give me peace of mind on every project.',
                earnings: '₹1.2L in 4 months'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="border-t pt-4">
                  <div className="font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                  <div className="text-sm font-semibold text-green-600 mt-2">{testimonial.earnings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Start Your Second Shift?</h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of professionals earning extra income legally and safely
          </p>
          <Link
            href="/register?type=worker"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Join the Waitlist
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm text-slate-500">Free to join • No credit card required • Get verified in 24 hours</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">© 2025 2ndShift India Private Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
