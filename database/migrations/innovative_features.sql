-- ============================================
-- 2NDSHIFT - INNOVATIVE FEATURES SCHEMA
-- Smart Match, Escrow, TaxMate, EarlyPay, Trust Scores, Skill Verification, Teams
-- ============================================

-- ============================================
-- 1. SMART MATCH AI SYSTEM
-- Intelligent job-worker matching
-- ============================================

-- Match scores between workers and projects
CREATE TABLE IF NOT EXISTS smart_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  skill_match_score INTEGER DEFAULT 0,
  experience_match_score INTEGER DEFAULT 0,
  rate_match_score INTEGER DEFAULT 0,
  availability_score INTEGER DEFAULT 0,
  success_rate_score INTEGER DEFAULT 0,
  location_score INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id, project_id)
);

-- Worker preferences for job matching
CREATE TABLE IF NOT EXISTS worker_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preferred_categories TEXT[] DEFAULT '{}',
  min_hourly_rate INTEGER,
  max_project_duration_hours INTEGER,
  preferred_work_hours TEXT, -- 'morning', 'afternoon', 'evening', 'night', 'flexible'
  preferred_project_types TEXT[] DEFAULT '{}', -- 'one-time', 'ongoing', 'full-time'
  industries_interested TEXT[] DEFAULT '{}',
  remote_only BOOLEAN DEFAULT TRUE,
  instant_booking_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 2. ESCROW & MILESTONE PAYMENT SYSTEM
-- Financial protection for both parties
-- ============================================

CREATE TYPE escrow_status AS ENUM (
  'pending_funding',
  'funded',
  'released',
  'disputed',
  'refunded',
  'cancelled'
);

CREATE TABLE IF NOT EXISTS escrow_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id),
  worker_id UUID NOT NULL REFERENCES users(id),
  total_amount INTEGER NOT NULL, -- In paise
  funded_amount INTEGER DEFAULT 0,
  released_amount INTEGER DEFAULT 0,
  platform_fee_percent DECIMAL(5,2) DEFAULT 10.00,
  status escrow_status DEFAULT 'pending_funding',
  funded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contract_id)
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_id UUID NOT NULL REFERENCES escrow_accounts(id) ON DELETE CASCADE,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount INTEGER NOT NULL, -- In paise
  due_date DATE,
  sequence_order INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'revision_requested', 'disputed', 'released')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  worker_notes TEXT,
  client_feedback TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. TAXMATE - AUTOMATED TAX COMPLIANCE
-- India-specific tax handling
-- ============================================

CREATE TABLE IF NOT EXISTS tax_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pan_number TEXT,
  pan_verified BOOLEAN DEFAULT FALSE,
  gstin TEXT,
  gst_registered BOOLEAN DEFAULT FALSE,
  tds_rate DECIMAL(5,2) DEFAULT 10.00, -- Default TDS rate
  threshold_194c INTEGER DEFAULT 3000000, -- 30,000 INR threshold in paise
  is_company BOOLEAN DEFAULT FALSE,
  company_name TEXT,
  billing_address JSONB,
  bank_account_number TEXT,
  bank_ifsc TEXT,
  bank_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS tax_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL,
  payer_id UUID NOT NULL REFERENCES users(id),
  payee_id UUID NOT NULL REFERENCES users(id),
  gross_amount INTEGER NOT NULL, -- In paise
  tds_amount INTEGER NOT NULL, -- In paise
  tds_rate DECIMAL(5,2) NOT NULL,
  net_amount INTEGER NOT NULL, -- In paise
  financial_year TEXT NOT NULL, -- e.g., '2024-25'
  quarter TEXT NOT NULL, -- Q1, Q2, Q3, Q4
  section TEXT DEFAULT '194C', -- Tax section
  challan_number TEXT,
  challan_date DATE,
  form_16a_generated BOOLEAN DEFAULT FALSE,
  form_16a_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quarterly tax summary
CREATE TABLE IF NOT EXISTS tax_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  financial_year TEXT NOT NULL,
  quarter TEXT NOT NULL,
  total_earnings INTEGER DEFAULT 0,
  total_tds_deducted INTEGER DEFAULT 0,
  total_gst_collected INTEGER DEFAULT 0,
  total_platform_fees INTEGER DEFAULT 0,
  net_income INTEGER DEFAULT 0,
  summary_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, financial_year, quarter)
);

-- ============================================
-- 4. EARLYPAY - EARNED WAGE ACCESS
-- Workers access earned money early
-- ============================================

CREATE TYPE early_pay_status AS ENUM (
  'pending',
  'approved',
  'disbursed',
  'repaid',
  'defaulted'
);

