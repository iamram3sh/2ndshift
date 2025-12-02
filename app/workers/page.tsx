'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, Filter, MapPin, Star, Clock, CheckCircle, BadgeCheck, 
  Briefcase, Users, ChevronDown, ArrowRight, Zap, Shield, Award,
  Code, Palette, Database, Cloud, Smartphone, TestTube, Lock,
  TrendingUp, DollarSign, X, Layers, Menu, Play, MessageSquare,
  Building2, Monitor, Heart, Calculator, Wrench, Radio
} from 'lucide-react'
import type { Industry } from '@/types/categories'

const SKILL_CATEGORIES = [
  { id: 'all', label: 'All Skills', icon: Users },
  { id: 'development', label: 'Development', icon: Code },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'data', label: 'Data & Analytics', icon: Database },
  { id: 'devops', label: 'DevOps & Cloud', icon: Cloud },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
  { id: 'qa', label: 'QA & Testing', icon: TestTube },
]

const INDUSTRY_ICONS: Record<string, any> = {
  it: Monitor,
  design: Palette,
  marketing: TrendingUp,
  finance: Calculator,
  healthcare: Heart,
  engineering: Wrench,
  telecom: Radio,
}

const FEATURED_PROFESSIONALS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    title: 'Senior Full Stack Developer',
    avatar: 'RS',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    rating: 4.9,
    reviews: 47,
    hourlyRate: 1500,
    completedProjects: 52,
    responseTime: '< 2 hours',
    location: 'Bangalore',
    verified: true,
    topRated: true,
    available: true,
    successRate: 98,
    bio: 'Building scalable web applications for 8+ years. Ex-Amazon, Ex-Flipkart.',
  },
  {
    id: 2,
    name: 'Priya Patel',
    title: 'UI/UX Designer',
    avatar: 'PP',
    skills: ['Figma', 'UI Design', 'Design Systems', 'Prototyping'],
    rating: 4.8,
    reviews: 38,
    hourlyRate: 1200,
    completedProjects: 41,
    responseTime: '< 1 hour',
    location: 'Mumbai',
    verified: true,
    topRated: true,
    available: true,
    successRate: 96,
    bio: 'Crafting beautiful user experiences. Worked with 30+ startups.',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    title: 'DevOps Architect',
    avatar: 'AK',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
    rating: 4.9,
    reviews: 29,
    hourlyRate: 2000,
    completedProjects: 34,
    responseTime: '< 3 hours',
    location: 'Hyderabad',
    verified: true,
    topRated: false,
    available: true,
    successRate: 100,
    bio: 'Cloud infrastructure specialist. AWS Certified Solutions Architect.',
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    title: 'Data Scientist',
    avatar: 'SR',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    rating: 4.7,
    reviews: 23,
    hourlyRate: 1800,
    completedProjects: 28,
    responseTime: '< 4 hours',
    location: 'Chennai',
    verified: true,
    topRated: false,
    available: false,
    successRate: 95,
    bio: 'Data-driven solutions for business problems. PhD from IIT.',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    title: 'Mobile App Developer',
    avatar: 'VS',
    skills: ['React Native', 'iOS', 'Android', 'Firebase'],
    rating: 4.8,
    reviews: 31,
    hourlyRate: 1400,
    completedProjects: 36,
    responseTime: '< 2 hours',
    location: 'Delhi',
    verified: true,
    topRated: true,
    available: true,
    successRate: 97,
    bio: 'Built 20+ apps with 1M+ downloads. Focus on performance.',
  },
  {
    id: 6,
    name: 'Deepa Menon',
    title: 'QA Lead',
    avatar: 'DM',
    skills: ['Selenium', 'Cypress', 'API Testing', 'Performance Testing'],
    rating: 4.9,
    reviews: 42,
    hourlyRate: 1100,
    completedProjects: 48,
    responseTime: '< 1 hour',
    location: 'Pune',
    verified: true,
    topRated: true,
    available: true,
    successRate: 99,
    bio: 'Quality advocate with 10+ years experience. ISTQB Certified.',
  },
]

const STATS = [
  { value: '500+', label: 'Professionals' },
  { value: '95%', label: 'Success Rate' },
  { value: '24hr', label: 'Avg. Response' },
  { value: 'Growing', label: 'Every Day' },
]

