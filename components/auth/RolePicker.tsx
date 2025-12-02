'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, User, ArrowRight } from 'lucide-react'
import { useRole } from '@/components/role/RoleContextProvider'
import { trackRoleSelected } from '@/lib/analytics/roleEvents'

export function RolePicker() {
  const router = useRouter()
  const { setRole } = useRole()
  const [selectedRole, setSelectedRole] = useState<'worker' | 'client' | null>(null)

  const handleRoleSelect = (role: 'worker' | 'client') => {
    setSelectedRole(role)
    setRole(role, 'login')
    trackRoleSelected(role, 'login')
    router.push(`/login?role=${role}`)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Choose your role</h2>
      <p className="text-slate-600 mb-8">Select how you want to use 2ndShift</p>

      <div className="space-y-4">
        <button
          onClick={() => handleRoleSelect('worker')}
          className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
          aria-label="I want to work — show worker signup"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">I want to work</h3>
              <p className="text-sm text-slate-600">Find remote jobs and earn money</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => handleRoleSelect('client')}
          className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
          aria-label="I want to hire — show client signup"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">I want to hire</h3>
              <p className="text-sm text-slate-600">Post jobs and find talent</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </button>
      </div>
    </div>
  )
}
