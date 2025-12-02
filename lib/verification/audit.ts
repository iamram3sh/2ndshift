/**
 * Audit Logging for Verification Actions
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export type AuditAction =
  | 'created'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'appealed'
  | 'badge_awarded'
  | 'badge_revoked'
  | 'status_changed'

export interface AuditLogEntry {
  verification_id?: string
  user_id: string
  action: AuditAction
  performed_by?: string
  old_status?: string
  new_status?: string
  notes?: string
  ip_address?: string
  user_agent?: string
}

/**
 * Log an audit event
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('verification_audit_logs').insert({
      verification_id: entry.verification_id || null,
      user_id: entry.user_id,
      action: entry.action,
      performed_by: entry.performed_by || null,
      old_status: entry.old_status || null,
      new_status: entry.new_status || null,
      notes: entry.notes || null,
      ip_address: entry.ip_address || null,
      user_agent: entry.user_agent || null
    })

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error logging audit event:', error)
    return { success: false, error: error.message || 'Failed to log audit event' }
  }
}

/**
 * Extract IP address and user agent from request
 */
export function extractRequestInfo(request: NextRequest): {
  ip_address?: string
  user_agent?: string
} {
  const ip_address =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    undefined

  const user_agent = request.headers.get('user-agent') || undefined

  return { ip_address, user_agent }
}

/**
 * Log verification status change
 */
export async function logStatusChange(
  verificationId: string,
  userId: string,
  oldStatus: string,
  newStatus: string,
  performedBy?: string,
  notes?: string,
  request?: NextRequest
): Promise<void> {
  const requestInfo = request ? extractRequestInfo(request) : {}

  await logAuditEvent({
    verification_id: verificationId,
    user_id: userId,
    action: 'status_changed',
    performed_by: performedBy,
    old_status: oldStatus,
    new_status: newStatus,
    notes,
    ...requestInfo
  })
}

/**
 * Get audit logs for a verification
 */
export async function getVerificationAuditLogs(verificationId: string) {
  try {
    const { data, error } = await supabase
      .from('verification_audit_logs')
      .select('*')
      .eq('verification_id', verificationId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, logs: data || [] }
  } catch (error: any) {
    console.error('Error fetching audit logs:', error)
    return { success: false, logs: [], error: error.message }
  }
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(userId: string, limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('verification_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { success: true, logs: data || [] }
  } catch (error: any) {
    console.error('Error fetching user audit logs:', error)
    return { success: false, logs: [], error: error.message }
  }
}

