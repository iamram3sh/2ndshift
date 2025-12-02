'use client'

import Link from 'next/link'
import { 
  ArrowRight, Briefcase, Shield, CheckCircle, Users, 
  Zap, Lock, Star, Award, BadgeCheck, TrendingUp,
  Clock, IndianRupee, Wallet, Target, FileText,
  Sparkles, BarChart3, Timer, Calendar
} from 'lucide-react'
import { withRoleParam, type UserRole } from '@/lib/utils/roleAwareLinks'
import { trackRoleCTA } from '@/lib/analytics/roleEvents'
import { useState } from 'react'

interface WorkerSpecificModulesProps {
  role?: UserRole | null
  onCTAClick?: (ctaName: string) => void
}

export function StarterPacksSection({ role, onCTAClick }: WorkerSpecificModulesProps) {
  const handleClick = (ctaName: string) => {
    onCTAClick?.(ctaName)
    trackRoleCTA('worker', ctaName)
  }

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200" data-role="worker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Quick-start opportunities
          </h2>
          <p className="text-lg text-[#333] max-w-2xl mx-auto">
            Get started fast with these verified, ready-to-start projects. Perfect for building your reputation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Logo Design',
              skills: ['Figma', 'Illustrator'],
              budget: '₹5,000 - ₹10,000',
              duration: '2-3 days',
              type: 'Quick Task',
              color: 'sky'
            },
            {
              title: 'Bug Fixes',
              skills: ['React', 'JavaScript'],
              budget: '₹3,000 - ₹8,000',
              duration: '1-2 days',
              type: 'Quick Task',
              color: 'emerald'
            },
            {
              title: 'Content Writing',
              skills: ['SEO', 'Copywriting'],
              budget: '₹2,000 - ₹5,000',
              duration: '1 week',
              type: 'Quick Task',
              color: 'purple'
            },
            {
              title: 'UI/UX Design',
              skills: ['Figma', 'Prototyping'],
              budget: '₹15,000 - ₹25,000',
              duration: '1-2 weeks',
              type: 'Project',
              color: 'amber'
            },
            {
              title: 'API Development',
              skills: ['Node.js', 'PostgreSQL'],
              budget: '₹20,000 - ₹40,000',
              duration: '2-3 weeks',
              type: 'Project',
              color: 'indigo'
            },
            {
              title: 'Mobile App',
              skills: ['React Native', 'Firebase'],
              budget: '₹50,000+',
              duration: '1-2 months',
              type: 'Project',
              color: 'rose'
            },
          ].map((job, i) => (
            <Link
              key={i}
              href={withRoleParam("/register?type=worker", role)}
              onClick={() => handleClick(`Quick Job: ${job.title}`)}
              className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-[#111] group-hover:text-sky-600 transition-colors">
                  {job.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                  job.type === 'Quick Task'
                    ? 'text-sky-700 bg-sky-50 border border-sky-200'
                    : 'text-purple-700 bg-purple-50 border border-purple-200'
                }`}>
                  {job.type}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <div className="text-sm font-semibold text-[#111]">{job.budget}</div>
                  <div className="text-xs text-[#333] flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {job.duration}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href={withRoleParam("/worker/discover", role)}
            onClick={() => handleClick('View All Quick Jobs')}
            className="inline-flex items-center gap-2 text-[#111] font-semibold hover:text-sky-600 transition-colors"
          >
            View All Opportunities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function VerificationExplainerSection({ role, onCTAClick }: WorkerSpecificModulesProps) {
  const handleClick = (ctaName: string) => {
    onCTAClick?.(ctaName)
    trackRoleCTA('worker', ctaName)
  }

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-50 to-green-50 border-t border-slate-200" data-role="worker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium mb-4">
              <BadgeCheck className="w-4 h-4" />
              Get Verified
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
              Stand out with verified badges
            </h2>
            <p className="text-lg text-[#333] mb-6">
              Get verified and earn trust badges that help you land better projects. 
              Verified workers get 3x more interview requests and higher rates.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Identity verification badge',
                'Skill verification badges',
                'Portfolio showcase',
                'Higher visibility in search',
                'Priority in client matching'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-[#333]">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href={withRoleParam("/register?type=worker&verify=true", role)}
              onClick={() => handleClick('Get Verified')}
              className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#333] transition-all shadow-lg"
            >
              Start Verification
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <BadgeCheck className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="font-semibold text-[#111]">Identity Verified</div>
                  <div className="text-sm text-[#333]">Government ID verified</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <Award className="w-8 h-8 text-sky-600" />
                <div>
                  <div className="font-semibold text-[#111]">React Expert</div>
                  <div className="text-sm text-[#333]">Skill verified via portfolio</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Star className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="font-semibold text-[#111]">Top Rated</div>
                  <div className="text-sm text-[#333]">4.9+ average rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EarningsCalculatorSection({ role, onCTAClick }: WorkerSpecificModulesProps) {
  const [hours, setHours] = useState(20)
  const [rate, setRate] = useState(1000)
  const monthlyEarnings = hours * rate * 4
  const yearlyEarnings = monthlyEarnings * 12

  const handleClick = (ctaName: string) => {
    onCTAClick?.(ctaName)
    trackRoleCTA('worker', ctaName)
  }

  return (
    <section className="py-20 lg:py-28 bg-slate-900 border-t border-slate-800" data-role="worker">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Calculate your potential earnings
          </h2>
          <p className="text-lg text-white/90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            See how much you could earn working on 2ndShift. Zero platform fees means you keep 100% of your rate.
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-white/90 mb-2 font-medium">Hours per week</label>
              <input
                type="range"
                min="5"
                max="40"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-white">{hours}</span>
                <span className="text-white/70 ml-1">hours/week</span>
              </div>
            </div>
            <div>
              <label className="block text-white/90 mb-2 font-medium">Hourly rate (₹)</label>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-white">₹{rate.toLocaleString()}</span>
                <span className="text-white/70 ml-1">/hour</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
            <div className="text-center p-6 bg-white/5 rounded-xl">
              <div className="text-sm text-white/70 mb-2">Monthly Earnings</div>
              <div className="text-3xl font-bold text-emerald-400">₹{monthlyEarnings.toLocaleString()}</div>
              <div className="text-xs text-white/60 mt-1">Zero platform fees</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-xl">
              <div className="text-sm text-white/70 mb-2">Yearly Earnings</div>
              <div className="text-3xl font-bold text-emerald-400">₹{yearlyEarnings.toLocaleString()}</div>
              <div className="text-xs text-white/60 mt-1">Keep 100% of what you earn</div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href={withRoleParam("/register?type=worker", role)}
              onClick={() => handleClick('Earnings Calculator CTA')}
              className="inline-flex items-center gap-2 bg-white text-[#111] px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Start Earning Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function WorkerSuccessStoriesSection({ role, onCTAClick }: WorkerSpecificModulesProps) {
  const handleClick = (ctaName: string) => {
    onCTAClick?.(ctaName)
    trackRoleCTA('worker', ctaName)
  }

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200" data-role="worker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Success stories from real workers
          </h2>
          <p className="text-lg text-[#333] max-w-2xl mx-auto">
            See how professionals like you are building their careers on 2ndShift.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              name: 'Priya S.',
              role: 'UI/UX Designer',
              quote: 'Started part-time while working my day job. Now earning ₹80k/month working 20 hours/week. The zero platform fees make a huge difference.',
              earnings: '₹80,000/month',
              rating: 5
            },
            {
              name: 'Rahul K.',
              role: 'Full Stack Developer',
              quote: 'Left my corporate job to freelance full-time. Best decision ever. I work on projects I love, set my own hours, and earn more than before.',
              earnings: '₹1.2L/month',
              rating: 5
            },
          ].map((story, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <div className="font-semibold text-[#111]">{story.name}</div>
                  <div className="text-sm text-[#333]">{story.role}</div>
                </div>
              </div>
              <blockquote className="text-[#333] mb-4 leading-relaxed">
                "{story.quote}"
              </blockquote>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-sm font-semibold text-emerald-600">{story.earnings}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href={withRoleParam("/register?type=worker", role)}
            onClick={() => handleClick('Start Earning')}
            className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#333] transition-all"
          >
            Start Your Success Story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

