'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, Shield, CheckCircle, Clock, Users, TrendingUp, Globe, Award, Star, BarChart3, Zap, Lock, FileCheck, Headphones, ChevronRight, Mail, Phone, MapPin, Linkedin, Twitter, ArrowUpRight, Sparkles, Target, Wallet, X } from 'lucide-react'
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
    <div className="min-h-screen bg-[#fafafa]">
      {/* SEO Structured Data */}
      <StructuredData />
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-neutral-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-2xl flex items-center justify-center shadow-lg shadow-[#05c8b1]/20 group-hover:shadow-xl group-hover:shadow-[#05c8b1]/30 transition-all duration-300 group-hover:scale-105">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff6b6b] rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-neutral-900 tracking-tight">
                  2nd<span className="text-[#05c8b1]">Shift</span>
                </span>
                <span className="text-[10px] text-neutral-500 -mt-0.5 font-medium tracking-wide uppercase">Legal Freelance</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Browse Jobs', href: '/jobs', highlight: true },
                { label: 'About', href: '/about' },
                { label: 'How It Works', action: () => scrollToSection('how-it-works') },
                { label: 'For Workers', href: '/workers' },
                { label: 'For Employers', href: '/employers' },
                { label: 'Pricing', href: '/pricing' },
              ].map((item, i) => (
                item.href ? (
                  <Link 
                    key={i} 
                    href={item.href} 
                    className={`px-4 py-2 font-medium transition-colors rounded-lg ${
                      (item as any).highlight 
                        ? 'text-[#05c8b1] hover:text-[#058076] hover:bg-[#05c8b1]/10' 
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button key={i} onClick={item.action} className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium transition-colors rounded-lg hover:bg-neutral-100">
                    {item.label}
                  </button>
                )
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1 text-neutral-700 hover:text-neutral-900 font-semibold transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="group relative bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-300 flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05c8b1] to-[#058076] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
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
          <div className="lg:hidden border-t border-neutral-200/50 bg-white/95 backdrop-blur-xl shadow-xl animate-in slide-in-from-top">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
              {[
                { label: '🔥 Browse Jobs', href: '/jobs', highlight: true },
                { label: 'About', href: '/about' },
                { label: 'How It Works', action: () => scrollToSection('how-it-works') },
                { label: 'For Workers', href: '/workers' },
                { label: 'For Employers', href: '/employers' },
                { label: 'Pricing', href: '/pricing' },
              ].map((item, i) => (
                item.href ? (
                  <Link 
                    key={i} 
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`block font-medium py-3 px-4 rounded-xl transition-colors ${
                      (item as any).highlight
                        ? 'text-[#05c8b1] bg-[#05c8b1]/10 hover:bg-[#05c8b1]/20'
                        : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button key={i} onClick={() => { item.action?.(); setMobileMenuOpen(false); }} className="block w-full text-left text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 font-medium py-3 px-4 rounded-xl transition-colors">
                    {item.label}
                  </button>
                )
              ))}
              <div className="pt-4 mt-4 border-t border-neutral-200">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-700 hover:text-neutral-900 font-semibold py-3 px-4 rounded-xl transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-neutral-800 transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f0fdfb] to-[#fafafa]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNWM4YjEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-40 right-20 w-72 h-72 bg-[#05c8b1]/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#3373ff]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-60 left-1/4 w-4 h-4 bg-[#ff6b6b] rounded-full animate-bounce-subtle"></div>
        <div className="absolute top-80 right-1/3 w-3 h-3 bg-[#05c8b1] rounded-full animate-bounce-subtle delay-300"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-[#05c8b1]/20 text-[#058076] px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm animate-in slide-in-from-bottom">
                <Sparkles className="w-4 h-4" />
                <span>India&apos;s #1 Legal Freelance Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-900 mb-6 leading-[1.1] tracking-tight animate-in slide-in-from-bottom delay-100">
                Your Skills.
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-[#05c8b1] via-[#00a192] to-[#058076] bg-clip-text text-transparent">
                    Your Schedule.
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 2 150 2 198 10" stroke="#05c8b1" strokeWidth="3" strokeLinecap="round" className="animate-line-draw" style={{strokeDasharray: 200, strokeDashoffset: 200}}/>
                  </svg>
                </span>
                <br />
                <span className="text-neutral-400">Your Earnings.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-neutral-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-in slide-in-from-bottom delay-200">
                Earn <span className="font-bold text-neutral-900">₹50,000 - ₹1,50,000</span> extra per month.
                Work remotely. Get paid weekly. Only 5% platform fee.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-stretch sm:items-center mb-6 animate-in slide-in-from-bottom delay-300">
                <Link
                  href="/jobs"
                  className="group relative bg-[#05c8b1] text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#00a192] transition-all duration-300 flex items-center gap-3 justify-center shadow-xl shadow-[#05c8b1]/25 hover:shadow-2xl hover:shadow-[#05c8b1]/30 hover:-translate-y-0.5"
                >
                  <span>Browse Jobs</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register?type=client"
                  className="group bg-white text-neutral-900 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 flex items-center gap-3 justify-center"
                >
                  <span>Post a Job</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
              
              {/* Secondary CTA */}
              <p className="text-center lg:text-left text-neutral-500 mb-10 animate-in slide-in-from-bottom delay-400">
                Want to earn? <Link href="/register?type=worker" className="text-[#05c8b1] font-semibold hover:underline">Sign up free →</Link>
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-in slide-in-from-bottom delay-500">
                {[
                  { icon: Shield, label: '100% Legal' },
                  { icon: FileCheck, label: 'Tax Compliant' },
                  { icon: Lock, label: 'Secure Payments' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#05c8b1]/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-[#05c8b1]" />
                    </div>
                    <span className="font-medium text-neutral-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Stats Card */}
            <div className="relative hidden lg:block animate-in slide-in-from-right delay-300">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-neutral-200/50 border border-neutral-100">
                {/* Floating Badge */}
                <div className="absolute -top-5 -right-5 bg-gradient-to-br from-[#ff6b6b] to-[#e51d1d] text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-[#ff6b6b]/30 rotate-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">₹5 Cr+ Paid</span>
                  </div>
                </div>
                
                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-2xl flex items-center justify-center shadow-lg shadow-[#05c8b1]/20">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-900">Professional Dashboard</div>
                    <div className="text-sm text-neutral-500">Your earning potential</div>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Active Workers', value: '2,500+', icon: Users, color: 'from-[#05c8b1] to-[#058076]' },
                    { label: 'Companies', value: '500+', icon: Briefcase, color: 'from-[#3373ff] to-[#1c50f5]' },
                    { label: 'Avg. Earnings', value: '₹45K', icon: Wallet, color: 'from-[#f59e0b] to-[#d97706]' },
                    { label: 'Success Rate', value: '98%', icon: Target, color: 'from-[#10b981] to-[#059669]' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-neutral-50 rounded-2xl p-4 hover:bg-neutral-100 transition-colors">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                      <div className="text-sm text-neutral-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Live Activity */}
                <div className="bg-gradient-to-br from-[#05c8b1]/5 to-[#058076]/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-neutral-700">Live Activity</span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    <span className="font-semibold">12 new projects</span> posted in the last hour
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-neutral-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Weekly Payouts</div>
                    <div className="text-xs text-neutral-500">Direct to bank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Preview - NEW SECTION */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 text-[#e51d1d] px-3 py-1.5 rounded-full text-sm font-semibold mb-3">
                <Zap className="w-4 h-4" />
                <span>Live Opportunities</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                Jobs Available <span className="text-[#05c8b1]">Right Now</span>
              </h2>
              <p className="text-neutral-600 mt-2">No signup required to browse. Apply after registration.</p>
            </div>
            <Link 
              href="/jobs" 
              className="group inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-all"
            >
              View All 156+ Jobs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Jobs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Senior React Developer',
                skills: ['React', 'TypeScript', 'Node.js'],
                pay: '₹1,200-1,800/hr',
                type: 'Part-time',
                posted: '2h ago',
                applicants: 12,
                urgent: true,
              },
              {
                title: 'DevOps Engineer - AWS',
                skills: ['AWS', 'Kubernetes', 'Docker'],
                pay: '₹1,500-2,200/hr',
                type: 'Ongoing',
                posted: '5h ago',
                applicants: 15,
                urgent: true,
              },
              {
                title: 'QA Automation Engineer',
                skills: ['Selenium', 'Python', 'CI/CD'],
                pay: '₹800-1,200/hr',
                type: 'Project',
                posted: '1d ago',
                applicants: 8,
                urgent: false,
              },
            ].map((job, i) => (
              <Link 
                key={i} 
                href="/jobs"
                className="group bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-[#05c8b1]/30 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-[#05c8b1]/5"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-neutral-900 group-hover:text-[#05c8b1] transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="bg-neutral-200 text-transparent rounded px-6">Company</span>
                    </div>
                  </div>
                  {job.urgent && (
                    <span className="flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                      🔥 Urgent
                    </span>
                  )}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <span key={skill} className="bg-white border border-neutral-200 text-neutral-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div>
                    <div className="text-lg font-bold text-[#05c8b1]">{job.pay}</div>
                    <div className="text-xs text-neutral-500">{job.type} • {job.posted}</div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-neutral-500">
                    <Users className="w-4 h-4" />
                    {job.applicants}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <Link 
              href="/jobs"
              className="inline-flex items-center gap-3 text-[#05c8b1] hover:text-[#058076] font-semibold text-lg group"
            >
              <span>Browse all jobs without signing up</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition - Two Cards */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* For Workers */}
            <div className="group relative bg-gradient-to-br from-[#f0fdfb] to-[#ccfbf1] rounded-3xl p-8 lg:p-10 border border-[#05c8b1]/20 hover:shadow-xl hover:shadow-[#05c8b1]/10 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#05c8b1]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-[#05c8b1] text-white px-4 py-2 rounded-xl text-sm font-bold mb-6">
                  <Briefcase className="w-4 h-4" />
                  For Professionals
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                  Earn ₹50K-1.5L<span className="text-[#05c8b1]">/month</span> extra
                </h3>
                <p className="text-neutral-600 mb-8">Work remotely with your existing skills. Set your own schedule and rates.</p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    { title: 'Weekly payouts', desc: 'Get paid every week via bank transfer' },
                    { title: 'Only 5% fee', desc: 'Lowest platform fee in India' },
                    { title: '100% remote', desc: 'Work from anywhere you want' },
                    { title: 'Verified projects', desc: 'Quality work from real companies' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-[#05c8b1] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">{item.title}</div>
                        <div className="text-sm text-neutral-600">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <Link href="/register?type=worker" className="inline-flex items-center gap-2 bg-[#05c8b1] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#00a192] transition-all group-hover:shadow-lg">
                  Start Earning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* For Companies */}
            <div className="group relative bg-gradient-to-br from-[#eef5ff] to-[#dbeafe] rounded-3xl p-8 lg:p-10 border border-[#3373ff]/20 hover:shadow-xl hover:shadow-[#3373ff]/10 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3373ff]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-[#3373ff] text-white px-4 py-2 rounded-xl text-sm font-bold mb-6">
                  <Users className="w-4 h-4" />
                  For Companies
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                  Hire <span className="text-[#3373ff]">skilled talent</span> instantly
                </h3>
                <p className="text-neutral-600 mb-8">Access verified professionals. Pay only for work delivered.</p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    { title: 'Hire in minutes', desc: 'Access 2,500+ verified professionals' },
                    { title: 'Pay for hours worked', desc: 'Flexible billing, no contracts' },
                    { title: 'Pre-vetted talent', desc: 'Developers, QA, DevOps & more' },
                    { title: '60% cheaper', desc: 'Save vs traditional agencies' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-[#3373ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">{item.title}</div>
                        <div className="text-sm text-neutral-600">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <Link href="/register?type=client" className="inline-flex items-center gap-2 bg-[#3373ff] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#1c50f5] transition-all group-hover:shadow-lg">
                  Post a Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 text-[#05c8b1]" />
              <span>Why 2ndShift</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
              Built for <span className="text-[#05c8b1]">trust</span> & <span className="text-[#3373ff]">transparency</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Everything you need for safe, legal, and profitable freelancing
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: '256-bit encryption protects all transactions and data',
                color: 'from-[#05c8b1] to-[#058076]',
              },
              {
                icon: Headphones,
                title: 'WhatsApp Support',
                description: 'Get instant help whenever you need it',
                color: 'from-[#10b981] to-[#059669]',
              },
              {
                icon: CheckCircle,
                title: 'Verified Profiles',
                description: 'All workers undergo background verification',
                color: 'from-[#3373ff] to-[#1c50f5]',
              },
              {
                icon: Award,
                title: 'Quality Companies',
                description: 'Only verified, trustworthy employers',
                color: 'from-[#f59e0b] to-[#d97706]',
              },
              {
                icon: BarChart3,
                title: 'Transparent Earnings',
                description: 'See exactly what you earn with no hidden fees',
                color: 'from-[#8b5cf6] to-[#7c3aed]',
              },
              {
                icon: Lock,
                title: 'Data Protection',
                description: 'Your personal information stays private',
                color: 'from-[#ef4444] to-[#dc2626]',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Table */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#05c8b1]/10 border border-[#05c8b1]/20 text-[#058076] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Wallet className="w-4 h-4" />
              <span>Earning Potential</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
              Real earnings for <span className="text-[#05c8b1]">real skills</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Based on actual platform data for 20 hours/week work
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-900 text-white">
                    <th className="px-6 py-5 text-left font-bold">Role</th>
                    <th className="px-6 py-5 text-center font-bold">Hourly Rate</th>
                    <th className="px-6 py-5 text-center font-bold hidden sm:table-cell">Type</th>
                    <th className="px-6 py-5 text-right font-bold">Monthly (20h/week)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    { role: 'Software Developer', rate: '₹800-1,500', type: 'Project', monthly: '₹64K-1.2L', icon: '💻' },
                    { role: 'QA Engineer', rate: '₹600-1,000', type: 'Remote', monthly: '₹48K-80K', icon: '🧪' },
                    { role: 'DevOps Engineer', rate: '₹900-1,800', type: 'On-demand', monthly: '₹72K-1.44L', icon: '⚙️' },
                    { role: 'Cloud Architect', rate: '₹1,200-2,000', type: 'Consulting', monthly: '₹96K-1.6L', icon: '☁️' },
                    { role: 'Security Auditor', rate: '₹1,000-1,800', type: 'Project', monthly: '₹80K-1.44L', icon: '🔒' },
                    { role: 'Data Analyst', rate: '₹600-1,100', type: 'Remote', monthly: '₹48K-88K', icon: '📊' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-semibold text-neutral-900">{item.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-[#05c8b1]">{item.rate}</td>
                      <td className="px-6 py-5 text-center text-neutral-600 hidden sm:table-cell">{item.type}</td>
                      <td className="px-6 py-5 text-right">
                        <span className="font-bold text-lg text-neutral-900">{item.monthly}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-neutral-50 p-6 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-neutral-600 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#05c8b1]" />
                  Based on 20 hours per week (~5 hrs on weekends)
                </p>
                <Link 
                  href="/register?type=worker"
                  className="bg-[#05c8b1] hover:bg-[#00a192] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-[#05c8b1]/20"
                >
                  Start Earning Now
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 lg:gap-8 mt-10">
            {[
              { value: '₹1.5L+', label: 'Top earners make', sub: 'monthly' },
              { value: 'Weekly', label: 'Payment frequency', sub: 'Direct to bank' },
              { value: '5%', label: 'Platform fee', sub: 'Lowest in India' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-neutral-50 rounded-2xl">
                <div className="text-3xl lg:text-4xl font-bold text-[#05c8b1] mb-1">{stat.value}</div>
                <div className="font-medium text-neutral-900">{stat.label}</div>
                <div className="text-sm text-neutral-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-neutral-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 text-[#05c8b1]" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Get started in minutes, not days
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Workers Flow */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 bg-[#05c8b1] text-white px-4 py-2 rounded-xl text-sm font-bold mb-8">
                <Briefcase className="w-4 h-4" />
                For Workers
              </div>
              
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Create Profile', desc: 'Sign up in 2 minutes', icon: '📝' },
                  { step: '02', title: 'Get Verified', desc: 'Quick background check', icon: '✓' },
                  { step: '03', title: 'Find Projects', desc: 'Browse matching work', icon: '🔍' },
                  { step: '04', title: 'Deliver Work', desc: 'Complete on your time', icon: '💼' },
                  { step: '05', title: 'Get Paid', desc: 'Weekly bank transfers', icon: '💰' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{item.icon}</span>
                        <h4 className="font-bold text-white text-lg">{item.title}</h4>
                      </div>
                      <p className="text-neutral-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/register?type=worker" className="mt-8 flex items-center justify-center gap-2 bg-[#05c8b1] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#00a192] transition-all">
                Start Earning
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Employers Flow */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 bg-[#3373ff] text-white px-4 py-2 rounded-xl text-sm font-bold mb-8">
                <Users className="w-4 h-4" />
                For Companies
              </div>
              
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Create Account', desc: 'Quick company setup', icon: '🏢' },
                  { step: '02', title: 'Post Project', desc: 'Describe your needs', icon: '📋' },
                  { step: '03', title: 'Review Matches', desc: 'Get matched profiles', icon: '👥' },
                  { step: '04', title: 'Hire & Track', desc: 'Manage everything', icon: '📊' },
                  { step: '05', title: 'Pay Securely', desc: 'Release on approval', icon: '🔒' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#3373ff] to-[#1c50f5] rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{item.icon}</span>
                        <h4 className="font-bold text-white text-lg">{item.title}</h4>
                      </div>
                      <p className="text-neutral-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/register?type=client" className="mt-8 flex items-center justify-center gap-2 bg-[#3373ff] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#1c50f5] transition-all">
                Post a Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#b45309] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="w-4 h-4 fill-[#f59e0b]" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
              Trusted by <span className="text-[#05c8b1]">thousands</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Real people, real earnings, real success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                quote: "I work as a DevOps engineer on weekends and earn ₹80,000 extra per month. The 5% fee is the lowest I've seen.",
                name: 'Amit Kumar',
                role: 'DevOps Engineer, Bangalore',
                earned: '₹2,40,000 in 3 months',
                initials: 'AK',
                color: 'from-[#05c8b1] to-[#058076]',
              },
              {
                quote: "As a QA engineer, I take on projects after work hours. Made ₹65,000 last month working just 20 hours per week.",
                name: 'Priya Singh',
                role: 'QA Engineer, Pune',
                earned: '₹1,95,000 in 3 months',
                initials: 'PS',
                color: 'from-[#3373ff] to-[#1c50f5]',
              },
              {
                quote: "We found a senior cloud architect in 2 hours. Saved ₹3 lakhs vs traditional recruitment.",
                name: 'FinTech Startup',
                role: 'SaaS Company, Hyderabad',
                earned: 'Hired 8 professionals',
                initials: 'FS',
                color: 'from-[#f59e0b] to-[#d97706]',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">{testimonial.name}</div>
                    <div className="text-sm text-neutral-600">{testimonial.role}</div>
                    <div className="text-xs font-semibold text-[#05c8b1] mt-1">{testimonial.earned}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-16">
            {[
              { icon: Shield, label: 'Secure Payments', color: 'from-[#05c8b1] to-[#058076]' },
              { icon: Headphones, label: 'WhatsApp Support', color: 'from-[#3373ff] to-[#1c50f5]' },
              { icon: Users, label: '2,500+ Workers', color: 'from-[#8b5cf6] to-[#7c3aed]' },
              { icon: Award, label: '500+ Companies', color: 'from-[#f59e0b] to-[#d97706]' },
              { icon: TrendingUp, label: '₹5Cr+ Paid', color: 'from-[#10b981] to-[#059669]' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-200 text-center hover:shadow-lg transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-neutral-900 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-[2.5rem] p-12 sm:p-16 lg:p-20 text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#05c8b1]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3373ff]/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Ready to start <span className="text-[#05c8b1]">earning</span>?
              </h2>
              <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
                Join thousands of professionals building better income on their own terms
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register?type=worker"
                  className="group bg-[#05c8b1] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#00a192] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#05c8b1]/25"
                >
                  Start Earning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register?type=client"
                  className="group bg-white/10 backdrop-blur text-white px-10 py-5 rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  Hire Talent
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">2ndShift</span>
              </div>
              <p className="text-sm mb-6 max-w-sm">
                India&apos;s first legal, tax-compliant freelance platform. Work flexible. Earn more.
              </p>
              <div className="flex gap-3">
                {[Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-neutral-800 hover:bg-[#05c8b1] rounded-xl flex items-center justify-center transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-neutral-800 pt-8 pb-8">
            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#05c8b1]" />
                <a href="mailto:support@2ndshift.com" className="hover:text-white transition">support@2ndshift.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#05c8b1]" />
                <a href="tel:+911800123456" className="hover:text-white transition">+91 1800 123 456</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#05c8b1]" />
                <span>Hyderabad, India</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-neutral-800 pt-8 text-center">
            <p className="text-sm">© 2025 2ndShift Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <BackToTop />

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/918639649349"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-2xl shadow-xl shadow-[#25D366]/30 hover:scale-110 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b6b] rounded-full border-2 border-white animate-pulse"></span>
      </a>
    </div>
  )
}
