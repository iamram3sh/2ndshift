-- ============================================
-- 2NDSHIFT - REVENUE SYSTEM V1
-- Commission, Credits, Subscriptions, Escrow Fees
-- ============================================

-- ============================================
-- UPDATE CONTRACTS TABLE
-- Add commission tracking fields
-- ============================================
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS worker_commission_percent NUMERIC(5,2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS worker_commission_amount NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS client_commission_percent NUMERIC(5,2) DEFAULT 4.00,
ADD COLUMN IF NOT EXISTS client_commission_amount NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_first_three_jobs BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS worker_job_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_micro_task BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS micro_task_fee NUMERIC(12,2) DEFAULT 0;

-- ============================================
-- UPDATE PAYMENTS TABLE
-- Add escrow fee tracking
-- ============================================
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS escrow_fee_percent NUMERIC(5,2) DEFAULT 2.00,
ADD COLUMN IF NOT EXISTS escrow_fee_amount NUMERIC(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS client_has_subscription BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS worker_has_subscription BOOLEAN DEFAULT FALSE;

-- ============================================
-- UPDATE SHIFTS PACKAGES
-- Update to match requirements: ₹49=10, ₹99=25, ₹199=60, ₹399=140
-- ============================================
DELETE FROM shifts_packages WHERE user_type = 'worker';

INSERT INTO shifts_packages (name, shifts_amount, price_inr, user_type, is_popular, discount_percent) VALUES
  ('Starter', 10, 4900, 'worker', false, 0),      -- ₹49 = 10 credits
  ('Popular', 25, 9900, 'worker', true, 0),       -- ₹99 = 25 credits
  ('Value', 60, 19900, 'worker', false, 0),       -- ₹199 = 60 credits
  ('Pro', 140, 39900, 'worker', false, 0)         -- ₹399 = 140 credits
ON CONFLICT DO NOTHING;

-- ============================================
-- UPDATE SUBSCRIPTION PLANS
-- Worker: Starter ₹199, Pro ₹499, Elite ₹999
-- Client: Growth ₹999, Pro Agency ₹2999
-- ============================================
DELETE FROM subscription_plans WHERE user_type = 'worker' AND slug NOT IN ('worker-free');
DELETE FROM subscription_plans WHERE user_type = 'client' AND slug NOT IN ('client-starter');

-- Worker Subscriptions
INSERT INTO subscription_plans (name, slug, user_type, price_monthly_inr, platform_fee_percent, free_shifts_monthly, features) VALUES
  ('Starter', 'worker-starter', 'worker', 19900, 8.00, 20, '["Everything in Free", "20 Shifts/month", "Profile boost (1 week/month)", "Basic badges", "Priority support"]'),
  ('Pro', 'worker-pro', 'worker', 49900, 5.00, 50, '["Everything in Starter", "50 Shifts/month", "Permanent profile boost", "Verified badges", "Ranking boost", "Instant payout", "Priority support"]'),
  ('Elite', 'worker-elite', 'worker', 99900, 0.00, 100, '["Everything in Pro", "100 Shifts/month", "Elite badge", "Top ranking boost", "Instant payout", "Dedicated account manager", "Phone support"]')
ON CONFLICT (slug) DO UPDATE SET
  price_monthly_inr = EXCLUDED.price_monthly_inr,
  platform_fee_percent = EXCLUDED.platform_fee_percent,
  free_shifts_monthly = EXCLUDED.free_shifts_monthly,
  features = EXCLUDED.features;

-- Client Subscriptions
INSERT INTO subscription_plans (name, slug, user_type, price_monthly_inr, platform_fee_percent, free_shifts_monthly, features) VALUES
  ('Growth', 'client-growth', 'client', 99900, 0.00, 30, '["Everything in Starter", "No platform commission", "30 Shifts/month", "Featured job listings", "Priority matching", "Advanced analytics", "Priority support"]'),
  ('Pro Agency', 'client-pro-agency', 'client', 299900, 0.00, 100, '["Everything in Growth", "No platform commission", "100 Shifts/month", "Multi-seat support (up to 5 users)", "Unlimited featured listings", "Custom integrations", "Dedicated account manager", "Phone support"]')
ON CONFLICT (slug) DO UPDATE SET
  price_monthly_inr = EXCLUDED.price_monthly_inr,
  platform_fee_percent = EXCLUDED.platform_fee_percent,
  free_shifts_monthly = EXCLUDED.free_shifts_monthly,
  features = EXCLUDED.features;

-- ============================================
-- ADD WORKER JOB COUNT TRACKING
-- Track completed jobs for first 3 jobs commission exemption
-- ============================================
CREATE TABLE IF NOT EXISTS worker_job_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_jobs_count INTEGER NOT NULL DEFAULT 0,
  first_three_jobs_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id)
);

