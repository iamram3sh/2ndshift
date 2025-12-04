'use client'

import Link from 'next/link'
import { Layers, Mail, MapPin, Twitter, Linkedin } from 'lucide-react'
import { withRoleParam } from '@/lib/utils/roleAwareLinks'

export function Footer() {
  return (
    <footer className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-[#111]">2ndShift</span>
            </Link>
            <p className="text-sm text-[#333] mb-4">
              Work on your terms.<br />Get paid with confidence.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com/2ndshift" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[#333] hover:bg-slate-200 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/2ndshift" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[#333] hover:bg-slate-200 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="font-bold text-[#111] mb-4">For Professionals</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/for-workers" className="text-[#333] hover:text-[#111] transition-colors">Why 2ndShift</Link></li>
              <li><Link href={withRoleParam("/worker/discover", 'worker')} className="text-[#333] hover:text-[#111] transition-colors">Find Work</Link></li>
              <li><Link href="/how-it-works" className="text-[#333] hover:text-[#111] transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="text-[#333] hover:text-[#111] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-bold text-[#111] mb-4">For Employers</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/employers" className="text-[#333] hover:text-[#111] transition-colors">Why 2ndShift</Link></li>
              <li><Link href={withRoleParam("/workers", 'client')} className="text-[#333] hover:text-[#111] transition-colors">Find Talent</Link></li>
              <li><Link href="/how-it-works" className="text-[#333] hover:text-[#111] transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="text-[#333] hover:text-[#111] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-[#111] mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terms" className="text-[#333] hover:text-[#111] transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="text-[#333] hover:text-[#111] transition-colors">Privacy</Link></li>
              <li><Link href="/security" className="text-[#333] hover:text-[#111] transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-[#111] mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-[#333]">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@2ndshift.in" className="hover:text-[#111] transition-colors">hello@2ndshift.in</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Hyderabad, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#333]">
            © 2025 2ndShift. All rights reserved.
          </p>
          <p className="text-sm text-[#333]">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  )
}
