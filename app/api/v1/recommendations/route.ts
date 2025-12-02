/**
 * GET /api/v1/recommendations
 * Get role-specific recommendations (demo stub)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { WORKER_QUICK_TASKS, CLIENT_QUICK_PACKS } from '@/data/highValueTasks'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || 'worker'
    const isPaid = searchParams.get('paid') === 'true'

    // Demo stub - in production, fetch from database based on user preferences
    if (role === 'worker') {
      return NextResponse.json({
        quickTasks: WORKER_QUICK_TASKS,
        recommendedJobs: isPaid ? [
          {
            id: 'demo-1',
            title: 'CI/CD Pipeline Optimization',
            price: 15000,
            skills: ['CI/CD', 'Docker', 'Kubernetes'],
            category: 'DevOps'
          }
        ] : [],
        starterPacks: [
          {
            id: 'starter-1',
            title: 'DevOps Starter',
            credits: 40,
            price: 199
          }
        ]
      })
    } else {
      return NextResponse.json({
        quickPacks: CLIENT_QUICK_PACKS,
        recommendedTalent: isPaid ? [
          {
            id: 'talent-1',
            name: 'Senior DevOps Engineer',
            verified: true,
            rating: 4.9,
            skills: ['AWS', 'Kubernetes', 'Terraform']
          }
        ] : [],
        pricingSummary: {
          platformFee: '4%',
          escrowFee: '2%',
          firstThreeJobs: '0% platform fee'
        }
      })
    }
  } catch (error: any) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}
