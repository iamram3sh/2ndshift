/**
 * POST /api/verification/identity/upload
 * Upload ID document for identity verification
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
        const file = formData.get('file') as File
        const documentType = formData.get('documentType') as string

        if (!file) {
          return NextResponse.json(
            { error: 'File is required' },
            { status: 400 }
          )
        }

        if (!['government_id', 'address_proof'].includes(documentType)) {
          return NextResponse.json(
            { error: 'Invalid document type' },
            { status: 400 }
          )
        }

        // Upload file to storage
        const filePath = `verification/${userId}/${documentType}-${Date.now()}.${file.name.split('.').pop()}`
        const uploadResult = await uploadFile('verification-documents', filePath, file)

        if (!uploadResult.success) {
          return NextResponse.json(
            { error: uploadResult.error || 'Upload failed' },
            { status: 500 }
          )
        }

        // Create or update verification record
        const { data: existing } = await supabase
          .from('verifications_v2')
          .select('*')
          .eq('user_id', userId)
          .eq('verification_type', 'identity')
          .eq('tier', 1)
          .single()

        const evidence = existing?.evidence || {}
        evidence[documentType] = {
          url: uploadResult.signedUrl,
          filePath: uploadResult.filePath,
          uploadedAt: new Date().toISOString()
        }

        if (existing) {
          // Update existing verification
          const { error } = await supabase
            .from('verifications_v2')
            .update({
              evidence,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)

          if (error) throw error
        } else {
          // Create new verification
          const { error } = await supabase
            .from('verifications_v2')
            .insert({
              user_id: userId,
              verification_type: 'identity',
              tier: 1,
              status: 'not_started',
              evidence
            })

          if (error) throw error
        }

        // Log audit event
        const requestInfo = extractRequestInfo(req)
        await logAuditEvent({
          user_id: userId,
          action: 'created',
          notes: `Uploaded ${documentType}`,
          ...requestInfo
        })

        return NextResponse.json({
          success: true,
          documentUrl: uploadResult.signedUrl,
          filePath: uploadResult.filePath
        })
      } catch (error: any) {
        console.error('Error uploading ID document:', error)
        return NextResponse.json(
          { error: error.message || 'Upload failed' },
          { status: 500 }
        )
      }
    },
    'verificationUpload'
  )
}

