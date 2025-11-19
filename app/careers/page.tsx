'use client'

import Link from 'next/link'
import { Briefcase, MapPin, Clock, DollarSign, TrendingUp, Users, Heart, Zap, Award } from 'lucide-react'

export default function CareersPage() {
  const openings = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Bangalore / Remote',
      type: 'Full-time',
      salary: '₹15-25 LPA',
      description: 'Build scalable features for our platform using Next.js, Node.js, and Supabase'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Bangalore / Remote',
      type: 'Full-time',
      salary: '₹12-20 LPA',
      description: 'Create beautiful, user-friendly interfaces for workers and employers'
    },
    {
      title: 'Growth Marketing Manager',
      department: 'Marketing',
      location: 'Bangalore',
      type: 'Full-time',
      salary: '₹10-18 LPA',
      description: 'Drive user acquisition and engagement through data-driven campaigns'
    },
    {
      title: 'Compliance & Legal Associate',
      department: 'Legal',
      location: 'Bangalore',
      type: 'Full-time',
      salary: '₹8-15 LPA',
      description: 'Ensure platform compliance with Indian tax and labor laws'
    }
  ]

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
              <Link href="/contact" className="text-slate-600 hover:text-indigo-600 font-medium transition">Contact</Link>
            </div>

            <Link href="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Users className="w-4 h-4" />
            Join Our Team
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Build the Future of
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Freelance Work in India
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            We&apos;re on a mission to make part-time work legal, safe, and rewarding. Join us!
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Fast Growing</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Great Culture</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>Impact Driven</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Join 2ndShift?</h2>
            <p className="text-xl text-slate-600">Perks and benefits that matter</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Competitive Salary',
                description: 'Market-leading compensation with ESOPs for early team members',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: MapPin,
                title: 'Remote Friendly',
                description: 'Work from anywhere in India. Office in Bangalore for those who prefer it',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Heart,
                title: 'Health Insurance',
                description: 'Comprehensive health coverage for you and your family',
                color: 'from-red-500 to-pink-500'
              },
              {
                icon: TrendingUp,
                title: 'Growth Opportunities',
                description: 'Learn, grow, and take on more responsibility as we scale',
                color: 'from-purple-500 to-violet-500'
              },
              {
                icon: Users,
                title: 'Amazing Team',
                description: 'Work with talented, passionate people who care about impact',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Award,
                title: 'Make an Impact',
                description: 'Help millions of Indians earn legally and safely',
                color: 'from-cyan-500 to-blue-500'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Open Positions</h2>
            <p className="text-xl text-slate-600">Join our team and make a difference</p>
          </div>

          <div className="space-y-6">
            {openings.map((job, index) => (
              <div key={index} className="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:shadow-xl hover:border-indigo-300 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-slate-900">{job.title}</h3>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                        {job.department}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/careers/apply?position=${encodeURIComponent(job.title)}`}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-6">
              Don&apos;t see a position that fits? We&apos;re always looking for talented people.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-slate-900 px-8 py-3 rounded-xl font-semibold border-2 border-slate-200 hover:border-indigo-600 hover:shadow-lg transition-all"
            >
              Send Us Your Resume
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join us in building India&apos;s most trusted platform for freelance work
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">© 2024 2ndShift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
