'use client'

import Link from 'next/link'
import { 
  ArrowRight, Briefcase, Shield, CheckCircle, Users, TrendingUp, 
  Award, Star, Zap, Lock, FileCheck, ChevronRight, Mail, Phone, 
  MapPin, Linkedin, Twitter, ArrowUpRight, Target, Building2, 
  Globe, Clock, BadgeCheck, Play, ChevronDown, Menu, X, 
  BarChart3, CreditCard, FileText, Headphones, Layers
} from 'lucide-react'
import { useState, useEffect } from 'react'

// Company logos for social proof
const TRUSTED_BY = [
  { name: 'TechCorp', initial: 'T' },
  { name: 'FinanceHub', initial: 'F' },
  { name: 'DataDriven', initial: 'D' },
  { name: 'CloudFirst', initial: 'C' },
  { name: 'SecureNet', initial: 'S' },
  { name: 'ScaleUp', initial: 'S' },
]

const STATS = [
  { value: '₹15Cr+', label: 'Paid to professionals', icon: CreditCard },
  { value: '5,000+', label: 'Verified professionals', icon: Users },
  { value: '500+', label: 'Enterprise clients', icon: Building2 },
  { value: '98.5%', label: 'Compliance rate', icon: Shield },
]

const SAMPLE_JOBS = [
  {
    title: 'Senior Backend Engineer',
    skills: ['Node.js', 'PostgreSQL', 'AWS'],
    rate: '₹1,500-2,200',
    type: 'Contract',
    posted: '2h ago',
    urgent: true,
  },
  {
    title: 'DevOps Architect',
    skills: ['Kubernetes', 'Terraform', 'CI/CD'],
    rate: '₹1,800-2,500',
    type: 'Part-time',
    posted: '4h ago',
    urgent: true,
  },
  {
    title: 'Full Stack Developer',
    skills: ['React', 'TypeScript', 'GraphQL'],
    rate: '₹1,200-1,800',
    type: 'Project',
    posted: '6h ago',
    urgent: false,
  },
  {
    title: 'Security Consultant',
    skills: ['Penetration Testing', 'OWASP', 'Compliance'],
    rate: '₹2,000-3,000',
    type: 'Contract',
    posted: '1d ago',
    urgent: false,
  },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900 tracking-tight">
                2ndShift
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/jobs" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                Browse Jobs
              </Link>
              <Link href="/employers" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                For Employers
              </Link>
              <Link href="/workers" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                For Professionals
              </Link>
              <Link href="/pricing" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                About
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-800 transition-all shadow-sm"
              >
                Get Started
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {[
                { label: 'Browse Jobs', href: '/jobs' },
                { label: 'For Employers', href: '/employers' },
                { label: 'For Professionals', href: '/workers' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'About', href: '/about' },
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-200 mt-4">
                <Link href="/login" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/40 via-transparent to-transparent"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-fade-in">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-600">
                156 opportunities available today
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight mb-6 animate-slide-up">
              The compliant way to build
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                your extended team
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
              Access India&apos;s largest network of verified professionals. 
              Full TDS & GST compliance, professional contracts, and weekly payouts built-in.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up delay-200">
              <Link 
                href="/jobs"
                className="group inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                Browse Opportunities
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link 
                href="/employers"
                className="group inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3.5 rounded-xl font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                For Employers
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-500 animate-slide-up delay-300">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                100% Tax Compliant
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                Verified Professionals
              </span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                Secure Payments
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Legal Contracts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl font-semibold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 mb-8">
            TRUSTED BY LEADING COMPANIES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {TRUSTED_BY.map((company, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                  {company.initial}
                </div>
                <span className="font-medium">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Opportunities */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 mb-3">
                <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
                Live Opportunities
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">
                Available positions
              </h2>
              <p className="text-slate-600 mt-2">
                Browse opportunities without signing up. Apply when you&apos;re ready.
              </p>
            </div>
            <Link 
              href="/jobs"
              className="inline-flex items-center gap-2 text-slate-900 font-medium hover:text-sky-600 transition-colors"
            >
              View all opportunities
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Jobs Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {SAMPLE_JOBS.map((job, i) => (
              <Link
                key={i}
                href="/jobs"
                className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Company visible after signup</span>
                    </div>
                  </div>
                  {job.urgent && (
                    <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-md border border-amber-200">
                      Urgent
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{job.rate}<span className="text-sm font-normal text-slate-500">/hr</span></div>
                    <div className="text-xs text-slate-500">{job.type} · {job.posted}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-10">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              Browse all 156+ opportunities
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Two-Column Value Prop */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Professionals */}
            <div className="bg-white p-8 lg:p-10 rounded-2xl border border-slate-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                For Professionals
              </div>

              <h3 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-4">
                Earn ₹50K-1.5L extra per month
              </h3>
              <p className="text-slate-600 mb-8">
                Work with top companies on your own schedule. Weekly payouts, lowest fees, full compliance.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { label: 'Weekly direct payouts', desc: 'Money in your account every week' },
                  { label: 'Only 5% platform fee', desc: 'Keep 95% of what you earn' },
                  { label: 'Full tax compliance', desc: 'TDS, GST, Form 16A included' },
                  { label: 'Verified opportunities', desc: 'Work with real, vetted companies' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">{item.label}</div>
                      <div className="text-sm text-slate-500">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link 
                href="/register?type=worker"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-all"
              >
                Start earning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For Employers */}
            <div className="bg-slate-900 p-8 lg:p-10 rounded-2xl text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                For Employers
              </div>

              <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
                Scale your team instantly
              </h3>
              <p className="text-slate-300 mb-8">
                Access verified professionals on-demand. No recruitment overhead, full compliance handled.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { label: 'Pre-vetted professionals', desc: '5,000+ verified experts ready to work' },
                  { label: 'Hire in 48 hours', desc: 'Get matched with the right talent fast' },
                  { label: 'Zero compliance burden', desc: 'We handle TDS, contracts, and payments' },
                  { label: '60% cost savings', desc: 'Compared to traditional staffing agencies' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-slate-400">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link 
                href="/register?type=client"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-100 transition-all"
              >
                Post a requirement
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get started in minutes, not days. Our streamlined process ensures quick onboarding and faster time to productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your profile',
                description: 'Sign up in 2 minutes. Add your skills, experience, and availability.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Get verified',
                description: 'Our team verifies your credentials within 24 hours. Background checks included.',
                icon: BadgeCheck,
              },
              {
                step: '03',
                title: 'Start working',
                description: 'Browse opportunities, accept projects, and get paid weekly.',
                icon: Zap,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-slate-100 mb-4">{item.step}</div>
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
              Built for compliance & trust
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Every transaction is tax-compliant, every professional is verified, every payment is secure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'TDS Compliance', description: 'Automatic TDS deduction and filing. Form 16A provided.' },
              { icon: FileText, title: 'Legal Contracts', description: 'Professional service agreements and NDAs auto-generated.' },
              { icon: CreditCard, title: 'Secure Payments', description: 'Bank-grade security. Escrow protection on all projects.' },
              { icon: BadgeCheck, title: 'Verified Profiles', description: 'Background checks and skill assessments for all professionals.' },
              { icon: BarChart3, title: 'Transparent Pricing', description: 'No hidden fees. Clear breakdown of all costs upfront.' },
              { icon: Headphones, title: 'Dedicated Support', description: '24/7 support via chat, email, and phone.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <feature.icon className="w-10 h-10 text-sky-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
              Trusted by thousands
            </h2>
            <p className="text-lg text-slate-600">
              Hear from professionals and companies using 2ndShift
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finally, a platform that handles all the compliance headaches. I just focus on delivering great work.",
                name: "Rahul Sharma",
                role: "Senior Developer",
                earned: "₹3.2L earned",
              },
              {
                quote: "We scaled our engineering team from 5 to 25 in three months. The quality of talent is exceptional.",
                name: "Priya Patel",
                role: "CTO, FinanceHub",
                earned: "15 contractors hired",
              },
              {
                quote: "Weekly payouts and automatic TDS filing. It's how freelancing should always have been.",
                name: "Amit Kumar",
                role: "DevOps Engineer",
                earned: "₹2.8L earned",
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-xl">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className="text-sm font-medium text-emerald-600">{testimonial.earned}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals and companies building the future of work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-medium hover:bg-slate-100 transition-all"
            >
              Browse opportunities
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/register?type=client"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-xl font-medium border border-slate-700 hover:bg-slate-800 transition-all"
            >
              Post a requirement
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-slate-900">2ndShift</span>
              </Link>
              <p className="text-sm text-slate-500 mb-4">
                India&apos;s compliant talent platform.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/jobs" className="text-slate-600 hover:text-slate-900 transition-colors">Browse Jobs</Link></li>
                <li><Link href="/workers" className="text-slate-600 hover:text-slate-900 transition-colors">For Professionals</Link></li>
                <li><Link href="/employers" className="text-slate-600 hover:text-slate-900 transition-colors">For Employers</Link></li>
                <li><Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</Link></li>
                <li><Link href="/careers" className="text-slate-600 hover:text-slate-900 transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="text-slate-600 hover:text-slate-900 transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/security" className="text-slate-600 hover:text-slate-900 transition-colors">Security</Link></li>
                <li><Link href="/compliance" className="text-slate-600 hover:text-slate-900 transition-colors">Compliance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@2ndshift.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +91 1800 123 456
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Hyderabad, India
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2025 2ndShift Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                SOC 2 Compliant
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                ISO 27001
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
