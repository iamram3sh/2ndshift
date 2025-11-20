'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, Shield, CheckCircle, Clock, Users, TrendingUp, Globe, Award, Star, Play, BarChart3, Zap, Lock, FileCheck, Headphones, ChevronRight, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Quote, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import BackToTop from '@/components/shared/BackToTop'
import StructuredData from '@/components/shared/StructuredData'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterSubmitted(true)
    setTimeout(() => {
      setNewsletterSubmitted(false)
      setEmail('')
    }, 3000)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Structured Data */}
      <StructuredData />
      
      {/* Navigation */}
      <nav className={`border-b fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-white/95 backdrop-blur-lg shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  2ndShift
                </span>
                <span className="text-[10px] text-slate-500 -mt-1 font-medium">Legal Freelance Platform</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/about" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <button onClick={() => scrollToSection('how-it-works')} className="text-slate-700 hover:text-indigo-600 font-medium transition-colors relative group">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <Link href="/workers" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors relative group">
                For Workers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/employers" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors relative group">
                For Employers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/pricing" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block text-slate-700 hover:text-indigo-600 font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-indigo-600 font-medium py-2 transition-colors">
                About
              </Link>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-slate-700 hover:text-indigo-600 font-medium py-2 transition-colors">
                How It Works
              </button>
              <Link href="/workers" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-indigo-600 font-medium py-2 transition-colors">
                For Workers
              </Link>
              <Link href="/employers" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-indigo-600 font-medium py-2 transition-colors">
                For Employers
              </Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-indigo-600 font-medium py-2 transition-colors">
                Pricing
              </Link>
              <div className="pt-4 border-t border-slate-200">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-indigo-600 font-semibold py-2 transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-sm border border-indigo-200/50">
                <Star className="w-4 h-4 fill-indigo-600" />
                <span>India&apos;s First Legal, Tax-Compliant Platform</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-[1.1]">
                Your Second Shift,
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent animate-gradient">
                  Done Right
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Connect verified professionals with compliant, legal after-work opportunities. 
                <span className="font-semibold text-slate-800"> Fully tax-compliant</span> with automatic TDS, GST, and professional contracts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10">
                <Link
                  href="/register?type=worker"
                  className="group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg"
                >
                  Find Work
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register?type=client"
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-300 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Hire Talent
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-slate-700">100% Legal</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-slate-700">Tax Compliant</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-slate-700">Secure Payments</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual/Demo */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 shadow-2xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">₹5L+</div>
                    <div className="text-xs text-slate-800">Paid Out</div>
                  </div>
                </div>
                
                {/* Mock Dashboard */}
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-slate-900">Professional Dashboard</div>
                      <div className="text-sm text-slate-500">Manage your projects</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Active Projects', value: '12', color: 'from-blue-500 to-cyan-500' },
                      { label: 'This Month Earnings', value: '₹45,000', color: 'from-green-500 to-emerald-500' },
                      { label: 'Completion Rate', value: '98%', color: 'from-purple-500 to-pink-500' }
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">{stat.label}</span>
                        <span className={`font-bold text-lg bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Active Professionals', value: '2,500+', color: 'from-blue-600 to-cyan-600' },
              { icon: Briefcase, label: 'Projects Completed', value: '5,000+', color: 'from-purple-600 to-pink-600' },
              { icon: TrendingUp, label: 'Total Earnings', value: '₹5Cr+', color: 'from-green-600 to-emerald-600' },
              { icon: Award, label: 'Client Satisfaction', value: '98%', color: 'from-orange-600 to-red-600' }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
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
                color: 'from-blue-500 to-indigo-500',
                bgColor: 'from-blue-50 to-indigo-50'
              },
              {
                icon: Clock,
                title: 'Quick Onboarding',
                description: 'Get verified and start working in under 24 hours. No lengthy processes or paperwork.',
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50'
              },
              {
                icon: Users,
                title: 'Verified Talent',
                description: 'Every professional is background-checked and skill-verified. Hire with confidence.',
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50'
              },
              {
                icon: TrendingUp,
                title: 'Fair Compensation',
                description: 'Transparent pricing with no hidden fees. Workers keep 90% of the contract value.',
                color: 'from-orange-500 to-red-500',
                bgColor: 'from-orange-50 to-red-50'
              },
              {
                icon: FileCheck,
                title: 'Legal Contracts',
                description: 'Professional NDAs, conflict declarations, and work agreements for every project.',
                color: 'from-cyan-500 to-blue-500',
                bgColor: 'from-cyan-50 to-blue-50'
              },
              {
                icon: Zap,
                title: 'Instant Payments',
                description: 'Get paid immediately after work completion. No 30-day waiting periods.',
                color: 'from-violet-500 to-purple-500',
                bgColor: 'from-violet-50 to-purple-50'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-16 -mt-16`}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-slate-600">
              Simple, fast, and completely transparent
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* For Workers */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-2xl border border-purple-100 hover:shadow-3xl transition-shadow duration-300">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-purple-200">
                <Users className="w-4 h-4" />
                For Workers
              </div>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Sign Up', desc: 'Create your profile in 2 minutes', icon: '👤' },
                  { step: '02', title: 'Get Verified', desc: 'Quick background and skill check', icon: '✓' },
                  { step: '03', title: 'Browse Projects', desc: 'Find opportunities that match your skills', icon: '🔍' },
                  { step: '04', title: 'Get Paid', desc: 'Receive payments instantly after completion', icon: '💰' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{item.icon}</span>
                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                      </div>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200">
                <Link href="/register?type=worker" className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Start as a Worker
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* For Employers */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-2xl border border-green-100 hover:shadow-3xl transition-shadow duration-300">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-green-200">
                <Briefcase className="w-4 h-4" />
                For Employers
              </div>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Post a Job', desc: 'Describe your project requirements', icon: '📝' },
                  { step: '02', title: 'Review Proposals', desc: 'Choose from verified professionals', icon: '👥' },
                  { step: '03', title: 'Work Together', desc: 'Manage project with built-in tools', icon: '🤝' },
                  { step: '04', title: 'Pay Securely', desc: 'Automatic TDS and tax compliance', icon: '🔒' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{item.icon}</span>
                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                      </div>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200">
                <Link href="/register?type=client" className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Start Hiring
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See what our community has to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Software Developer',
                company: 'Tech Corp',
                image: '👩‍💻',
                quote: 'Finally, a platform that handles all the legal and tax compliance. I can focus on my work without worrying about paperwork.',
                rating: 5
              },
              {
                name: 'Rahul Verma',
                role: 'Graphic Designer',
                company: 'Creative Agency',
                image: '👨‍🎨',
                quote: 'The instant payment feature is a game-changer. No more waiting 30 days to get paid for my freelance work.',
                rating: 5
              },
              {
                name: 'Anjali Mehta',
                role: 'Content Writer',
                company: 'Media House',
                image: '👩‍💼',
                quote: 'Professional contracts and verified clients give me peace of mind. Best decision to join 2ndShift for my side projects.',
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-indigo-200 mb-4" />
                <p className="text-slate-700 mb-6 leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                    <div className="text-xs text-slate-500">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Newsletter</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Get the latest updates on features, compliance news, and success stories
          </p>
          {newsletterSubmitted ? (
            <div className="max-w-xl mx-auto bg-green-50 border-2 border-green-200 rounded-xl p-6 flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-800 font-semibold">Thank you for subscribing! Check your email.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-300 focus:border-indigo-600 focus:outline-none text-slate-900 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Subscribe
                <Mail className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-12 sm:p-16 text-white overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" />
                <span>Limited Time Offer</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Ready to Start Your Second Shift?
              </h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals earning extra income legally and safely. 
                <span className="font-semibold text-white"> No fees for the first 3 months!</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/register"
                  className="group bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="group bg-transparent text-white px-10 py-5 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center gap-2"
                >
                  Contact Sales
                  <Headphones className="w-5 h-5" />
                </Link>
              </div>
              <div className="mt-10 flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Free for 3 months</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 hidden sm:flex">
                  <CheckCircle className="w-5 h-5" />
                  <span>Setup in minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-white font-bold text-2xl">2ndShift</span>
                  <div className="text-xs text-slate-500">Legal Freelance Platform</div>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
                India&apos;s first legal, tax-compliant freelance platform for part-time work. 
                Empowering professionals to earn extra income safely and legally.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Platform Column */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/how-it-works" className="hover:text-white transition-colors hover:translate-x-1 inline-block">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Pricing</Link></li>
                <li><Link href="/workers" className="hover:text-white transition-colors hover:translate-x-1 inline-block">For Workers</Link></li>
                <li><Link href="/employers" className="hover:text-white transition-colors hover:translate-x-1 inline-block">For Employers</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors hover:translate-x-1 inline-block">FAQ</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Blog</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Privacy Policy</Link></li>
                <li><Link href="/compliance" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Compliance</Link></li>
                <li><a href="/.well-known/security.txt" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-slate-800 pt-8 pb-8">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Email</div>
                  <a href="mailto:support@2ndshift.com" className="text-slate-400 hover:text-white transition">support@2ndshift.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Phone</div>
                  <a href="tel:+911800123456" className="text-slate-400 hover:text-white transition">+91 1800 123 456</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Address</div>
                  <p className="text-slate-400">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © 2024 2ndShift Technologies Pvt Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4" />
              <span>256-bit SSL Encrypted</span>
              <span className="mx-2">•</span>
              <Shield className="w-4 h-4" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}
