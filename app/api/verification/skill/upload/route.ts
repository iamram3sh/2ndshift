/**
 * POST /api/verification/skill/upload
 * Upload skill proof (GitHub, deployment, file, link)
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
        const skillName = formData.get('skillName') as string
        const proofType = formData.get('proofType') as string
        const title = formData.get('title') as string
        const url = formData.get('url') as string | null
        const file = formData.get('file') as File | null

        if (!skillName || !proofType || !title) {
          return NextResponse.json(
            { error: 'skillName, proofType, and title are required' },
            { status: 400 }
          )
        }

        if (!['github', 'deployment', 'file', 'link', 'code_walkthrough'].includes(proofType)) {
          return NextResponse.json(
            { error: 'Invalid proof type' },
            { status: 400 }
          )
        }

        let filePath: string | undefined
        let proofUrl: string | undefined

        // Handle file upload
        if (proofType === 'file' && file) {
          const uploadPath = `skill-proofs/${userId}/${skillName}-${Date.now()}.${file.name.split('.').pop()}`
          const uploadResult = await uploadFile('verification-documents', uploadPath, file)
          
          if (!uploadResult.success) {
            return NextResponse.json(
              { error: uploadResult.error || 'File upload failed' },
              { status: 500 }
            )
          }
          
          filePath = uploadResult.filePath
          proofUrl = uploadResult.signedUrl
        } else if (url) {
          // Validate URL
          try {
            new URL(url)
            proofUrl = url
          } catch {
            return NextResponse.json(
              { error: 'Invalid URL format' },
              { status: 400 }
            )
          }
        } else {
          return NextResponse.json(
            { error: 'Either file or URL is required' },
            { status: 400 }
          )
        }

        // Create skill proof record
        const { data: skillProof, error: proofError } = await supabase
          .from('skill_proofs')
          .insert({
            user_id: userId,
            title,
            skill_name: skillName,
            proof_type: proofType,
            url: proofUrl,
            file_path: filePath,
            file_storage_bucket: filePath ? 'verification-documents' : null,
            verified: false
          })
          .select()
          .single()

        if (proofError) throw proofError

        // Get or create verification record for tier 2
        const { data: existingVerification } = await supabase
          .from('verifications_v2')
          .select('*')
          .eq('user_id', userId)
          .eq('verification_type', 'skill')
          .eq('tier', 2)
          .single()

        const evidence = existingVerification?.evidence || { skillProofs: [] }
        if (!evidence.skillProofs) evidence.skillProofs = []
        evidence.skillProofs.push({
          id: skillProof.id,
          skillName,
          proofType,
          title,
          url: proofUrl,
          uploadedAt: new Date().toISOString()
        })

        if (existingVerification) {
          await supabase
            .from('verifications_v2')
            .update({
              evidence,
              status: 'pending',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingVerification.id)
        } else {
          await supabase
            .from('verifications_v2')
            .insert({
              user_id: userId,
              verification_type: 'skill',
              tier: 2,
              status: 'pending',
              evidence
            })
        }

        // Log audit event
        const requestInfo = extractRequestInfo(req)
        await logAuditEvent({
          user_id: userId,
          action: 'created',
          notes: `Uploaded skill proof: ${skillName} (${proofType})`,
          ...requestInfo
        })

        return NextResponse.json({
          success: true,
          proofId: skillProof.id,
          proofUrl
        })
      } catch (error: any) {
        console.error('Error uploading skill proof:', error)
        return NextResponse.json(
          { error: error.message || 'Upload failed' },
          { status: 500 }
        )
      }
    },
    'verificationUpload'
  )
}

