export type UserType = 'worker' | 'client' | 'admin'
export type ProfileVisibility = 'public' | 'anonymous'
export type ProjectStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type ContractStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type KycVerificationStatus = 'pending' | 'processing' | 'verified' | 'rejected' | 'expired'
export type KycVerificationType = 'pan' | 'aadhaar' | 'gst' | 'bank_account' | 'address' | 'identity'
export type EscrowStatus = 'inactive' | 'funded' | 'locked' | 'released' | 'closed'
export type EscrowTransactionType = 'fund' | 'release' | 'refund' | 'fee' | 'hold'
export type EscrowTransactionStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type MilestoneStatus = 'pending' | 'in_review' | 'approved' | 'released' | 'blocked'
export type NotificationType = 'application' | 'contract' | 'payment' | 'message' | 'review' | 'system' | 'verification' | 'kyc' | 'milestone' | 'risk'
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface User {
  id: string
  email: string
  full_name: string
  user_type: UserType
  pan_number?: string
  phone?: string
  profile_visibility: ProfileVisibility
  created_at: string
  updated_at: string
  
  // Enhanced fields for investor-ready features
  profile_photo_url?: string
  date_of_birth?: string
  gender?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
  address?: string
  phone_verified?: boolean
  email_verified?: boolean
  is_online?: boolean
  last_seen?: string
  availability_status?: 'online' | 'away' | 'offline' | 'busy' | 'available'
  profile_completion_percentage?: number
  government_id_type?: string
  government_id_number?: string
  government_id_url?: string
  address_proof_url?: string
  verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
  verification_notes?: string
  verified_at?: string
  verified_by?: string
  trust_score?: number
  badges?: any
}

export interface WorkerProfile {
  id: string
  user_id: string
  skills: string[]
  experience_years: number
  hourly_rate: number
  availability_hours: Record<string, unknown>
  portfolio_url?: string
  resume_url?: string
  bio?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  client_id: string
  title: string
  description: string
  budget: number
  required_skills: string[]
  duration_hours: number
  status: ProjectStatus
  deadline?: string
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  project_id: string
  worker_id: string
  cover_letter: string
  proposed_rate: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  project_id: string
  worker_id: string
  contract_amount: number
  platform_fee_percentage: number
  platform_fee: number
  tds_percentage: number
  tds_amount: number
  worker_payout: number
  nda_signed: boolean
  conflict_declaration_signed: boolean
  status: ContractStatus
  started_at?: string
  completed_at?: string
  created_at: string
}

export interface Payment {
  id: string
  contract_id: string
  payment_from: string
  payment_to: string
  gross_amount: number
  platform_fee: number
  tds_deducted: number
  gst_amount?: number
  net_amount: number
  razorpay_payment_id?: string
  razorpay_order_id?: string
  status: PaymentStatus
  invoice_url?: string
  payment_date?: string
  created_at: string
}

export interface KycVerification {
  id: string
  user_id: string
  provider: string
  verification_type: KycVerificationType
  status: KycVerificationStatus
  risk_score?: number
  reference_id?: string
  document_urls?: string[]
  metadata?: Record<string, unknown>
  verified_by?: string
  verified_at?: string
  rejection_reason?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface EscrowAccount {
  id: string
  contract_id: string
  balance: number
  currency: string
  status: EscrowStatus
  last_funded_at?: string
  last_released_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface EscrowTransaction {
  id: string
  escrow_account_id: string
  initiated_by?: string
  transaction_type: EscrowTransactionType
  status: EscrowTransactionStatus
  amount: number
  razorpay_transfer_id?: string
  notes?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ContractMilestone {
  id: string
  contract_id: string
  title: string
  description?: string
  due_date?: string
  amount: number
  status: MilestoneStatus
  approval_notes?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface ContractDocument {
  id: string
  contract_id: string
  document_type: 'nda' | 'msa' | 'sow' | 'invoice' | 'form16a'
  storage_path: string
  signed: boolean
  signed_at?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface Review {
  id: string
  contract_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  review_text?: string
  response_text?: string
  is_visible: boolean
  is_flagged: boolean
  created_at: string
  updated_at: string
}

export interface Verification {
  id: string
  user_id: string
  verification_type: 'email' | 'phone' | 'pan' | 'aadhar' | 'bank_account' | 'address'
  status: 'pending' | 'verified' | 'rejected'
  document_urls?: string[]
  verification_data?: any
  verified_by?: string
  verified_at?: string
  rejection_reason?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  receiver_id: string
  project_id?: string
  message_text: string
  attachment_urls?: string[]
  is_read: boolean
  read_at?: string
  is_flagged: boolean
  ai_summary?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface Conversation {
  id: string
  project_id?: string
  contract_id?: string
  created_by?: string
  title?: string
  visibility: 'participants' | 'platform' | 'admin'
  created_at: string
  updated_at: string
}

export interface ConversationMember {
  conversation_id: string
  user_id: string
  role: 'participant' | 'viewer' | 'admin'
  joined_at: string
}

export interface SecureFile {
  id: string
  owner_id: string
  project_id?: string
  contract_id?: string
  conversation_id?: string
  storage_path: string
  original_name: string
  mime_type?: string
  file_size?: number
  checksum?: string
  virus_scan_status: 'pending' | 'clean' | 'infected'
  access_level: 'participants' | 'platform' | 'admin'
  metadata?: Record<string, unknown>
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  link?: string
  data?: Record<string, unknown>
  is_read: boolean
  read_at?: string
  created_at: string
}

export interface TalentRecommendation {
  id: string
  project_id: string
  worker_id: string
  score: number
  explanation?: string
  embedding?: number[]
  metadata?: Record<string, unknown>
  created_at: string
}

export interface Dispute {
  id: string
  contract_id: string
  raised_by: string
  against_user: string
  reason: string
  description: string
  evidence_urls?: string[]
  status: 'open' | 'under_review' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  resolution?: string
  resolved_by?: string
  resolved_at?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface RiskEvent {
  id: string
  contract_id: string
  triggered_by?: string
  severity: RiskSeverity
  event_type: string
  details?: Record<string, unknown>
  resolved: boolean
  resolved_at?: string
  created_at: string
}

export interface Report {
  id: string
  reported_by: string
  reported_user: string
  report_type: 'user' | 'project' | 'message' | 'review' | 'profile'
  reference_id: string
  reason: string
  description?: string
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
  reviewed_by?: string
  admin_notes?: string
  action_taken?: string
  created_at: string
  updated_at: string
}