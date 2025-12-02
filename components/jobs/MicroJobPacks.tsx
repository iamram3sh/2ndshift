/**
 * Remote Micro Job Packs
 * Preset task bundles for clients
 * 
 * TODO: Implement full functionality
 */

'use client'

import { Package, CheckCircle, Clock, Users } from 'lucide-react'
import Link from 'next/link'

interface MicroJobPack {
  id: string
  name: string
  description: string
  tasks: string[]
  price: number
  duration: string
  workers: number
  popular?: boolean
}

const MICRO_JOB_PACKS: MicroJobPack[] = [
  {
    id: 'web-basics',
    name: 'Web Basics Pack',
    description: 'Perfect for small businesses getting started online',
    tasks: ['Landing page design', 'Basic SEO setup', 'Contact form integration', 'Mobile responsiveness'],
    price: 15000,
    duration: '1-2 weeks',
    workers: 1,
    popular: true,
  },
  {
    id: 'content-creator',
    name: 'Content Creator Pack',
    description: 'Complete content package for your brand',
    tasks: ['10 blog posts', 'Social media graphics (20)', 'Email templates (5)', 'Content calendar'],
    price: 25000,
    duration: '2-3 weeks',
    workers: 2,
  },
  {
    id: 'app-prototype',
    name: 'App Prototype Pack',
    description: 'Get your app idea to prototype stage',
    tasks: ['UI/UX design', 'Frontend prototype', 'Backend API setup', 'Basic testing'],
    price: 50000,
    duration: '3-4 weeks',
    workers: 3,
  },
]

export default function MicroJobPacks() {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] mb-4">
            Remote Micro Job Packs
          </h2>
          <p className="text-lg text-[#333] max-w-2xl mx-auto">
            Pre-configured task bundles. Pick a pack, get matched with a micro-team, and get started.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MICRO_JOB_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`p-6 bg-white rounded-xl border-2 ${
                pack.popular ? 'border-sky-500 shadow-lg' : 'border-slate-200'
              } hover:shadow-xl transition-all`}
            >
              {pack.popular && (
                <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold mb-4">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111]">{pack.name}</h3>
                  <p className="text-sm text-[#333]">{pack.description}</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {pack.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#333]">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-4 text-sm text-[#333]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {pack.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {pack.workers} worker{pack.workers > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-[#111]">₹{pack.price.toLocaleString()}</div>
                <div className="text-sm text-[#333]">One-time payment</div>
                <div className="text-xs text-slate-500 mt-1">
                  Platform fee: 4% · Escrow fee: 2%
                </div>
              </div>

              <Link
                href={`/projects/create?pack=${pack.id}`}
                className="block w-full text-center bg-[#111] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#333] transition-all"
              >
                Select This Pack
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

