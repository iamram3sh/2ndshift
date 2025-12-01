'use client'

import Link from 'next/link'
import { 
  ArrowRight, Briefcase, Shield, CheckCircle, Users, TrendingUp, 
  Award, Star, Zap, Lock, FileCheck, ChevronRight, Mail, Phone, 
  MapPin, Linkedin, Twitter, ArrowUpRight, Target, Building2, 
  Globe, Clock, BadgeCheck, Play, ChevronDown, Menu, X, 
  BarChart3, CreditCard, FileText, Headphones, Layers, Timer,
  Wallet, Calendar, Coffee, Sparkles, Heart, IndianRupee
} from 'lucide-react'
import { useState, useEffect } from 'react'

// What makes us different
const VALUE_PROPS = [
  { icon: Shield, label: 'TDS & GST Handled' },
  { icon: Lock, label: 'Secure Escrow Payments' },
  { icon: Clock, label: 'Flexible: Hourly to Full-time' },
  { icon: Star, label: 'Verified Professionals' },
]

const SAMPLE_JOBS = [
  {
    title: 'React Native Developer',
    skills: ['React Native', 'TypeScript', 'Firebase'],
    budget: '₹40,000 - ₹60,000',
    duration: '2-3 weeks',
    type: 'Project',
    posted: 'Just now',
  },
  {
    title: 'UI/UX Designer',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    budget: '₹25,000 - ₹40,000',
    duration: '1-2 weeks',
    type: 'Project',
    posted: '1h ago',
  },
  {
    title: 'Backend Developer',
    skills: ['Node.js', 'PostgreSQL', 'AWS'],
    budget: '₹800 - ₹1,200/hr',
    duration: 'Ongoing',
    type: 'Part-time',
    posted: '2h ago',
  },
  {
    title: 'Full Stack Engineer',
    skills: ['React', 'Python', 'Docker'],
    budget: '₹1.2L - ₹1.8L/month',
    duration: '6+ months',
    type: 'Full-time',
    posted: '3h ago',
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
                Find Work
              </Link>
              <Link href="/workers" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                Hire Talent
              </Link>
              <Link href="/how-it-works" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                How It Works
              </Link>
              <Link href="/features" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                Pricing
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
                Get Started Free
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
                { label: 'Find Work', href: '/jobs' },
                { label: 'Hire Talent', href: '/workers' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Features', href: '/features' },
                { label: 'Pricing', href: '/pricing' },
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
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/40 via-transparent to-transparent"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Now open for early access
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight mb-6 animate-slide-up">
              Get work done.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                Without the hassle.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
              Whether you need a quick task done or a full-time team member, 
              find verified professionals who fit your budget and timeline. 
              <span className="font-medium text-slate-800"> All tax compliance included.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up delay-200">
              <Link 
                href="/register?type=client"
                className="group inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                I want to hire
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link 
                href="/register?type=worker"
                className="group inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3.5 rounded-xl font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                I want to work
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 animate-slide-up delay-300">
              {VALUE_PROPS.map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <item.icon className="w-4 h-4 text-emerald-600" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Tasks</h3>
              <p className="text-slate-400 text-sm">
                Logo design, bug fixes, content writing. Get small tasks done in hours, not days.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Project-Based</h3>
              <p className="text-slate-400 text-sm">
                App development, website redesign, marketing campaigns. Fixed price, clear timeline.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Full-Time Hire</h3>
              <p className="text-slate-400 text-sm">
                Need a dedicated team member? Hire full-time with all compliance handled.
              </p>
            </div>
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
                Open Opportunities
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">
                Work that fits your life
              </h2>
              <p className="text-slate-600 mt-2">
                From quick gigs to full-time roles. Choose what works for you.
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
                href="/register"
                className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {job.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Timer className="w-3.5 h-3.5" />
                      <span>{job.duration}</span>
                      <span>•</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                    job.type === 'Full-time' 
                      ? 'text-purple-700 bg-purple-50 border border-purple-200'
                      : job.type === 'Part-time'
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : 'text-sky-700 bg-sky-50 border border-sky-200'
                  }`}>
                    {job.type}
                  </span>
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
                    <div className="text-lg font-semibold text-slate-900">{job.budget}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sign Up CTA */}
          <div className="text-center mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 mb-4">
              Sign up free to see company details and apply to opportunities
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              Create Free Account
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
                Use your skills.
                <br />
                <span className="text-sky-600">Earn on your terms.</span>
              </h3>
              <p className="text-slate-600 mb-8">
                Turn your free time into income. Work on projects you love, 
                with clients who value your expertise.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { label: 'Work when you want', desc: 'Evening, weekends, or full-time - you decide' },
                  { label: 'Get paid securely', desc: 'Escrow protection ensures you always get paid' },
                  { label: 'No tax headaches', desc: 'TDS handled, Form 16A provided automatically' },
                  { label: 'Build your reputation', desc: 'Verified reviews help you land better projects' },
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
                Start Earning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For Clients */}
            <div className="bg-slate-900 p-8 lg:p-10 rounded-2xl text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                For Businesses
              </div>

              <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
                Get work done.
                <br />
                <span className="text-sky-400">Stay within budget.</span>
              </h3>
              <p className="text-slate-300 mb-8">
                From one-time tasks to building your dream team. 
                Find the right talent without the recruitment overhead.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { label: 'Find talent in hours', desc: 'Browse verified professionals, hire same day' },
                  { label: 'Flexible engagement', desc: 'Project, part-time, or full-time - your choice' },
                  { label: 'Zero compliance burden', desc: 'We handle TDS, GST, contracts - everything' },
                  { label: 'Pay only for results', desc: 'Escrow ensures you pay only when satisfied' },
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
                Post a Requirement
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why 2ndShift */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
              Why choose 2ndShift?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We built the platform we wished existed. Here&apos;s what makes us different.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Shield, 
                title: 'Complete Compliance', 
                description: 'TDS, GST, Form 16A, professional contracts - all handled automatically. No legal worries.' 
              },
              { 
                icon: Lock, 
                title: 'Payment Protection', 
                description: 'Every payment secured in escrow. Workers get paid for completed work, clients pay only when satisfied.' 
              },
              { 
                icon: Star, 
                title: 'Two-Way Reviews', 
                description: 'Workers rate clients too. Know if they pay on time before you accept. Transparency for everyone.' 
              },
              { 
                icon: Zap, 
                title: 'EarlyPay Access', 
                description: 'Workers can access earned money before project completion. Because you shouldn\'t wait to get paid.' 
              },
              { 
                icon: IndianRupee, 
                title: 'Fair Pricing', 
                description: 'Just 5-10% platform fee. No hidden charges. Transparent pricing for both sides.' 
              },
              { 
                icon: Heart, 
                title: 'Human Support', 
                description: 'Real people, not bots. WhatsApp, email, or call - we\'re here when you need help.' 
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <feature.icon className="w-10 h-10 text-sky-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
              Simple process
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Get started in minutes. No complicated onboarding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create free account',
                description: 'Sign up in 2 minutes. Add your skills or post your requirement.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Get matched',
                description: 'Our AI finds the best matches. Review profiles, chat, and decide.',
                icon: Target,
              },
              {
                step: '03',
                title: 'Start working',
                description: 'Agree on terms, we handle the paperwork. Get work done.',
                icon: Zap,
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-slate-700 mb-4">{item.step}</div>
                <div className="w-14 h-14 bg-sky-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-sky-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Our Vision
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-6">
            The future of work in India
          </h2>
          
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            We believe everyone deserves the freedom to work on their own terms. 
            Whether you&apos;re a developer coding on weekends, a designer exploring freelance, 
            or a company looking for the perfect hire - 2ndShift is building the platform 
            that makes it seamless, compliant, and fair for everyone.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700">
              🎯 Skill-based matching
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700">
              🛡️ Payment protection
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700">
              📋 Full compliance
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700">
              ⭐ Trust & transparency
            </div>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-slate-800 transition-all"
          >
            Join Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <p className="text-sm text-slate-500 mt-4">
            Free to join. First 100 users get lifetime benefits.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Join 2ndShift today. It&apos;s free to create an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register?type=worker"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-medium hover:bg-slate-100 transition-all"
            >
              I want to earn
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/register?type=client"
              className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-sky-700 transition-all"
            >
              I want to hire
              <ArrowRight className="w-4 h-4" />
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
                Work on your terms.<br />Get paid with confidence.
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
                <li><Link href="/jobs" className="text-slate-600 hover:text-slate-900 transition-colors">Find Work</Link></li>
                <li><Link href="/workers" className="text-slate-600 hover:text-slate-900 transition-colors">Hire Talent</Link></li>
                <li><Link href="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</Link></li>
                <li><Link href="/faq" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</Link></li>
                <li><Link href="/blog" className="text-slate-600 hover:text-slate-900 transition-colors">Blog</Link></li>
                <li><Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy</Link></li>
                <li><Link href="/security" className="text-slate-600 hover:text-slate-900 transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  hello@2ndshift.in
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
              © 2025 2ndShift. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
