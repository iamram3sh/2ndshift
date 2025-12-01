'use client'

import Link from 'next/link'
import { 
  ArrowRight, Shield, Users, Target, Heart, Zap, Globe,
  Award, CheckCircle, Building2, Layers, MapPin, Mail,
  Linkedin, Twitter, TrendingUp, Lightbulb, Handshake
} from 'lucide-react'

const STATS = [
  { value: '100%', label: 'Tax compliant' },
  { value: 'Growing', label: 'Professional network' },
  { value: 'Weekly', label: 'Payment cycles' },
  { value: '24/7', label: 'Platform availability' },
]

const VALUES = [
  {
    icon: Shield,
    title: 'Compliance First',
    description: 'We believe every professional deserves proper tax documentation and every company deserves peace of mind.',
  },
  {
    icon: Handshake,
    title: 'Trust & Transparency',
    description: 'Clear pricing, verified profiles, and honest communication. No hidden fees, no surprises.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We\'re building more than a platform — we\'re building a community of professionals who support each other.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Constantly improving our platform with AI-powered matching, better tools, and smarter features.',
  },
]

const TEAM = [
  {
    name: 'Founder & CEO',
    role: 'Leading vision and strategy',
    avatar: 'FC',
    bio: 'Building the future of work in India.',
  },
  {
    name: 'Head of Engineering',
    role: 'Technology & Product',
    avatar: 'HE',
    bio: 'Scaling the platform for millions.',
  },
  {
    name: 'Head of Operations',
    role: 'Compliance & Support',
    avatar: 'HO',
    bio: 'Ensuring seamless experiences.',
  },
  {
    name: 'Head of Growth',
    role: 'Marketing & Partnerships',
    avatar: 'HG',
    bio: 'Connecting professionals and companies.',
  },
]

const MILESTONES = [
  { year: '2024', title: 'Founded', description: 'Started with a vision to make contract work compliant and simple.' },
  { year: '2024', title: 'Platform Launch', description: 'Launched our beta platform with core features.' },
  { year: '2025', title: 'Early Access', description: 'Opening platform to early adopters and building community.' },
  { year: '2025', title: 'Growing Community', description: 'Building a network of verified professionals.' },
  { year: 'Future', title: 'Pan-India Scale', description: 'Expanding to serve professionals and companies nationwide.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">2ndShift</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Browse Jobs
              </Link>
              <Link href="/employers" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                For Employers
              </Link>
              <Link href="/about" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                About
              </Link>
              <Link href="/contact" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold text-slate-900 mb-6">
              Making contract work
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600"> simple and compliant</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              We started 2ndShift because we saw a broken system. Talented professionals doing great work, 
              but struggling with compliance. Companies wanting flexibility, but drowning in paperwork. 
              We&apos;re here to fix that.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  The gig economy in India is booming. Millions of professionals are choosing contract work 
                  for its flexibility and earning potential. But there was a problem — compliance was a nightmare.
                </p>
                <p>
                  Workers didn&apos;t get proper TDS certificates. Companies worried about misclassification. 
                  Freelance platforms ignored Indian tax laws. Everyone was exposed to risk.
                </p>
                <p>
                  <strong className="text-slate-900">We built 2ndShift to change that.</strong> A platform where 
                  every transaction is compliant from day one. Where professionals get Form 16A and companies 
                  get proper invoices. Where trust is built through verification, not hope.
                </p>
                <p>
                  Today, we&apos;re proud to serve thousands of professionals and hundreds of companies. 
                  But we&apos;re just getting started.
                </p>
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8 lg:p-12">
              <div className="space-y-6">
                {MILESTONES.map((milestone, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 text-sm font-semibold text-slate-500">
                      {milestone.year}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{milestone.title}</div>
                      <div className="text-sm text-slate-600">{milestone.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              What We Believe In
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our values guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            Our Mission
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-6">
            To make every contract engagement in India compliant, transparent, and fair.
          </h2>
          <p className="text-xl text-slate-600">
            We envision a future where professionals can focus on doing great work, and companies 
            can build flexible teams without worrying about compliance. That&apos;s the future we&apos;re building.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-slate-400">
              Building the future of work in India.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-2xl font-semibold text-white mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{member.role}</p>
                <p className="text-sm text-slate-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
              Join us in building the future of work
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Whether you&apos;re a professional looking for opportunities or a company looking for talent, 
              we&apos;re here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register?type=worker"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition-all"
              >
                Start Earning
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?type=client"
                className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-medium border border-slate-600 hover:bg-slate-700 transition-all"
              >
                Hire Talent
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Careers CTA */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">We&apos;re hiring!</h3>
            <p className="text-slate-600 mb-4">
              Want to join our team? We&apos;re looking for passionate people to help us grow.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-slate-900 font-medium hover:text-sky-600"
            >
              View open positions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <Mail className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
              <p className="text-slate-600">hello@2ndshift.com</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <MapPin className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Location</h3>
              <p className="text-slate-600">Hyderabad, India</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <Globe className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Social</h3>
              <div className="flex items-center justify-center gap-4 mt-2">
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">2ndShift</span>
            </div>
            <p className="text-sm text-slate-500">© 2025 2ndShift Technologies Pvt. Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