function WorkersPageContent() {
  const searchParams = useSearchParams()
  const industryFromUrl = searchParams.get('industry')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(industryFromUrl)
  const [industries, setIndustries] = useState<Industry[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    fetchIndustries()
    checkAuth()
  }, [])

  useEffect(() => {
    if (industryFromUrl) {
      setSelectedIndustry(industryFromUrl)
    }
  }, [industryFromUrl])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/get-profile')
      const data = await response.json()
      if (data.user) {
        setIsLoggedIn(true)
        setUserType(data.user.user_type)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    }
  }

  const fetchIndustries = async () => {
    try {
      const response = await fetch('/api/industries')
      const data = await response.json()
      setIndustries(data.industries || [])
    } catch (error) {
      console.error('Error fetching industries:', error)
    }
  }

  const getInviteLink = () => {
    if (isLoggedIn && userType === 'client') {
      return '/projects/create'
    }
    return '/register?type=client'
  }

  const selectedIndustryData = industries.find(i => i.slug === selectedIndustry)

  const filteredProfessionals = FEATURED_PROFESSIONALS.filter(pro => {
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pro.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pro.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-slate-900">2ndShift</span>
              </Link>
              
              <div className="hidden lg:flex items-center gap-1">
                {isLoggedIn ? (
                  <>
                    <Link 
                      href={userType === 'client' ? '/client' : '/worker'} 
                      className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <Link href="/workers" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                      Find Talent
                    </Link>
                    <Link href="/messages" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                      Messages
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/industries" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                      Browse Industries
                    </Link>
                    <Link href="/workers" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                      Find Talent
                    </Link>
                    <Link href="/how-it-works" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                      How It Works
                    </Link>
                    <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                      Pricing
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link 
                  href={userType === 'client' ? '/projects/create' : '/worker/discover'} 
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
                >
                  {userType === 'client' ? 'Post a Project' : 'Find Work'}
                </Link>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                    Sign in
                  </Link>
                  <Link 
                    href="/register?type=client" 
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
                  >
                    Post a Project
                  </Link>
                </>
              )}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-slate-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {selectedIndustryData ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Link 
                    href="/workers"
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    All Industries
                  </Link>
                  <span className="text-slate-400">/</span>
                  <span className="text-sm text-sky-400 font-medium">{selectedIndustryData.name}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
                  {selectedIndustryData.name} Professionals
                </h1>
                <p className="text-lg text-slate-300">
                  {selectedIndustryData.description || `Find verified ${selectedIndustryData.name} professionals`}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
                  Find India&apos;s Top Talent
                </h1>
                <p className="text-lg text-slate-300">
                  Verified professionals across multiple industries. All compliance handled.
                </p>
              </>
            )}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-2 flex items-center gap-2 shadow-lg">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by skill, role, or name..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none text-slate-900"
                />
              </div>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl font-semibold text-white">{stat.value}</div>
                <div className="text-sm text-white mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
              {/* Industries */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Industries</h3>
                  <Link href="/industries" className="text-xs text-sky-600 hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedIndustry(null)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      !selectedIndustry
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="font-medium">All Industries</span>
                  </button>
                  {industries.slice(0, 8).map((ind) => {
                    const Icon = INDUSTRY_ICONS[ind.slug] || Building2
                    return (
                      <button
                        key={ind.id}
                        onClick={() => setSelectedIndustry(ind.slug)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedIndustry === ind.slug
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{ind.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Skill Categories */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Skill Categories</h3>
                <div className="space-y-1">
                  {SKILL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Filters</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                    <span className="text-sm text-slate-600">Available Now</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                    <span className="text-sm text-slate-600">Top Rated</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                    <span className="text-sm text-slate-600">Verified Only</span>
                  </label>
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Hourly Rate</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rate" className="w-4 h-4 border-slate-300 text-slate-900 focus:ring-slate-500" />
                    <span className="text-sm text-slate-600">Any rate</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rate" className="w-4 h-4 border-slate-300 text-slate-900 focus:ring-slate-500" />
                    <span className="text-sm text-slate-600">Under ₹1,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rate" className="w-4 h-4 border-slate-300 text-slate-900 focus:ring-slate-500" />
                    <span className="text-sm text-slate-600">₹1,000 - ₹1,500</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rate" className="w-4 h-4 border-slate-300 text-slate-900 focus:ring-slate-500" />
                    <span className="text-sm text-slate-600">₹1,500+</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {filteredProfessionals.length} professionals found
                </h2>
                <p className="text-sm text-slate-500">
                  Showing verified professionals matching your criteria
                </p>
              </div>
              <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                <option>Best Match</option>
                <option>Highest Rated</option>
                <option>Most Experienced</option>
                <option>Lowest Rate</option>
              </select>
            </div>

            {/* Professional Cards */}
            <div className="space-y-4">
              {filteredProfessionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-xl font-semibold text-slate-600">
                          {pro.avatar}
                        </div>
                        {pro.available && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {pro.name}
                          </h3>
                          {pro.verified && (
                            <span className="flex items-center gap-1 text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                              <BadgeCheck className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                          {pro.topRated && (
                            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                              <Award className="w-3 h-3" />
                              Top Rated
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 mt-1">{pro.title}</p>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{pro.bio}</p>
                        
                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {pro.skills.map((skill) => (
                            <span key={skill} className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="lg:w-56 flex-shrink-0">
                      <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:gap-2">
                        <div className="lg:text-right">
                          <div className="text-2xl font-semibold text-slate-900">
                            ₹{pro.hourlyRate.toLocaleString()}<span className="text-sm font-normal text-slate-500">/hr</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 lg:justify-end">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-slate-900">{pro.rating}</span>
                            <span className="text-sm text-slate-500">({pro.reviews})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Success Rate</span>
                          <span className="font-medium text-emerald-600">{pro.successRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Projects</span>
                          <span className="font-medium text-slate-900">{pro.completedProjects}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Response</span>
                          <span className="font-medium text-slate-900">{pro.responseTime}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link
                          href={getInviteLink()}
                          className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium text-center hover:bg-slate-800 transition-all"
                        >
                          {isLoggedIn && userType === 'client' ? 'Create Project' : 'Invite to Project'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              {isLoggedIn ? (
                <button className="inline-flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-all">
                  Load More Professionals
                </button>
              ) : (
                <Link
                  href="/register?type=client"
                  className="inline-flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  Sign up to see more professionals
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
            Ready to build your team?
          </h2>
          <p className="text-slate-300 mb-8">
            Post your project and get proposals from verified professionals within hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=client"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition-all"
            >
              Post a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-medium border border-slate-700 hover:bg-slate-800 transition-all"
            >
              Learn How It Works
            </Link>
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
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-slate-500">© 2025 2ndShift</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Wrap in Suspense for useSearchParams
export default function WorkersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    }>
      <WorkersPageContent />
    </Suspense>
  )
}
