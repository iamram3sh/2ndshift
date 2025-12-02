/**
 * GET /api/admin/verifications/[id]
 * Get verification details (admin only)
 * PATCH /api/admin/verifications/[id]
 * Update verification status (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-middleware'
import { createClient } from '@supabase/supabase-js'
import { logStatusChange, extractRequestInfo } from '@/lib/verification/audit'
import { transitionStatus } from '@/lib/verification/state-machine'
import { calculateVerificationLevel } from '@/lib/verification/badges'
import { getSignedUrl } from '@/lib/verification/storage'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const userId = req.userId!
      const { id } = await params
      const verificationId = id

      // Verify admin access
      const { data: user } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single()

      if (!user || !['admin', 'superadmin'].includes(user.user_type)) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      // Get verification with user info
      const { data: verification, error } = await supabase
        .from('verifications_v2')
        .select(`
          *,
          user:users!verifications_v2_user_id_fkey (
            id,
            full_name,
            email,
            user_type
          ),
          verifier:users!verifications_v2_verifier_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq('id', verificationId)
        .single()

      if (error || !verification) {
        return NextResponse.json(
          { error: 'Verification not found' },
          { status: 404 }
        )
      }

      // Get audit logs
      const { data: auditLogs } = await supabase
        .from('verification_audit_logs')
        .select('*')
        .eq('verification_id', verificationId)
        .order('created_at', { ascending: false })

      // Generate signed URLs for evidence files
      const evidence = verification.evidence || {}
      if (evidence.government_id?.filePath) {
        const signedUrl = await getSignedUrl('verification-documents', evidence.government_id.filePath)
        if (signedUrl.success) {
          evidence.government_id.signedUrl = signedUrl.signedUrl
        }
      }
      if (evidence.selfie?.filePath) {
        const signedUrl = await getSignedUrl('verification-documents', evidence.selfie.filePath)
        if (signedUrl.success) {
          evidence.selfie.signedUrl = signedUrl.signedUrl
        }
      }
      if (evidence.videoUrl) {
        const signedUrl = await getSignedUrl('verification-documents', evidence.videoPath)
        if (signedUrl.success) {
          evidence.videoSignedUrl = signedUrl.signedUrl
        }
      }

      return NextResponse.json({
        success: true,
        verification: {
          ...verification,
          evidence
        },
        auditLogs: auditLogs || []
      })
    } catch (error: any) {
      console.error('Error fetching verification:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch verification' },
        { status: 500 }
      )
    }
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const userId = req.userId!
      const { id } = await params
      const verificationId = id

      // Verify admin access
      const { data: user } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single()

      if (!user || !['admin', 'superadmin'].includes(user.user_type)) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      const body = await req.json()
      const { status, notes, rejectionReason } = body

      // Get current verification
      const { data: verification, error: fetchError } = await supabase
        .from('verifications_v2')
        .select('*')
        .eq('id', verificationId)
        .single()

      if (fetchError || !verification) {
        return NextResponse.json(
          { error: 'Verification not found' },
          { status: 404 }
        )
      }

      // Validate status transition
      if (status && status !== verification.status) {
        const transition = transitionStatus(
          verification.status as any,
          status as any,
          status === 'rejected' ? rejectionReason : undefined
        )

        if (!transition.valid) {
          return NextResponse.json(
            { error: transition.error || 'Invalid status transition' },
            { status: 400 }
          )
        }
      }

      // Update verification
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (status) {
        updateData.status = status
        if (status === 'verified') {
          updateData.verified_at = new Date().toISOString()
          updateData.verifier_id = userId
        }
        if (status === 'rejected' && rejectionReason) {
          updateData.rejection_reason = rejectionReason
        }
      }

      if (notes) {
        updateData.notes = notes
      }

      const { error: updateError } = await supabase
        .from('verifications_v2')
        .update(updateData)
        .eq('id', verificationId)

      if (updateError) throw updateError

      // Log status change
      if (status && status !== verification.status) {
        await logStatusChange(
          verificationId,
          verification.user_id,
          verification.status,
          status,
          userId,
          notes || rejectionReason,
          req
        )

        // If verified, calculate badges
        if (status === 'verified') {
          await calculateVerificationLevel(verification.user_id)
        }
      }

      return NextResponse.json({
        success: true,
        verification: {
          ...verification,
          ...updateData
        }
      })
    } catch (error: any) {
      console.error('Error updating verification:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update verification' },
        { status: 500 }
      )
    }
  })
}

