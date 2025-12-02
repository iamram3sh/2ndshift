'use client'

import Link from 'next/link'
import { 
  ArrowRight, Briefcase, Shield, CheckCircle, Users, 
  Zap, Lock, Star, Building2, Target, FileText,
  CreditCard, Sparkles, BarChart3, TrendingUp, 
  Clock, IndianRupee, Award, Layers, Code
} from 'lucide-react'
import { withRoleParam, type UserRole } from '@/lib/utils/roleAwareLinks'
import { trackRoleCTA } from '@/lib/analytics/roleEvents'

interface ClientSpecificModulesProps {
  role?: UserRole | null
  onCTAClick?: (ctaName: string) => void
}

export function HiringModelsSection({ role, onCTAClick }: ClientSpecificModulesProps) {
  const handleClick = (ctaName: string) => {
    onCTAClick?.(ctaName)
    trackRoleCTA('client', ctaName)
  }

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200" data-role="client">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Flexible hiring models
          </h2>
          <p className="text-lg text-[#333] max-w-2xl mx-auto">
            Choose the engagement model that fits your needs. All compliance handled automatically.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'High-Value Microtasks',
              description: 'Premium technical tasks: CI/CD fixes, API debugging, cloud audits, security hardening. Get expert solutions fast.',
              features: ['3-7 day delivery', 'Fixed pricing', 'Senior-level expertise'],
              iconBg: 'bg-sky-50',
              iconColor: 'text-sky-600'
            },
            {
              icon: Target,
              title: 'Complex Projects',
              description: 'High-value technical projects: architecture refactoring, system migrations, AI/LLM implementations.',
              features: ['Clear timeline', 'Milestone-based payments', 'Expert delivery'],
              iconBg: 'bg-emerald-50',
              iconColor: 'text-emerald-600'
            },
            {
              icon: Users,
              title: 'Ongoing Hire',
              description: 'Long-term engagements: part-time or full-time team members for your business.',
              features: ['Flexible hours', 'Monthly billing', 'Replacement guarantee'],
              iconBg: 'bg-purple-50',
              iconColor: 'text-purple-600'
            },
          ].map((model, i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all">
              <div className={`w-12 h-12 ${model.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <model.icon className={`w-6 h-6 ${model.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-[#111] mb-2">{model.title}</h3>
              <p className="text-[#333] text-sm mb-4">{model.description}</p>
              <ul className="space-y-2 mb-6">
                {model.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-[#333]">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={withRoleParam("/projects/create", role)}
                onClick={() => handleClick(`Hire ${model.title}`)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AIJobWizardSection({ role, onCTAClick }: ClientSpecificModulesProps) {
  const handleClick = (ctaName: string) => {
    onCTAClick?.(ctaName)
    trackRoleCTA('client', ctaName)
  }

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-sky-50 to-blue-50 border-t border-slate-200" data-role="client">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
              Generate perfect job posts in seconds
            </h2>
            <p className="text-lg text-[#333] mb-6">
              Our AI job wizard helps you create detailed, effective job posts that attract the right talent. 
              Just describe what you need, and we'll handle the rest.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Auto-generate job descriptions',
                'Suggest optimal budget ranges',
                'Match with relevant skills',
                'Optimize for best candidates'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-[#333]">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href={withRoleParam("/projects/create?wizard=true", role)}
              onClick={() => handleClick('AI Job Wizard')}
              className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#333] transition-all shadow-lg"
            >
              Generate Job Post
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#333] mb-2">Describe your requirement</label>
                <textarea
                  placeholder="e.g., Need to fix API memory leak in production Java service. High CPU usage during peak hours."
                  className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#111] placeholder-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 outline-none resize-none"
                  readOnly
                />
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="text-sm font-medium text-[#111] mb-3">AI Suggestions:</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#111]">Category: Programming</div>
                      <div className="text-xs text-[#333]">Suggested budget: ₹8,000 - ₹20,000</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-sky-50 border border-sky-200 rounded-lg">
                    <Target className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#111]">Skills: Java, Performance, Debugging</div>
                      <div className="text-xs text-[#333]">3 microtasks suggested</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EscrowExplainerSection({ role, onCTAClick }: ClientSpecificModulesProps) {
  return (
    <section className="py-20 lg:py-28 bg-slate-900 border-t border-slate-800" data-role="client">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-16 h-16 bg-sky-500/10 rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-sky-400" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Payment protection built-in
            </h2>
            <p className="text-lg text-white/90 mb-6" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              Every payment is secured in escrow. You only pay when you're satisfied with the work. 
              Workers get paid for completed milestones. It's that simple.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                { label: 'Secure escrow', desc: 'Funds held safely until work is approved' },
                { label: 'Milestone payments', desc: 'Pay as work progresses, not all upfront' },
                { label: 'Dispute resolution', desc: 'Fair mediation if issues arise' },
                { label: 'Refund protection', desc: 'Get your money back if not satisfied' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-sm text-white/80">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/90">Project Budget</span>
                <span className="text-white font-semibold">₹50,000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/90">In Escrow</span>
                <span className="text-sky-400 font-semibold">₹50,000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-white/90">Paid to Worker</span>
                <span className="text-white/60 font-semibold">₹0</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/70 text-center">
                  Funds released only after milestone approval
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ClientTestimonialSection({ role, onCTAClick }: ClientSpecificModulesProps) {
  const handleClick = (ctaName: string) => {
    onCTAClick?.(ctaName)
    trackRoleCTA('client', ctaName)
  }

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200" data-role="client">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Trusted by growing businesses
          </h2>
        </div>
        <div className="bg-slate-50 p-8 lg:p-12 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-sky-600" />
            </div>
            <div>
              <div className="font-semibold text-[#111]">TechStart Inc.</div>
              <div className="text-sm text-[#333]">E-commerce Platform</div>
            </div>
          </div>
          <blockquote className="text-lg text-[#333] mb-6 leading-relaxed">
            "We needed a React developer urgently for a critical project. Posted on 2ndShift at 10 AM, 
            had 5 qualified proposals by 2 PM, and started working with our chosen developer the next day. 
            The escrow system gave us confidence, and all compliance was handled automatically. 
            Saved us weeks of recruitment time."
          </blockquote>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            href={withRoleParam("/register?type=client", role)}
            onClick={() => handleClick('Join as Client')}
            className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#333] transition-all"
          >
            Start Hiring Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function PricingCTASection({ role, onCTAClick }: ClientSpecificModulesProps) {
  const handleClick = (ctaName: string) => {
    onCTAClick?.(ctaName)
    trackRoleCTA('client', ctaName)
  }

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200" data-role="client">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Transparent pricing, no surprises
          </h2>
          <p className="text-lg text-[#333] max-w-2xl mx-auto">
            Just 5-10% platform fee. No hidden charges. Enterprise plans available for high-volume hiring.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: 'Standard',
              fee: '10%',
              features: ['All features included', 'Standard support', 'Up to 10 active projects'],
              popular: false
            },
            {
              name: 'Pro',
              fee: '8%',
              features: ['Priority matching', 'Dedicated support', 'Unlimited projects', 'Advanced analytics'],
              popular: true
            },
            {
              name: 'Enterprise',
              fee: 'Custom',
              features: ['Custom pricing', 'Dedicated account manager', 'SLA guarantees', 'Custom integrations'],
              popular: false
            },
          ].map((plan, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-2xl border-2 ${
                plan.popular 
                  ? 'bg-[#111] border-[#111] text-white' 
                  : 'bg-white border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="inline-block px-3 py-1 bg-sky-500 text-white text-xs font-semibold rounded-full mb-4">
                  Most Popular
                </div>
              )}
              <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-[#111]'}`}>
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-[#111]'}`}>
                  {plan.fee}
                </span>
                {plan.fee !== 'Custom' && (
                  <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-[#333]'}`}>
                    {' '}platform fee
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.popular ? 'text-sky-400' : 'text-emerald-500'
                    }`} />
                    <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-[#333]'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === 'Enterprise' ? '/contact' : withRoleParam("/register?type=client", role)}
                onClick={() => handleClick(`Pricing ${plan.name}`)}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-white text-[#111] hover:bg-slate-100'
                    : 'bg-[#111] text-white hover:bg-[#333]'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

