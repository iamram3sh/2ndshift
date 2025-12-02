/**
 * POST /api/verification/microtask/submit
 * Submit microtask solution
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuthAndRateLimit } from '@/lib/api-middleware'
import { gradeMicrotask, validateSubmission } from '@/lib/verification/microtask-grader'
import { uploadFile } from '@/lib/verification/storage'
import { createClient } from '@supabase/supabase-js'
import { logAuditEvent, extractRequestInfo } from '@/lib/verification/audit'
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
        const microtaskId = formData.get('microtaskId') as string
        const submissionType = formData.get('submissionType') as string
        const submissionUrl = formData.get('submissionUrl') as string | null
        const submissionFile = formData.get('submissionFile') as File | null

        if (!microtaskId || !submissionType) {
          return NextResponse.json(
            { error: 'microtaskId and submissionType are required' },
            { status: 400 }
          )
        }

        if (!['url', 'file'].includes(submissionType)) {
          return NextResponse.json(
            { error: 'Invalid submission type' },
            { status: 400 }
          )
        }

        // Validate submission
        const validation = validateSubmission(
          submissionType as 'url' | 'file',
          submissionUrl || undefined,
          submissionFile || undefined
        )

        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error || 'Invalid submission' },
            { status: 400 }
          )
        }

        // Get microtask
        const { data: microtask, error: taskError } = await supabase
          .from('microtasks')
          .select('*')
          .eq('id', microtaskId)
          .eq('is_active', true)
          .single()

        if (taskError || !microtask) {
          return NextResponse.json(
            { error: 'Microtask not found' },
            { status: 404 }
          )
        }

        // Check if already submitted
        const { data: existing } = await supabase
          .from('microtask_submissions')
          .select('*')
          .eq('user_id', userId)
          .eq('microtask_id', microtaskId)
          .single()

        if (existing) {
          return NextResponse.json(
            { error: 'Already submitted. Please wait for review.' },
            { status: 400 }
          )
        }

        // Handle file upload if needed
        let submissionFilePath: string | undefined
        if (submissionType === 'file' && submissionFile) {
          const filePath = `microtask-submissions/${userId}/${microtaskId}-${Date.now()}.${submissionFile.name.split('.').pop()}`
          const uploadResult = await uploadFile('verification-documents', filePath, submissionFile)
          
          if (!uploadResult.success) {
            return NextResponse.json(
              { error: uploadResult.error || 'File upload failed' },
              { status: 500 }
            )
          }
          
          submissionFilePath = uploadResult.filePath
        }

        // Create submission record
        const { data: submission, error: submitError } = await supabase
          .from('microtask_submissions')
          .insert({
            user_id: userId,
            microtask_id: microtaskId,
            submission_type: submissionType,
            submission_url: submissionUrl || null,
            submission_file_path: submissionFilePath || null,
            status: 'grading'
          })
          .select()
          .single()

        if (submitError) throw submitError

        // Grade submission (async - update status)
        const gradingResult = await gradeMicrotask(
          microtaskId,
          submissionType as 'url' | 'file',
          submissionUrl || undefined,
          submissionFile || undefined,
          microtask.grader_script || undefined
        )

        // Update submission with grading result
        await supabase
          .from('microtask_submissions')
          .update({
            score: gradingResult.score,
            status: gradingResult.requiresManualReview
              ? 'manual_review'
              : gradingResult.passed
              ? 'passed'
              : 'failed',
            grader_output: gradingResult.graderOutput
          })
          .eq('id', submission.id)

        // If passed and not requiring manual review, update verification
        if (gradingResult.passed && !gradingResult.requiresManualReview) {
          const { data: verification } = await supabase
            .from('verifications_v2')
            .select('*')
            .eq('user_id', userId)
            .eq('verification_type', 'skill')
            .eq('tier', 2)
            .single()

          if (verification) {
            const evidence = verification.evidence || {}
            evidence.microtaskSubmission = {
              submissionId: submission.id,
              microtaskId,
              score: gradingResult.score,
              passedAt: new Date().toISOString()
            }

            // Check if all requirements met for tier 2
            const skillProofs = evidence.skillProofs || []
            if (skillProofs.length > 0) {
              await supabase
                .from('verifications_v2')
                .update({
                  evidence,
                  status: 'verified',
                  verified_at: new Date().toISOString(),
                  score: gradingResult.score,
                  updated_at: new Date().toISOString()
                })
                .eq('id', verification.id)

              // Calculate badges
              await calculateVerificationLevel(userId)
            }
          }
        }

        // Log audit event
        const requestInfo = extractRequestInfo(req)
        await logAuditEvent({
          user_id: userId,
          action: 'submitted',
          notes: `Submitted microtask: ${microtask.title} (Score: ${gradingResult.score})`,
          ...requestInfo
        })

        return NextResponse.json({
          success: true,
          submissionId: submission.id,
          status: gradingResult.requiresManualReview
            ? 'manual_review'
            : gradingResult.passed
            ? 'passed'
            : 'failed',
          score: gradingResult.score,
          feedback: gradingResult.feedback,
          requiresManualReview: gradingResult.requiresManualReview
        })
      } catch (error: any) {
        console.error('Error submitting microtask:', error)
        return NextResponse.json(
          { error: error.message || 'Submission failed' },
          { status: 500 }
        )
      }
    },
    'verificationUpload'
  )
}

