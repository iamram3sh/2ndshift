'use client'

import { Check, Zap, Crown, Building2 } from 'lucide-react'
import Link from 'next/link'

interface PricingSectionProps {
  role: 'worker' | 'client'
}

export function PricingSection({ role }: PricingSectionProps) {
  if (role === 'worker') {
    return (
      <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
              Transparent Pricing for Workers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Pay only when you earn. First 3 jobs are commission-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Commission Info */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Commission</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">First 3 Jobs</div>
                    <div className="text-sm text-slate-600">0% commission</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Verified Workers</div>
                    <div className="text-sm text-slate-600">5% commission</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Unverified Workers</div>
                    <div className="text-sm text-slate-600">10% commission</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Shifts Info */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-slate-900">Shifts (Credits)</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Job Applications</div>
                    <div className="text-sm text-slate-600">3 Shifts per application</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Refund Policy</div>
                    <div className="text-sm text-slate-600">Refunded if client doesn't view</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Packages</div>
                    <div className="text-sm text-slate-600">₹49=10, ₹99=25, ₹199=60, ₹399=140</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Subscriptions */}
            <div className="bg-slate-900 p-6 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold">Subscriptions</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Starter ₹199/mo</div>
                    <div className="text-sm text-slate-300">8% commission, 20 Shifts</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Pro ₹499/mo</div>
                    <div className="text-sm text-slate-300">5% commission, 50 Shifts</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Elite ₹999/mo</div>
                    <div className="text-sm text-slate-300">0% commission, 100 Shifts</div>
                  </div>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-all text-sm"
              >
                View All Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Client pricing
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight mb-4">
            Transparent Pricing for Clients
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Pay only for results. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Commission Info */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Commission</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">Regular Payments</div>
                  <div className="text-sm text-slate-600">4% commission</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">Micro Tasks</div>
                  <div className="text-sm text-slate-600">₹49 flat fee</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">Subscribers</div>
                  <div className="text-sm text-slate-600">0% commission</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Escrow Fee */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Escrow Fee</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">Payment Protection</div>
                  <div className="text-sm text-slate-600">2% escrow fee</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">Secure Transactions</div>
                  <div className="text-sm text-slate-600">Funds held until completion</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Subscriptions */}
          <div className="bg-slate-900 p-6 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold">Subscriptions</h3>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Growth ₹999/mo</div>
                  <div className="text-sm text-slate-300">0% commission, 30 Shifts</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Pro Agency ₹2999/mo</div>
                  <div className="text-sm text-slate-300">0% commission, 100 Shifts, Multi-seat</div>
                </div>
              </li>
            </ul>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-all text-sm"
            >
              View All Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

