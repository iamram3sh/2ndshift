/**
 * GET /api/client/verification/status/[clientId]
 * Get client verification status
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params

    const { data: verification } = await supabase
      .from('client_verifications')
      .select('*')
      .eq('client_id', clientId)
      .single()

    return NextResponse.json({
      clientId,
      identityStatus: verification?.identity_status || 'not_started',
      paymentStatus: verification?.payment_status || 'not_started',
      businessStatus: verification?.business_status || 'not_started',
      verifiedAt: verification?.verified_at || null
    })
  } catch (error: any) {
    console.error('Error fetching client verification status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch status' },
      { status: 500 }
    )
  }
}

