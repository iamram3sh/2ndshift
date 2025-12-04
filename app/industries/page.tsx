'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Monitor, Building2, Heart, ShoppingBag, Radio, Sparkles,
  ArrowRight, CheckCircle, Shield, Clock, Users, Zap, MessageSquare,
  Menu, X, Briefcase, TrendingUp, Code, Database, Cloud, Lock,
  Server, Network, Brain, BarChart, FileCode, Settings, Globe, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'
import { RoleAwareNav } from '@/components/role/RoleAwareNav'
import { withRoleParam } from '@/lib/utils/roleAwareLinks'

// Industry data with microtasks
const INDUSTRIES = [
  {
    id: 'tech-saas',
    name: 'Tech & SaaS',
    icon: Monitor,
    description: 'Cloud infrastructure, API development, and scalable software solutions',
    microtasks: [
      'AWS/Azure cloud migration',
      'RESTful API development',
      'Microservices architecture',
      'CI/CD pipeline setup'
    ],
    color: 'bg-blue-500'
  },
  {
    id: 'finance-banking',
    name: 'Finance & Banking',
    icon: Building2,
    description: 'Secure financial systems, compliance, and fintech integrations',
    microtasks: [
      'Payment gateway integration',
      'PCI-DSS compliance audit',
      'Blockchain smart contracts',
      'Fraud detection algorithms'
    ],
    color: 'bg-emerald-500'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Heart,
    description: 'HIPAA-compliant systems, telemedicine, and health data management',
    microtasks: [
      'HIPAA compliance implementation',
      'HL7/FHIR integration',
      'Telemedicine platform setup',
      'Medical data encryption'
    ],
    color: 'bg-rose-500'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: ShoppingBag,
    description: 'High-performance stores, payment processing, and inventory systems',
    microtasks: [
      'E-commerce platform migration',
      'Payment gateway optimization',
      'Inventory management system',
      'Order fulfillment automation'
    ],
    color: 'bg-purple-500'
  },
  {
    id: 'telecom-networking',
    name: 'Telecom & Networking',
    icon: Radio,
    description: 'Network infrastructure, 5G solutions, and communication systems',
    microtasks: [
      '5G network optimization',
      'VoIP system implementation',
      'Network security hardening',
      'SD-WAN configuration'
    ],
    color: 'bg-violet-500'
  },
  {
    id: 'ai-startups',
    name: 'AI Startups',
    icon: Sparkles,
    description: 'Machine learning models, AI infrastructure, and data pipelines',
    microtasks: [
      'ML model deployment',
      'Data pipeline architecture',
      'NLP/LLM integration',
      'Model training infrastructure'
    ],
    color: 'bg-amber-500'
  }
]

// Why 2ndShift benefits
const BENEFITS = [
  {
    icon: Shield,
    title: 'Verified senior professionals only',
    description: 'All professionals are vetted and verified before joining'
  },
  {
    icon: DollarSign,
    title: 'Transparent pricing, zero overhead',
    description: 'No hidden fees, no markups. Pay only for the work delivered'
  },
  {
    icon: Lock,
    title: 'Escrow-protected payments',
    description: 'Your payment is secured until work is completed and approved'
  },
  {
    icon: Clock,
    title: 'Delivery windows from 6 hours to 4 weeks',
    description: 'Fast turnaround for urgent needs, flexible timelines for complex projects'
  },
  {
    icon: Sparkles,
    title: 'AI-matched professionals for faster hiring',
    description: 'Our AI finds the perfect match based on skills, experience, and availability'
  }
]

export default function IndustriesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2S</span>
                </div>
                <span className="text-xl font-bold text-[#111]">2ndShift</span>
              </Link>
              <div className="hidden lg:block">
                <RoleAwareNav />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  href={withRoleParam('/projects/create', 'client')}
                  variant="primary"
                  size="sm"
                >
                  Post a Project
                </Button>
                <Button
                  href={withRoleParam('/workers', 'client')}
                  variant="outline"
                  size="sm"
                >
                  Browse Specialists
                </Button>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              <RoleAwareNav isMobile onLinkClick={() => setMobileMenuOpen(false)} />
              <div className="pt-4 space-y-2">
                <Button
                  href={withRoleParam('/projects/create', 'client')}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Post a Project
                </Button>
                <Button
                  href={withRoleParam('/workers', 'client')}
                  variant="outline"
                  size="md"
                  className="w-full"
                >
                  Browse Specialists
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
            >
              Industries We Support
            </h1>
            <p 
              className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
            >
              High-value IT expertise for fast, reliable delivery across major industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href={withRoleParam('/projects/create', 'client')}
                variant="secondary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Post a Project
              </Button>
              <Button
                href={withRoleParam('/workers', 'client')}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Browse Specialists
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INDUSTRIES.map((industry, index) => {
              const Icon = industry.icon
              return (
                <div
                  key={industry.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className={`h-2 ${industry.color}`} />
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 ${industry.color} bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-7 h-7 ${industry.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {industry.name}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                          {industry.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Example Microtasks
                      </p>
                      {industry.microtasks.map((task, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{task}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      href={withRoleParam('/workers', 'client')}
                      variant="primary"
                      size="md"
                      className="w-full"
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      Hire Specialists
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why 2ndShift Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why 2ndShift for Industry Projects?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We connect you with verified senior professionals who deliver high-value IT solutions across all major industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-slate-200"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
          >
            Start your project today
          </h2>
          <p 
            className="text-xl text-slate-300 mb-10"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
          >
            Join thousands of companies using 2ndShift to find top IT talent. Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={withRoleParam('/projects/create', 'client')}
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Post a Project Free
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              icon={<MessageSquare className="w-5 h-5" />}
              iconPosition="right"
            >
              Talk to Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
