-- =====================================================
-- 2ndShift V1 - COMPLETE BACKEND SCHEMA
-- Comprehensive database schema for marketplace platform
-- Run this migration after existing schema
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- ENHANCED USERS TABLE
-- =====================================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- =====================================================
-- PROFILES TABLE (Worker-specific enhanced)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  headline TEXT,
  bio TEXT,
  location TEXT,
  availability JSONB DEFAULT '{}', -- {peak_hours: [], capacity: number}
  hourly_rate_min NUMERIC(10,2),
  hourly_rate_max NUMERIC(10,2),
  verified_level TEXT DEFAULT 'none' CHECK (verified_level IN ('none', 'basic', 'professional', 'premium')),
  score DECIMAL(5,2) DEFAULT 0.0,
  skills JSONB DEFAULT '[]', -- Array of skill objects
  portfolio_links JSONB DEFAULT '[]', -- Array of {url, title, description}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CATEGORIES TABLE (Enhanced)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MICROTASKS CATALOG TABLE
-- =====================================================
CREATE TYPE complexity_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE delivery_window AS ENUM ('6-24h', '3-7d', '1-4w', '1-6m');

CREATE TABLE IF NOT EXISTS microtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  complexity complexity_level DEFAULT 'intermediate',
  delivery_window delivery_window DEFAULT '3-7d',
  base_price_min NUMERIC(10,2) NOT NULL,
  base_price_max NUMERIC(10,2) NOT NULL,
  default_commission_percent NUMERIC(5,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- JOBS TABLE (Enhanced from projects)
-- =====================================================
CREATE TYPE job_status AS ENUM ('draft', 'open', 'assigned', 'in_progress', 'completed', 'disputed', 'cancelled');

-- Rename projects to jobs if projects exists, otherwise create jobs table
DO $$ 
BEGIN
  -- Check if projects table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
    -- Rename projects to jobs
    ALTER TABLE projects RENAME TO jobs;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
    -- Create jobs table if neither exists
    CREATE TABLE jobs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      budget NUMERIC(12,2),
      required_skills TEXT[] DEFAULT '{}',
      duration_hours INTEGER,
      status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'assigned', 'in_progress', 'completed', 'disputed', 'cancelled')),
      deadline TIMESTAMPTZ,
      escrow_enabled BOOLEAN DEFAULT false,
      project_type TEXT DEFAULT 'fixed',
      urgency TEXT DEFAULT 'normal',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Add new columns to jobs table
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS microtask_id UUID REFERENCES microtasks(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS custom BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS price_fixed NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS price_currency VARCHAR(3) DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS delivery_deadline TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivery_window delivery_window,
ADD COLUMN IF NOT EXISTS escrow_id UUID,
ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ DEFAULT NOW();

-- Update status enum constraint
DO $$ 
BEGIN
  -- Drop old constraint if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'jobs' AND constraint_name = 'projects_status_check'
  ) THEN
    ALTER TABLE jobs DROP CONSTRAINT projects_status_check;
  END IF;
  
  -- Drop jobs_status_check if exists to recreate
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'jobs' AND constraint_name = 'jobs_status_check'
  ) THEN
    ALTER TABLE jobs DROP CONSTRAINT jobs_status_check;
  END IF;
  
  -- Add new constraint
  ALTER TABLE jobs ADD CONSTRAINT jobs_status_check 
    CHECK (status IN ('draft', 'open', 'assigned', 'in_progress', 'completed', 'disputed', 'cancelled'));
END $$;

-- =====================================================
-- PROPOSALS / APPLICATIONS TABLE (Enhanced)
-- =====================================================
CREATE TYPE proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Create applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  proposed_rate NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, worker_id)
);

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Add cover_text if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'cover_text'
  ) THEN
    ALTER TABLE applications ADD COLUMN cover_text TEXT;
  END IF;

  -- Add credits_used if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'credits_used'
  ) THEN
    ALTER TABLE applications ADD COLUMN credits_used INTEGER DEFAULT 3;
  END IF;

  -- Add proposed_price if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'proposed_price'
  ) THEN
    ALTER TABLE applications ADD COLUMN proposed_price NUMERIC(10,2);
  END IF;

  -- Add proposed_delivery if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'proposed_delivery'
  ) THEN
    ALTER TABLE applications ADD COLUMN proposed_delivery TIMESTAMPTZ;
  END IF;

  -- Add reviewed_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE applications ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Update status enum constraint
