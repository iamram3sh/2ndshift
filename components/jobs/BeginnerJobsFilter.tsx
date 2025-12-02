/**
 * Beginner-Friendly Jobs Section
 * Filter and display jobs suitable for first-time remote workers
 * 
 * TODO: Implement full filtering logic
 */

'use client'

import { GraduationCap, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface BeginnerJob {
  id: string
  title: string
  description: string
  skills: string[]
  budget: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  mentorAvailable: boolean
}

interface BeginnerJobsFilterProps {
  jobs?: BeginnerJob[]
}

export default function BeginnerJobsFilter({ jobs = [] }: BeginnerJobsFilterProps) {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#111]">Beginner-Friendly Jobs</h2>
            <p className="text-[#333]">Perfect for your first remote work experience</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Sparkles className="w-12 h-12 text-sky-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#111] mb-2">No beginner jobs available</h3>
              <p className="text-[#333] mb-4">
                Check back soon for jobs perfect for first-time remote workers.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/projects/${job.id}`}
                className="block p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#111] flex-1">{job.title}</h3>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    Beginner
                  </span>
                </div>

                <p className="text-sm text-[#333] mb-4 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-slate-100 text-[#333] rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-lg font-bold text-[#111]">{job.budget}</div>
                    {job.mentorAvailable && (
                      <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3" />
                        Mentor available
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/jobs?filter=beginner"
            className="inline-flex items-center gap-2 text-[#111] font-semibold hover:text-sky-600 transition-colors"
          >
            View All Beginner Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

