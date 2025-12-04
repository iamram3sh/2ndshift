// ============================================
// 2NDSHIFT - JOBS & TASKS TYPES
// ============================================

export type JobStatus = 'draft' | 'open' | 'assigned' | 'in_progress' | 'completed' | 'disputed' | 'cancelled'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type DeliveryWindow = 'sixTo24h' | 'threeTo7d' | 'oneTo4w' | 'oneTo6m'
export type Urgency = 'low' | 'normal' | 'urgent' | 'critical'

export interface Job {
  id: string
  client_id: string
  title: string
  description: string
  category_id: string | null
  microtask_id: string | null
  custom: boolean
  status: JobStatus
  price_fixed: number | null
  price_currency: string
  delivery_deadline: string | null
  delivery_window: DeliveryWindow | null
  escrow_id: string | null
  required_skills: string[]
  urgency: Urgency
  created_at: string
  updated_at: string
  requested_at: string
  
  // Joined data
  category?: {
    id: string
    name: string
    slug: string
    icon: string | null
  }
  microtask?: {
    id: string
    title: string
    slug: string
  }
  client?: {
    id: string
    full_name: string
    email: string
    trust_score?: number
  }
  applications?: Application[]
  applications_count?: number
  assignments_count?: number
}

export interface Application {
  id: string
  project_id: string
  worker_id: string
  cover_text: string | null
  proposed_price: number | null
  proposed_delivery: string | null
  credits_used: number
  status: ApplicationStatus
  submitted_at: string
  reviewed_at: string | null
  
  // Joined data
  worker?: {
    id: string
    full_name: string
    email: string
    trust_score?: number
  }
  job?: Job
}

export interface CreateJobPayload {
  title: string
  description: string
  category_id?: string
  microtask_id?: string
  price_fixed?: number
  price_currency?: string
  delivery_window?: DeliveryWindow
  delivery_deadline?: string
  required_skills?: string[]
  urgency?: Urgency
}

export interface ApplyToJobPayload {
  cover_text?: string
  proposed_price?: number
  proposed_delivery?: string
}

export interface JobFilters {
  status?: JobStatus
  category_id?: string
  minPrice?: number
  search?: string
  role?: 'worker' | 'client'
  limit?: number
  offset?: number
}
