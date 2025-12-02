'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, Filter, MapPin, Clock, Users, ChevronDown, ArrowRight, 
  Zap, Lock, Bell, CheckCircle, X, Timer, Code, TestTube, Cloud, 
  Shield, Database, Smartphone, Mail, ArrowUpRight, Building2, 
  BadgeCheck, Briefcase, Layers, Menu, TrendingUp, DollarSign
} from 'lucide-react'

const SAMPLE_JOBS = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    type: 'Contract',
    duration: '3 months',
    experience: 'Senior',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    rate: { min: 1200, max: 1800 },
    postedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    applicants: 12,
    category: 'development',
    urgent: true,
    verified: true,
  },
  {
    id: 2,
    title: 'QA Automation Engineer',
    company: 'FinanceHub',
    location: 'Remote',
    type: 'Project',
    duration: '2 months',
    experience: 'Mid-level',
    skills: ['Selenium', 'Python', 'API Testing', 'CI/CD'],
    rate: { min: 800, max: 1200 },
    postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    applicants: 8,
    category: 'qa',
    urgent: false,
    verified: true,
  },
  {
    id: 3,
    title: 'DevOps Engineer - AWS',
    company: 'CloudFirst Inc',
    location: 'Remote',
    type: 'Part-time',
    duration: '6+ months',
    experience: 'Senior',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker'],
    rate: { min: 1500, max: 2200 },
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    applicants: 15,
    category: 'devops',
    urgent: true,
    verified: true,
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Contract',
    duration: '4 months',
    experience: 'Mid-level',
    skills: ['Next.js', 'PostgreSQL', 'Tailwind', 'Prisma'],
    rate: { min: 900, max: 1400 },
    postedDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    applicants: 22,
    category: 'development',
    urgent: false,
    verified: true,
  },
  {
    id: 5,
    title: 'Security Consultant',
    company: 'SecureNet',
    location: 'Remote',
    type: 'Project',
    duration: '1 month',
    experience: 'Senior',
    skills: ['Penetration Testing', 'OWASP', 'Security Audit'],
    rate: { min: 1800, max: 2500 },
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    applicants: 6,
    category: 'security',
    urgent: false,
    verified: true,
  },
  {
    id: 6,
    title: 'Mobile App Developer',
    company: 'AppWorks',
    location: 'Remote',
    type: 'Contract',
    duration: '3 months',
    experience: 'Mid-level',
    skills: ['React Native', 'iOS', 'Android', 'Firebase'],
    rate: { min: 1000, max: 1500 },
    postedDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    applicants: 18,
    category: 'development',
    urgent: true,
    verified: true,
  },
  {
    id: 7,
    title: 'Data Engineer',
    company: 'DataDriven Co',
    location: 'Remote',
    type: 'Part-time',
    duration: '6+ months',
    experience: 'Senior',
    skills: ['Python', 'Spark', 'Airflow', 'Snowflake'],
    rate: { min: 1300, max: 1900 },
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    applicants: 9,
    category: 'data',
    urgent: false,
    verified: true,
  },
  {
    id: 8,
    title: 'Backend Developer - Node.js',
    company: 'APIFirst',
    location: 'Remote',
    type: 'Contract',
    duration: '2 months',
    experience: 'Mid-level',
    skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    rate: { min: 850, max: 1300 },
    postedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    applicants: 14,
    category: 'development',
    urgent: false,
    verified: true,
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Categories', count: 156 },
  { id: 'development', label: 'Development', count: 78 },
  { id: 'qa', label: 'QA & Testing', count: 24 },
  { id: 'devops', label: 'DevOps & Cloud', count: 18 },
  { id: 'security', label: 'Security', count: 12 },
  { id: 'data', label: 'Data Engineering', count: 15 },
  { id: 'mobile', label: 'Mobile', count: 9 },
  { id: 'programming', label: 'Senior Backend & Systems Programming', count: 20 },
]

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [emailForAlerts, setEmailForAlerts] = useState('')
  const [alertSubmitted, setAlertSubmitted] = useState(false)
  
  const filteredJobs = SAMPLE_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailForAlerts) {
      setAlertSubmitted(true)
      setTimeout(() => {
        setAlertSubmitted(false)
        setEmailForAlerts('')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-[#111]">2ndShift</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-[#333] hover:text-[#111] font-medium">Home</Link>
              <Link href="/employers" className="text-sm text-[#333] hover:text-[#111] font-medium">For Employers</Link>
              <Link href="/workers" className="text-sm text-[#333] hover:text-[#111] font-medium">For Professionals</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-[#333] hover:text-[#111] font-medium hidden sm:block">
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Get Started
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#333]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Stats Bar */}
      <div className="bg-slate-900 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span><strong className="text-white">23</strong> new today</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-white">₹12.5L</strong> paid this week</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-300">
              <Users className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-white">847</strong> active professionals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-semibold text-[#111] tracking-tight mb-2">
              Browse Opportunities
            </h1>
            <p className="text-[#333]">
              {filteredJobs.length} positions available. Sign up to apply and see company details.
            </p>
          </div>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-[#333] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, skill, or keyword..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <h3 className="font-semibold text-[#111] mb-4 text-sm">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'text-[#333] hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-medium">{cat.label}</span>
                    <span className={`text-xs ${selectedCategory === cat.id ? 'text-slate-300' : 'text-[#333]'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Job Alerts */}
            <div className="bg-slate-900 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Job Alerts</h3>
              </div>
              <p className="text-xs text-white mb-4">
                Get notified when new jobs match your skills
              </p>
              {alertSubmitted ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleAlertSubmit}>
                  <input
                    type="email"
                    value={emailForAlerts}
                    onChange={(e) => setEmailForAlerts(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-white/30 mb-3"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full bg-white text-[#111] py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Avg Rates */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mt-6">
              <h3 className="font-semibold text-[#111] mb-4 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Avg. Hourly Rates
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { role: 'Senior Developer', rate: '₹1,200-1,800' },
                  { role: 'DevOps Engineer', rate: '₹1,400-2,000' },
                  { role: 'QA Engineer', rate: '₹700-1,100' },
                  { role: 'Security Expert', rate: '₹1,600-2,500' },
                ].map((item) => (
                  <div key={item.role} className="flex items-center justify-between">
                    <span className="text-[#333]">{item.role}</span>
                    <span className="font-medium text-[#111]">{item.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Jobs List */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#333]">
                Showing <strong>{filteredJobs.length}</strong> opportunities
              </p>
              <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-slate-100">
                <option>Most Recent</option>
                <option>Highest Pay</option>
                <option>Most Applied</option>
              </select>
            </div>
            
            {/* Job Cards */}
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {/* Company Placeholder - Locked */}
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[#333]" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-[#111] group-hover:text-sky-600 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-[#333]">
                          <Building2 className="w-4 h-4" />
                          <span>Company visible after signup</span>
                          {job.verified && (
                            <span className="flex items-center gap-1 text-emerald-600 ml-2">
                              <BadgeCheck className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {job.urgent && (
                        <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-md border border-amber-200">
                          Urgent
                        </span>
                      )}
                      <span className="text-xs text-[#333]">
                        {formatTimeAgo(job.postedDate)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2.5 py-1 text-xs font-medium text-[#333] bg-slate-100 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-[#333] mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Timer className="w-4 h-4" />
                      {job.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {job.applicants} applied
                    </span>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-semibold text-[#111]">
                        ₹{job.rate.min.toLocaleString()} - {job.rate.max.toLocaleString()}
                      </span>
                      <span className="text-[#333] text-sm">/hr</span>
                    </div>
                    
                    <Link 
                      href="/register?type=worker"
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      Apply
                      <Lock className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More */}
            <div className="mt-8 text-center">
              <Link
                href="/register?type=worker"
                className="inline-flex items-center gap-2 bg-slate-100 text-[#111] px-6 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Sign up to see 148 more opportunities
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* CTA Banner */}
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
            Ready to start earning?
          </h2>
          <p className="text-white mb-8">
            Create your free profile in 2 minutes. Get verified in 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=worker"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#111] px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors"
            >
              Create Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register?type=client"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-6 py-3 rounded-xl font-medium border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              Post a Requirement
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Trust */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Free to join
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Weekly payouts
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Only 5% fee
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Tax compliant
            </span>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-[#111]">2ndShift</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#333]">
              <Link href="/about" className="hover:text-[#111] transition-colors">About</Link>
              <Link href="/terms" className="hover:text-[#111] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[#111] transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-[#111] transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-[#333]">© 2025 2ndShift</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
