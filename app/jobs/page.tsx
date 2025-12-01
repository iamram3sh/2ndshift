'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Briefcase, Search, Filter, MapPin, Clock, DollarSign, Users, 
  ChevronDown, ChevronRight, ArrowRight, Star, Zap, TrendingUp, 
  Eye, EyeOff, Lock, Bell, CheckCircle, X, Calendar, Timer,
  Code, TestTube, Cloud, Shield, Database, Smartphone, Globe,
  Sparkles, ArrowUpRight, Building2, Flame, BadgeCheck, Mail
} from 'lucide-react'

// Sample job data - In production, this would come from your database
const SAMPLE_JOBS = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    companyLogo: '🏢',
    location: 'Remote',
    type: 'Part-time',
    duration: '3 months',
    experience: 'Senior',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    payRange: { min: 1200, max: 1800, currency: '₹', unit: 'hour' },
    postedDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    applicants: 12,
    category: 'Development',
    urgent: true,
    verified: true,
    description: 'Looking for an experienced React developer to help build our next-generation SaaS platform...',
  },
  {
    id: 2,
    title: 'QA Automation Engineer',
    company: 'FinanceHub',
    companyLogo: '💼',
    location: 'Remote',
    type: 'Project-based',
    duration: '2 months',
    experience: 'Mid-level',
    skills: ['Selenium', 'Python', 'API Testing', 'CI/CD'],
    payRange: { min: 800, max: 1200, currency: '₹', unit: 'hour' },
    postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    applicants: 8,
    category: 'QA/Testing',
    urgent: false,
    verified: true,
    description: 'Seeking a skilled QA engineer to set up automated testing framework...',
  },
  {
    id: 3,
    title: 'DevOps Engineer - AWS',
    company: 'CloudFirst Inc',
    companyLogo: '☁️',
    location: 'Remote',
    type: 'Ongoing',
    duration: '6+ months',
    experience: 'Senior',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker'],
    payRange: { min: 1500, max: 2200, currency: '₹', unit: 'hour' },
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    applicants: 15,
    category: 'DevOps',
    urgent: true,
    verified: true,
    description: 'Need an AWS expert to help migrate our infrastructure and set up CI/CD pipelines...',
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    companyLogo: '🚀',
    location: 'Remote',
    type: 'Part-time',
    duration: '4 months',
    experience: 'Mid-level',
    skills: ['Next.js', 'PostgreSQL', 'Tailwind', 'Prisma'],
    payRange: { min: 900, max: 1400, currency: '₹', unit: 'hour' },
    postedDate: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    applicants: 22,
    category: 'Development',
    urgent: false,
    verified: true,
    description: 'Join our team to build exciting features for our growing platform...',
  },
  {
    id: 5,
    title: 'Security Consultant',
    company: 'SecureNet',
    companyLogo: '🔒',
    location: 'Remote',
    type: 'Project-based',
    duration: '1 month',
    experience: 'Senior',
    skills: ['Penetration Testing', 'OWASP', 'Security Audit', 'Compliance'],
    payRange: { min: 1800, max: 2500, currency: '₹', unit: 'hour' },
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    applicants: 6,
    category: 'Security',
    urgent: false,
    verified: true,
    description: 'Conduct comprehensive security audit and penetration testing...',
  },
  {
    id: 6,
    title: 'Mobile App Developer',
    company: 'AppWorks',
    companyLogo: '📱',
    location: 'Remote',
    type: 'Part-time',
    duration: '3 months',
    experience: 'Mid-level',
    skills: ['React Native', 'iOS', 'Android', 'Firebase'],
    payRange: { min: 1000, max: 1500, currency: '₹', unit: 'hour' },
    postedDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    applicants: 18,
    category: 'Development',
    urgent: true,
    verified: true,
    description: 'Build cross-platform mobile application with React Native...',
  },
  {
    id: 7,
    title: 'Data Engineer',
    company: 'DataDriven Co',
    companyLogo: '📊',
    location: 'Remote',
    type: 'Ongoing',
    duration: '6+ months',
    experience: 'Senior',
    skills: ['Python', 'Spark', 'Airflow', 'Snowflake'],
    payRange: { min: 1300, max: 1900, currency: '₹', unit: 'hour' },
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    applicants: 9,
    category: 'Data',
    urgent: false,
    verified: true,
    description: 'Design and implement data pipelines for analytics platform...',
  },
  {
    id: 8,
    title: 'Backend Developer - Node.js',
    company: 'APIFirst',
    companyLogo: '⚡',
    location: 'Remote',
    type: 'Part-time',
    duration: '2 months',
    experience: 'Mid-level',
    skills: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    payRange: { min: 850, max: 1300, currency: '₹', unit: 'hour' },
    postedDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    applicants: 14,
    category: 'Development',
    urgent: false,
    verified: true,
    description: 'Build scalable REST APIs and microservices...',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Jobs', icon: Briefcase, count: 156 },
  { id: 'development', label: 'Development', icon: Code, count: 78 },
  { id: 'qa', label: 'QA/Testing', icon: TestTube, count: 24 },
  { id: 'devops', label: 'DevOps', icon: Cloud, count: 18 },
  { id: 'security', label: 'Security', icon: Shield, count: 12 },
  { id: 'data', label: 'Data', icon: Database, count: 15 },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, count: 9 },
]

