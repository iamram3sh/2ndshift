-- =====================================================
-- 2ndShift - VERIFICATION SYSTEM V2
-- Comprehensive 3-tier verification system
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- VERIFICATIONS V2 TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS verifications_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN (
    'identity', 'skill', 'microtask', 'video', 'delivery'
  )),
  tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN (
    'not_started', 'pending', 'in_review', 'verified', 'rejected', 'expired'
  )),
  evidence JSONB DEFAULT '{}',
  score DECIMAL(5,2),
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verifier_id UUID REFERENCES users(id),
  rejection_reason TEXT,
  notes TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verification_type, tier)
);

-- =====================================================
-- SKILL PROOFS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS skill_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verification_id UUID REFERENCES verifications_v2(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  proof_type TEXT NOT NULL CHECK (proof_type IN (
    'github', 'deployment', 'file', 'link', 'code_walkthrough'
  )),
  url TEXT,
  file_path TEXT,
  file_storage_bucket TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MICROTASKS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS microtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  test_input JSONB,
  expected_output JSONB,
  grader_script TEXT, -- JavaScript/TypeScript code for auto-grading
  time_limit_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MICROTASK SUBMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS microtask_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  microtask_id UUID NOT NULL REFERENCES microtasks(id) ON DELETE CASCADE,
  verification_id UUID REFERENCES verifications_v2(id) ON DELETE CASCADE,
  submission_url TEXT, -- GitHub repo, deployment URL, or file path
  submission_file_path TEXT,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('url', 'file')),
  score DECIMAL(5,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'grading', 'passed', 'failed', 'manual_review'
  )),
  grader_output JSONB,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, microtask_id)
);

-- =====================================================
-- CLIENT VERIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS client_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  identity_status TEXT NOT NULL DEFAULT 'not_started' CHECK (identity_status IN (
    'not_started', 'pending', 'verified', 'rejected'
  )),
  payment_status TEXT NOT NULL DEFAULT 'not_started' CHECK (payment_status IN (
    'not_started', 'pending', 'verified', 'rejected', 'expired'
  )),
  business_status TEXT NOT NULL DEFAULT 'not_started' CHECK (business_status IN (
    'not_started', 'pending', 'verified', 'rejected'
  )),
  payment_method_id TEXT, -- Stripe payment method ID or UPI ID
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'razorpay', 'upi')),
  business_documents JSONB DEFAULT '{}',
  evidence JSONB DEFAULT '{}',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id)
);

-- =====================================================
-- BADGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'identity_verified', 'skill_verified', 'video_verified',
    'level_1', 'level_2', 'level_3',
    'payment_verified', 'business_verified',
    'top_performer', 'trusted_worker', 'verified_client'
  )),
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  awarded_by UUID REFERENCES users(id),
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES users(id),
  revocation_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index for active badges only
CREATE UNIQUE INDEX IF NOT EXISTS idx_badges_active_unique 
ON badges(user_id, badge_type) 
WHERE revoked_at IS NULL;

-- =====================================================
-- VERIFICATION AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS verification_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES verifications_v2(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'created', 'submitted', 'approved', 'rejected', 'appealed',
    'badge_awarded', 'badge_revoked', 'status_changed'
  )),
  performed_by UUID REFERENCES users(id),
  old_status TEXT,
  new_status TEXT,
  notes TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VERIFICATION APPEALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS verification_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID NOT NULL REFERENCES verifications_v2(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  additional_evidence JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'under_review', 'approved', 'rejected'
  )),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- UPDATE EXISTING TABLES
-- =====================================================

-- Add verification level columns to worker_profiles
ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS verification_level INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_tier_1_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_tier_2_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_tier_3_completed_at TIMESTAMPTZ;

-- Add verification timestamps to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_verifications_v2_user_id ON verifications_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_v2_status ON verifications_v2(status);
CREATE INDEX IF NOT EXISTS idx_verifications_v2_type_tier ON verifications_v2(verification_type, tier);
CREATE INDEX IF NOT EXISTS idx_skill_proofs_user_id ON skill_proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_proofs_verification_id ON skill_proofs(verification_id);
CREATE INDEX IF NOT EXISTS idx_microtask_submissions_user_id ON microtask_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_microtask_submissions_status ON microtask_submissions(status);
CREATE INDEX IF NOT EXISTS idx_microtask_submissions_microtask_id ON microtask_submissions(microtask_id);
CREATE INDEX IF NOT EXISTS idx_client_verifications_client_id ON client_verifications(client_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_verification_audit_logs_verification_id ON verification_audit_logs(verification_id);
CREATE INDEX IF NOT EXISTS idx_verification_audit_logs_user_id ON verification_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_appeals_status ON verification_appeals(status);
CREATE INDEX IF NOT EXISTS idx_verification_appeals_verification_id ON verification_appeals(verification_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_verification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_verifications_v2_updated_at 
  BEFORE UPDATE ON verifications_v2
  FOR EACH ROW EXECUTE FUNCTION update_verification_updated_at();

CREATE TRIGGER update_skill_proofs_updated_at 
  BEFORE UPDATE ON skill_proofs
  FOR EACH ROW EXECUTE FUNCTION update_verification_updated_at();

CREATE TRIGGER update_microtask_submissions_updated_at 
  BEFORE UPDATE ON microtask_submissions
  FOR EACH ROW EXECUTE FUNCTION update_verification_updated_at();

CREATE TRIGGER update_client_verifications_updated_at 
  BEFORE UPDATE ON client_verifications
  FOR EACH ROW EXECUTE FUNCTION update_verification_updated_at();

CREATE TRIGGER update_verification_appeals_updated_at 
  BEFORE UPDATE ON verification_appeals
  FOR EACH ROW EXECUTE FUNCTION update_verification_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE verifications_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE microtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE microtask_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_appeals ENABLE ROW LEVEL SECURITY;

-- Users can view their own verifications
CREATE POLICY "Users can view own verifications" ON verifications_v2
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own verifications
CREATE POLICY "Users can create own verifications" ON verifications_v2
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending verifications
CREATE POLICY "Users can update own pending verifications" ON verifications_v2
  FOR UPDATE USING (auth.uid() = user_id AND status IN ('not_started', 'pending'));

-- Admins can view all verifications
CREATE POLICY "Admins can view all verifications" ON verifications_v2
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

-- Admins can update all verifications
CREATE POLICY "Admins can update all verifications" ON verifications_v2
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

-- Public can view badges (for display)
CREATE POLICY "Public can view active badges" ON badges
  FOR SELECT USING (revoked_at IS NULL);

-- Users can view their own badges
CREATE POLICY "Users can view own badges" ON badges
  FOR SELECT USING (auth.uid() = user_id);

-- Similar policies for other tables...
CREATE POLICY "Users can manage own skill proofs" ON skill_proofs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own microtask submissions" ON microtask_submissions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own client verifications" ON client_verifications
  FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can create own appeals" ON verification_appeals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own appeals" ON verification_appeals
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs" ON verification_audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Verification System V2 schema installed successfully!';
  RAISE NOTICE 'Next: Run seed_microtasks.sql';
END $$;

