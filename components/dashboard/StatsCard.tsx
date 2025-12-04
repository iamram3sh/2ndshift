import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: {
    value: number
    trend: 'up' | 'down'
  }
  color: 'indigo' | 'green' | 'orange' | 'purple' | 'blue'
}

const colorClasses = {
  indigo: 'from-[#0b63ff] to-[#0a56e6]',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
  blue: 'from-blue-500 to-blue-600',
}

const iconBgColors = {
  indigo: 'bg-blue-100 text-[#0b63ff] dark:bg-blue-900 dark:text-blue-300',
  green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
}

export function StatsCard({ title, value, icon: Icon, change, color }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColors[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            change.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.trend === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
          </div>
        )}
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}
