// ============================================
// 2NDSHIFT - INNOVATIVE FEATURES TYPES
// ============================================

// ============================================
// 1. SMART MATCH AI
// ============================================

export interface SmartMatch {
  id: string
  worker_id: string
  project_id: string
  match_score: number
  skill_match_score: number
  experience_match_score: number
  rate_match_score: number
  availability_score: number
  success_rate_score: number
  location_score: number
  is_featured: boolean
  is_notified: boolean
  created_at: string
  project?: any // Project details
  worker?: any // Worker details
}

export interface WorkerPreferences {
  id: string
  user_id: string
  preferred_categories: string[]
  min_hourly_rate: number | null
  max_project_duration_hours: number | null
  preferred_work_hours: 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible'
  preferred_project_types: string[]
  industries_interested: string[]
  remote_only: boolean
  instant_booking_enabled: boolean
}

// ============================================
// 2. ESCROW & MILESTONES
// ============================================

export type EscrowStatus = 
  | 'pending_funding'
  | 'funded'
  | 'released'
  | 'disputed'
  | 'refunded'
  | 'cancelled'

export interface EscrowAccount {
  id: string
  contract_id: string
  client_id: string
  worker_id: string
  total_amount: number
  funded_amount: number
  released_amount: number
  platform_fee_percent: number
  status: EscrowStatus
  funded_at: string | null
  created_at: string
  milestones?: Milestone[]
}

export type MilestoneStatus = 
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'revision_requested'
  | 'disputed'
  | 'released'

export interface Milestone {
  id: string
  escrow_id: string
  contract_id: string
  title: string
  description: string | null
  amount: number
  due_date: string | null
  sequence_order: number
  status: MilestoneStatus
  submitted_at: string | null
  approved_at: string | null
  released_at: string | null
  worker_notes: string | null
  client_feedback: string | null
  attachments: any[]
}

// ============================================
// 3. TAXMATE
// ============================================

export interface TaxProfile {
  id: string
  user_id: string
  pan_number: string | null
  pan_verified: boolean
  gstin: string | null
  gst_registered: boolean
  tds_rate: number
  threshold_194c: number
  is_company: boolean
  company_name: string | null
  billing_address: any
  bank_account_number: string | null
  bank_ifsc: string | null
  bank_name: string | null
}

export interface TaxDeduction {
  id: string
  payment_id: string
  payer_id: string
  payee_id: string
  gross_amount: number
  tds_amount: number
  tds_rate: number
  net_amount: number
  financial_year: string
  quarter: string
  section: string
  challan_number: string | null
  form_16a_generated: boolean
  form_16a_url: string | null
}

export interface TaxSummary {
  id: string
  user_id: string
  financial_year: string
  quarter: string
  total_earnings: number
  total_tds_deducted: number
  total_gst_collected: number
  total_platform_fees: number
  net_income: number
}

// ============================================
// 4. EARLYPAY
// ============================================

export type EarlyPayStatus = 
  | 'pending'
  | 'approved'
  | 'disbursed'
  | 'repaid'
  | 'defaulted'

export interface EarlyPayRequest {
  id: string
  worker_id: string
  contract_id: string
  milestone_id: string | null
  requested_amount: number
  max_eligible_amount: number
  advance_fee_percent: number
  advance_fee_amount: number
  net_disbursement: number
  status: EarlyPayStatus
  requested_at: string
  approved_at: string | null
  disbursed_at: string | null
  repayment_due_at: string | null
  repaid_at: string | null
}

export interface EarlyPayEligibility {
  id: string
  user_id: string
  is_eligible: boolean
  eligibility_score: number
  max_advance_percent: number
  total_advanced_amount: number
  total_repaid_amount: number
  on_time_repayment_rate: number
}

// ============================================
// 5. TRUST SCORES
// ============================================

export type BadgeLevel = 'new' | 'verified' | 'trusted' | 'elite' | 'champion'

