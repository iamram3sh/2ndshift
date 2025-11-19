export type UserType = 'worker' | 'client' | 'admin'
export type ProfileVisibility = 'public' | 'anonymous'
export type ProjectStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type ContractStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

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