'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronDown, Search, Layers, Shield, CreditCard, Users,
  FileText, Zap, HelpCircle, MessageSquare, ArrowRight
} from 'lucide-react'

const FAQ_CATEGORIES = [
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'workers', label: 'For Professionals', icon: Users },
  { id: 'clients', label: 'For Employers', icon: Shield },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'compliance', label: 'Compliance', icon: FileText },
  { id: 'shifts', label: 'Shifts', icon: Zap },
]

const FAQS = {
  general: [
    {
      q: 'What is 2ndShift?',
      a: '2ndShift is India\'s compliant contract workforce platform. We connect companies with verified professionals for project-based and contract work, while handling all compliance requirements like TDS, GST, and legal contracts automatically.',
    },
    {
      q: 'How is 2ndShift different from other freelancing platforms?',
      a: 'Unlike global platforms, 2ndShift is built specifically for the Indian market with full tax compliance built-in. We automatically handle TDS deduction, GST invoicing, Form 16A generation, and professional contracts. Every transaction is compliant from day one.',
    },
    {
      q: 'Is 2ndShift free to use?',
      a: 'Yes, creating an account is free for both professionals and companies. We charge a small platform fee on successful transactions. Paid subscription plans offer additional benefits like lower fees, premium features, and more Shifts.',
    },
    {
      q: 'What types of work can I find/hire for on 2ndShift?',
      a: 'We specialize in tech and digital services: software development, design, data science, DevOps, QA, mobile development, and more. Both short-term projects and long-term contracts are supported.',
    },
  ],
  workers: [
    {
      q: 'How do I get started as a professional?',
      a: 'Sign up, create your profile with skills and experience, and get verified. Verification takes 24-48 hours. Once verified, you can browse and apply to projects immediately.',
    },
    {
      q: 'What is the verification process?',
      a: 'We verify your identity (Aadhaar/PAN), check your professional background, and optionally assess your skills. This builds trust with clients and unlocks premium opportunities.',
    },
    {
      q: 'How much does 2ndShift charge?',
      a: 'Free accounts have a 10% platform fee on earnings. Paid plans reduce this to 8% (Professional) or 5% (Expert). This fee covers compliance handling, payment processing, and platform services.',
    },
    {
      q: 'When and how do I get paid?',
      a: 'Payments are processed weekly, every Friday. Money is transferred directly to your bank account. We handle TDS deduction automatically and provide Form 16A quarterly.',
    },
    {
      q: 'What are Shifts and how do I use them?',
      a: 'Shifts are premium credits that help you stand out. Use them to boost applications (appear first), get your profile featured, or message clients directly. Every plan includes free Shifts, and you can purchase more anytime.',
    },
    {
      q: 'Can I set my own rates?',
      a: 'Yes, you have complete control over your hourly rate. Our platform shows market insights to help you price competitively.',
    },
  ],
  clients: [
    {
      q: 'How do I post a project?',
      a: 'Sign up, describe your project requirements, set your budget and timeline, and publish. You\'ll start receiving proposals from verified professionals within hours.',
    },
    {
      q: 'How are professionals verified?',
      a: 'Every professional on 2ndShift goes through identity verification (Aadhaar/PAN), background checks, and optional skills assessments. You can trust that verified professionals are who they claim to be.',
    },
    {
      q: 'What if I\'m not satisfied with the work?',
      a: 'Payments are held in escrow until milestones are completed to your satisfaction. You only release payment when you\'re happy with the deliverables. We also have a dispute resolution process.',
    },
    {
      q: 'How does compliance work for my company?',
      a: 'We handle everything. Professional contracts are auto-generated, TDS is deducted and deposited, proper invoices are generated, and you receive all documentation for your records. Zero compliance burden on you.',
    },
    {
      q: 'Can I hire the same professional again?',
      a: 'Absolutely! Many companies build long-term relationships with professionals they find on 2ndShift. You can invite past collaborators to new projects with a single click.',
    },
    {
      q: 'What are Shifts and how do clients use them?',
      a: 'Shifts help you find talent faster. Use them to feature your job listings (appear at the top), get AI-powered candidate recommendations, or directly invite specific professionals to apply.',
    },
  ],
  payments: [
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major payment methods through Razorpay: credit/debit cards, UPI, net banking, and wallets. Enterprise clients can also pay via invoice.',
    },
    {
      q: 'How does escrow protection work?',
      a: 'When you hire a professional, the payment is held securely in escrow. It\'s only released to the professional when you approve the completed milestone. This protects both parties.',
    },
    {
      q: 'Are there any hidden fees?',
      a: 'No hidden fees. For professionals, the platform fee is deducted from earnings. For clients, the platform fee is shown clearly before payment. You always know the exact amounts.',
    },
    {
      q: 'Can I get a refund?',
      a: 'Yes. If a professional doesn\'t deliver as agreed, you can request a refund for unreleased milestone payments. Our support team handles disputes fairly.',
    },
    {
      q: 'How are international payments handled?',
      a: 'Currently, 2ndShift operates within India only. All payments are in INR. We may expand internationally in the future.',
    },
  ],
  compliance: [
    {
      q: 'How is TDS handled?',
      a: 'We automatically calculate and deduct TDS at the applicable rate (typically 10% for professionals, 2% for companies under 194C). We deposit it with the government and provide challan details. Professionals receive Form 16A quarterly.',
    },
    {
      q: 'What about GST?',
      a: 'Proper GST invoices are generated for every transaction. If you\'re GST registered, you can add your GSTIN and claim input credit. All invoices are compliant with GST requirements.',
    },
    {
      q: 'Do I need to worry about worker misclassification?',
      a: 'No. Our contracts clearly establish that professionals are independent contractors, not employees. The agreement terms, payment structure, and work arrangement all support this classification.',
    },
    {
      q: 'Are the contracts legally valid?',
      a: 'Yes. Our contracts are drafted by legal experts and are fully enforceable under Indian law. They include clear terms for deliverables, payments, IP rights, confidentiality, and dispute resolution.',
    },
    {
      q: 'Can I use my own contract instead?',
      a: 'Enterprise clients can use custom contracts. Contact our sales team to discuss your requirements.',
    },
  ],
  shifts: [
    {
      q: 'What are Shifts?',
      a: 'Shifts are 2ndShift\'s premium credits. They help professionals stand out and help clients find talent faster. Think of them as a way to accelerate your success on the platform.',
    },
    {
      q: 'How do professionals use Shifts?',
      a: 'Professionals use Shifts to: boost applications (2 Shifts - appear first), get profile featured (5 Shifts/week), send direct messages to clients (1 Shift). These help you get noticed faster.',
    },
    {
      q: 'How do clients use Shifts?',
      a: 'Clients use Shifts to: feature job listings (3 Shifts/week), add urgent badges (2 Shifts), send direct invites to professionals (1 Shift), get AI-powered recommendations (5 Shifts).',
    },
    {
      q: 'How do I get Shifts?',
      a: 'Every plan includes free Shifts monthly. You can purchase additional Shifts in packages of 10, 25, 50, or 100. Larger packages offer better per-Shift pricing.',
    },
    {
      q: 'Do Shifts expire?',
      a: 'Purchased Shifts never expire. Free monthly Shifts expire at the end of each month if unused.',
    },
  ],
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState('')

  const currentFaqs = FAQS[activeCategory as keyof typeof FAQS]

  const filteredFaqs = searchQuery
    ? Object.entries(FAQS).flatMap(([, faqs]) => 
        faqs.filter(faq => 
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : currentFaqs

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
              <Link href="/how-it-works" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                How It Works
              </Link>
              <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Pricing
              </Link>
              <Link href="/faq" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                FAQ
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
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Everything you need to know about 2ndShift. Can&apos;t find your answer? Contact us.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            {!searchQuery && (
              <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Categories</h3>
                  <div className="space-y-1">
                    {FAQ_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id)
                          setExpandedFaq(0)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          activeCategory === cat.id
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
              </aside>
            )}

            {/* FAQs */}
            <main className="flex-1 max-w-3xl">
              {searchQuery && (
                <div className="mb-6">
                  <p className="text-sm text-slate-500">
                    Found {filteredFaqs.length} results for &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {filteredFaqs.map((faq, i) => (
                  <div 
                    key={i} 
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-medium text-slate-900 pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                        expandedFaq === i ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {expandedFaq === i && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No matching questions found.</p>
                  <p className="text-sm text-slate-500 mt-2">Try a different search or browse by category.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-slate-600" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-slate-600 mb-8">
            Our support team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:support@2ndshift.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Email Us
            </a>
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
              <Link href="/about" className="hover:text-slate-900">About</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link href="/contact" className="hover:text-slate-900">Contact</Link>
            </div>
            <p className="text-sm text-slate-500">© 2025 2ndShift</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
