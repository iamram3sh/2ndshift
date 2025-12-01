import { NextRequest, NextResponse } from 'next/server'

import { startKycVerification } from '@/lib/kyc'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { KycVerificationType } from '@/types/database.types'

export async function POST(request: NextRequest) {
  try {
    const { userId, verificationType } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const verification: KycVerificationType = verificationType ?? 'pan'

    const { data: userRecord, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError || !userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const record = await startKycVerification({
      userId,
      verificationType: verification
    })

    return NextResponse.json({ verification: record })
  } catch (error) {
    console.error('Start KYC error:', error)
    return NextResponse.json(
      { error: 'Unable to start verification' },
      { status: 500 }
    )
  }
}
