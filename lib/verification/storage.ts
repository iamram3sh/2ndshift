/**
 * Secure File Storage with Signed URLs
 * Handles file uploads to Supabase Storage with proper security
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface UploadResult {
  success: boolean
  filePath?: string
  signedUrl?: string
  publicUrl?: string
  error?: string
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  filePath: string,
  file: File | Buffer,
  options?: {
    contentType?: string
    cacheControl?: string
    upsert?: boolean
  }
): Promise<UploadResult> {
  try {
    // Validate file size (max 10MB for images/PDFs, 100MB for videos)
    const maxSize = filePath.includes('video') ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    const fileSize = file instanceof File ? file.size : file.length

    if (fileSize > maxSize) {
      return {
        success: false,
        error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
      }
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
      'video/mp4',
      'video/webm'
    ]

    if (file instanceof File && !allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Allowed: JPG, PNG, PDF, MP4, WebM'
      }
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: options?.contentType,
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false
      })

    if (error) throw error

    // Generate signed URL (24-hour expiry)
    const { data: signedUrlData } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 24 * 60 * 60) // 24 hours

    // Get public URL if bucket is public
    let publicUrl: string | undefined
    try {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)
      publicUrl = publicUrlData.publicUrl
    } catch {
      // Bucket is private, no public URL
    }

    return {
      success: true,
      filePath: data.path,
      signedUrl: signedUrlData?.signedUrl,
      publicUrl
    }
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    }
  }
}

/**
 * Generate signed URL for existing file
 */
export async function getSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 24 * 60 * 60 // 24 hours
): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn)

    if (error) throw error

    return {
      success: true,
      signedUrl: data.signedUrl
    }
  } catch (error: any) {
    console.error('Error generating signed URL:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate signed URL'
    }
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting file:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete file'
    }
  }
}

/**
 * Cleanup old files (age-off policy)
 * Call this periodically to delete files older than specified days
 */
export async function cleanupOldFiles(
  bucket: string,
  olderThanDays: number = 90
): Promise<{ deleted: number; errors: number }> {
  try {
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list()

    if (error) throw error

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    let deleted = 0
    let errors = 0

    for (const file of files || []) {
      const fileDate = new Date(file.created_at)
      if (fileDate < cutoffDate) {
        const result = await deleteFile(bucket, file.name)
        if (result.success) {
          deleted++
        } else {
          errors++
        }
      }
    }

    return { deleted, errors }
  } catch (error: any) {
    console.error('Error cleaning up old files:', error)
    return { deleted: 0, errors: 1 }
  }
}

