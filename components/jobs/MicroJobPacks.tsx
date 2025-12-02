/**
 * Remote Micro Job Packs
 * Preset task bundles for clients
 * 
 * TODO: Implement full functionality
 */

'use client'

import { Package, CheckCircle, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { CLIENT_QUICK_PACKS } from '@/data/highValueTasks'
import { formatCurrency } from '@/lib/utils/formatCurrency'

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
          {CLIENT_QUICK_PACKS.map((pack, index) => (
            <div
              key={index}
              className={`p-6 bg-white rounded-xl border-2 ${
                index === 0 ? 'border-sky-500 shadow-lg' : 'border-slate-200'
              } hover:shadow-xl transition-all`}
            >
              {index === 0 && (
                <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold mb-4">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111]">{pack.title}</h3>
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

              <div className="mb-6">
                <div className="text-3xl font-bold text-[#111]">{formatCurrency(pack.price * 100)}</div>
                <div className="text-sm text-[#333]">One-time payment</div>
                <div className="text-xs text-slate-500 mt-1">
                  Platform fee: 4% · Escrow fee: 2%
                </div>
              </div>

              <Link
                href={`/projects/create?pack=${pack.title.toLowerCase().replace(/\s+/g, '-')}`}
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

