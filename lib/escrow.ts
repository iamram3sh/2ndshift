import { ensureServerSide, supabaseAdmin } from '@/lib/supabase/admin'
import { razorpay } from '@/lib/razorpay'
import type {
  EscrowAccount,
  EscrowStatus,
  EscrowTransaction,
  EscrowTransactionStatus,
  EscrowTransactionType
} from '@/types/database.types'

const DEFAULT_CURRENCY = 'INR'

interface EscrowAccountOptions {
  contractId: string
  currency?: string
  metadata?: Record<string, unknown>
}

export async function ensureEscrowAccount(options: EscrowAccountOptions): Promise<EscrowAccount> {
  ensureServerSide()

  const { contractId, currency = DEFAULT_CURRENCY, metadata } = options

  const existing = await supabaseAdmin
    .from('escrow_accounts')
    .select('*')
    .eq('contract_id', contractId)
    .maybeSingle()

  if (existing.data) {
    return existing.data as EscrowAccount
  }

  const { data, error } = await supabaseAdmin
    .from('escrow_accounts')
    .insert({
      contract_id: contractId,
      currency,
      status: 'inactive',
      metadata: metadata ?? {}
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to create escrow account: ${error.message}`)
  }

  return data as EscrowAccount
}

interface EscrowTransactionInput {
  contractId: string
  amount: number
  initiatedBy: string
  transactionType: EscrowTransactionType
  status?: EscrowTransactionStatus
  notes?: string
  metadata?: Record<string, unknown>
}

async function recordEscrowTransaction(accountId: string, payload: Omit<EscrowTransactionInput, 'contractId'>) {
  const { data, error } = await supabaseAdmin
    .from('escrow_transactions')
    .insert({
      escrow_account_id: accountId,
      initiated_by: payload.initiatedBy,
      transaction_type: payload.transactionType,
      status: payload.status ?? 'pending',
      amount: payload.amount,
      notes: payload.notes,
      metadata: payload.metadata ?? {}
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Unable to record escrow transaction: ${error.message}`)
  }

  return data as EscrowTransaction
}

export interface FundEscrowInput {
  contractId: string
  amount: number
  initiatedBy: string
  metadata?: Record<string, unknown>
}

export async function fundEscrowAccount(payload: FundEscrowInput) {
  ensureServerSide()
  const account = await ensureEscrowAccount({ contractId: payload.contractId })

  const transaction = await recordEscrowTransaction(account.id, {
    initiatedBy: payload.initiatedBy,
    transactionType: 'fund',
    status: 'processing',
    amount: payload.amount,
    metadata: payload.metadata
  })

  const { error } = await supabaseAdmin
    .from('escrow_accounts')
    .update({
      balance: (account.balance ?? 0) + payload.amount,
      status: 'funded' as EscrowStatus,
      last_funded_at: new Date().toISOString()
    })
    .eq('id', account.id)

  if (error) {
    throw new Error(`Unable to update escrow balance: ${error.message}`)
  }

  await supabaseAdmin
    .from('escrow_transactions')
    .update({ status: 'completed' })
    .eq('id', transaction.id)
}

interface ReleaseEscrowInput {
  contractId: string
  amount: number
  initiatedBy: string
  razorpayAccountId: string
  notes?: string
  metadata?: Record<string, unknown>
}

export async function releaseEscrowFunds(payload: ReleaseEscrowInput) {
  ensureServerSide()
  const account = await ensureEscrowAccount({ contractId: payload.contractId })

  if (payload.amount > account.balance) {
    throw new Error('Insufficient escrow balance')
  }

  const transaction = await recordEscrowTransaction(account.id, {
    initiatedBy: payload.initiatedBy,
    transactionType: 'release',
    status: 'processing',
    amount: payload.amount,
    notes: payload.notes,
    metadata: payload.metadata
  })

  const amountPaise = Math.round(payload.amount * 100)
  const reference = `escrow_release_${transaction.id}`

  try {
    await razorpay.transfers.create({
      account: payload.razorpayAccountId,
      amount: amountPaise,
      currency: account.currency || DEFAULT_CURRENCY,
      reference_id: reference,
      notes: payload.metadata ?? {}
    })
  } catch (error) {
    await supabaseAdmin
      .from('escrow_transactions')
      .update({ status: 'failed', metadata: { ...payload.metadata, error: String(error) } })
      .eq('id', transaction.id)
    throw error
  }

  await supabaseAdmin.from('escrow_transactions').update({ status: 'completed' }).eq('id', transaction.id)

  const { error } = await supabaseAdmin
    .from('escrow_accounts')
    .update({
      balance: account.balance - payload.amount,
      status: account.balance - payload.amount <= 0 ? 'released' : account.status,
      last_released_at: new Date().toISOString()
    })
    .eq('id', account.id)

  if (error) {
    throw new Error(`Unable to finalize escrow release: ${error.message}`)
  }
}

export async function getEscrowSnapshot(contractId: string) {
  ensureServerSide()

  const account = await ensureEscrowAccount({ contractId })

  const { data: transactions } = await supabaseAdmin
    .from('escrow_transactions')
    .select('*')
    .eq('escrow_account_id', account.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return {
    account,
    transactions: (transactions as EscrowTransaction[]) ?? []
  }
}
