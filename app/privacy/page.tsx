'use client'

import Link from 'next/link'
import { Briefcase, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Last Updated: January 15, 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-xl mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Your Privacy Matters</h3>
              <p className="text-slate-700 leading-relaxed">
                At 2ndShift, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our Platform.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Database className="w-8 h-8 text-indigo-600" />
                1. Information We Collect
              </h2>
              
              <div className="space-y-6 text-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 mt-6">1.1 Personal Information</h3>
                <p>We collect the following personal information when you register and use our Platform:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Identity Information:</strong> Name, date of birth, gender, profile photo</li>
                  <li><strong>Contact Information:</strong> Email address, phone number, residential address</li>
                  <li><strong>Government IDs:</strong> PAN card, Aadhaar number (for KYC verification)</li>
                  <li><strong>Financial Information:</strong> Bank account details, UPI ID, payment card information</li>
                  <li><strong>Professional Information:</strong> Skills, work experience, education, certifications, portfolio</li>
                  <li><strong>Business Information:</strong> Company name, GST number, business registration details (for corporate clients)</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">1.2 Usage Data</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Login times, IP addresses, device information</li>
                  <li>Browser type, operating system, and version</li>
                  <li>Pages visited, time spent on pages, clickstream data</li>
                  <li>Search queries and filters used</li>
                  <li>Project applications, bids, and proposals</li>
                  <li>Messages and communications (for dispute resolution and quality assurance)</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">1.3 Transaction Data</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Project details and contracts</li>
                  <li>Payment amounts, dates, and methods</li>
                  <li>Invoices and receipts</li>
                  <li>Tax documentation (Form 16A, TDS certificates)</li>
                  <li>Refund and dispute records</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">1.4 Information from Third Parties</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>KYC verification data from UIDAI (Aadhaar)</li>
                  <li>PAN verification from Income Tax Department</li>
                  <li>Bank account verification from payment processors</li>
                  <li>Social login information (Google, LinkedIn - if used)</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">1.5 Cookies and Tracking Technologies</h3>
                <p>We use cookies, web beacons, and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain your login session</li>
                  <li>Remember your preferences</li>
                  <li>Analyze Platform usage and performance</li>
                  <li>Provide personalized recommendations</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
              </div>
            </section>

            {/* 2. How We Use Your Information */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Eye className="w-8 h-8 text-indigo-600" />
                2. How We Use Your Information
              </h2>
              
              <div className="space-y-6 text-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 mt-6">2.1 Platform Operations</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create and manage your account</li>
                  <li>Verify your identity and credentials</li>
                  <li>Process payments and transactions</li>
                  <li>Generate contracts and legal documents</li>
                  <li>Facilitate communication between Users</li>
                  <li>Provide customer support</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">2.2 Legal and Compliance</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with KYC/AML regulations</li>
                  <li>Deduct and remit TDS as per Income Tax Act</li>
                  <li>Issue tax certificates (Form 16A)</li>
                  <li>Maintain records for statutory audits</li>
                  <li>Respond to legal requests and court orders</li>
                  <li>Prevent fraud, money laundering, and illegal activities</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">2.3 Service Improvement</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Analyze usage patterns and user behavior</li>
                  <li>Improve Platform features and functionality</li>
                  <li>Develop new products and services</li>
                  <li>Personalize your experience</li>
                  <li>Conduct research and analytics</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">2.4 Communication</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Send transactional emails (payment confirmations, contract updates)</li>
                  <li>Notify about project opportunities (Workers)</li>
                  <li>Alert about security issues or policy changes</li>
                  <li>Send promotional offers (with your consent)</li>
                  <li>Request feedback and reviews</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">2.5 Security and Fraud Prevention</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Detect and prevent fraudulent activities</li>
                  <li>Monitor for suspicious transactions</li>
                  <li>Protect against cyber threats and attacks</li>
                  <li>Enforce our Terms of Service</li>
                  <li>Investigate violations and disputes</li>
                </ul>
              </div>
            </section>

            {/* 3. How We Share Your Information */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">3. Information Sharing and Disclosure</h2>
              
              <div className="space-y-6 text-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 mt-6">3.1 With Other Users</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Workers:</strong> Profile information, skills, ratings, portfolio (visible to Clients)</li>
                  <li><strong>Clients:</strong> Company name, project details, ratings (visible to Workers)</li>
                  <li><strong>After Hiring:</strong> Contact information shared between Client and Worker</li>
                  <li>You control visibility settings for your profile information</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">3.2 With Service Providers</h3>
                <p>We share data with trusted third-party service providers who help us operate the Platform:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Payment Processors:</strong> Razorpay (for payment processing)</li>
                  <li><strong>Cloud Hosting:</strong> Supabase, AWS (for data storage)</li>
                  <li><strong>Email Services:</strong> SendGrid, AWS SES (for transactional emails)</li>
                  <li><strong>Analytics:</strong> Google Analytics (for usage analytics)</li>
                  <li><strong>KYC Verification:</strong> UIDAI, DigiLocker (for identity verification)</li>
                  <li><strong>Customer Support:</strong> Zendesk or similar tools</li>
                </ul>
                <p className="mt-4">All service providers are bound by confidentiality agreements and data protection obligations.</p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">3.3 Legal Requirements</h3>
                <p>We may disclose your information when required by law:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To comply with legal processes (subpoenas, court orders)</li>
                  <li>To government authorities (tax, law enforcement)</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>To prevent fraud or illegal activities</li>
                  <li>To enforce our Terms of Service</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">3.4 Business Transfers</h3>
                <p>In the event of merger, acquisition, or sale of assets, your information may be transferred to the new entity. We will notify you before your information is transferred and becomes subject to a different Privacy Policy.</p>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">3.5 With Your Consent</h3>
                <p>We may share information with third parties when you explicitly consent to such sharing.</p>
              </div>
            </section>

            {/* 4. Data Storage and Security */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Lock className="w-8 h-8 text-indigo-600" />
                4. Data Storage and Security
              </h2>
              
              <div className="space-y-6 text-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 mt-6">4.1 Data Location</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your data is primarily stored on servers located in India</li>
                  <li>Some data may be processed by service providers outside India (with appropriate safeguards)</li>
                  <li>We comply with cross-border data transfer regulations</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">4.2 Security Measures</h3>
                <p>We implement industry-standard security practices:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> TLS/SSL for data in transit, AES-256 for data at rest</li>
                  <li><strong>Access Controls:</strong> Role-based access, multi-factor authentication</li>
                  <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                  <li><strong>Monitoring:</strong> 24/7 security monitoring and incident response</li>
                  <li><strong>Compliance:</strong> ISO 27001, PCI-DSS (for payment data)</li>
                  <li><strong>Data Minimization:</strong> Collect only necessary information</li>
                  <li><strong>Employee Training:</strong> Regular security awareness training</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">4.3 Data Retention</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Active Accounts:</strong> Data retained as long as account is active</li>
                  <li><strong>Inactive Accounts:</strong> Data retained for 3 years after last activity</li>
                  <li><strong>Financial Records:</strong> Retained for 7 years (as per tax laws)</li>
                  <li><strong>Legal Disputes:</strong> Data retained until resolution</li>
                  <li><strong>Deleted Accounts:</strong> Data deleted within 90 days (except legally required records)</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">4.4 Sensitive Data Protection</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Aadhaar numbers encrypted and masked (showing only last 4 digits)</li>
                  <li>Payment card data never stored (tokenized by payment processor)</li>
                  <li>Bank account details encrypted and access-restricted</li>
                  <li>Passwords hashed using bcrypt with salt</li>
                </ul>
              </div>
            </section>

            {/* 5. Your Rights and Choices */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-indigo-600" />
                5. Your Rights and Choices
              </h2>
              
              <div className="space-y-6 text-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 mt-6">5.1 Access and Correction</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information through your account dashboard</li>
                  <li>Update or correct your information at any time</li>
                  <li>Download your data in machine-readable format</li>
                  <li>Request a copy of all data we hold about you</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">5.2 Data Deletion</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request deletion of your account and personal data</li>
                  <li>We will delete data within 90 days (except legally required records)</li>
                  <li>Some data may be retained in anonymized form for analytics</li>
                  <li>Financial records retained for 7 years as per law</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">5.3 Marketing Communications</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Opt out of promotional emails via unsubscribe link</li>
                  <li>Manage notification preferences in account settings</li>
                  <li>You cannot opt out of transactional communications (payment confirmations, security alerts)</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">5.4 Cookie Management</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Control cookies through browser settings</li>
                  <li>Disable non-essential cookies via Cookie Consent Manager</li>
                  <li>Note: Disabling cookies may affect Platform functionality</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-900 mt-6">5.5 Profile Visibility</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Control who can see your profile (public, clients only, private)</li>
                  <li>Hide specific information from your profile</li>
                  <li>Manage portfolio visibility</li>
                  <li>Control search visibility</li>
                </ul>
              </div>
            </section>

            {/* 6. Children's Privacy */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">6. Children's Privacy</h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  2ndShift is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@2ndshift.in.
                </p>
              </div>
            </section>

            {/* 7. Third-Party Links */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">7. Third-Party Links and Services</h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.
                </p>
                <p>Examples of third-party services we integrate with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment gateways (Razorpay)</li>
                  <li>Social login providers (Google, LinkedIn)</li>
                  <li>Analytics tools (Google Analytics)</li>
                  <li>Customer support platforms</li>
                </ul>
              </div>
            </section>

            {/* 8. International Users */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">8. International Users</h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  2ndShift primarily operates in India. If you access our Platform from outside India, your information may be transferred to, stored, and processed in India. By using our Platform, you consent to such transfer.
                </p>
                <p>
                  India's data protection laws may differ from those in your country. We implement appropriate safeguards to protect your information in accordance with this Privacy Policy.
                </p>
              </div>
            </section>

            {/* 9. Legal Basis for Processing */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">9. Legal Basis for Processing (IT Act 2000 & SPDI Rules)</h2>
              <div className="space-y-4 text-slate-700">
                <p>We process your personal information under the following legal bases:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Consent:</strong> When you provide explicit consent (e.g., marketing communications)</li>
                  <li><strong>Contract Performance:</strong> To fulfill our obligations under Terms of Service</li>
                  <li><strong>Legal Obligations:</strong> To comply with Indian laws (KYC, TDS, tax reporting)</li>
                  <li><strong>Legitimate Interests:</strong> For fraud prevention, security, and service improvement</li>
                </ul>
              </div>
            </section>

            {/* 10. Data Breach Notification */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">10. Data Breach Notification</h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  In the event of a data breach that may compromise your personal information, we will:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Notify affected users within 72 hours of discovery</li>
                  <li>Inform relevant regulatory authorities as required by law</li>
                  <li>Provide details about the breach and steps taken</li>
                  <li>Offer guidance on protective measures you can take</li>
                  <li>Take immediate action to contain and remediate the breach</li>
                </ul>
              </div>
            </section>

            {/* 11. Changes to Privacy Policy */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">11. Changes to This Privacy Policy</h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Material changes will be notified via email and Platform notification</li>
                  <li>Updated Privacy Policy will be posted with "Last Updated" date</li>
                  <li>Continued use after changes constitutes acceptance</li>
                  <li>You may close your account if you disagree with changes</li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">12. Contact Us</h2>
              <div className="space-y-4 text-slate-700">
                <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
                
                <div className="bg-slate-50 p-6 rounded-xl mt-4 space-y-3">
                  <p><strong>Data Protection Officer</strong></p>
                  <p><strong>2ndShift India Private Limited</strong></p>
                  <p>Hyderabad, Telangana, India</p>
                  <p>Email: privacy@2ndshift.in</p>
                  <p>Phone: +91 80712 34567</p>
                  <p>Support: Monday - Saturday, 9 AM - 6 PM IST</p>
                </div>

                <p className="mt-6">
                  For grievance redressal, you can also contact our Grievance Officer at the above address. We will respond to your request within 30 days.
                </p>
              </div>
            </section>

            {/* Compliance Statement */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl mt-12">
              <h3 className="text-xl font-bold mb-4">Compliance Statement</h3>
              <p className="text-sm leading-relaxed mb-4">
                This Privacy Policy is compliant with:
              </p>
              <ul className="text-sm space-y-2">
                <li>• Information Technology Act, 2000</li>
                <li>• Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
                <li>• Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</li>
              </ul>
              <p className="text-sm leading-relaxed mt-4">
                By using 2ndShift, you acknowledge that you have read, understood, and agree to this Privacy Policy.
              </p>
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
              <Shield className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Terms of Service</h4>
              <p className="text-sm text-slate-600">Platform usage terms and conditions</p>
            </Link>
            <Link href="/compliance" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition group">
              <Lock className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Compliance</h4>
              <p className="text-sm text-slate-600">Our regulatory compliance framework</p>
            </Link>
            <Link href="/security" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition group">
              <Database className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Security</h4>
              <p className="text-sm text-slate-600">Platform security measures</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">© 2024 2ndShift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
