import { NextRequest, NextResponse } from 'next/server'

import { getLatestKycVerification } from '@/lib/kyc'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const verification = await getLatestKycVerification(userId)

    return NextResponse.json({ verification })
  } catch (error) {
    console.error('Fetch KYC status error:', error)
    return NextResponse.json(
      { error: 'Unable to fetch KYC status' },
      { status: 500 }
    )
  }
}
