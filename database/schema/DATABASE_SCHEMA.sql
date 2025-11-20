-- 2ndShift Platform - Complete Database Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'client', 'admin')),
  pan_number TEXT,
  phone TEXT,
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'anonymous')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow insert during registration
CREATE POLICY "Anyone can insert during registration" ON users
  FOR INSERT WITH CHECK (true);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- =====================================================
-- WORKER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS worker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  hourly_rate NUMERIC(10,2) DEFAULT 0,
  availability_hours JSONB DEFAULT '{}',
  portfolio_url TEXT,
  resume_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS for worker_profiles
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view own profile" ON worker_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Workers can update own profile" ON worker_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Workers can insert own profile" ON worker_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view verified workers" ON worker_profiles
  FOR SELECT USING (is_verified = true);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget NUMERIC(12,2) NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  duration_hours INTEGER NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open projects" ON projects
  FOR SELECT USING (status = 'open' OR auth.uid() = client_id);

CREATE POLICY "Clients can create projects" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'client')
  );

CREATE POLICY "Clients can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  );

-- =====================================================
-- APPLICATIONS TABLE (for workers applying to projects)
-- =====================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  proposed_rate NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, worker_id)
);

-- RLS for applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Workers can view own applications" ON applications
  FOR SELECT USING (auth.uid() = worker_id);

CREATE POLICY "Clients can view applications to their projects" ON applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE POLICY "Clients can update applications to their projects" ON applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid())
  );

-- =====================================================
-- CONTRACTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
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

-- RLS for contracts
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contracts" ON contracts
  FOR SELECT USING (
    auth.uid() = worker_id OR
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE POLICY "Clients can create contracts" ON contracts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid())
  );

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  payment_from UUID REFERENCES users(id),
  payment_to UUID REFERENCES users(id),
  gross_amount NUMERIC(12,2) NOT NULL,
  platform_fee NUMERIC(12,2) NOT NULL,
  tds_deducted NUMERIC(12,2) NOT NULL,
  gst_amount NUMERIC(12,2) DEFAULT 0,
  net_amount NUMERIC(12,2) NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  invoice_url TEXT,
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = payment_from OR auth.uid() = payment_to);

CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_applications_worker_id ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_worker_id ON contracts(worker_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_from ON payments(payment_from);
CREATE INDEX IF NOT EXISTS idx_payments_payment_to ON payments(payment_to);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_profiles_updated_at BEFORE UPDATE ON worker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ADMIN VIEWS (for analytics)
-- =====================================================
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE user_type = 'worker') as total_workers,
  (SELECT COUNT(*) FROM users WHERE user_type = 'client') as total_clients,
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM projects WHERE status IN ('in_progress', 'assigned')) as active_projects,
  (SELECT COUNT(*) FROM projects WHERE status = 'completed') as completed_projects,
  (SELECT COALESCE(SUM(platform_fee), 0) FROM payments WHERE status = 'completed') as total_platform_revenue,
  (SELECT COALESCE(SUM(net_amount), 0) FROM payments WHERE status = 'completed') as total_worker_earnings;

-- =====================================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- =====================================================

-- Note: To create an admin user, you must:
-- 1. Register normally through the app
-- 2. Then run this SQL to upgrade the user to admin:
-- UPDATE users SET user_type = 'admin' WHERE email = 'your-admin@email.com';
