import Link from 'next/link'
import { Shield, Users, FileText, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">2ndShift</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            India&apos;s First Legal, Tax-Compliant Freelance Platform
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
            Earn extra income through part-time contract work while staying 100% compliant 
            with tax laws. We handle TDS, GST, and all legal documentation.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/register?type=worker"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            >
              Find Work
            </Link>
            <Link 
              href="/register?type=client"
              className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition"
            >
              Hire Talent
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Shield className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">100% Legal</h3>
            <p className="text-gray-600">TDS deduction, GST compliance, Form 16A</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Users className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Worker Protection</h3>
            <p className="text-gray-600">Anonymous profiles until hired</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <FileText className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Auto Documentation</h3>
            <p className="text-gray-600">NDAs, contracts, invoices generated</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Fair Earnings</h3>
            <p className="text-gray-600">Transparent fee structure</p>
          </div>
        </div>
      </div>
    </div>
  )
}