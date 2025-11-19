'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, Shield, CheckCircle, Clock, Users, TrendingUp, Globe, Award, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
              <Link href="/about" className="text-slate-600 hover:text-indigo-600 font-medium transition">
                About
              </Link>
              <Link href="/how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition">
                How It Works
              </Link>
              <Link href="/workers" className="text-slate-600 hover:text-indigo-600 font-medium transition">
                For Workers
              </Link>
              <Link href="/employers" className="text-slate-600 hover:text-indigo-600 font-medium transition">
                For Employers
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition">
                Pricing
              </Link>
              <Link href="/faq" className="text-slate-600 hover:text-indigo-600 font-medium transition">
                FAQ
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-slate-600 hover:text-indigo-600 font-medium transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              <span>India&apos;s First Legal, Tax-Compliant Freelance Platform</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Your Second Shift,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Done Right
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Connect verified professionals with compliant, legal after-work opportunities. 
              Fully tax-compliant with automatic TDS, GST, and professional contracts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register?type=worker"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                Find Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register?type=client"
                className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-indigo-600 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                Hire Talent
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% Legal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Tax Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm font-medium mb-8">
            TRUSTED BY LEADING COMPANIES
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                <span className="text-slate-400 font-semibold">Company {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Why Choose 2ndShift?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              India&apos;s only platform that handles everything - from compliance to payments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Fully Compliant',
                description: 'Automatic TDS deduction, GST handling, and Form 16A generation. Stay 100% tax compliant.',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Clock,
                title: 'Quick Onboarding',
                description: 'Get verified and start working in under 24 hours. No lengthy processes or paperwork.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Users,
                title: 'Verified Talent',
                description: 'Every professional is background-checked and skill-verified. Hire with confidence.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: TrendingUp,
                title: 'Fair Compensation',
                description: 'Transparent pricing with no hidden fees. Workers keep 90% of the contract value.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Globe,
                title: 'Legal Contracts',
                description: 'Professional NDAs, conflict declarations, and work agreements for every project.',
                color: 'from-cyan-500 to-blue-500'
              },
              {
                icon: Award,
                title: 'Instant Payments',
                description: 'Get paid immediately after work completion. No 30-day waiting periods.',
                color: 'from-violet-500 to-purple-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-slate-600">
              Simple, fast, and completely transparent
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Workers */}
            <div className="bg-white p-10 rounded-3xl shadow-lg">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                For Workers
              </div>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Sign Up', desc: 'Create your profile in 2 minutes' },
                  { step: '02', title: 'Get Verified', desc: 'Quick background and skill check' },
                  { step: '03', title: 'Browse Projects', desc: 'Find opportunities that match your skills' },
                  { step: '04', title: 'Get Paid', desc: 'Receive payments instantly after completion' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Employers */}
            <div className="bg-white p-10 rounded-3xl shadow-lg">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                For Employers
              </div>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Post a Job', desc: 'Describe your project requirements' },
                  { step: '02', title: 'Review Proposals', desc: 'Choose from verified professionals' },
                  { step: '03', title: 'Work Together', desc: 'Manage project with built-in tools' },
                  { step: '04', title: 'Pay Securely', desc: 'Automatic TDS and tax compliance' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 sm:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Ready to Start Your Second Shift?
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals earning extra income legally and safely
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Join the Waitlist
                </Link>
                <Link
                  href="/about"
                  className="bg-indigo-500/30 backdrop-blur text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/20 hover:bg-indigo-500/50 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg"></div>
                <span className="text-white font-bold text-xl">2ndShift</span>
              </div>
              <p className="text-sm text-slate-400">
                India&apos;s first legal, tax-compliant freelance platform for part-time work.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/compliance" className="hover:text-white transition">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © 2024 2ndShift. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