DO $$ 
BEGIN
  -- Drop old constraint if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'applications' AND constraint_name = 'applications_status_check'
  ) THEN
    ALTER TABLE applications DROP CONSTRAINT applications_status_check;
  END IF;
  
  -- Add new constraint
  ALTER TABLE applications ADD CONSTRAINT applications_status_check 
    CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn'));
END $$;

-- =====================================================
-- ASSIGNMENTS TABLE
-- =====================================================
CREATE TYPE assignment_status AS ENUM ('assigned', 'in_progress', 'completed', 'delivered', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status assignment_status DEFAULT 'assigned',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);

-- =====================================================
-- VERIFICATIONS TABLE (Enhanced)
-- =====================================================
CREATE TYPE verification_type AS ENUM ('identity', 'skill', 'microtask', 'video', 'delivery');
CREATE TYPE verification_status AS ENUM ('not_started', 'pending', 'verified', 'rejected');

-- Use existing verifications_v2 or create new
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type verification_type NOT NULL,
  status verification_status DEFAULT 'not_started',
  evidence JSONB DEFAULT '{}',
  score DECIMAL(5,2),
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If verifications table exists but doesn't have type column, add it
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'verifications') THEN
    -- Add type column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'verifications' AND column_name = 'type'
    ) THEN
      ALTER TABLE verifications ADD COLUMN type verification_type;
    END IF;
    
    -- Add status column if it doesn't exist (in case it's using different enum)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'verifications' AND column_name = 'status'
    ) THEN
      ALTER TABLE verifications ADD COLUMN status verification_status DEFAULT 'not_started';
    END IF;
  END IF;
END $$;

-- =====================================================
-- SKILL PROOFS TABLE (Already exists, ensure structure)
-- =====================================================
-- Table already exists from verification_system_v2.sql

-- =====================================================
-- SHIFT CREDITS TABLE (Enhanced from shifts_balance)
-- =====================================================
CREATE TABLE IF NOT EXISTS shift_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREDIT TRANSACTIONS TABLE
-- =====================================================
CREATE TYPE credit_reason AS ENUM ('purchase', 'apply', 'refund', 'admin_adjust', 'subscription_bonus', 'referral');

CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  change INTEGER NOT NULL, -- Positive for credits added, negative for deducted
  reason credit_reason NOT NULL,
  reference_id UUID, -- Links to job_id, payment_id, etc.
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUBSCRIPTION PLANS TABLE (Create first if doesn't exist)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'client')),
  price_monthly_inr INTEGER NOT NULL,
  price_yearly_inr INTEGER,
  platform_fee_percent DECIMAL(5,2) NOT NULL,
  free_shifts_monthly INTEGER NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUBSCRIPTIONS TABLE (Enhanced from user_subscriptions)
-- =====================================================
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'expired', 'trial');

-- Create table if it doesn't exist, or alter if it does
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  plan_slug TEXT,
  status subscription_status NOT NULL DEFAULT 'active',
  razorpay_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
  next_billing_date TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add columns if table already exists (from previous migration)
DO $$ 
BEGIN
  -- Add plan_slug if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'plan_slug'
  ) THEN
    ALTER TABLE user_subscriptions ADD COLUMN plan_slug TEXT;
  END IF;

  -- Add next_billing_date if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'next_billing_date'
  ) THEN
    ALTER TABLE user_subscriptions ADD COLUMN next_billing_date TIMESTAMPTZ;
  END IF;

  -- Add meta if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_subscriptions' AND column_name = 'meta'
  ) THEN
    ALTER TABLE user_subscriptions ADD COLUMN meta JSONB DEFAULT '{}';
  END IF;
