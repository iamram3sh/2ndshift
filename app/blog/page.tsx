'use client'

import Link from 'next/link'
import { Briefcase, Calendar, Clock, ArrowRight, User } from 'lucide-react'

const blogPosts = [
  {
    slug: 'understanding-tds-for-freelancers',
    title: 'Understanding TDS for Freelancers: A Complete Guide',
    excerpt: 'Learn everything about TDS deduction, Form 16A, and how to claim it during ITR filing. Complete guide for Indian freelancers.',
    author: 'Priya Sharma',
    date: '2025-01-15',
    readTime: '8 min read',
    category: 'Tax & Compliance',
    image: '/blog/tds-guide.jpg',
  },
  {
    slug: 'how-to-build-successful-freelance-profile',
    title: 'How to Build a Successful Freelance Profile in 2024',
    excerpt: 'Expert tips on creating a compelling profile that attracts high-paying clients. Portfolio, rates, and communication strategies.',
    author: 'Rahul Verma',
    date: '2025-01-12',
    readTime: '6 min read',
    category: 'Career Tips',
    image: '/blog/profile-building.jpg',
  },
  {
    slug: 'freelancing-from-hyderabad-tech-hub-opportunities',
    title: 'Freelancing from Hyderabad: Riding the Tech Hub Wave',
    excerpt: 'How Hyderabad\'s booming tech ecosystem creates unprecedented opportunities for freelance professionals in India.',
    author: 'Sanjay Reddy',
    date: '2025-01-11',
    readTime: '7 min read',
    category: 'Career Tips',
    image: '/blog/hyderabad-tech.jpg',
  },
  {
    slug: 'top-10-mistakes-freelancers-make',
    title: 'Top 10 Mistakes Freelancers Make (And How to Avoid Them)',
    excerpt: 'From underpricing to poor communication, learn the common pitfalls and how to navigate them successfully.',
    author: 'Anjali Desai',
    date: '2025-01-10',
    readTime: '7 min read',
    category: 'Best Practices',
    image: '/blog/mistakes.jpg',
  },
  {
    slug: 'gst-for-freelancers-explained',
    title: 'GST for Freelancers: When Do You Need to Register?',
    excerpt: 'Understand GST threshold, registration process, and invoicing requirements for freelance professionals in India.',
    author: 'Amit Kumar',
    date: '2025-01-08',
    readTime: '10 min read',
    category: 'Tax & Compliance',
    image: '/blog/gst-guide.jpg',
  },
  {
    slug: 'legal-contracts-for-freelancers',
    title: 'Why Every Freelancer Needs a Legal Contract',
    excerpt: 'Protect yourself with proper contracts. Understanding NDAs, IP rights, payment terms, and dispute resolution clauses.',
    author: 'Adv. Meera Krishnan',
    date: '2025-01-07',
    readTime: '9 min read',
    category: 'Legal',
    image: '/blog/contracts.jpg',
  },
  {
    slug: 'negotiating-rates-with-clients',
    title: 'The Art of Negotiating Rates with Clients',
    excerpt: 'Proven strategies to command higher rates without losing clients. Learn to communicate your value effectively.',
    author: 'Sneha Patel',
    date: '2025-01-05',
    readTime: '5 min read',
    category: 'Business',
    image: '/blog/negotiation.jpg',
  },
  {
    slug: 'building-portfolio-that-converts',
    title: 'Building a Portfolio That Actually Converts',
    excerpt: 'Case studies, testimonials, and showcasing results that matter. How to create a portfolio that wins high-ticket clients.',
    author: 'Karthik Menon',
    date: '2025-01-04',
    readTime: '8 min read',
    category: 'Career Tips',
    image: '/blog/portfolio.jpg',
  },
  {
    slug: 'work-life-balance-for-freelancers',
    title: 'Maintaining Work-Life Balance as a Freelancer',
    excerpt: 'Practical tips to avoid burnout, set boundaries, and create a sustainable freelance career you love.',
    author: 'Vikram Singh',
    date: '2025-01-03',
    readTime: '6 min read',
    category: 'Wellness',
    image: '/blog/work-life.jpg',
  },
  {
    slug: 'payment-delays-solutions-2024',
    title: 'How to Handle Payment Delays: A Freelancer\'s Guide',
    excerpt: 'Practical strategies for dealing with late payments, escrow protection, and legal remedies available in India.',
    author: 'Arjun Nair',
    date: '2025-01-02',
    readTime: '7 min read',
    category: 'Business',
    image: '/blog/payments.jpg',
  },
  {
    slug: 'cybersecurity-for-freelancers',
    title: 'Cybersecurity Essentials for Freelance Professionals',
    excerpt: 'Protect your business and client data with these essential security practices every freelancer should follow.',
    author: 'Dr. Priya Menon',
    date: '2023-12-30',
    readTime: '9 min read',
    category: 'Security',
    image: '/blog/security.jpg',
  },
  {
    slug: 'scaling-freelance-business-to-agency',
    title: 'From Solo Freelancer to Agency: Scaling Your Business',
    excerpt: 'When and how to scale from solo freelancing to building a team. Hiring, management, and systems that work.',
    author: 'Rohan Chatterjee',
    date: '2023-12-28',
    readTime: '11 min read',
    category: 'Business',
    image: '/blog/scaling.jpg',
  },
  {
    slug: 'remote-work-productivity-hacks',
    title: '15 Productivity Hacks for Remote Workers',
    excerpt: 'Boost your productivity with these proven strategies used by successful remote freelancers across India.',
    author: 'Neha Gupta',
    date: '2023-12-25',
    readTime: '6 min read',
    category: 'Wellness',
    image: '/blog/productivity.jpg',
  },
]

const categories = [
  'All Posts',
  'Tax & Compliance',
  'Career Tips',
  'Best Practices',
  'Business',
  'Legal',
  'Security',
  'Wellness',
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0b63ff] to-[#0a56e6] rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#0b63ff] to-[#0a56e6] bg-clip-text text-transparent">
                2ndShift
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-[#0b63ff] dark:hover:text-blue-400 font-medium transition">
                About
              </Link>
              <Link href="/blog" className="text-[#0b63ff] dark:text-blue-400 font-semibold">
                Blog
              </Link>
              <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-[#0b63ff] dark:hover:text-blue-400 font-medium transition">
                Contact
              </Link>
            </div>

            <Link
              href="/register"
              className="bg-gradient-to-r from-[#0b63ff] to-[#0a56e6] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            2ndShift
            <br />
            <span className="bg-gradient-to-r from-[#0b63ff] to-[#0a56e6] bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Expert insights on freelancing, tax compliance, and building your career
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-5 py-2 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0b63ff] dark:hover:border-blue-400 hover:text-[#0b63ff] dark:hover:text-blue-400 transition whitespace-nowrap font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-slate-100 dark:from-blue-900 dark:to-purple-900"></div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-[#0a56e6] dark:text-blue-300 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#0b63ff] dark:group-hover:text-blue-400 transition">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-4 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-[#0b63ff] dark:hover:border-blue-400 transition">
              Load More Posts
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0b63ff] to-[#0a56e6]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest articles, tips, and updates delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-6 py-4 rounded-xl text-slate-900 focus:ring-4 focus:ring-white/30 outline-none"
            />
            <button className="bg-white text-[#0b63ff] px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">© 2025 2ndShift India Private Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