export interface TrustScore {
  id: string
  user_id: string
  user_type: 'worker' | 'client'
  overall_score: number
  total_reviews: number
  
  // Worker-specific
  quality_score: number
  communication_score: number
  timeliness_score: number
  professionalism_score: number
  
  // Client-specific
  payment_reliability_score: number
  clarity_score: number
  responsiveness_score: number
  fairness_score: number
  
  // Behavioral
  contracts_completed: number
  contracts_cancelled: number
  disputes_initiated: number
  disputes_won: number
  average_response_time_hours: number | null
  repeat_hire_rate: number
  
  badge_level: BadgeLevel
  last_calculated_at: string
  created_at: string
  updated_at: string
}

export interface TrustReview {
  id: string
  contract_id: string
  reviewer_id: string
  reviewee_id: string
  reviewer_type: 'worker' | 'client'
  overall_rating: number
  
  // Worker reviewing Client
  payment_reliability?: number
  requirement_clarity?: number
  responsiveness?: number
  fair_treatment?: number
  would_work_again?: boolean
  
  // Client reviewing Worker
  work_quality?: number
  communication?: number
  timeliness?: number
  professionalism?: number
  would_hire_again?: boolean
  
  review_text: string | null
  is_public: boolean
  response_text: string | null
  response_at: string | null
  created_at: string
}

// ============================================
// 6. SKILL VERIFICATION
// ============================================

export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type ChallengeType = 'quiz' | 'coding' | 'design' | 'writing' | 'project'
export type SkillBadge = 'verified' | 'proficient' | 'expert'

export interface SkillChallenge {
  id: string
  skill_name: string
  skill_category: string
  difficulty_level: SkillDifficulty
  challenge_type: ChallengeType
  title: string
  description: string | null
  time_limit_minutes: number
  passing_score: number
  questions: any[]
  total_points: number
  is_active: boolean
  times_taken: number
  average_score: number | null
}

export interface SkillVerification {
  id: string
  user_id: string
  challenge_id: string
  skill_name: string
  score: number
  passed: boolean
  time_taken_minutes: number | null
  attempt_number: number
  verified_at: string | null
  expires_at: string | null
  badge_awarded: SkillBadge | null
  certificate_url: string | null
}

// ============================================
// 7. PROJECT INSIGHTS
// ============================================

export interface ProjectTemplate {
  id: string
  category: string
  subcategory: string | null
  title: string
  description_template: string
  suggested_skills: string[]
  suggested_budget_min: number | null
  suggested_budget_max: number | null
  suggested_duration_hours: number | null
  common_requirements: string[]
  success_tips: string[]
  example_deliverables: string[]
  times_used: number
}

export interface ProjectInsights {
  id: string
  category: string
  skill_set: string[]
  avg_budget: number
  avg_duration_hours: number
  avg_hourly_rate: number
  avg_applications_received: number
  avg_time_to_hire_hours: number
  success_rate: number
  top_skills_requested: string[]
  market_demand: 'low' | 'medium' | 'high' | 'very_high'
  talent_availability: 'scarce' | 'limited' | 'medium' | 'abundant'
  suggested_rate_range: {
    min: number
    max: number
    median: number
  }
}

// ============================================
// 8. WORKER TEAMS
// ============================================

export interface WorkerTeam {
  id: string
  name: string
  slug: string
  description: string | null
  leader_id: string
  logo_url: string | null
  cover_image_url: string | null
  team_size: number
  skills_offered: string[]
  industries: string[]
  min_project_budget: number | null
  projects_completed: number
  total_earnings: number
  avg_rating: number
  is_verified: boolean
  is_active: boolean
  members?: TeamMember[]
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'leader' | 'co-leader' | 'member'
  title: string | null
  skills: string[]
  revenue_share_percent: number | null
  joined_at: string
  is_active: boolean
  user?: any // User details
}

export interface CollaborationHistory {
  id: string
  user1_id: string
  user2_id: string
  projects_together: number
  collaboration_score: number
  last_project_at: string | null
}
