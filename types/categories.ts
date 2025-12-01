// ============================================
// 2NDSHIFT - CATEGORIES & RATINGS TYPES
// ============================================

// ============================================
// INDUSTRIES & SKILLS
// ============================================

export interface Industry {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  is_active: boolean
  display_order: number
  professional_count: number
  created_at: string
  categories?: SkillCategory[]
}

export interface SkillCategory {
  id: string
  industry_id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  display_order: number
  skill_count: number
  created_at: string
  skills?: Skill[]
}

export interface Skill {
  id: string
  category_id: string | null
  industry_id: string | null
  name: string
  slug: string
  description: string | null
  aliases: string[]
  is_verified: boolean
  is_active: boolean
  usage_count: number
  created_at: string
}

// ============================================
// CATEGORY SUGGESTIONS
// ============================================

export type SuggestionStatus = 'pending' | 'approved' | 'rejected' | 'merged'
export type SuggestionType = 'industry' | 'category' | 'skill'

export interface CategorySuggestion {
  id: string
  user_id: string
  suggestion_type: SuggestionType
  parent_id: string | null
  suggested_name: string
  suggested_description: string | null
  reason: string | null
  status: SuggestionStatus
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  merged_into_id: string | null
  created_at: string
}

// ============================================
// RATINGS
// ============================================

export interface ProfessionalRating {
  id: string
  professional_id: string
  client_id: string
  contract_id: string | null
  
  overall_rating: number
  quality_rating: number | null
  communication_rating: number | null
  timeliness_rating: number | null
  professionalism_rating: number | null
  value_rating: number | null
  
  review_title: string | null
  review_text: string | null
  would_hire_again: boolean | null
  skills_demonstrated: string[]
  
  is_public: boolean
  response_text: string | null
  response_at: string | null
  
  created_at: string
  updated_at: string
  
  // Joined data
  client?: {
    id: string
    full_name: string
    company_name?: string
  }
}

export interface CompanyRating {
  id: string
  company_id: string
  professional_id: string
  contract_id: string | null
  
  overall_rating: number
  payment_rating: number | null
  communication_rating: number | null
  requirements_clarity_rating: number | null
  respect_rating: number | null
  
  review_title: string | null
  review_text: string | null
  would_work_again: boolean | null
  
  paid_on_time: boolean | null
  payment_issues: string | null
  
  is_public: boolean
  response_text: string | null
  response_at: string | null
  
  created_at: string
  updated_at: string
  
  // Joined data
  professional?: {
    id: string
    full_name: string
  }
}

export interface UserRatingSummary {
  id: string
  user_id: string
  user_type: 'worker' | 'client'
  
  overall_rating: number
  total_reviews: number
  
  // Worker ratings
  avg_quality: number
  avg_communication: number
  avg_timeliness: number
  avg_professionalism: number
  avg_value: number
  
  // Client ratings
  avg_payment: number
  avg_clarity: number
  avg_respect: number
  
  // Distribution
  five_star_count: number
  four_star_count: number
  three_star_count: number
  two_star_count: number
  one_star_count: number
  
  would_recommend_percent: number
  on_time_payment_percent: number
  
  last_review_at: string | null
  last_calculated_at: string
}

// ============================================
// API TYPES
// ============================================

export interface SubmitRatingRequest {
  contract_id?: string
  overall_rating: number
  
  // For professional ratings
  quality_rating?: number
  communication_rating?: number
  timeliness_rating?: number
  professionalism_rating?: number
  value_rating?: number
  would_hire_again?: boolean
  skills_demonstrated?: string[]
  
  // For company ratings
  payment_rating?: number
  requirements_clarity_rating?: number
  respect_rating?: number
  would_work_again?: boolean
  paid_on_time?: boolean
  payment_issues?: string
  
  // Common
  review_title?: string
  review_text?: string
  is_public?: boolean
}

export interface SuggestCategoryRequest {
  suggestion_type: SuggestionType
  parent_id?: string
  suggested_name: string
  suggested_description?: string
  reason?: string
}

// ============================================
// CONSTANTS
// ============================================

export const INDUSTRY_ICONS: Record<string, string> = {
  it: 'Monitor',
  telecom: 'Radio',
  cybersecurity: 'Shield',
  design: 'Palette',
  media: 'Film',
  marketing: 'Megaphone',
  finance: 'Calculator',
  legal: 'Scale',
  hr: 'Users',
  consulting: 'Briefcase',
  healthcare: 'Heart',
  pharma: 'Pill',
  hospitality: 'Hotel',
  realestate: 'Building',
  retail: 'ShoppingBag',
  education: 'GraduationCap',
  training: 'BookOpen',
  engineering: 'Wrench',
  manufacturing: 'Factory',
  automotive: 'Car',
  agriculture: 'Leaf',
  energy: 'Zap',
  logistics: 'Truck',
  government: 'Landmark',
  nonprofit: 'HeartHandshake',
  other: 'MoreHorizontal',
}

export const INDUSTRY_COLORS: Record<string, string> = {
  it: 'sky',
  telecom: 'violet',
  cybersecurity: 'red',
  design: 'pink',
  media: 'purple',
  marketing: 'orange',
  finance: 'emerald',
  legal: 'slate',
  hr: 'cyan',
  consulting: 'amber',
  healthcare: 'rose',
  pharma: 'teal',
  hospitality: 'yellow',
  realestate: 'stone',
  retail: 'fuchsia',
  education: 'indigo',
  training: 'blue',
  engineering: 'zinc',
  manufacturing: 'neutral',
  automotive: 'gray',
  agriculture: 'lime',
  energy: 'green',
  logistics: 'brown',
  government: 'blue',
  nonprofit: 'rose',
  other: 'slate',
}
