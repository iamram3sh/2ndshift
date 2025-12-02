/**
 * POST /api/verification/video/upload
 * Upload video verification
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuthAndRateLimit } from '@/lib/api-middleware'
import { uploadFile } from '@/lib/verification/storage'
import { createClient } from '@supabase/supabase-js'
import { logAuditEvent, extractRequestInfo } from '@/lib/verification/audit'

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
        const videoFile = formData.get('videoFile') as File
        const description = formData.get('description') as string | null

        if (!videoFile) {
          return NextResponse.json(
            { error: 'Video file is required' },
            { status: 400 }
          )
        }

        // Validate file type
        const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
        if (!allowedTypes.includes(videoFile.type)) {
          return NextResponse.json(
            { error: 'Invalid video format. Allowed: MP4, WebM, MOV' },
            { status: 400 }
          )
        }

        // Validate file size (max 100MB)
        const maxSize = 100 * 1024 * 1024
        if (videoFile.size > maxSize) {
          return NextResponse.json(
            { error: 'Video size exceeds 100MB limit' },
            { status: 400 }
          )
        }

        // Upload video
        const videoPath = `verification/${userId}/video-${Date.now()}.${videoFile.name.split('.').pop()}`
        const uploadResult = await uploadFile(
          'verification-documents',
          videoPath,
          videoFile,
          { contentType: videoFile.type }
        )

        if (!uploadResult.success || !uploadResult.signedUrl) {
          return NextResponse.json(
            { error: uploadResult.error || 'Video upload failed' },
            { status: 500 }
          )
        }

        // Get or create verification record for tier 3
        const { data: existingVerification } = await supabase
          .from('verifications_v2')
          .select('*')
          .eq('user_id', userId)
          .eq('verification_type', 'video')
          .eq('tier', 3)
          .single()

        const evidence = {
          videoUrl: uploadResult.signedUrl,
          videoPath: uploadResult.filePath,
          description: description || null,
          uploadedAt: new Date().toISOString()
        }

        if (existingVerification) {
          await supabase
            .from('verifications_v2')
            .update({
              evidence,
              status: 'in_review', // Always requires manual review
              submitted_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingVerification.id)
        } else {
          const { data: verification, error: verifyError } = await supabase
            .from('verifications_v2')
            .insert({
              user_id: userId,
              verification_type: 'video',
              tier: 3,
              status: 'in_review',
              evidence,
              submitted_at: new Date().toISOString()
            })
            .select()
            .single()

          if (verifyError) throw verifyError

          // Log audit event
          const requestInfo = extractRequestInfo(req)
          await logAuditEvent({
            verification_id: verification.id,
            user_id: userId,
            action: 'submitted',
            notes: 'Video verification uploaded',
            ...requestInfo
          })

          return NextResponse.json({
            success: true,
            verificationId: verification.id,
            videoUrl: uploadResult.signedUrl,
            status: 'in_review'
          })
        }

        // Log audit event
        const requestInfo = extractRequestInfo(req)
        await logAuditEvent({
          verification_id: existingVerification.id,
          user_id: userId,
          action: 'submitted',
          notes: 'Video verification uploaded',
          ...requestInfo
        })

        return NextResponse.json({
          success: true,
          verificationId: existingVerification.id,
          videoUrl: uploadResult.signedUrl,
          status: 'in_review'
        })
      } catch (error: any) {
        console.error('Error uploading video:', error)
        return NextResponse.json(
          { error: error.message || 'Video upload failed' },
          { status: 500 }
        )
      }
    },
    'verificationUpload'
  )
}