END $$;

-- =====================================================
-- PAYMENTS TABLE (Enhanced)
-- =====================================================
CREATE TYPE payment_method AS ENUM ('card', 'upi', 'wallet', 'bank_transfer', 'netbanking');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create contracts table if it doesn't exist (needed for payments)
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contract_amount NUMERIC(12,2) NOT NULL,
  platform_fee_percentage NUMERIC(5,2) DEFAULT 10.00,
  platform_fee NUMERIC(12,2) NOT NULL,
  tds_percentage NUMERIC(5,2) DEFAULT 10.00,
  tds_amount NUMERIC(12,2) NOT NULL,
  worker_payout NUMERIC(12,2) NOT NULL,
  nda_signed BOOLEAN DEFAULT false,
  conflict_declaration_signed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  payment_from UUID REFERENCES users(id),
  payment_to UUID REFERENCES users(id),
  gross_amount NUMERIC(12,2),
  platform_fee NUMERIC(12,2),
  tds_deducted NUMERIC(12,2),
  gst_amount NUMERIC(12,2) DEFAULT 0,
  net_amount NUMERIC(12,2),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  invoice_url TEXT,
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Add payer_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'payer_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN payer_id UUID REFERENCES users(id);
  END IF;

  -- Add payee_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'payee_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN payee_id UUID REFERENCES users(id);
  END IF;

  -- Add amount if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'amount'
  ) THEN
    ALTER TABLE payments ADD COLUMN amount NUMERIC(12,2);
  END IF;

  -- Add currency if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'currency'
  ) THEN
    ALTER TABLE payments ADD COLUMN currency VARCHAR(3) DEFAULT 'INR';
  END IF;

  -- Add method if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'method'
  ) THEN
    ALTER TABLE payments ADD COLUMN method payment_method;
  END IF;

  -- Add provider_meta if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payments' AND column_name = 'provider_meta'
  ) THEN
    ALTER TABLE payments ADD COLUMN provider_meta JSONB DEFAULT '{}';
  END IF;
END $$;

-- =====================================================
-- ESCROWS TABLE
-- =====================================================
CREATE TYPE escrow_status AS ENUM ('created', 'funded', 'released', 'refunded');

CREATE TABLE IF NOT EXISTS escrows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status escrow_status DEFAULT 'created',
  provider_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMMISSIONS TABLE
-- =====================================================
CREATE TYPE commission_charged_to AS ENUM ('client', 'worker', 'both');

CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  percent NUMERIC(5,2) NOT NULL,
  charged_to commission_charged_to DEFAULT 'both',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDITS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  object_type TEXT NOT NULL,
  object_id UUID,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADMIN REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verif_id UUID REFERENCES verifications(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If notifications table exists but doesn't have read column, add it
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    -- Add read column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'read'
    ) THEN
      ALTER TABLE notifications ADD COLUMN read BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add type column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'type'
    ) THEN
      ALTER TABLE notifications ADD COLUMN type TEXT;
    END IF;
    
    -- Add payload column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'payload'
    ) THEN
      ALTER TABLE notifications ADD COLUMN payload JSONB DEFAULT '{}';
    END IF;
  END IF;
END $$;

-- =====================================================
-- MISSING TASK REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS missing_task_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,
  parsed JSONB DEFAULT '{}', -- {skills: [], urgency: string, complexity: string}
  suggested_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  assigned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  criteria JSONB DEFAULT '{}',
  awarded BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PLATFORM CONFIG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS platform_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Insert default platform config
