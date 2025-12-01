-- 2ndShift Platform - Complete Database Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

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
  bid_type TEXT DEFAULT 'fixed' CHECK (bid_type IN ('fixed', 'hourly', 'milestone')),
  bid_amount NUMERIC(12,2),
  hourly_rate NUMERIC(10,2),
  estimated_hours NUMERIC(10,2),
  milestone_plan JSONB DEFAULT '[]',
  availability_date TIMESTAMPTZ,
  pitch_strength NUMERIC(5,2),
  auto_match_candidate BOOLEAN DEFAULT false,
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
-- KYC & COMPLIANCE TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  verification_type TEXT NOT NULL CHECK (
    verification_type IN ('pan', 'aadhaar', 'gst', 'bank_account', 'address', 'identity')
  ),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'verified', 'rejected', 'expired')
  ),
  risk_score NUMERIC(5,2) DEFAULT 0,
  reference_id TEXT,
  document_urls TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own kyc status" ON kyc_verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage kyc" ON kyc_verifications
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  );

-- =====================================================
-- ESCROW & PAYOUT ORCHESTRATION
-- =====================================================
CREATE TABLE IF NOT EXISTS escrow_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID UNIQUE REFERENCES contracts(id) ON DELETE CASCADE,
  balance NUMERIC(14,2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'inactive' CHECK (status IN ('inactive', 'funded', 'locked', 'released', 'closed')),
  last_funded_at TIMESTAMPTZ,
  last_released_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties can view escrow accounts" ON escrow_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts c
      JOIN projects p ON p.id = c.project_id
      WHERE c.id = escrow_accounts.contract_id AND (c.worker_id = auth.uid() OR p.client_id = auth.uid())
    )
  );

CREATE TABLE IF NOT EXISTS escrow_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escrow_account_id UUID REFERENCES escrow_accounts(id) ON DELETE CASCADE,
  initiated_by UUID REFERENCES users(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('fund', 'release', 'refund', 'fee', 'hold')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  amount NUMERIC(14,2) NOT NULL,
  razorpay_transfer_id TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties can view escrow transactions" ON escrow_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM escrow_accounts ea
      JOIN contracts c ON c.id = ea.contract_id
      WHERE ea.id = escrow_account_id AND (
        c.worker_id = auth.uid() OR
        EXISTS (SELECT 1 FROM projects WHERE id = c.project_id AND client_id = auth.uid())
      )
    )
  );

-- =====================================================
-- CONTRACT AUTOMATION (MILESTONES & DOCUMENTS)
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'released', 'blocked')),
  approval_notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties can view milestones" ON contract_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts c
      JOIN projects p ON p.id = c.project_id
      WHERE c.id = contract_milestones.contract_id AND (c.worker_id = auth.uid() OR p.client_id = auth.uid())
    )
  );

CREATE TABLE IF NOT EXISTS contract_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('nda', 'msa', 'sow', 'invoice', 'form16a')),
  storage_path TEXT NOT NULL,
  signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties can view contract documents" ON contract_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts c
      JOIN projects p ON p.id = c.project_id
      WHERE c.id = contract_documents.contract_id AND (c.worker_id = auth.uid() OR p.client_id = auth.uid())
    )
  );

-- =====================================================
-- COLLABORATION: CONVERSATIONS, MESSAGES, FILE VAULT
-- =====================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id),
  title TEXT,
  visibility TEXT DEFAULT 'participants' CHECK (visibility IN ('participants', 'platform', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view conversations" ON conversations
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects p WHERE p.id = conversations.project_id AND p.client_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM contracts c
      JOIN projects p ON p.id = c.project_id
      WHERE c.id = conversations.contract_id AND (c.worker_id = auth.uid() OR p.client_id = auth.uid())
    )
  );

CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'participant' CHECK (role IN ('participant', 'viewer', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view membership" ON conversation_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join conversations" ON conversation_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Conversation owners can manage memberships" ON conversation_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_members.conversation_id AND created_by = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  attachment_urls TEXT[] DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_flagged BOOLEAN DEFAULT false,
  ai_summary TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation members can read messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can send messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    ) AND auth.uid() = sender_id
  );

CREATE POLICY "Receivers can update receipt state" ON messages
  FOR UPDATE USING (auth.uid() = receiver_id);

CREATE TABLE IF NOT EXISTS secure_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  checksum TEXT,
  virus_scan_status TEXT DEFAULT 'pending' CHECK (virus_scan_status IN ('pending', 'clean', 'infected')),
  access_level TEXT DEFAULT 'participants' CHECK (access_level IN ('participants', 'platform', 'admin')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE secure_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view file info" ON secure_files
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Conversation members can view shared files" ON secure_files
  FOR SELECT USING (
    conversation_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM conversation_members WHERE conversation_id = secure_files.conversation_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- NOTIFICATIONS & EVENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  query JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own searches" ON saved_searches
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- AI MATCHING & RISK SIGNALS
-- =====================================================
CREATE TABLE IF NOT EXISTS talent_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  explanation TEXT,
  embedding VECTOR(768),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE talent_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view recommendations" ON talent_recommendations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE TABLE IF NOT EXISTS risk_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  triggered_by UUID REFERENCES users(id),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE risk_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view risk events" ON risk_events
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
CREATE INDEX IF NOT EXISTS idx_applications_bid_type ON applications(bid_type);
CREATE INDEX IF NOT EXISTS idx_contracts_worker_id ON contracts(worker_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_from ON payments(payment_from);
CREATE INDEX IF NOT EXISTS idx_payments_payment_to ON payments(payment_to);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_kyc_user_id ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_escrow_contract_id ON escrow_accounts(contract_id);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_account ON escrow_transactions(escrow_account_id);
CREATE INDEX IF NOT EXISTS idx_milestones_contract_id ON contract_milestones(contract_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contract_id ON conversations(contract_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_secure_files_owner_id ON secure_files(owner_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_project_id ON talent_recommendations(project_id);
CREATE INDEX IF NOT EXISTS idx_risk_events_contract_id ON risk_events(contract_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

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

CREATE TRIGGER update_kyc_updated_at BEFORE UPDATE ON kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escrow_accounts_updated_at BEFORE UPDATE ON escrow_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escrow_transactions_updated_at BEFORE UPDATE ON escrow_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_milestones_updated_at BEFORE UPDATE ON contract_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
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
