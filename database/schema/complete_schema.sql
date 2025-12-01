-- =====================================================
-- 2ndShift Platform - COMPLETE DATABASE SCHEMA
-- Run this FIRST in Supabase SQL Editor
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table
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

-- Worker profiles
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
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'submitted', 'approved', 'rejected')),
  industry_id UUID,
  years_in_industry INTEGER DEFAULT 0,
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Projects table
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
  escrow_enabled BOOLEAN DEFAULT false,
  project_type TEXT DEFAULT 'fixed' CHECK (project_type IN ('fixed', 'hourly', 'milestone')),
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'urgent', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
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

-- Contracts table
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

-- Payments table
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

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert during registration" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view basic user info" ON users FOR SELECT USING (true);

-- Worker profiles policies
CREATE POLICY "Workers can manage own profile" ON worker_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view worker profiles" ON worker_profiles FOR SELECT USING (true);

-- Projects policies
CREATE POLICY "Anyone can view open projects" ON projects FOR SELECT USING (status = 'open' OR auth.uid() = client_id);
CREATE POLICY "Clients can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own projects" ON projects FOR UPDATE USING (auth.uid() = client_id);

-- Applications policies
CREATE POLICY "Workers can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Workers can view own applications" ON applications FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Clients can view applications to their projects" ON applications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));
CREATE POLICY "Clients can update applications" ON applications FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));

-- Contracts policies
CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT 
  USING (auth.uid() = worker_id OR EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));
CREATE POLICY "Clients can create contracts" ON contracts FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid()));

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT 
  USING (auth.uid() = payment_from OR auth.uid() = payment_to);

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_applications_worker_id ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_worker_id ON contracts(worker_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, is_read);

-- =====================================================
-- TRIGGERS
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
-- AUTO-CREATE WORKER PROFILE ON USER REGISTRATION
-- =====================================================

CREATE OR REPLACE FUNCTION create_worker_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_type = 'worker' THEN
    INSERT INTO worker_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_worker_profile_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_worker_profile_on_signup();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Complete schema installed successfully!';
  RAISE NOTICE 'Next: Run shifts_and_subscriptions.sql';
END $$;