INSERT INTO platform_config (key, value, description) VALUES
  ('worker_commission_verified', '0.05', 'Commission for verified workers (5%)'),
  ('worker_commission_unverified', '0.10', 'Commission for unverified workers (10%)'),
  ('client_commission_percent', '0.04', 'Client commission percentage (4%)'),
  ('escrow_fee_percent', '0.02', 'Escrow fee percentage (2%)'),
  ('credits_per_application', '3', 'Shift Credits required per job application'),
  ('credits_refund_rules', '{"on_rejection": true, "on_withdrawal": true, "on_job_cancel": true}', 'Credit refund rules')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- INDEXES
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_verified_level ON profiles(verified_level);
CREATE INDEX IF NOT EXISTS idx_profiles_skills_gin ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_score ON profiles(score DESC);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Microtasks indexes
CREATE INDEX IF NOT EXISTS idx_microtasks_slug ON microtasks(slug);
CREATE INDEX IF NOT EXISTS idx_microtasks_category ON microtasks(category_id);
CREATE INDEX IF NOT EXISTS idx_microtasks_complexity ON microtasks(complexity);
CREATE INDEX IF NOT EXISTS idx_microtasks_title_search ON microtasks USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_microtasks_description_search ON microtasks USING gin(to_tsvector('english', description));

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_microtask ON jobs(microtask_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);

-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Assignments indexes
CREATE INDEX IF NOT EXISTS idx_assignments_job ON assignments(job_id);
CREATE INDEX IF NOT EXISTS idx_assignments_worker ON assignments(worker_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);

-- Verifications indexes
CREATE INDEX IF NOT EXISTS idx_verifications_user ON verifications(user_id);
-- Only create type index if column exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verifications' AND column_name = 'type'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_verifications_type ON verifications(type);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);

-- Shift Credits indexes
CREATE INDEX IF NOT EXISTS idx_shift_credits_user ON shift_credits(user_id);

-- Credit Transactions indexes
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_reference ON credit_transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions(created_at DESC);

-- Escrows indexes
CREATE INDEX IF NOT EXISTS idx_escrows_job ON escrows(job_id);
CREATE INDEX IF NOT EXISTS idx_escrows_client ON escrows(client_id);
CREATE INDEX IF NOT EXISTS idx_escrows_status ON escrows(status);

-- Commissions indexes
CREATE INDEX IF NOT EXISTS idx_commissions_job ON commissions(job_id);

