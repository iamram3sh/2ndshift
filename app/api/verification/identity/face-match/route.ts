/**
 * POST /api/verification/identity/face-match
 * Submit selfie for face matching with ID document
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuthAndRateLimit } from '@/lib/api-middleware'
import { compareFaces, validateImage } from '@/lib/verification/face-match'
import { uploadFile } from '@/lib/verification/storage'
import { createClient } from '@supabase/supabase-js'
import { logAuditEvent, extractRequestInfo, logStatusChange } from '@/lib/verification/audit'
import { transitionStatus } from '@/lib/verification/state-machine'
import { calculateVerificationLevel } from '@/lib/verification/badges'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    request,
    async (req) => {
      try {
        const userId = req.userId!
        const formData = await req.formData()
        const selfieFile = formData.get('selfieFile') as File
        const idDocumentUrlParam = formData.get('idDocumentUrl') as string

        if (!selfieFile) {
          return NextResponse.json(
            { error: 'Selfie file is required' },
            { status: 400 }
          )
        }

        // Get verification record to find ID document URL
        const { data: verification } = await supabase
          .from('verifications_v2')
          .select('*')
          .eq('user_id', userId)
          .eq('verification_type', 'identity')
          .eq('tier', 1)
          .single()

        if (!verification) {
          return NextResponse.json(
            { error: 'ID document must be uploaded first' },
            { status: 400 }
          )
        }

        // Get ID document URL from evidence
        const existingEvidence = verification.evidence || {}
        const idDocumentUrl = existingEvidence.government_id?.url || existingEvidence.government_id?.signedUrl

        if (!idDocumentUrl) {
          return NextResponse.json(
            { error: 'ID document URL not found. Please upload ID document first.' },
            { status: 400 }
          )
        }

        // Validate image
        const validation = validateImage(selfieFile)
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error || 'Invalid image' },
            { status: 400 }
          )
        }

        // Upload selfie
        const selfiePath = `verification/${userId}/selfie-${Date.now()}.${selfieFile.name.split('.').pop()}`
        const uploadResult = await uploadFile('verification-documents', selfiePath, selfieFile)

        if (!uploadResult.success || !uploadResult.signedUrl) {
          return NextResponse.json(
            { error: uploadResult.error || 'Upload failed' },
            { status: 500 }
          )
        }

        // Perform face match
        const faceMatchResult = await compareFaces(idDocumentUrl, uploadResult.signedUrl)

        if (!faceMatchResult.success) {
          return NextResponse.json(
            { error: faceMatchResult.error || 'Face match failed' },
            { status: 500 }
          )
        }

        // Update verification with selfie and face match result
        const evidence = {
          ...existingEvidence,
          selfie: {
            url: uploadResult.signedUrl,
            filePath: uploadResult.filePath,
            uploadedAt: new Date().toISOString()
          },
          faceMatch: {
            similarityScore: faceMatchResult.similarityScore,
            verified: faceMatchResult.verified,
            requiresManualReview: faceMatchResult.requiresManualReview,
            matchedAt: new Date().toISOString()
          }
        }

        // Determine new status
        let newStatus = verification.status
        if (faceMatchResult.verified) {
          newStatus = 'pending' // Will be verified after OTP
        } else if (faceMatchResult.requiresManualReview) {
          newStatus = 'in_review'
        } else {
          newStatus = 'rejected'
        }

        // Validate transition
        const transition = transitionStatus(verification.status, newStatus as any)
        if (!transition.valid) {
          return NextResponse.json(
            { error: transition.error || 'Invalid status transition' },
            { status: 400 }
          )
        }

        // Update verification
        const { error: updateError } = await supabase
          .from('verifications_v2')
          .update({
            evidence,
            status: newStatus,
            score: faceMatchResult.similarityScore * 100,
            submitted_at: newStatus === 'pending' ? new Date().toISOString() : verification.submitted_at,
            updated_at: new Date().toISOString()
          })
          .eq('id', verification.id)

        if (updateError) throw updateError

        // Log status change
        const requestInfo = extractRequestInfo(req)
        await logStatusChange(
          verification.id,
          userId,
          verification.status,
          newStatus,
          undefined,
          `Face match similarity: ${faceMatchResult.similarityScore.toFixed(2)}`,
          req
        )

        // If verified, calculate badges
        if (newStatus === 'pending' && faceMatchResult.verified) {
          // Will be fully verified after OTP
        }

        return NextResponse.json({
          success: true,
          similarityScore: faceMatchResult.similarityScore,
          verified: faceMatchResult.verified,
          requiresManualReview: faceMatchResult.requiresManualReview,
          status: newStatus
        })
      } catch (error: any) {
        console.error('Error in face match:', error)
        return NextResponse.json(
          { error: error.message || 'Face match failed' },
          { status: 500 }
        )
      }
    },
    'verificationFaceMatch'
  )
}

