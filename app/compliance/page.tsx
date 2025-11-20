'use client'

import Link from 'next/link'
import { Briefcase, FileCheck, Shield, Award, CheckCircle, Building } from 'lucide-react'

export default function CompliancePage() {
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
              <Link href="/contact" className="text-slate-600 hover:text-indigo-600 font-medium transition">Contact</Link>
            </div>

            <Link href="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Compliance Framework
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Our commitment to legal and regulatory compliance
          </p>
        </div>
      </section>

      {/* Compliance Overview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-indigo-600 transition">
              <Award className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% Compliant</h3>
              <p className="text-slate-600">Full compliance with Indian laws and regulations</p>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-indigo-600 transition">
              <Shield className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Data Protected</h3>
              <p className="text-slate-600">ISO 27001 certified security practices</p>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-indigo-600 transition">
              <Building className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Registered Entity</h3>
              <p className="text-slate-600">Incorporated under Companies Act 2013</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Regulatory Compliance */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">1. Regulatory Compliance</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Companies Act, 2013
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>2ndShift India Private Limited incorporated under Companies Act, 2013</li>
                  <li>Corporate Identification Number (CIN): [To be added]</li>
                  <li>Registered Office: Hyderabad, Telangana</li>
                  <li>Regular filing of annual returns and financial statements with ROC</li>
                  <li>Compliance with board meetings and statutory requirements</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Information Technology Act, 2000
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Compliance with IT Act provisions for intermediary services</li>
                  <li>Implementation of Intermediary Guidelines and Digital Media Ethics Code Rules, 2021</li>
                  <li>Appointed Grievance Officer for user complaints</li>
                  <li>Response to grievances within 24 hours, resolution within 15 days</li>
                  <li>Content moderation and takedown mechanisms in place</li>
                  <li>Digital signatures valid under Section 3A (Aadhaar-based e-Sign)</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Income Tax Act, 1961
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>TDS Compliance:</strong> Deduction of TDS u/s 194J (professional services) and 194C (contracts)</li>
                  <li>10% TDS deducted on payments exceeding ₹30,000 per transaction</li>
                  <li>Quarterly TDS returns filed (Form 26Q)</li>
                  <li>Form 16A issued to workers within prescribed timelines</li>
                  <li>PAN-based verification for all users</li>
                  <li>Annual Information Return (AIR) filing for high-value transactions</li>
                  <li>GST TAN obtained for TDS deduction</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Goods and Services Tax (GST) Act, 2017
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>GSTIN registered: [To be added]</li>
                  <li>18% GST applicable on platform service fees</li>
                  <li>Reverse charge mechanism for foreign service providers</li>
                  <li>Monthly/Quarterly GST return filing (GSTR-1, GSTR-3B)</li>
                  <li>GST-compliant invoicing system</li>
                  <li>Input tax credit management</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Payment and Settlement Systems Act, 2007
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Payment processing through RBI-authorized payment gateway (Razorpay)</li>
                  <li>PCI-DSS Level 1 compliant payment infrastructure</li>
                  <li>Escrow account management for buyer protection</li>
                  <li>KYC compliance for high-value transactions</li>
                  <li>Transaction monitoring for fraud prevention</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Prevention of Money Laundering Act (PMLA), 2002
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>KYC/AML compliance through Aadhaar-based verification</li>
                  <li>Customer Due Diligence (CDD) procedures in place</li>
                  <li>Suspicious Transaction Reporting (STR) mechanism</li>
                  <li>Record maintenance as per PMLA requirements</li>
                  <li>Transaction limits and monitoring for high-risk activities</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Indian Contract Act, 1872
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>All contracts generated comply with essential elements of valid contract</li>
                  <li>Clear offer, acceptance, consideration, and intention to create legal relations</li>
                  <li>Contract templates reviewed by legal experts</li>
                  <li>Dispute resolution clauses in all contracts</li>
                  <li>Digital signatures legally valid under IT Act</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Aadhaar Act, 2016
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Aadhaar-based e-KYC for identity verification</li>
                  <li>Voluntary usage with user consent</li>
                  <li>Aadhaar data encrypted and stored as per UIDAI guidelines</li>
                  <li>Masked Aadhaar displayed (last 4 digits only)</li>
                  <li>e-Sign integration for legally valid digital signatures</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">2. Data Protection & Privacy</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  SPDI Rules, 2011
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Compliance with Sensitive Personal Data or Information (SPDI) Rules</li>
                  <li>User consent obtained before collecting sensitive data</li>
                  <li>Purpose limitation and data minimization principles followed</li>
                  <li>Third-party data sharing only with explicit consent</li>
                  <li>Data breach notification procedures in place</li>
                  <li>User rights to access, correct, and delete personal data</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  ISO 27001:2013 Information Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Information Security Management System (ISMS) implemented</li>
                  <li>Regular security audits and risk assessments</li>
                  <li>Employee security awareness training</li>
                  <li>Incident response and business continuity plans</li>
                  <li>Access control and authentication mechanisms</li>
                  <li>Encryption for data in transit and at rest</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  PCI-DSS Compliance
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Payment Card Industry Data Security Standard Level 1 compliance</li>
                  <li>Card data never stored on our servers</li>
                  <li>Tokenization of payment information</li>
                  <li>Regular vulnerability scans and penetration testing</li>
                  <li>Secure payment gateway integration (Razorpay)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Labor & Employment */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">3. Labor & Employment Compliance</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Platform Model Clarification
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>2ndShift operates as a platform connecting clients and workers</li>
                  <li>Workers are independent contractors, not employees of 2ndShift</li>
                  <li>Clear contractual relationship between clients and workers</li>
                  <li>No employer-employee relationship created by platform</li>
                  <li>Workers responsible for their own taxes and compliance</li>
                  <li>Compliance with Social Security Code, 2020 (gig workers provisions)</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Anti-Discrimination & Equal Opportunity
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Zero tolerance for discrimination based on caste, religion, gender, disability</li>
                  <li>Equal opportunity platform for all qualified workers</li>
                  <li>Reporting mechanism for discrimination complaints</li>
                  <li>Regular audits to ensure fair practices</li>
                  <li>Compliance with Equal Remuneration Act, 1976</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">4. Intellectual Property Compliance</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Copyright & Trademark
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>2ndShift trademark registration: [Applied/Registered]</li>
                  <li>Copyright in platform code and content protected</li>
                  <li>DMCA-compliant takedown procedures</li>
                  <li>IP ownership clauses in all contracts</li>
                  <li>Dispute resolution for IP conflicts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Audit & Certification */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">5. Audits & Certifications</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-3">Regular Audits</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• Annual statutory audit by chartered accountants</li>
                  <li>• Quarterly internal compliance reviews</li>
                  <li>• Security audits and penetration testing</li>
                  <li>• Tax audit u/s 44AB (if applicable)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-3">Certifications</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• ISO 27001:2013 (Information Security)</li>
                  <li>• PCI-DSS Level 1 (Payment Security)</li>
                  <li>• SOC 2 Type II (In Progress)</li>
                  <li>• Startup India Recognition</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Grievance Redressal */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">6. Grievance Redressal Mechanism</h2>
            
            <div className="bg-slate-50 p-8 rounded-xl">
              <p className="text-slate-700 mb-6">
                As per IT Rules 2021, we have established a robust grievance redressal mechanism:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Grievance Officer</h4>
                  <p className="text-slate-700">Name: [To be designated]</p>
                  <p className="text-slate-700">Email: grievance@2ndshift.in</p>
                  <p className="text-slate-700">Phone: +91 80712 34567</p>
                  <p className="text-slate-700">Address: Hyderabad, Telangana</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Response Timeline</h4>
                  <ul className="list-disc pl-6 space-y-1 text-slate-700">
                    <li>Acknowledgment within 24 hours</li>
                    <li>Resolution within 15 days</li>
                    <li>Monthly compliance report to Ministry of Electronics and IT</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Transparency Report */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">7. Transparency Reporting</h2>
            
            <div className="bg-slate-50 p-6 rounded-xl">
              <p className="text-slate-700 mb-4">
                We publish monthly transparency reports containing:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Number of complaints received and action taken</li>
                <li>Content takedown requests and compliance</li>
                <li>Law enforcement requests received</li>
                <li>User data access statistics</li>
                <li>Proactive monitoring and removal stats</li>
              </ul>
              <Link href="/transparency" className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 font-semibold">
                View Transparency Reports →
              </Link>
            </div>
          </div>

          {/* Contact Compliance */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Compliance Queries</h3>
            <p className="text-slate-300 mb-6">
              For questions about our compliance framework or to report non-compliance, contact:
            </p>
            <div className="space-y-2 text-slate-300">
              <p><strong>Compliance Officer:</strong> compliance@2ndshift.in</p>
              <p><strong>Legal Team:</strong> legal@2ndshift.in</p>
              <p><strong>Phone:</strong> +91 80712 34567</p>
              <p><strong>Address:</strong> 2ndShift India Private Limited, Hyderabad, Telangana</p>
            </div>
          </div>

        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Related Documents</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/terms" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition group">
              <FileCheck className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Terms of Service</h4>
              <p className="text-sm text-slate-600">Platform usage terms</p>
            </Link>
            <Link href="/privacy" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition group">
              <Shield className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Privacy Policy</h4>
              <p className="text-sm text-slate-600">Data protection practices</p>
            </Link>
            <Link href="/security" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition group">
              <Award className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Security</h4>
              <p className="text-sm text-slate-600">Platform security measures</p>
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
