import { randomUUID } from 'crypto'

import { ensureServerSide, supabaseAdmin } from '@/lib/supabase/admin'
import type { KycVerification, KycVerificationStatus, KycVerificationType } from '@/types/database.types'

const SIGNZY_BASE_URL = process.env.SIGNZY_BASE_URL || 'https://ondc.api.signzy.app/api'
const SIGNZY_API_KEY = process.env.SIGNZY_API_KEY
const SIGNZY_WORKFLOW_ID = process.env.SIGNZY_WORKFLOW_ID || '2ndshift_default'

interface StartKycInput {
  userId: string
  verificationType: KycVerificationType
  documentUrls?: string[]
  metadata?: Record<string, unknown>
}

interface KycProviderResponse {
  referenceId: string
  status: KycVerificationStatus
  riskScore?: number
  notes?: string
  payload?: Record<string, unknown>
}

const DEFAULT_HEADERS = SIGNZY_API_KEY
  ? {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SIGNZY_API_KEY}`,
      'x-workflow-id': SIGNZY_WORKFLOW_ID
    }
  : { 'Content-Type': 'application/json' }

async function callKycProvider(payload: Record<string, unknown>): Promise<KycProviderResponse> {
  if (!SIGNZY_API_KEY) {
    console.warn('KYC provider credentials missing. Falling back to mock verification.')
    return {
      referenceId: randomUUID(),
      status: 'processing',
      payload
    }
  }

  const response = await fetch(`${SIGNZY_BASE_URL}/v2/verify`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Signzy verification failed: ${response.status} ${errorText}`)
  }

  const json = await response.json()
  return {
    referenceId: json?.result?.referenceId ?? json?.referenceId ?? randomUUID(),
    status: (json?.result?.status || 'processing') as KycVerificationStatus,
    riskScore: json?.result?.riskScore,
    payload: json
  }
}

export async function startKycVerification(input: StartKycInput): Promise<KycVerification> {
  ensureServerSide()

  const providerPayload = {
    workflowId: SIGNZY_WORKFLOW_ID,
    verificationType: input.verificationType,
    documents: input.documentUrls ?? [],
    metadata: input.metadata ?? {}
  }

  const providerResponse = await callKycProvider(providerPayload)

  const { data, error } = await supabaseAdmin
    .from('kyc_verifications')
    .insert({
      user_id: input.userId,
      provider: SIGNZY_API_KEY ? 'signzy' : 'mock',
      verification_type: input.verificationType,
      status: providerResponse.status,
      risk_score: providerResponse.riskScore ?? 0,
      reference_id: providerResponse.referenceId,
      document_urls: input.documentUrls ?? [],
      metadata: { providerPayload, providerResponse }
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to persist KYC verification: ${error.message}`)
  }

  return data as KycVerification
}

export interface KycStatusUpdate {
  referenceId: string
  status: KycVerificationStatus
  riskScore?: number
  rejectionReason?: string
  verifiedBy?: string
  verifiedAt?: string
  notes?: string
  metadata?: Record<string, unknown>
}

export async function updateKycStatus(payload: KycStatusUpdate) {
  ensureServerSide()

  const { error } = await supabaseAdmin
    .from('kyc_verifications')
    .update({
      status: payload.status,
      risk_score: payload.riskScore ?? 0,
      rejection_reason: payload.rejectionReason,
      verified_by: payload.verifiedBy,
      verified_at: payload.verifiedAt,
      notes: payload.notes,
      metadata: payload.metadata
    })
    .eq('reference_id', payload.referenceId)

  if (error) {
    throw new Error(`Unable to update KYC status: ${error.message}`)
  }
}

export async function getLatestKycVerification(userId: string): Promise<KycVerification | null> {
  ensureServerSide()

  const { data } = await supabaseAdmin
    .from('kyc_verifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (data as KycVerification) ?? null
}

export function requiresKycRefresh(kyc: KycVerification | null): boolean {
  if (!kyc) return true
  if (kyc.status !== 'verified') return true

  const verifiedAt = kyc.verified_at ? new Date(kyc.verified_at) : null
  if (!verifiedAt) return true

  const monthsSinceVerification = (Date.now() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
  return monthsSinceVerification > 12
}

export async function ensureVerifiedUser(userId: string, type: KycVerificationType) {
  const latest = await getLatestKycVerification(userId)
  if (requiresKycRefresh(latest) || latest?.verification_type !== type) {
    await startKycVerification({ userId, verificationType: type })
  }
}