CREATE TABLE IF NOT EXISTS early_pay_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contract_id UUID NOT NULL REFERENCES contracts(id),
  milestone_id UUID REFERENCES milestones(id),
  requested_amount INTEGER NOT NULL, -- In paise
  max_eligible_amount INTEGER NOT NULL, -- Based on work completed
  advance_fee_percent DECIMAL(5,2) DEFAULT 2.50, -- Fee for early access
  advance_fee_amount INTEGER NOT NULL,
  net_disbursement INTEGER NOT NULL,
  status early_pay_status DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  repayment_due_at TIMESTAMPTZ,
  repaid_at TIMESTAMPTZ,
  razorpay_transfer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worker's EarlyPay eligibility
CREATE TABLE IF NOT EXISTS early_pay_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_eligible BOOLEAN DEFAULT FALSE,
  eligibility_score INTEGER DEFAULT 0, -- 0-100
  max_advance_percent INTEGER DEFAULT 50, -- Max % of earned amount they can withdraw
  total_advanced_amount INTEGER DEFAULT 0,
  total_repaid_amount INTEGER DEFAULT 0,
  on_time_repayment_rate DECIMAL(5,2) DEFAULT 100.00,
  last_assessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 5. TWO-WAY TRUST SCORE SYSTEM
-- Workers rate clients too!
-- ============================================

CREATE TABLE IF NOT EXISTS trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'client')),
  overall_score DECIMAL(3,2) DEFAULT 5.00 CHECK (overall_score >= 0 AND overall_score <= 5),
  total_reviews INTEGER DEFAULT 0,
  
  -- Worker-specific scores (rated by clients)
  quality_score DECIMAL(3,2) DEFAULT 5.00,
  communication_score DECIMAL(3,2) DEFAULT 5.00,
  timeliness_score DECIMAL(3,2) DEFAULT 5.00,
  professionalism_score DECIMAL(3,2) DEFAULT 5.00,
  
  -- Client-specific scores (rated by workers)
  payment_reliability_score DECIMAL(3,2) DEFAULT 5.00,
  clarity_score DECIMAL(3,2) DEFAULT 5.00, -- How clear are requirements
  responsiveness_score DECIMAL(3,2) DEFAULT 5.00,
  fairness_score DECIMAL(3,2) DEFAULT 5.00, -- Fair treatment
  
  -- Behavioral metrics
  contracts_completed INTEGER DEFAULT 0,
  contracts_cancelled INTEGER DEFAULT 0,
  disputes_initiated INTEGER DEFAULT 0,
  disputes_won INTEGER DEFAULT 0,
  average_response_time_hours INTEGER,
  repeat_hire_rate DECIMAL(5,2) DEFAULT 0, -- % of workers/clients they work with again
  
  badge_level TEXT DEFAULT 'new' CHECK (badge_level IN ('new', 'verified', 'trusted', 'elite', 'champion')),
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Individual reviews
CREATE TABLE IF NOT EXISTS trust_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  reviewer_type TEXT NOT NULL CHECK (reviewer_type IN ('worker', 'client')),
  
  -- Scores (1-5)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  -- Worker reviewing Client
  payment_reliability INTEGER CHECK (payment_reliability >= 1 AND payment_reliability <= 5),
  requirement_clarity INTEGER CHECK (requirement_clarity >= 1 AND requirement_clarity <= 5),
  responsiveness INTEGER CHECK (responsiveness >= 1 AND responsiveness <= 5),
  fair_treatment INTEGER CHECK (fair_treatment >= 1 AND fair_treatment <= 5),
  would_work_again BOOLEAN,
  
  -- Client reviewing Worker
  work_quality INTEGER CHECK (work_quality >= 1 AND work_quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  timeliness INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  would_hire_again BOOLEAN,
  
  review_text TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  response_text TEXT, -- Reviewee can respond
  response_at TIMESTAMPTZ,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(contract_id, reviewer_id)
);

-- ============================================
-- 6. SKILL VERIFICATION CHALLENGES
-- Prove skills with tests
-- ============================================

CREATE TABLE IF NOT EXISTS skill_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  challenge_type TEXT DEFAULT 'quiz' CHECK (challenge_type IN ('quiz', 'coding', 'design', 'writing', 'project')),
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER DEFAULT 60,
  passing_score INTEGER DEFAULT 70,
  questions JSONB NOT NULL, -- Array of questions
  total_points INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  times_taken INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES skill_challenges(id),
  skill_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  time_taken_minutes INTEGER,
  answers JSONB, -- User's answers
  attempt_number INTEGER DEFAULT 1,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Verifications can expire
  badge_awarded TEXT, -- 'verified', 'proficient', 'expert'
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, challenge_id, attempt_number)
);

-- ============================================
-- 7. PROJECT BRIEF AI
-- Help clients create better job posts
-- ============================================

