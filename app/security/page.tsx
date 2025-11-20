'use client'

import Link from 'next/link'
import { Briefcase, Shield, Lock, Key, Eye, Server, AlertTriangle, CheckCircle } from 'lucide-react'

export default function SecurityPage() {
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
            Security & Data Protection
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Enterprise-grade security protecting your data and transactions
          </p>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">256-bit</div>
              <div className="text-slate-600">AES Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">ISO 27001</div>
              <div className="text-slate-600">Certified</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">PCI-DSS</div>
              <div className="text-slate-600">Level 1 Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-slate-600">Security Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Data Encryption */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Lock className="w-8 h-8 text-indigo-600" />
              1. Data Encryption
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Encryption in Transit
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>TLS 1.3:</strong> All data transmitted over HTTPS with TLS 1.3 encryption</li>
                  <li><strong>Perfect Forward Secrecy:</strong> Each session uses unique encryption keys</li>
                  <li><strong>HSTS:</strong> HTTP Strict Transport Security enforced</li>
                  <li><strong>Certificate Pinning:</strong> Prevents man-in-the-middle attacks</li>
                  <li>Regular SSL/TLS certificate updates and renewals</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Encryption at Rest
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>AES-256:</strong> Industry-standard encryption for stored data</li>
                  <li><strong>Database Encryption:</strong> Full database encryption with PostgreSQL encryption extensions</li>
                  <li><strong>File Encryption:</strong> All uploaded files encrypted before storage</li>
                  <li><strong>Key Management:</strong> AWS KMS for secure key storage and rotation</li>
                  <li><strong>Encrypted Backups:</strong> All backups encrypted and stored securely</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Sensitive Data Protection
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Aadhaar:</strong> Encrypted and masked (only last 4 digits displayed)</li>
                  <li><strong>PAN:</strong> Encrypted storage with access controls</li>
                  <li><strong>Bank Details:</strong> Tokenized and encrypted</li>
                  <li><strong>Passwords:</strong> Hashed using bcrypt with salt (never stored in plaintext)</li>
                  <li><strong>Payment Cards:</strong> Never stored (PCI-DSS compliant tokenization)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Key className="w-8 h-8 text-indigo-600" />
              2. Access Control & Authentication
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Multi-Factor Authentication (MFA)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>SMS-based OTP for login and sensitive operations</li>
                  <li>Email verification for account creation</li>
                  <li>Aadhaar-based e-KYC verification</li>
                  <li>Biometric authentication support (fingerprint, face ID)</li>
                  <li>TOTP (Time-based One-Time Password) option available</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Password Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Minimum 8 characters with complexity requirements</li>
                  <li>Bcrypt hashing with per-user salt</li>
                  <li>Password breach detection (Have I Been Pwned integration)</li>
                  <li>Account lockout after 5 failed attempts</li>
                  <li>Password reset via secure token with expiration</li>
                  <li>Password history to prevent reuse</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Role-Based Access Control (RBAC)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Granular permissions based on user roles (Worker, Client, Admin, Super Admin)</li>
                  <li>Principle of least privilege - users only access what they need</li>
                  <li>Admin actions logged and auditable</li>
                  <li>Separation of duties for critical operations</li>
                  <li>Regular access reviews and permission audits</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Session Management
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Secure session tokens (JWT with short expiration)</li>
                  <li>Automatic logout after 30 minutes of inactivity</li>
                  <li>Single active session per user (configurable)</li>
                  <li>Session termination on password change</li>
                  <li>Secure cookie attributes (HttpOnly, Secure, SameSite)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Infrastructure Security */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Server className="w-8 h-8 text-indigo-600" />
              3. Infrastructure Security
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Cloud Infrastructure
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Hosting:</strong> AWS/Vercel with ISO 27001, SOC 2 Type II certified data centers</li>
                  <li><strong>Database:</strong> Supabase (PostgreSQL) with built-in security features</li>
                  <li><strong>CDN:</strong> Cloudflare for DDoS protection and performance</li>
                  <li><strong>Geographic Redundancy:</strong> Data replicated across multiple availability zones</li>
                  <li><strong>Auto-scaling:</strong> Dynamic resource allocation for high availability</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Network Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Firewall:</strong> Web Application Firewall (WAF) with OWASP top 10 protection</li>
                  <li><strong>DDoS Protection:</strong> Cloudflare with automatic threat mitigation</li>
                  <li><strong>VPC:</strong> Virtual Private Cloud with isolated network segments</li>
                  <li><strong>Rate Limiting:</strong> API rate limits to prevent abuse</li>
                  <li><strong>IP Whitelisting:</strong> For admin and sensitive operations</li>
                  <li><strong>Intrusion Detection:</strong> Real-time monitoring for suspicious activity</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Application Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Input Validation:</strong> All user inputs sanitized and validated</li>
                  <li><strong>SQL Injection Prevention:</strong> Parameterized queries and ORM</li>
                  <li><strong>XSS Protection:</strong> Content Security Policy (CSP) headers</li>
                  <li><strong>CSRF Protection:</strong> Token-based CSRF prevention</li>
                  <li><strong>Dependency Scanning:</strong> Automated vulnerability scanning of libraries</li>
                  <li><strong>Code Reviews:</strong> Security-focused code review process</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Monitoring & Incident Response */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Eye className="w-8 h-8 text-indigo-600" />
              4. Monitoring & Incident Response
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  24/7 Security Monitoring
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Real-time monitoring of all system activities</li>
                  <li>Automated alerting for suspicious activities</li>
                  <li>Log aggregation and analysis (ELK stack)</li>
                  <li>Anomaly detection using machine learning</li>
                  <li>Security Information and Event Management (SIEM)</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Audit Logging
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Comprehensive logging of all security-relevant events</li>
                  <li>Immutable audit trails for compliance</li>
                  <li>Admin actions fully logged and reviewable</li>
                  <li>Login attempts, password changes, and data access logged</li>
                  <li>Log retention for 7 years (as per regulatory requirements)</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Incident Response Plan
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Dedicated Security Incident Response Team (SIRT)</li>
                  <li>Defined incident classification and escalation procedures</li>
                  <li>Containment, eradication, and recovery protocols</li>
                  <li>User notification within 72 hours of data breach</li>
                  <li>Post-incident review and continuous improvement</li>
                  <li>Business Continuity and Disaster Recovery plans</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fraud Prevention */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-indigo-600" />
              5. Fraud Prevention
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Transaction Monitoring
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Real-time fraud detection algorithms</li>
                  <li>Unusual activity alerts and automatic blocking</li>
                  <li>Velocity checks for high-frequency transactions</li>
                  <li>Geolocation-based fraud prevention</li>
                  <li>Device fingerprinting to detect suspicious devices</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  KYC & AML Compliance
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Aadhaar-based identity verification</li>
                  <li>PAN verification for tax compliance</li>
                  <li>Bank account verification</li>
                  <li>Watchlist screening for sanctions and PEPs</li>
                  <li>Ongoing transaction monitoring for suspicious activity</li>
                  <li>Suspicious Transaction Report (STR) filing mechanism</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Payment Security
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Escrow Protection:</strong> Payments held until project completion</li>
                  <li><strong>3D Secure:</strong> Additional authentication for card payments</li>
                  <li><strong>Tokenization:</strong> Card details never stored on our servers</li>
                  <li><strong>Chargeback Protection:</strong> Dispute resolution and evidence collection</li>
                  <li><strong>PCI-DSS Compliance:</strong> Level 1 certified payment processing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compliance & Certifications */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">6. Security Certifications</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Current Certifications
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• ISO 27001:2013 - Information Security Management</li>
                  <li>• PCI-DSS Level 1 - Payment Card Security</li>
                  <li>• SSL/TLS Certificate - Extended Validation</li>
                  <li>• IT Act 2000 Compliance</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-3">In Progress</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• SOC 2 Type II Certification</li>
                  <li>• ISO 27017 - Cloud Security</li>
                  <li>• ISO 27018 - Cloud Privacy</li>
                  <li>• Bug Bounty Program Launch</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Audits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">7. Regular Security Audits</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Scheduled Assessments</h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Quarterly:</strong> Internal security audits and code reviews</li>
                  <li><strong>Semi-Annual:</strong> External penetration testing by certified firms</li>
                  <li><strong>Annual:</strong> Comprehensive security assessment and ISO 27001 recertification</li>
                  <li><strong>Continuous:</strong> Automated vulnerability scanning and dependency checks</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Security Tips */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">8. Protect Yourself</h2>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Security Best Practices for Users</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">✅ Do:</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Use strong, unique passwords</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Keep your email and phone number updated</li>
                    <li>• Log out after using shared devices</li>
                    <li>• Review account activity regularly</li>
                    <li>• Report suspicious activity immediately</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">❌ Don't:</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Share your password with anyone</li>
                    <li>• Use public Wi-Fi without VPN</li>
                    <li>• Click on suspicious links in emails</li>
                    <li>• Accept friend requests from strangers</li>
                    <li>• Share sensitive info via unsecure channels</li>
                    <li>• Ignore security alerts or notifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Report Security Issue */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-7 h-7" />
              Report a Security Issue
            </h3>
            <p className="text-slate-300 mb-6">
              If you discover a security vulnerability, please report it to us immediately. We take all security reports seriously.
            </p>
            <div className="space-y-2 text-slate-300 mb-6">
              <p><strong>Security Team:</strong> security@2ndshift.in</p>
              <p><strong>PGP Key:</strong> Available on request</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
              <p><strong>Bug Bounty:</strong> Rewards available for valid findings</p>
            </div>
            <Link href="/.well-known/security.txt" className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition">
              View Security.txt
            </Link>
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
              <p className="text-sm text-slate-600">Platform usage terms</p>
            </Link>
            <Link href="/privacy" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition group">
              <Lock className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Privacy Policy</h4>
              <p className="text-sm text-slate-600">Data protection practices</p>
            </Link>
            <Link href="/compliance" className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition group">
              <Key className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Compliance</h4>
              <p className="text-sm text-slate-600">Regulatory compliance</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">© 2025 2ndShift India Private Limited. All rights reserved.</p>
          <p className="text-xs text-slate-500 mt-2 italic">Developed with passion by an Indisciplined Financial person to build financial freedom for all</p>
        </div>
      </footer>
    </div>
  )
}