-- Audits indexes
CREATE INDEX IF NOT EXISTS idx_audits_user ON audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_object ON audits(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_audits_created ON audits(created_at DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
-- Only create read index if column exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'read'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Missing Task Requests indexes
CREATE INDEX IF NOT EXISTS idx_missing_tasks_client ON missing_task_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_missing_tasks_assigned ON missing_task_requests(assigned);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_microtasks_updated_at ON microtasks;
CREATE TRIGGER update_microtasks_updated_at BEFORE UPDATE ON microtasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assignments_updated_at ON assignments;
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_verifications_updated_at ON verifications;
CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shift_credits_updated_at ON shift_credits;
CREATE TRIGGER update_shift_credits_updated_at BEFORE UPDATE ON shift_credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_escrows_updated_at ON escrows;
CREATE TRIGGER update_escrows_updated_at BEFORE UPDATE ON escrows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE microtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE missing_task_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS profiles_public_read ON profiles;
CREATE POLICY profiles_public_read ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS profiles_user_manage ON profiles;
CREATE POLICY profiles_user_manage ON profiles FOR ALL USING (auth.uid() = user_id);

-- Categories policies
DROP POLICY IF EXISTS categories_public_read ON categories;
CREATE POLICY categories_public_read ON categories FOR SELECT USING (is_active = true);

-- Microtasks policies
DROP POLICY IF EXISTS microtasks_public_read ON microtasks;
CREATE POLICY microtasks_public_read ON microtasks FOR SELECT USING (true);

-- Jobs policies (enhanced)
DROP POLICY IF EXISTS jobs_public_read ON jobs;
CREATE POLICY jobs_public_read ON jobs FOR SELECT USING (status = 'open' OR auth.uid() = client_id OR EXISTS (
  SELECT 1 FROM assignments WHERE assignments.job_id = jobs.id AND assignments.worker_id = auth.uid()
));
DROP POLICY IF EXISTS jobs_client_create ON jobs;
CREATE POLICY jobs_client_create ON jobs FOR INSERT WITH CHECK (auth.uid() = client_id);
DROP POLICY IF EXISTS jobs_client_update ON jobs;
CREATE POLICY jobs_client_update ON jobs FOR UPDATE USING (auth.uid() = client_id);

-- Assignments policies
DROP POLICY IF EXISTS assignments_user_read ON assignments;
CREATE POLICY assignments_user_read ON assignments FOR SELECT USING (
  auth.uid() = worker_id OR EXISTS (SELECT 1 FROM jobs WHERE jobs.id = assignments.job_id AND jobs.client_id = auth.uid())
);

-- Verifications policies
DROP POLICY IF EXISTS verifications_user_read ON verifications;
CREATE POLICY verifications_user_read ON verifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS verifications_user_manage ON verifications;
CREATE POLICY verifications_user_manage ON verifications FOR ALL USING (auth.uid() = user_id);

-- Shift Credits policies
DROP POLICY IF EXISTS shift_credits_user_read ON shift_credits;
CREATE POLICY shift_credits_user_read ON shift_credits FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS shift_credits_user_update ON shift_credits;
CREATE POLICY shift_credits_user_update ON shift_credits FOR UPDATE USING (auth.uid() = user_id);

-- Credit Transactions policies
DROP POLICY IF EXISTS credit_transactions_user_read ON credit_transactions;
CREATE POLICY credit_transactions_user_read ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Escrows policies
DROP POLICY IF EXISTS escrows_user_read ON escrows;
CREATE POLICY escrows_user_read ON escrows FOR SELECT USING (
  auth.uid() = client_id OR EXISTS (SELECT 1 FROM assignments WHERE assignments.job_id = escrows.job_id AND assignments.worker_id = auth.uid())
);

-- Notifications policies
DROP POLICY IF EXISTS notifications_user_read ON notifications;
CREATE POLICY notifications_user_read ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS notifications_user_update ON notifications;
CREATE POLICY notifications_user_update ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Missing Task Requests policies
DROP POLICY IF EXISTS missing_tasks_client_read ON missing_task_requests;
CREATE POLICY missing_tasks_client_read ON missing_task_requests FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS missing_tasks_client_create ON missing_task_requests;
CREATE POLICY missing_tasks_client_create ON missing_task_requests FOR INSERT WITH CHECK (auth.uid() = client_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to initialize shift credits for new users
CREATE OR REPLACE FUNCTION initialize_shift_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO shift_credits (user_id, balance)
  VALUES (NEW.id, 5) -- Welcome bonus
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO credit_transactions (user_id, change, reason, meta)
  VALUES (NEW.id, 5, 'subscription_bonus', '{"description": "Welcome bonus"}');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create shift credits
DROP TRIGGER IF EXISTS trigger_initialize_shift_credits ON users;
CREATE TRIGGER trigger_initialize_shift_credits
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_shift_credits();

-- Function to reserve credits
CREATE OR REPLACE FUNCTION reserve_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reference_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
BEGIN
  SELECT balance INTO v_current_balance
  FROM shift_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  UPDATE shift_credits
  SET 
    balance = balance - p_amount,
    reserved = reserved + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  INSERT INTO credit_transactions (user_id, change, reason, reference_id, meta)
  VALUES (p_user_id, -p_amount, 'apply', p_reference_id, '{"action": "reserved"}');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to release reserved credits
CREATE OR REPLACE FUNCTION release_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reference_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE shift_credits
  SET 
    reserved = GREATEST(0, reserved - p_amount),
    updated_at = NOW()
  WHERE user_id = p_user_id AND reserved >= p_amount;
  
  INSERT INTO credit_transactions (user_id, change, reason, reference_id, meta)
  VALUES (p_user_id, p_amount, 'refund', p_reference_id, '{"action": "released"}');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Backend Schema V1 migration completed successfully!';
  RAISE NOTICE 'Next: Run seed script to populate sample data';
END $$;
