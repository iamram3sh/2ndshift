'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        aria-label="Toggle theme"
      >
        {theme === 'light' && <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
        {theme === 'dark' && <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
        {theme === 'system' && <Monitor className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-2">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
                  theme === value ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
