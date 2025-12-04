'use client'

import Link from 'next/link'
import { Briefcase, FileText, Scale, Shield } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0b63ff] to-[#0a56e6] rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#0b63ff] to-[#0a56e6] bg-clip-text text-transparent">
                2ndShift
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-[#333] hover:text-[#0b63ff] font-medium transition">About</Link>
              <Link href="/contact" className="text-[#333] hover:text-[#0b63ff] font-medium transition">Contact</Link>
            </div>

            <Link href="/register" className="bg-gradient-to-r from-[#0b63ff] to-[#0a56e6] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0b63ff] to-[#0a56e6] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-[#111] mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-[#333] leading-relaxed">
            Last Updated: January 15, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="bg-blue-50 border-l-4 border-[#0b63ff] p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-[#111] mb-2">Welcome to 2ndShift</h3>
              <p className="text-slate-700 leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use of 2ndShift platform, including our website, mobile application, and services (collectively, the "Platform"). By accessing or using 2ndShift, you agree to be bound by these Terms.
              </p>
            </div>

            {/* 1. Definitions */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#0b63ff]" />
                1. Definitions
              </h2>
              <div className="space-y-4 text-slate-700">
                <p><strong>"Platform"</strong> refers to 2ndShift website, mobile applications, and all related services.</p>
                <p><strong>"User"</strong> refers to any person or entity accessing or using the Platform.</p>
                <p><strong>"Worker"</strong> refers to skilled professionals offering services through the Platform.</p>
                <p><strong>"Client"</strong> refers to individuals or businesses hiring Workers through the Platform.</p>
                <p><strong>"Project"</strong> refers to work assignments posted by Clients and undertaken by Workers.</p>
                <p><strong>"Contract"</strong> refers to the legally binding agreement between Client and Worker generated through our Platform.</p>
              </div>
            </section>

            {/* 2. Eligibility */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">2. Eligibility</h2>
              <div className="space-y-4 text-slate-700">
                <p>To use 2ndShift, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least 18 years of age</li>
                  <li>Be a resident of India</li>
                  <li>Have a valid PAN card for tax purposes</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Comply with all applicable Indian laws and regulations</li>
                  <li>Not have been previously suspended or removed from the Platform</li>
                </ul>
              </div>
            </section>

            {/* 3. Account Registration */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">3. Account Registration and Security</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold text-[#111] mt-6">3.1 Account Creation</h3>
                <p>You must create an account to access Platform features. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Immediately notify us of any unauthorized access</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">3.2 Verification</h3>
                <p>We may require identity verification including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Aadhaar-based KYC verification</li>
                  <li>PAN card verification for tax compliance</li>
                  <li>Bank account verification for payments</li>
                  <li>Professional credentials and certifications (for Workers)</li>
                  <li>Business registration documents (for Corporate Clients)</li>
                </ul>
              </div>
            </section>

            {/* 4. User Obligations */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">4. User Obligations</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold text-[#111] mt-6">4.1 Prohibited Activities</h3>
                <p>You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Harass, threaten, or abuse other Users</li>
                  <li>Attempt to circumvent Platform fees or payment systems</li>
                  <li>Use automated systems to access the Platform without authorization</li>
                  <li>Engage in any form of discrimination based on caste, religion, gender, or other protected characteristics</li>
                  <li>Share login credentials or transfer accounts</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">4.2 Content Standards</h3>
                <p>All content posted on the Platform must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be accurate and not misleading</li>
                  <li>Comply with Indian laws including IT Act 2000</li>
                  <li>Not contain obscene, defamatory, or offensive material</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not contain malware, viruses, or malicious code</li>
                </ul>
              </div>
            </section>

            {/* 5. Services and Platform Use */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">5. Platform Services</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold text-[#111] mt-6">5.1 For Workers</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create and maintain professional profiles</li>
                  <li>Browse and apply for Projects</li>
                  <li>Communicate with Clients through secure messaging</li>
                  <li>Submit work and receive payments</li>
                  <li>Access legally valid contracts and NDAs</li>
                  <li>Receive and provide reviews</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">5.2 For Clients</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Post Project requirements</li>
                  <li>Search and filter qualified Workers</li>
                  <li>Review Worker profiles and ratings</li>
                  <li>Communicate securely with Workers</li>
                  <li>Make secure payments through escrow</li>
                  <li>Generate automatic contracts and NDAs</li>
                  <li>Provide reviews and ratings</li>
                </ul>
              </div>
            </section>

            {/* 6. Payments and Fees */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">6. Payments, Fees, and Taxation</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold text-[#111] mt-6">6.1 Platform Fees</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Workers:</strong> 10% service fee on earnings</li>
                  <li><strong>Clients:</strong> 3% payment processing fee</li>
                  <li>Fees are automatically deducted from transactions</li>
                  <li>We reserve the right to modify fees with 30 days notice</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">6.2 Payment Processing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payments are processed through Razorpay (PCI-DSS compliant)</li>
                  <li>Escrow protection holds Client payments until project approval</li>
                  <li>Workers receive payment within 2-3 business days after approval</li>
                  <li>Instant payout option available for verified Workers (additional 1% fee)</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">6.3 Taxation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>TDS:</strong> 10% TDS deducted for payments exceeding ₹30,000 per transaction (as per Section 194J/194C)</li>
                  <li>Form 16A issued quarterly for TDS deducted</li>
                  <li><strong>GST:</strong> Applicable on Platform fees as per Indian GST laws</li>
                  <li>Workers responsible for their own income tax filing</li>
                  <li>Annual earning reports provided for ITR filing</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">6.4 Refunds and Disputes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds processed based on contract terms and dispute resolution</li>
                  <li>Dispute resolution follows our internal arbitration process</li>
                  <li>Platform fees are non-refundable except in cases of Platform error</li>
                </ul>
              </div>
            </section>

            {/* 7. Contracts and Legal Agreements */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">7. Contracts and Legal Framework</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold text-[#111] mt-6">7.1 Contract Generation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform auto-generates legally valid contracts for each Project</li>
                  <li>Contracts comply with Indian Contract Act, 1872</li>
                  <li>Digital signatures valid under IT Act, 2000 and Aadhaar Act</li>
                  <li>Contracts include: scope, timeline, payment terms, IP rights, confidentiality</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">7.2 Contractual Relationship</h3>
                <p>2ndShift is a platform facilitating connections. We are NOT:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>An employer of Workers</li>
                  <li>A party to contracts between Clients and Workers</li>
                  <li>Responsible for the quality of work delivered</li>
                  <li>Liable for disputes between Users (beyond mediation)</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">7.3 Intellectual Property</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Work product ownership defined in individual contracts</li>
                  <li>Default: Client owns all deliverables upon full payment</li>
                  <li>Workers retain portfolio rights unless NDA restricts</li>
                  <li>Platform retains rights to anonymized usage data</li>
                </ul>
              </div>
            </section>

            {/* 8. Privacy and Data Protection */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">8. Privacy and Data Protection</h2>
              <div className="space-y-4 text-slate-700">
                <p>Your privacy is important to us. Our data practices include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Compliance with IT Act 2000 and SPDI Rules 2011</li>
                  <li>Secure storage of personal and financial information</li>
                  <li>Limited data sharing only with service providers</li>
                  <li>User control over data visibility and sharing</li>
                </ul>
                <p className="mt-4">
                  For detailed information, please review our{' '}
                  <Link href="/privacy" className="text-[#0b63ff] hover:text-indigo-700 font-semibold">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* 9. Dispute Resolution */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">9. Dispute Resolution</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold text-[#111] mt-6">9.1 Platform Mediation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Initial dispute resolution through Platform support team</li>
                  <li>Evidence-based review of contracts and communications</li>
                  <li>Decision within 7 business days for standard disputes</li>
                  <li>Escrow protection during dispute resolution</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">9.2 Arbitration</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unresolved disputes subject to binding arbitration</li>
                  <li>Arbitration conducted in Hyderabad, Telangana</li>
                  <li>Governed by Arbitration and Conciliation Act, 1996</li>
                  <li>Single arbitrator appointed mutually or by Platform</li>
                  <li>Arbitration costs shared equally unless otherwise decided</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">9.3 Jurisdiction</h3>
                <p>
                  These Terms are governed by Indian law. Exclusive jurisdiction lies with courts in Hyderabad, Telangana.
                </p>
              </div>
            </section>

            {/* 10. Liability and Disclaimers */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">10. Limitation of Liability</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold text-[#111] mt-6">10.1 Platform Disclaimer</h3>
                <p>The Platform is provided "AS IS" and "AS AVAILABLE". We do not guarantee:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Uninterrupted or error-free service</li>
                  <li>Quality, accuracy, or reliability of User content</li>
                  <li>Specific outcomes from using the Platform</li>
                  <li>Compatibility with all devices or browsers</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">10.2 User Responsibility</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Users are responsible for evaluating other Users before engaging</li>
                  <li>Verify credentials, portfolios, and references independently</li>
                  <li>Read and understand contracts before accepting</li>
                  <li>Maintain backups of your work and communications</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">10.3 Liability Cap</h3>
                <p>
                  Our total liability for any claims related to the Platform shall not exceed the lesser of: (a) fees paid by you in the past 12 months, or (b) ₹50,000.
                </p>

                <h3 className="text-xl font-semibold text-[#111] mt-6">10.4 Indemnification</h3>
                <p>You agree to indemnify and hold harmless 2ndShift from claims arising from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any law or third-party rights</li>
                  <li>Content you post on the Platform</li>
                  <li>Your use of Platform services</li>
                </ul>
              </div>
            </section>

            {/* 11. Termination */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">11. Account Termination</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-xl font-semibold text-[#111] mt-6">11.1 By User</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may close your account at any time</li>
                  <li>Complete all active Projects before closure</li>
                  <li>Outstanding payments will be processed</li>
                  <li>Data retention as per Privacy Policy</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">11.2 By Platform</h3>
                <p>We may suspend or terminate accounts for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violation of Terms or policies</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Multiple unresolved disputes</li>
                  <li>Extended inactivity (12+ months)</li>
                  <li>Non-payment of fees</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#111] mt-6">11.3 Effect of Termination</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access to Platform immediately revoked</li>
                  <li>Outstanding financial obligations remain</li>
                  <li>Certain provisions survive termination (liability, arbitration, etc.)</li>
                </ul>
              </div>
            </section>

            {/* 12. Changes to Terms */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">12. Modifications to Terms</h2>
              <div className="space-y-4 text-slate-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>We may update these Terms from time to time</li>
                  <li>Material changes will be notified via email and Platform notification</li>
                  <li>Continued use after changes constitutes acceptance</li>
                  <li>You may terminate if you disagree with changes</li>
                </ul>
              </div>
            </section>

            {/* 13. Miscellaneous */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">13. General Provisions</h2>
              <div className="space-y-4 text-slate-700">
                <p><strong>Severability:</strong> If any provision is found unenforceable, remaining provisions continue in effect.</p>
                <p><strong>Waiver:</strong> Failure to enforce any right does not waive that right.</p>
                <p><strong>Assignment:</strong> You may not transfer your account. We may assign our rights and obligations.</p>
                <p><strong>Entire Agreement:</strong> These Terms, along with Privacy Policy and other policies, constitute the entire agreement.</p>
                <p><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our control.</p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#111] mb-6">14. Contact Information</h2>
              <div className="space-y-4 text-slate-700">
                <p>For questions about these Terms, contact us at:</p>
                <div className="bg-slate-50 p-6 rounded-xl mt-4">
                  <p><strong>2ndShift India Private Limited</strong></p>
                  <p>Hyderabad, Telangana, India</p>
                  <p>Email: legal@2ndshift.in</p>
                  <p>Phone: +91 80712 34567</p>
                </div>
              </div>
            </section>

            {/* Legal Footer */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl mt-12">
              <p className="text-sm leading-relaxed">
                These Terms of Service are effective as of January 15, 2025. By using 2ndShift, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use our Platform.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#111] mb-8 text-center">Related Legal Documents</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/privacy" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-[#0b63ff] transition group">
              <Shield className="w-10 h-10 text-[#0b63ff] mb-4" />
              <h4 className="font-bold text-[#111] mb-2 group-hover:text-[#0b63ff]">Privacy Policy</h4>
              <p className="text-sm text-[#333]">How we collect, use, and protect your data</p>
            </Link>
            <Link href="/compliance" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-[#0b63ff] transition group">
              <FileText className="w-10 h-10 text-[#0b63ff] mb-4" />
              <h4 className="font-bold text-[#111] mb-2 group-hover:text-[#0b63ff]">Compliance</h4>
              <p className="text-sm text-[#333]">Our regulatory compliance framework</p>
            </Link>
            <Link href="/security" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-[#0b63ff] transition group">
              <Scale className="w-10 h-10 text-[#0b63ff] mb-4" />
              <h4 className="font-bold text-[#111] mb-2 group-hover:text-[#0b63ff]">Security</h4>
              <p className="text-sm text-[#333]">Platform security and data protection</p>
            </Link>
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
