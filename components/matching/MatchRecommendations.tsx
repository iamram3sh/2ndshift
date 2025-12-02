/**
 * AI Job Matchmaking Component
 * Auto-match workers to jobs based on skills and preferences
 * 
 * TODO: Implement full matching algorithm
 */

'use client'

import { Sparkles, TrendingUp, MapPin, Clock, IndianRupee } from 'lucide-react'
import Link from 'next/link'

interface MatchRecommendation {
  id: string
  title: string
  matchScore: number
  skills: string[]
  budget: string
  duration: string
  location: string
  reason: string
}

interface MatchRecommendationsProps {
  workerId?: string
}

export default function MatchRecommendations({ workerId }: MatchRecommendationsProps) {
  // TODO: Fetch real recommendations from API
  const recommendations: MatchRecommendation[] = []

  if (recommendations.length === 0) {
    return (
      <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 text-center">
        <Sparkles className="w-12 h-12 text-sky-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#111] mb-2">No matches yet</h3>
        <p className="text-[#333] mb-4">
          Complete your profile with skills and preferences to get AI-powered job recommendations.
        </p>
        <Link
          href="/worker/profile/edit"
          className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#333] transition-all"
        >
          Complete Profile
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-sky-600" />
        <h2 className="text-2xl font-bold text-[#111]">AI-Powered Job Matches</h2>
      </div>

      {recommendations.map((job) => (
        <Link
          key={job.id}
          href={`/projects/${job.id}`}
          className="block p-6 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-[#111]">{job.title}</h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  {job.matchScore}% Match
                </span>
              </div>
              <p className="text-sm text-[#333] mb-3">{job.reason}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-sky-600 flex-shrink-0" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-slate-100 text-[#333] rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-[#333]">
            <span className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {job.budget}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.duration}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