CREATE INDEX IF NOT EXISTS idx_worker_job_counts_worker ON worker_job_counts(worker_id);

-- ============================================
-- ADD APPLICATION CREDITS TRACKING
-- Track credits used for job applications
-- ============================================
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS application_credits_required INTEGER DEFAULT 3;

-- Create applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credits_used INTEGER DEFAULT 3,
  credits_refunded BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'shortlisted', 'rejected', 'hired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, worker_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_project ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- ============================================
-- FUNCTIONS FOR COMMISSION CALCULATION
-- ============================================

-- Function to calculate worker commission
CREATE OR REPLACE FUNCTION calculate_worker_commission(
  p_contract_amount NUMERIC,
  p_worker_id UUID,
  p_is_verified BOOLEAN,
  p_is_first_three BOOLEAN
)
RETURNS NUMERIC AS $$
DECLARE
  v_commission_percent NUMERIC;
  v_commission_amount NUMERIC;
BEGIN
  -- First 3 jobs: 0% commission
  IF p_is_first_three THEN
    RETURN 0;
  END IF;
  
  -- Verified workers: 5%, Unverified: 10%
  IF p_is_verified THEN
    v_commission_percent := 5.00;
  ELSE
    v_commission_percent := 10.00;
  END IF;
  
  v_commission_amount := (p_contract_amount * v_commission_percent) / 100;
  
  RETURN v_commission_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate client commission
CREATE OR REPLACE FUNCTION calculate_client_commission(
  p_payment_amount NUMERIC,
  p_has_subscription BOOLEAN,
  p_is_micro_task BOOLEAN
)
RETURNS NUMERIC AS $$
DECLARE
  v_commission_amount NUMERIC;
BEGIN
  -- Subscribers: 0% commission
  IF p_has_subscription THEN
    RETURN 0;
  END IF;
  
  -- Micro tasks: ₹49 flat fee
  IF p_is_micro_task THEN
    RETURN 49.00;
  END IF;
  
  -- Regular: 4% commission
  v_commission_amount := (p_payment_amount * 4.00) / 100;
  
  RETURN v_commission_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate escrow fee
CREATE OR REPLACE FUNCTION calculate_escrow_fee(
  p_payment_amount NUMERIC
)
RETURNS NUMERIC AS $$
BEGIN
  -- 2% escrow fee from clients
  RETURN (p_payment_amount * 2.00) / 100;
END;
$$ LANGUAGE plpgsql;

-- Function to update worker job count
CREATE OR REPLACE FUNCTION update_worker_job_count(
  p_worker_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_count INTEGER;
  v_new_count INTEGER;
BEGIN
  -- Get or create job count record
  INSERT INTO worker_job_counts (worker_id, completed_jobs_count)
  VALUES (p_worker_id, 0)
  ON CONFLICT (worker_id) DO NOTHING;
  
  -- Increment count
  UPDATE worker_job_counts
  SET 
    completed_jobs_count = completed_jobs_count + 1,
    first_three_jobs_completed = CASE 
      WHEN completed_jobs_count + 1 >= 3 THEN TRUE 
      ELSE FALSE 
    END,
    updated_at = NOW()
  WHERE worker_id = p_worker_id
  RETURNING completed_jobs_count INTO v_new_count;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Update job count on contract completion
-- ============================================
CREATE OR REPLACE FUNCTION trigger_update_job_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM update_worker_job_count(NEW.worker_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_contract_completed ON contracts;
CREATE TRIGGER trigger_contract_completed
  AFTER UPDATE ON contracts
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed'))
  EXECUTE FUNCTION trigger_update_job_count();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE worker_job_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY worker_job_counts_user_policy ON worker_job_counts
  FOR ALL USING (auth.uid() = worker_id);

CREATE POLICY applications_worker_policy ON applications
  FOR SELECT USING (auth.uid() = worker_id);

CREATE POLICY applications_client_policy ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = applications.project_id 
      AND projects.client_id = auth.uid()
    )
  );

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_contracts_worker ON contracts(worker_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_applications_credits_refunded ON applications(credits_refunded);