CREATE TABLE IF NOT EXISTS project_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  subcategory TEXT,
  title TEXT NOT NULL,
  description_template TEXT NOT NULL,
  suggested_skills TEXT[] DEFAULT '{}',
  suggested_budget_min INTEGER,
  suggested_budget_max INTEGER,
  suggested_duration_hours INTEGER,
  common_requirements TEXT[] DEFAULT '{}',
  success_tips TEXT[] DEFAULT '{}',
  example_deliverables TEXT[] DEFAULT '{}',
  times_used INTEGER DEFAULT 0,
  avg_success_rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  skill_set TEXT[] NOT NULL,
  avg_budget INTEGER,
  avg_duration_hours INTEGER,
  avg_hourly_rate INTEGER,
  avg_applications_received INTEGER,
  avg_time_to_hire_hours INTEGER,
  success_rate DECIMAL(5,2),
  top_skills_requested TEXT[] DEFAULT '{}',
  market_demand TEXT DEFAULT 'medium' CHECK (market_demand IN ('low', 'medium', 'high', 'very_high')),
  talent_availability TEXT DEFAULT 'medium' CHECK (talent_availability IN ('scarce', 'limited', 'medium', 'abundant')),
  suggested_rate_range JSONB, -- {min, max, median}
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. TEAM FORMATION - WORKER CREWS
-- Workers form teams, clients hire together
-- ============================================

CREATE TABLE IF NOT EXISTS worker_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  leader_id UUID NOT NULL REFERENCES users(id),
  logo_url TEXT,
  cover_image_url TEXT,
  team_size INTEGER DEFAULT 1,
  skills_offered TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  min_project_budget INTEGER,
  projects_completed INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 5.00,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES worker_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'co-leader', 'member')),
  title TEXT, -- e.g., "Lead Developer", "UI Designer"
  skills TEXT[] DEFAULT '{}',
  revenue_share_percent DECIMAL(5,2), -- Their cut of team earnings
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS team_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES worker_teams(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  contract_id UUID REFERENCES contracts(id),
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'hired', 'in_progress', 'completed', 'cancelled')),
  team_rate INTEGER, -- Team's combined rate
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team collaboration history (for recommendations)
CREATE TABLE IF NOT EXISTS collaboration_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES users(id),
  user2_id UUID NOT NULL REFERENCES users(id),
  projects_together INTEGER DEFAULT 0,
  collaboration_score DECIMAL(3,2) DEFAULT 5.00, -- How well they work together
  last_project_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_smart_matches_worker ON smart_matches(worker_id);
CREATE INDEX IF NOT EXISTS idx_smart_matches_project ON smart_matches(project_id);
CREATE INDEX IF NOT EXISTS idx_smart_matches_score ON smart_matches(match_score DESC);

CREATE INDEX IF NOT EXISTS idx_escrow_contract ON escrow_accounts(contract_id);
CREATE INDEX IF NOT EXISTS idx_milestones_escrow ON milestones(escrow_id);
CREATE INDEX IF NOT EXISTS idx_milestones_contract ON milestones(contract_id);

CREATE INDEX IF NOT EXISTS idx_tax_deductions_payer ON tax_deductions(payer_id);
CREATE INDEX IF NOT EXISTS idx_tax_deductions_payee ON tax_deductions(payee_id);
CREATE INDEX IF NOT EXISTS idx_tax_deductions_fy ON tax_deductions(financial_year, quarter);

CREATE INDEX IF NOT EXISTS idx_early_pay_worker ON early_pay_requests(worker_id);
CREATE INDEX IF NOT EXISTS idx_early_pay_status ON early_pay_requests(status);

CREATE INDEX IF NOT EXISTS idx_trust_scores_user ON trust_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_scores_overall ON trust_scores(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_trust_reviews_reviewee ON trust_reviews(reviewee_id);

CREATE INDEX IF NOT EXISTS idx_skill_verifications_user ON skill_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_challenges_skill ON skill_challenges(skill_name);

CREATE INDEX IF NOT EXISTS idx_worker_teams_leader ON worker_teams(leader_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE smart_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE early_pay_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY smart_matches_worker_policy ON smart_matches
  FOR ALL USING (auth.uid() = worker_id);

CREATE POLICY worker_preferences_user_policy ON worker_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY escrow_accounts_policy ON escrow_accounts
  FOR ALL USING (auth.uid() = client_id OR auth.uid() = worker_id);

CREATE POLICY milestones_policy ON milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM escrow_accounts e 
      WHERE e.id = escrow_id 
      AND (e.client_id = auth.uid() OR e.worker_id = auth.uid())
    )
  );

CREATE POLICY tax_profiles_user_policy ON tax_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY tax_deductions_policy ON tax_deductions
  FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY early_pay_worker_policy ON early_pay_requests
  FOR ALL USING (auth.uid() = worker_id);

CREATE POLICY trust_scores_read_policy ON trust_scores
  FOR SELECT USING (true); -- Public read

CREATE POLICY trust_reviews_read_policy ON trust_reviews
  FOR SELECT USING (is_public = true OR auth.uid() = reviewer_id OR auth.uid() = reviewee_id);

CREATE POLICY skill_verifications_user_policy ON skill_verifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY worker_teams_read_policy ON worker_teams
  FOR SELECT USING (is_active = true);

CREATE POLICY team_members_read_policy ON team_members
  FOR SELECT USING (is_active = true);