const TRENDING_SKILLS = [
  { name: 'React', jobs: 45, trend: '+12%' },
  { name: 'AWS', jobs: 32, trend: '+18%' },
  { name: 'Python', jobs: 38, trend: '+8%' },
  { name: 'Kubernetes', jobs: 22, trend: '+25%' },
  { name: 'TypeScript', jobs: 41, trend: '+15%' },
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

function JobCard({ job, index }: { job: typeof SAMPLE_JOBS[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="group bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-xl hover:border-[#05c8b1]/30 transition-all duration-300 animate-in slide-in-from-bottom"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Company Logo - Blurred */}
          <div className="relative">
            <div className="w-14 h-14 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl blur-[2px] select-none">
              {job.companyLogo}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#05c8b1] transition-colors">
              {job.title}
            </h3>
            {/* Company Name - Hidden */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-neutral-400">
                <Building2 className="w-4 h-4" />
                <span className="text-sm bg-neutral-200 text-transparent select-none rounded px-8">Hidden</span>
              </div>
              {job.verified && (
                <span className="flex items-center gap-1 text-xs text-[#05c8b1] font-medium">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex flex-col items-end gap-2">
          {job.urgent && (
            <span className="flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-lg">
              <Flame className="w-3 h-3" />
              Urgent
            </span>
          )}
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(job.postedDate)}
          </span>
        </div>
      </div>
      
      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <span 
            key={skill}
            className="bg-neutral-100 text-neutral-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#05c8b1]/10 hover:text-[#05c8b1] transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <MapPin className="w-4 h-4 text-neutral-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Timer className="w-4 h-4 text-neutral-400" />
          {job.duration}
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Briefcase className="w-4 h-4 text-neutral-400" />
          {job.type}
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Users className="w-4 h-4 text-neutral-400" />
          {job.applicants} applied
        </div>
      </div>
      
      {/* Pay Range */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <div>
          <span className="text-2xl font-bold text-[#05c8b1]">
            {job.payRange.currency}{job.payRange.min} - {job.payRange.max}
          </span>
          <span className="text-neutral-500 text-sm">/{job.payRange.unit}</span>
        </div>
        
        {/* CTA */}
        <Link 
          href="/register?type=worker"
          className="group/btn flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#05c8b1] transition-all"
        >
          <span>Apply</span>
          <Lock className="w-4 h-4 group-hover/btn:hidden" />
          <ArrowRight className="w-4 h-4 hidden group-hover/btn:block" />
        </Link>
      </div>
      
      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-end justify-center pb-20">
          <span className="text-white font-medium flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Sign up to see company details
          </span>
        </div>
      )}
    </div>
  )
}

export default function PublicJobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [emailForAlerts, setEmailForAlerts] = useState('')
  const [alertSubmitted, setAlertSubmitted] = useState(false)
  const [liveStats, setLiveStats] = useState({
    newJobsToday: 23,
    totalPaidThisWeek: '₹12.5L',
    activeWorkers: 847,
  })
  
  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        newJobsToday: prev.newJobsToday + Math.floor(Math.random() * 2),
        activeWorkers: prev.activeWorkers + Math.floor(Math.random() * 3) - 1,
      }))
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  const filteredJobs = SAMPLE_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || 
                           job.category.toLowerCase().includes(selectedCategory.toLowerCase())
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
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-neutral-900">
                2nd<span className="text-[#05c8b1]">Shift</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-neutral-600 hover:text-neutral-900 font-medium px-4 py-2 hidden sm:block">
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-neutral-900 text-white px-5 py-2 rounded-xl font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Live Stats Ticker */}
      <div className="bg-neutral-900 text-white py-2.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-neutral-400">Live</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#05c8b1]" />
              <span><strong className="text-white">{liveStats.newJobsToday}</strong> new jobs today</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#05c8b1]" />
              <span><strong className="text-white">{liveStats.totalPaidThisWeek}</strong> paid this week</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Users className="w-4 h-4 text-[#05c8b1]" />
              <span><strong className="text-white">{liveStats.activeWorkers}</strong> professionals online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#fafafa] pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#05c8b1]/10 border border-[#05c8b1]/20 text-[#058076] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>156+ Active Opportunities</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
              Find Your Next <span className="text-[#05c8b1]">Side Project</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Browse real opportunities from verified companies. Sign up to apply and see full details.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, skill, or keyword..."
                className="w-full pl-12 pr-32 py-4 bg-white border-2 border-neutral-200 rounded-2xl focus:border-[#05c8b1] focus:ring-4 focus:ring-[#05c8b1]/10 transition-all outline-none text-lg"
              />
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-xl font-medium transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              {/* Categories */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 mb-6">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#05c8b1]" />
                  Categories
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-[#05c8b1]/10 text-[#05c8b1]'
                          : 'hover:bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </span>
                      <span className={`text-sm ${selectedCategory === cat.id ? 'text-[#05c8b1]' : 'text-neutral-400'}`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Trending Skills */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 mb-6">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#05c8b1]" />
                  Trending Skills
                </h3>
                <div className="space-y-3">
                  {TRENDING_SKILLS.map((skill, i) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-400 w-4">{i + 1}</span>
                        <span className="font-medium text-neutral-700">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500">{skill.jobs} jobs</span>
                        <span className="text-xs text-green-600 font-medium">{skill.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Job Alerts */}
              <div className="bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-bold">Job Alerts</h3>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  Get notified when new jobs match your skills
                </p>
                {alertSubmitted ? (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-5 h-5" />
                    <span>You&apos;re subscribed!</span>
                  </div>
                ) : (
                  <form onSubmit={handleAlertSubmit}>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={emailForAlerts}
                        onChange={(e) => setEmailForAlerts(e.target.value)}
                        placeholder="Your email"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full mt-3 bg-white text-[#05c8b1] py-2.5 rounded-xl font-semibold hover:bg-white/90 transition-colors text-sm"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
              
              {/* Salary Insights */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 mt-6">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#05c8b1]" />
                  Avg. Hourly Rates
                </h3>
                <div className="space-y-3">
                  {[
                    { role: 'Senior Developer', rate: '₹1,200-1,800' },
                    { role: 'DevOps Engineer', rate: '₹1,400-2,000' },
                    { role: 'QA Engineer', rate: '₹700-1,100' },
                    { role: 'Security Expert', rate: '₹1,600-2,500' },
                  ].map((item) => (
                    <div key={item.role} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">{item.role}</span>
                      <span className="text-sm font-bold text-[#05c8b1]">{item.rate}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/register?type=worker" 
                  className="flex items-center justify-center gap-1 mt-4 text-sm text-[#05c8b1] font-medium hover:underline"
                >
                  See full salary data
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
            
            {/* Jobs List */}
            <main className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {filteredJobs.length} Jobs Found
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Sign up to apply and see company details
                  </p>
                </div>
                <select className="bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#05c8b1]/20">
                  <option>Most Recent</option>
                  <option>Highest Pay</option>
                  <option>Most Applied</option>
                </select>
              </div>
              
              {/* Job Cards */}
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} />
                ))}
              </div>
              
              {/* Load More */}
              <div className="mt-8 text-center">
                <Link
                  href="/register?type=worker"
                  className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Sign Up to See 148 More Jobs
                </Link>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#05c8b1]/10 border border-[#05c8b1]/20 text-[#058076] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Join 2,500+ Professionals
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Ready to Start <span className="text-[#05c8b1]">Earning</span>?
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Create your free account in 2 minutes. Get verified in 24 hours. Start earning immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=worker"
              className="bg-[#05c8b1] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00a192] transition-all shadow-lg shadow-[#05c8b1]/25 flex items-center justify-center gap-2"
            >
              Start Earning
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register?type=client"
              className="bg-neutral-100 text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
            >
              Post a Job
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#05c8b1]" />
              100% Free to Join
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#05c8b1]" />
              Weekly Payouts
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#05c8b1]" />
              Only 5% Fee
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#05c8b1]" />
              Tax Compliant
            </span>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#05c8b1] to-[#058076] rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">2ndShift</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <p className="text-sm">© 2025 2ndShift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
