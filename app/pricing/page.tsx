'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Check, X, ArrowRight, Shield, Zap, Users, Building2, 
  HelpCircle, ChevronDown, Layers, Menu, Crown, Sparkles,
  BadgeCheck, Clock, CreditCard, Headphones, FileText, Lock
} from 'lucide-react'

const WORKER_PLANS = [
  {
    name: 'Free',
    price: 0,
    description: 'Get started and find your first clients',
    features: [
      { text: 'Create professional profile', included: true },
      { text: 'Apply to unlimited projects', included: true },
      { text: 'Basic search visibility', included: true },
      { text: '10% platform fee on earnings', included: true },
      { text: '5 free Shifts/month', included: true },
      { text: 'Email support', included: true },
      { text: 'Profile boost', included: false },
      { text: 'Featured in recommendations', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Professional',
    price: 499,
    period: '/month',
    description: 'For serious professionals who want to stand out',
    features: [
      { text: 'Everything in Free', included: true },
      { text: '8% platform fee (save 20%)', included: true },
      { text: '30 Shifts included', included: true },
      { text: 'Profile boost (1 week/month)', included: true },
      { text: 'Featured in client recommendations', included: true },
      { text: 'Priority in search results', included: true },
      { text: 'Skills verification badges', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Dedicated account manager', included: false },
    ],
    cta: 'Start 14-Day Free Trial',
    popular: true,
  },
  {
    name: 'Expert',
    price: 999,
    period: '/month',
    description: 'For top professionals who want maximum visibility',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: '5% platform fee (save 50%)', included: true },
      { text: '100 Shifts included', included: true },
      { text: 'Permanent profile boost', included: true },
      { text: 'Top placement in all searches', included: true },
      { text: '"Expert" badge on profile', included: true },
      { text: 'Early access to premium projects', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Phone support', included: true },
    ],
    cta: 'Start 14-Day Free Trial',
    popular: false,
  },
]

const CLIENT_PLANS = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for small projects and testing the platform',
    features: [
      { text: 'Post unlimited projects', included: true },
      { text: 'Access to all professionals', included: true },
      { text: 'Basic filters and search', included: true },
      { text: '12% platform fee', included: true },
      { text: '5 free Shifts', included: true },
      { text: 'Email support', included: true },
      { text: 'Featured job listing', included: false },
      { text: 'AI recommendations', included: false },
      { text: 'Dedicated manager', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Business',
    price: 1499,
    period: '/month',
    description: 'For growing teams who hire regularly',
    features: [
      { text: 'Everything in Starter', included: true },
      { text: '10% platform fee (save 17%)', included: true },
      { text: '50 Shifts included', included: true },
      { text: '3 featured job listings/month', included: true },
      { text: 'AI-powered recommendations', included: true },
      { text: 'Advanced filters & analytics', included: true },
      { text: 'Priority matching', included: true },
      { text: 'Priority support', included: true },
      { text: 'Dedicated manager', included: false },
    ],
    cta: 'Start 14-Day Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    priceLabel: 'Custom',
    description: 'For large organizations with complex needs',
    features: [
      { text: 'Everything in Business', included: true },
      { text: 'Custom platform fee (as low as 5%)', included: true },
      { text: 'Unlimited Shifts', included: true },
      { text: 'Unlimited featured listings', included: true },
      { text: 'Custom integrations (API)', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom contracts & SLA', included: true },
      { text: 'On-site support available', included: true },
      { text: 'White-label options', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const SHIFT_PACKAGES_WORKERS = [
  { shifts: 10, price: 99, perShift: 9.9 },
  { shifts: 25, price: 199, perShift: 7.96, popular: true },
  { shifts: 50, price: 349, perShift: 6.98, save: '30%' },
  { shifts: 100, price: 599, perShift: 5.99, save: '40%' },
]

const SHIFT_PACKAGES_CLIENTS = [
  { shifts: 10, price: 149, perShift: 14.9 },
  { shifts: 25, price: 299, perShift: 11.96, popular: true },
  { shifts: 50, price: 499, perShift: 9.98, save: '30%' },
  { shifts: 100, price: 849, perShift: 8.49, save: '40%' },
]

const FAQS = [
  {
    q: 'What are Shifts and how do they work?',
    a: 'Shifts are our premium currency that helps you stand out. Workers use Shifts to boost applications and get featured. Clients use Shifts to feature jobs and get AI recommendations. Free Shifts are included with every plan, and you can purchase more anytime.',
  },
  {
    q: 'How does the platform fee work?',
    a: 'We charge a small percentage on each successful transaction. For workers, this is deducted from your earnings. For clients, this is added on top of what you pay the worker. Higher tier plans have lower fees.',
  },
  {
    q: 'Is there a long-term commitment?',
    a: 'No. All paid plans are month-to-month and you can cancel anytime. Your plan will remain active until the end of your billing period.',
  },
  {
    q: 'What compliance is included?',
    a: 'All plans include automatic TDS deduction, GST invoicing, professional contracts, and Form 16A generation. You never have to worry about tax compliance.',
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes, you can change your plan at any time. When upgrading, you&apos;ll get immediate access to new features. When downgrading, changes take effect at the next billing cycle.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay. Enterprise clients can also pay via invoice.',
  },
]

export default function PricingPage() {
  const [userType, setUserType] = useState<'worker' | 'client'>('client')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const plans = userType === 'worker' ? WORKER_PLANS : CLIENT_PLANS
  const shiftPackages = userType === 'worker' ? SHIFT_PACKAGES_WORKERS : SHIFT_PACKAGES_CLIENTS

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
              <Link href="/workers" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Find Talent
              </Link>
              <Link href="/how-it-works" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                How It Works
              </Link>
              <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Start free, upgrade when you need more. All plans include full compliance handling.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setUserType('client')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                userType === 'client'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                For Employers
              </span>
            </button>
            <button
              onClick={() => setUserType('worker')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                userType === 'worker'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                For Professionals
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border-2 transition-all ${
                  plan.popular
                    ? 'border-slate-900 bg-slate-50 shadow-xl'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-slate-900 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  {plan.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">₹{plan.price.toLocaleString()}</span>
                      {plan.period && <span className="text-slate-500">{plan.period}</span>}
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-slate-900">{plan.priceLabel}</div>
                  )}
                </div>

                <Link
                  href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                  className={`block w-full py-3 rounded-xl font-medium text-center transition-all mb-8 ${
                    plan.popular
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shifts Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Premium Credits
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
              Boost with Shifts
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              {userType === 'worker'
                ? 'Stand out from the competition. Boost applications, get featured, and message clients directly.'
                : 'Find talent faster. Feature your jobs, get AI recommendations, and invite top professionals.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {shiftPackages.map((pkg, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl text-center ${
                  pkg.popular
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                <div className="text-3xl font-bold mb-1">{pkg.shifts}</div>
                <div className={`text-sm mb-4 ${pkg.popular ? 'text-amber-100' : 'text-white'}`}>
                  Shifts
                </div>
                <div className="text-2xl font-semibold mb-1">₹{pkg.price}</div>
                <div className={`text-xs ${pkg.popular ? 'text-amber-100' : 'text-white'}`}>
                  ₹{pkg.perShift.toFixed(2)}/shift
                </div>
                {pkg.save && (
                  <div className="mt-2 text-xs font-medium text-emerald-400">
                    Save {pkg.save}
                  </div>
                )}
                {pkg.popular && (
                  <div className="mt-2 text-xs font-medium text-amber-100">
                    Best Value
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition-all"
            >
              <Zap className="w-4 h-4" />
              Get Shifts Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Included */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Included in all plans
            </h2>
            <p className="text-lg text-slate-600">
              Every plan comes with enterprise-grade features at no extra cost.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Full Compliance', description: 'TDS, GST, contracts, Form 16A - all handled automatically' },
              { icon: Lock, title: 'Secure Payments', description: 'Bank-grade security with escrow protection' },
              { icon: FileText, title: 'Legal Contracts', description: 'Professional service agreements auto-generated' },
              { icon: Headphones, title: 'Support', description: 'Email support for all users, priority for paid plans' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedFaq === i ? 'rotate-180' : ''
                  }`} />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-slate-900 font-medium hover:text-slate-700"
            >
              Contact our team
              <ArrowRight className="w-4 h-4" />
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
