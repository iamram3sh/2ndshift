'use client'

import Link from 'next/link'
import { ArrowRight, Target, Eye, Heart, Shield, Users, Globe, Award, Briefcase } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Same as home */}
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
              <Link href="/about" className="text-indigo-600 font-semibold">About</Link>
              <Link href="/how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition">How It Works</Link>
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Redefining Part-Time Work
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              For Modern India
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            We&apos;re building India&apos;s first fully compliant platform that makes 
            part-time, after-work opportunities safe, legal, and rewarding for everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-12 rounded-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                To empower professionals across India to earn additional income safely and legally, 
                while helping businesses access top-tier talent for flexible, part-time work—all 
                without the compliance headaches.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-12 rounded-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                To become the most trusted platform in India for part-time professional work, 
                where every transaction is transparent, compliant, and beneficial for both workers 
                and employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why We Exist</h2>
            <p className="text-xl text-slate-600">The problem we&apos;re solving</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">The Tax & Legal Nightmare</h3>
              <p className="text-slate-600 leading-relaxed">
                Most freelance platforms in India ignore tax compliance completely. Workers receive 
                payments without TDS deduction, leading to tax notices and penalties. Companies risk 
                legal action for non-compliance with labor laws.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">No Protection for Workers</h3>
              <p className="text-slate-600 leading-relaxed">
                Workers often face payment delays, unfair terms, and zero legal recourse. There&apos;s 
                no standard contract, no NDA protection, and no guarantee of timely payment.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Employers Take All the Risk</h3>
              <p className="text-slate-600 leading-relaxed">
                Companies hiring part-time workers face compliance nightmares—manual TDS calculations, 
                GST filing, Form 16A generation, and contract management. One mistake can lead to audits 
                and penalties.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-3xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
            <p className="text-lg text-indigo-100 leading-relaxed">
              2ndShift handles everything automatically—TDS deduction, GST compliance, professional 
              contracts, NDAs, Form 16A generation, and instant payments. We make part-time work 
              completely legal, safe, and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600">What drives us every day</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Integrity First',
                description: 'Complete transparency in all transactions. No hidden fees, no surprises.',
                color: 'from-red-500 to-pink-500'
              },
              {
                icon: Shield,
                title: 'Compliance Always',
                description: '100% legal operations. We never cut corners on taxes or labor laws.',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Users,
                title: 'People Focused',
                description: 'Workers and employers are equal partners. We serve both fairly.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Globe,
                title: 'Innovation Driven',
                description: 'Using technology to solve real problems in the Indian job market.',
                color: 'from-purple-500 to-violet-500'
              }
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-6`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Statement */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-16 h-16 mx-auto mb-6 text-indigo-400" />
          <h2 className="text-4xl font-bold mb-6">Compliance & Safety Commitment</h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            2ndShift is fully registered under Indian law and operates in complete compliance with:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              'Income Tax Act, 1961 (TDS provisions)',
              'Goods and Services Tax Act, 2017',
              'Contract Labour Act, 1970',
              'Payment of Wages Act, 1936',
              'Information Technology Act, 2000',
              'Companies Act, 2013'
            ].map((law, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">{law}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-slate-400 text-sm">
            All payments are processed through licensed payment gateways. Data is encrypted and stored 
            securely in compliance with Indian data protection regulations.
          </p>
        </div>
      </section>

      {/* Founder Story (Generic) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Started</h2>
            <p className="text-xl text-slate-600">A personal experience that sparked a mission</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-10 rounded-3xl">
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Like millions of Indians, our founders worked full-time jobs while taking on freelance 
              projects to supplement their income. They quickly discovered the harsh reality—no legal 
              contracts, delayed payments, and worst of all, unexpected tax notices.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              After helping hundreds of professionals navigate tax compliance issues and seeing 
              companies struggle with part-time hiring, the solution became clear: India needs a 
              platform that makes part-time work completely legal and safe.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed font-semibold">
              That&apos;s why we built 2ndShift—to solve a problem we experienced firsthand.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Join Our Mission</h2>
          <p className="text-xl text-slate-600 mb-8">
            Help us build India&apos;s most trusted platform for part-time professional work
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=worker"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition inline-flex items-center justify-center gap-2"
            >
              Start Working
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register?type=client"
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-indigo-600 transition inline-flex items-center justify-center gap-2"
            >
              Hire Talent
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Same as home */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg"></div>
                <span className="text-white font-bold text-xl">2ndShift</span>
              </div>
              <p className="text-sm text-slate-400">
                India&apos;s first legal, tax-compliant freelance platform.
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
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-sm text-slate-400">
              © 2024 2ndShift. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
