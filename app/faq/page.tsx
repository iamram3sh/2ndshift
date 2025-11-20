'use client'

import Link from 'next/link'
import { Briefcase, ChevronDown, Shield, DollarSign, FileText, Users, Clock, HelpCircle } from 'lucide-react'
import { useState } from 'react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      category: 'Legal & Compliance',
      icon: Shield,
      color: 'from-blue-500 to-indigo-500',
      questions: [
        {
          q: 'Is 2ndShift completely legal and tax-compliant?',
          a: 'Yes, absolutely. We operate in full compliance with Indian Income Tax Act, GST Act, Contract Labour Act, and all relevant regulations. Every transaction is properly documented, TDS is automatically deducted, and all tax filings are handled correctly.'
        },
        {
          q: 'How does TDS deduction work?',
          a: 'We automatically deduct 10% TDS from every payment to workers (as per Section 194J/194C of Income Tax Act). This TDS is deposited with the government, and we generate Form 16A for workers to use during tax filing. Everything is automated.'
        },
        {
          q: 'Will I get Form 16A?',
          a: 'Yes. Workers automatically receive Form 16A after each payment, showing TDS deducted. This certificate is essential for your ITR filing and is legally required. We generate and send it digitally within 15 days of payment.'
        },
        {
          q: 'What about GST compliance?',
          a: 'For employers: We charge 18% GST on our platform fee and provide proper GST invoices. You don\'t need GST registration to hire on 2ndShift. For workers: If your annual income exceeds ₹20 lakhs, you need GST registration, but most part-time workers don\'t hit this threshold.'
        },
        {
          q: 'Are the contracts legally binding?',
          a: 'Yes. All contracts generated on 2ndShift are legally valid under Indian Contract Act and IT Act. They include digital signatures (Aadhaar-based eSign), proper terms, NDAs, and conflict declarations. Courts recognize these as valid agreements.'
        },
        {
          q: 'What happens during a tax audit?',
          a: 'You\'re fully protected. We maintain complete records of all transactions, TDS certificates, contracts, and invoices. These documents are audit-ready and accessible anytime. Many CAs recommend 2ndShift specifically because of our compliance standards.'
        }
      ]
    },
    {
      category: 'Payments',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      questions: [
        {
          q: 'How long does payment take?',
          a: 'Workers receive payment instantly after project approval—usually within minutes. Money is transferred directly to your bank account. No 30-day NET terms or payment delays.'
        },
        {
          q: 'What payment methods are accepted?',
          a: 'Employers can pay via UPI, credit card, debit card, net banking, or NEFT/RTGS. Workers receive payments directly to their bank accounts via IMPS/NEFT.'
        },
        {
          q: 'Is there payment protection?',
          a: 'Yes. We use escrow—when a project starts, the employer\'s payment is held securely. It\'s only released to the worker after approval. If there\'s a dispute, we mediate. Both parties are protected.'
        },
        {
          q: 'What if the employer doesn\'t pay?',
          a: 'Can\'t happen. Payment is held in escrow when the project starts. If work is delivered as agreed, payment is automatically released. If there\'s a dispute, our team reviews and resolves within 7 days.'
        },
        {
          q: 'Can I get a refund?',
          a: 'Employers can request refunds if work isn\'t delivered as agreed. We review disputes fairly. If the worker didn\'t fulfill the contract, full refund is provided. Partial refunds are given for partial work completion.'
        },
        {
          q: 'Are there international payment options?',
          a: 'Currently, we only support INR transactions within India. International payments are on our roadmap but not available yet.'
        }
      ]
    },
    {
      category: 'For Workers',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      questions: [
        {
          q: 'How do I get verified?',
          a: 'After registration, you complete: (1) PAN verification, (2) Aadhaar verification, (3) Bank account verification, (4) Background check, and (5) Skill assessment. Most profiles are approved within 24 hours.'
        },
        {
          q: 'Can I work if I have a full-time job?',
          a: 'Yes, but check your employment contract for non-compete clauses. Most companies allow part-time work if there\'s no conflict of interest. We provide a "Conflict of Interest Declaration" you sign before each project.'
        },
        {
          q: 'How much can I realistically earn?',
          a: 'Depends on skills and time. Average workers earn ₹15,000-₹40,000/month part-time. Top performers earn ₹50,000-₹1,00,000+. You keep 80% of project value after platform fee and TDS.'
        },
        {
          q: 'What if I can\'t complete a project?',
          a: 'Communicate immediately with the client. If you can\'t continue, the project is cancelled. You won\'t be paid for incomplete work. Multiple cancellations hurt your rating, so only take projects you can complete.'
        },
        {
          q: 'How do ratings work?',
          a: 'After each project, clients rate you (1-5 stars) on quality, communication, and timeliness. Your overall rating affects project visibility. Maintain 4+ stars for best opportunities.'
        },
        {
          q: 'Can I set my own rates?',
          a: 'For applications, you propose your rate. For posted projects, the client sets the budget. You can negotiate before accepting. Once agreed, the rate is fixed in the contract.'
        }
      ]
    },
    {
      category: 'For Employers',
      icon: Briefcase,
      color: 'from-orange-500 to-red-500',
      questions: [
        {
          q: 'How do I know workers are qualified?',
          a: 'Every worker is: (1) Background verified, (2) Skill assessed, (3) Rated by previous clients, and (4) Has a verified portfolio. You can interview before hiring. We don\'t allow unverified profiles.'
        },
        {
          q: 'What if the work is not satisfactory?',
          a: 'Use milestone-based payments. Approve only when satisfied. If work doesn\'t meet requirements, request revisions. If still unsatisfactory, raise a dispute—we\'ll review and mediate fairly.'
        },
        {
          q: 'Can I hire the same worker again?',
          a: 'Yes! You can "favorite" workers and directly hire them for future projects without posting publicly. Many employers build long-term relationships with trusted workers.'
        },
        {
          q: 'Do I need a separate contract with the worker?',
          a: 'No. Our platform-generated contract covers everything—scope, payment terms, NDA, IP rights, termination clauses. It\'s legally binding and CA-approved. You can add custom clauses if needed.'
        },
        {
          q: 'What about intellectual property rights?',
          a: 'By default, all work output belongs to the employer (work-for-hire). This is clearly stated in contracts. If you need special IP clauses, contact us for custom contracts.'
        },
        {
          q: 'Can I hire workers permanently after working together?',
          a: 'Yes. Many companies hire 2ndShift workers full-time after successful projects. There\'s no additional fee for conversion to permanent employment.'
        }
      ]
    },
    {
      category: 'Platform Usage',
      icon: Clock,
      color: 'from-cyan-500 to-blue-500',
      questions: [
        {
          q: 'How do I post a project?',
          a: 'Click "Post Job," fill in project details (title, description, budget, timeline, skills needed), and publish. You\'ll start receiving proposals within hours. Review profiles, interview candidates, and hire.'
        },
        {
          q: 'How long do projects typically take?',
          a: 'Most projects are 1-8 weeks. Short tasks (data entry, simple designs) take days. Complex projects (app development, consulting) take weeks. You set the timeline when posting.'
        },
        {
          q: 'Can I hire multiple workers for one project?',
          a: 'Yes. You can hire a team. Each worker has a separate contract and payment. Common for large projects requiring multiple skills (e.g., developer + designer + writer).'
        },
        {
          q: 'What if there\'s a dispute?',
          a: 'Raise a ticket with details and evidence. Our dispute resolution team reviews within 48 hours. We check contracts, communication, and deliverables. Fair decisions are made, and resolved within 7 days.'
        },
        {
          q: 'Is my data secure?',
          a: 'Yes. We use bank-grade encryption (256-bit SSL), comply with Indian data protection laws, and never share your information. PAN and Aadhaar data is encrypted. We\'re ISO 27001 compliant.'
        },
        {
          q: 'Do you have a mobile app?',
          a: 'Not yet, but our website is mobile-optimized. You can browse, apply, hire, and manage projects from any device. Native apps for iOS and Android are coming in 2024.'
        }
      ]
    },
    {
      category: 'Account & Support',
      icon: HelpCircle,
      color: 'from-violet-500 to-purple-500',
      questions: [
        {
          q: 'How do I delete my account?',
          a: 'Go to Settings → Account → Delete Account. Active projects must be completed first. Once deleted, all data is removed within 30 days (required for compliance records).'
        },
        {
          q: 'What support do you provide?',
          a: 'Email support (response within 24 hours), live chat (9 AM - 6 PM IST), and phone support for enterprise clients. Plus detailed help docs and video tutorials.'
        },
        {
          q: 'Can I have multiple accounts?',
          a: 'No. One person = one account. You can\'t be both worker and employer on the same account. Create separate accounts with different emails if you want both roles.'
        },
        {
          q: 'How do I change my PAN/bank details?',
          a: 'Go to Settings → Payment Info. Changes require re-verification (1-2 days). You can\'t change PAN after verification (prevents fraud). Bank account can be updated anytime.'
        },
        {
          q: 'What if I forget my password?',
          a: 'Click "Forgot Password" on login page. Enter your email, and we\'ll send a reset link. For security, password resets expire after 1 hour.'
        },
        {
          q: 'Do you offer training for workers?',
          a: 'Yes. We provide free courses on platform usage, proposal writing, client communication, and tax filing. Paid skill courses (coding, design, etc.) coming soon.'
        }
      ]
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
              <Link href="/how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition">How It Works</Link>
              <Link href="/workers" className="text-slate-600 hover:text-indigo-600 font-medium transition">For Workers</Link>
              <Link href="/employers" className="text-slate-600 hover:text-indigo-600 font-medium transition">For Employers</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition">Pricing</Link>
              <Link href="/faq" className="text-indigo-600 font-semibold">FAQ</Link>
            </div>

            <Link
              href="/register"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 text-indigo-600" />
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Frequently Asked
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Everything you need to know about using 2ndShift safely and legally
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">{category.category}</h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex
                    const isOpen = openIndex === globalIndex

                    return (
                      <div
                        key={faqIndex}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full text-left p-6 flex items-center justify-between gap-4"
                        >
                          <span className="font-semibold text-slate-900 text-lg">{faq.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our support team is here to help you get started
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              Contact Support
            </Link>
            <Link
              href="/register"
              className="bg-indigo-500/30 backdrop-blur text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/20 hover:bg-indigo-500/50 transition"
            >
              Get Started Now
            </Link>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
              <FileText className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-sm text-indigo-100">Detailed guides and tutorials</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
              <Clock className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-indigo-100">9 AM - 6 PM IST, Mon-Sat</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
              <Shield className="w-8 h-8 mb-3" />
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-sm text-indigo-100">For enterprise clients</p>
            </div>
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
