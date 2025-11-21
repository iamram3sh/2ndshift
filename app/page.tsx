'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, Shield, CheckCircle, Clock, Users, TrendingUp, Globe, Award, Star, Play, BarChart3, Zap, Lock, FileCheck, Headphones, ChevronRight, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Quote, X, DollarSign } from 'lucide-react'
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
                Earn More.
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent animate-gradient">
                  Work Your Way.
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Turn your free time into real income.
                <br />
                Connect with companies who need your skills.
                <br />
                <span className="font-semibold text-slate-800">100% safe. 100% legal. 100% yours.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10">
                <Link
                  href="/register?type=worker"
                  className="group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg"
                >
                  Start Earning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register?type=client"
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-300 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Hire in Minutes
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

      {/* Value Proposition - Two Blocks */}
      <section className="py-20 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* For Workers */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 border-2 border-purple-200 hover:shadow-xl transition-all">
              <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Users className="w-4 h-4" />
                For Workers
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Your Skills. Your Schedule.</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Earn with your free time</div>
                    <div className="text-slate-600 text-sm">Pick shifts that fit your life</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Get paid fast</div>
                    <div className="text-slate-600 text-sm">Daily or weekly payouts</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Zero fees</div>
                    <div className="text-slate-600 text-sm">Keep what you earn</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Build your second income</div>
                    <div className="text-slate-600 text-sm">Grow your earnings every month</div>
                  </div>
                </li>
              </ul>
              <Link href="/register?type=worker" className="mt-8 inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all">
                Start Earning
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* For Companies */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-10 border-2 border-green-200 hover:shadow-xl transition-all">
              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Briefcase className="w-4 h-4" />
                For Companies
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Hire Smart. Hire Fast.</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Quick hiring</div>
                    <div className="text-slate-600 text-sm">Post and hire in 24 hours</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Pre-verified workers</div>
                    <div className="text-slate-600 text-sm">Background checked and skilled</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Affordable pricing</div>
                    <div className="text-slate-600 text-sm">Pay only for completed work</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Simple process</div>
                    <div className="text-slate-600 text-sm">No paperwork, no hassle</div>
                  </div>
                </li>
              </ul>
              <Link href="/register?type=client" className="mt-8 inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all">
                Hire in Minutes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Why 2ndShift?
            </h2>
            <p className="text-xl text-slate-600">
              Safe. Simple. Trusted.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: '100% secure payments',
                description: 'Your money is safe with bank-level security'
              },
              {
                icon: Headphones,
                title: 'WhatsApp support',
                description: 'Get help instantly on WhatsApp'
              },
              {
                icon: CheckCircle,
                title: 'Verified workers',
                description: 'All workers are background-checked'
              },
              {
                icon: Award,
                title: 'Reliable employers',
                description: 'Work with trusted companies only'
              },
              {
                icon: DollarSign,
                title: 'Transparent payouts',
                description: 'See exactly what you earn'
              },
              {
                icon: Lock,
                title: 'Data protection',
                description: 'Your information stays private'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {feature.description}
                </p>
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
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Simple. Fast. Secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* For Workers */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-2xl border border-purple-100 hover:shadow-3xl transition-shadow duration-300">
              <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-bold mb-8">
                <Users className="w-4 h-4" />
                For Workers
              </div>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Sign up', desc: 'Quick registration', icon: '📝' },
                  { step: '02', title: 'Complete profile', desc: 'Add your skills', icon: '✏️' },
                  { step: '03', title: 'Get verified', desc: 'We check your background', icon: '✓' },
                  { step: '04', title: 'Pick shifts', desc: 'Choose work you like', icon: '📋' },
                  { step: '05', title: 'Get paid', desc: 'Money in your account', icon: '💰' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-all duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{item.icon}</span>
                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                      </div>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200">
                <Link href="/register?type=worker" className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Start Earning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* For Companies */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-2xl border border-green-100 hover:shadow-3xl transition-shadow duration-300">
              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-bold mb-8">
                <Briefcase className="w-4 h-4" />
                For Companies
              </div>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Create profile', desc: 'Set up company account', icon: '🏢' },
                  { step: '02', title: 'Post a shift', desc: 'Tell us what you need', icon: '📝' },
                  { step: '03', title: 'Select workers', desc: 'Pick from verified profiles', icon: '👥' },
                  { step: '04', title: 'Track attendance', desc: 'Monitor work progress', icon: '📊' },
                  { step: '05', title: 'Pay securely', desc: 'Automatic and safe', icon: '🔒' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-all duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{item.icon}</span>
                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                      </div>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200">
                <Link href="/register?type=client" className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Hire in Minutes
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Elements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Trusted by thousands
            </h2>
            <p className="text-lg text-slate-600">
              Safe. Verified. Reliable.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-slate-900 text-sm">100% secure payments</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-slate-900 text-sm">WhatsApp support</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-slate-900 text-sm">Verified workers</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-slate-900 text-sm">Reliable employers</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-slate-900 text-sm">Transparent payouts</div>
            </div>
          </div>
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
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Start earning today
              </h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join workers and companies building better income together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/register?type=worker"
                  className="group bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Start Earning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register?type=client"
                  className="group bg-transparent text-white px-10 py-5 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center gap-2"
                >
                  Hire in Minutes
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-2xl">2ndShift</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 max-w-sm">
                Work flexible. Earn more. Live better.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-slate-800 pt-8 pb-8">
            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <a href="mailto:support@2ndshift.com" className="text-slate-400 hover:text-white transition">support@2ndshift.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <a href="tel:+911800123456" className="text-slate-400 hover:text-white transition">+91 1800 123 456</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <span className="text-slate-400">Hyderabad, India</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-sm text-slate-400">
              © 2025 2ndShift. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}
