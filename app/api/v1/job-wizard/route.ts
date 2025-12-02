/**
 * POST /api/v1/job-wizard
 * AI Job Wizard - converts one-line requirement to structured job spec
 * DEMO-STUB - replace for production with real LLM
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const wizardSchema = z.object({
  requirement: z.string().min(10).max(500),
})

export async function POST(request: NextRequest) {
  return requireAuth(request, async (authReq) => {
    try {
      if (authReq.userRole !== 'client') {
        return NextResponse.json(
          { error: 'Only clients can use job wizard' },
          { status: 403 }
        )
      }

      const body = await request.json()
      const validated = wizardSchema.parse(body)

      // DEMO-STUB - replace for production with real LLM
      // This is a deterministic stub that extracts keywords and suggests structure
      const requirement = validated.requirement.toLowerCase()
      
      // Extract keywords
      const keywords = {
        devops: ['ci/cd', 'docker', 'kubernetes', 'terraform', 'jenkins', 'pipeline'],
        cloud: ['aws', 'azure', 'gcp', 'ec2', 's3', 'cloud'],
        python: ['python', 'django', 'fastapi', 'automation', 'script'],
        ai: ['ai', 'llm', 'rag', 'machine learning', 'ml', 'openai'],
        backend: ['api', 'backend', 'microservices', 'graphql', 'rest'],
        networking: ['network', 'vpn', 'dns', 'load balancer', 'firewall'],
        data: ['data', 'etl', 'pipeline', 'database', 'warehouse'],
      }

      let suggestedCategory = 'DevOps'
      let maxMatches = 0

      for (const [category, terms] of Object.entries(keywords)) {
        const matches = terms.filter(term => requirement.includes(term)).length
        if (matches > maxMatches) {
          maxMatches = matches
          suggestedCategory = category.charAt(0).toUpperCase() + category.slice(1)
        }
      }

      // Estimate price based on keywords
      let estimatedPrice = 15000
      if (requirement.includes('urgent') || requirement.includes('asap')) {
        estimatedPrice = 25000
      }
      if (requirement.includes('simple') || requirement.includes('quick')) {
        estimatedPrice = 8000
      }
      if (requirement.includes('complex') || requirement.includes('advanced')) {
        estimatedPrice = 30000
      }

      // Get matching microtasks
      const { data: microtasks } = await supabaseAdmin
        .from('microtasks')
        .select('id, title, base_price_min, base_price_max')
        .limit(3)

      // Get top 3 workers (demo - in production, use matching algorithm)
      const { data: workers } = await supabaseAdmin
        .from('profiles')
        .select(`
          user_id,
          headline,
          skills,
          verified_level,
          score,
          user:users!inner(id, full_name, email)
        `)
        .gte('score', 75)
        .order('score', { ascending: false })
        .limit(3)

      return NextResponse.json({
        job_spec: {
          title: validated.requirement.substring(0, 100),
          description: `Detailed job description for: ${validated.requirement}`,
          suggested_category: suggestedCategory,
          estimated_price_min: estimatedPrice * 100,
          estimated_price_max: estimatedPrice * 1.5 * 100,
          delivery_window: '3-7d',
          complexity: maxMatches > 2 ? 'advanced' : 'intermediate',
        },
        suggested_microtasks: microtasks || [],
        top_workers: (workers || []).map((w: any) => ({
          id: w.user_id,
          name: (w.user as any)?.full_name || 'Unknown',
          headline: w.headline,
          skills: w.skills,
          verified_level: w.verified_level,
          score: w.score,
        })),
        note: '[DEMO-STUB] This is a deterministic stub. Replace with real LLM in production.'
      })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.issues },
          { status: 400 }
        )
      }
      console.error('Error in job wizard:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
