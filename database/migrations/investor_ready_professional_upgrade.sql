-- =====================================================
-- INVESTOR-READY PROFESSIONAL PLATFORM UPGRADE
-- Complete trust, verification, and engagement system
-- =====================================================

-- =====================================================
-- 1. ENHANCED USER PROFILES WITH MANDATORY FIELDS
-- =====================================================

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE users ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'offline' CHECK (availability_status IN ('online', 'away', 'offline', 'busy', 'available'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0 CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100);

-- Add verification fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS government_id_type TEXT CHECK (government_id_type IN ('aadhaar', 'pan', 'passport', 'driving_license'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS government_id_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS government_id_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_proof_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES users(id);

-- Trust badges
ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';

-- =====================================================
-- 2. ENHANCED WORKER PROFILES
-- =====================================================

ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS tagline TEXT; -- Short professional headline
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS work_samples JSONB DEFAULT '[]';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS worker_references JSONB DEFAULT '[]';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS total_earnings NUMERIC(12,2) DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS completed_projects INTEGER DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS success_rate NUMERIC(5,2) DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS avg_rating NUMERIC(3,2) DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS response_time_minutes INTEGER DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS verification_level INTEGER DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 6);

-- =====================================================
-- 3. CLIENT PROFILES TABLE (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Company Information
  company_name TEXT NOT NULL,
  company_type TEXT CHECK (company_type IN ('individual', 'startup', 'sme', 'enterprise', 'government')),
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
  founded_year INTEGER,
  company_logo_url TEXT,
  company_description TEXT,
  website_url TEXT,
  linkedin_url TEXT,
  
  -- Contact Information
  primary_contact_name TEXT,
  designation TEXT,
  business_address TEXT,
  
  -- Verification Documents
  gst_number TEXT,
  pan_number TEXT,
  company_registration_number TEXT,
  gst_certificate_url TEXT,
  company_registration_url TEXT,
  pan_card_url TEXT,
  
  -- Business Metrics
  total_spent NUMERIC(12,2) DEFAULT 0,
  projects_posted INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  payment_success_rate NUMERIC(5,2) DEFAULT 100,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verification_level INTEGER DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 6),
  
  -- Preferences
  preferred_budget_range_min NUMERIC(12,2),
  preferred_budget_range_max NUMERIC(12,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for client_profiles
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own profile" ON client_profiles;
CREATE POLICY "Clients can view own profile" ON client_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can update own profile" ON client_profiles;
CREATE POLICY "Clients can update own profile" ON client_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can insert own profile" ON client_profiles;
CREATE POLICY "Clients can insert own profile" ON client_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view verified clients" ON client_profiles;
CREATE POLICY "Public can view verified clients" ON client_profiles
  FOR SELECT USING (is_verified = true);

DROP POLICY IF EXISTS "Admins can view all client profiles" ON client_profiles;
CREATE POLICY "Admins can view all client profiles" ON client_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  );

-- =====================================================
-- 4. CERTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Certificate Details
  certificate_name TEXT NOT NULL,
  certificate_type TEXT CHECK (certificate_type IN ('educational', 'professional', 'platform', 'trade_license')),
  issuing_organization TEXT NOT NULL,
  certificate_url TEXT,
  certificate_id TEXT,
  
  -- Validity
  issue_date DATE,
  expiry_date DATE,
  is_lifetime BOOLEAN DEFAULT false,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for certifications
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own certifications" ON certifications;
CREATE POLICY "Users can manage own certifications" ON certifications
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view verified certifications" ON certifications;
CREATE POLICY "Public can view verified certifications" ON certifications
  FOR SELECT USING (is_verified = true);

DROP POLICY IF EXISTS "Admins can manage all certifications" ON certifications;
CREATE POLICY "Admins can manage all certifications" ON certifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  );

-- =====================================================
-- 5. REVIEWS & RATINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Rating (1-5 stars)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  -- Detailed ratings (for workers)
  skill_rating INTEGER CHECK (skill_rating >= 1 AND skill_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  
  -- Detailed ratings (for clients)
  payment_promptness_rating INTEGER CHECK (payment_promptness_rating >= 1 AND payment_promptness_rating <= 5),
  clarity_rating INTEGER CHECK (clarity_rating >= 1 AND clarity_rating <= 5),
  
  -- Review text
  review_text TEXT NOT NULL,
  pros TEXT,
  cons TEXT,
  
  -- Badges/tags
  tags TEXT[] DEFAULT '{}',
  
  -- Would recommend
  would_recommend BOOLEAN,
  
  -- Response from reviewee
  response TEXT,
  response_date TIMESTAMPTZ,
  
  -- Moderation
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  is_visible BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view visible reviews" ON reviews;
CREATE POLICY "Anyone can view visible reviews" ON reviews
  FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Users can create reviews for completed contracts" ON reviews;
CREATE POLICY "Users can create reviews for completed contracts" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE id = contract_id 
      AND status = 'completed'
      AND (worker_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM projects WHERE id = contracts.project_id AND client_id = auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Reviewees can respond to reviews" ON reviews;
CREATE POLICY "Reviewees can respond to reviews" ON reviews
  FOR UPDATE USING (auth.uid() = reviewee_id);

-- =====================================================
-- 6. VERIFICATION REQUESTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Request type
  verification_type TEXT NOT NULL CHECK (verification_type IN (
    'identity', 'phone', 'email', 'business', 'certification', 'background_check'
  )),
  
  -- Documents
  documents JSONB DEFAULT '[]',
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'more_info_needed')),
  
  -- Admin review
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  rejection_reason TEXT,
  
  -- Communication
  user_notes TEXT,
  additional_info_requested TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for verification_requests
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own verification requests" ON verification_requests;
CREATE POLICY "Users can manage own verification requests" ON verification_requests
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all verification requests" ON verification_requests;
CREATE POLICY "Admins can manage all verification requests" ON verification_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  );

-- =====================================================
-- 7. NOTIFICATIONS TABLE (Enhanced)
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT NOT NULL CHECK (type IN (
    'system', 'message', 'application', 'contract', 'payment', 
    'review', 'verification', 'job_alert', 'project_update'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Priority
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Data
  data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 8. USER ACTIVITY LOG
-- =====================================================

CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Activity details
  activity_type TEXT NOT NULL,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for activity log
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own activity" ON user_activity_log;
CREATE POLICY "Users can view own activity" ON user_activity_log
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all activity" ON user_activity_log;
CREATE POLICY "Admins can view all activity" ON user_activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  );

-- =====================================================
-- 9. SAVED PROJECTS TABLE (Enhanced)
-- =====================================================

CREATE TABLE IF NOT EXISTS saved_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- RLS for saved_projects
ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own saved projects" ON saved_projects;
CREATE POLICY "Users can manage own saved projects" ON saved_projects
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 10. MESSAGES TABLE (Anonymous Communication)
-- =====================================================

-- Check if messages table exists and add missing columns
DO $$ 
BEGIN
  -- Add recipient_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'recipient_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN recipient_id UUID REFERENCES users(id) ON DELETE CASCADE;
  END IF;
  
  -- Add conversation_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'conversation_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN conversation_id UUID;
  END IF;
  
  -- Add attachments if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE messages ADD COLUMN attachments JSONB DEFAULT '[]';
  END IF;
  
  -- Add is_anonymous if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'is_anonymous'
  ) THEN
    ALTER TABLE messages ADD COLUMN is_anonymous BOOLEAN DEFAULT true;
  END IF;
  
  -- Add sender_display_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'sender_display_name'
  ) THEN
    ALTER TABLE messages ADD COLUMN sender_display_name TEXT;
  END IF;
  
  -- Add is_deleted_by_sender if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'is_deleted_by_sender'
  ) THEN
    ALTER TABLE messages ADD COLUMN is_deleted_by_sender BOOLEAN DEFAULT false;
  END IF;
  
  -- Add is_deleted_by_recipient if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'is_deleted_by_recipient'
  ) THEN
    ALTER TABLE messages ADD COLUMN is_deleted_by_recipient BOOLEAN DEFAULT false;
  END IF;
  
  -- Add is_flagged if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'is_flagged'
  ) THEN
    ALTER TABLE messages ADD COLUMN is_flagged BOOLEAN DEFAULT false;
  END IF;
  
  -- Add flag_reason if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'flag_reason'
  ) THEN
    ALTER TABLE messages ADD COLUMN flag_reason TEXT;
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    (recipient_id IS NOT NULL AND auth.uid() = recipient_id)
  );

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update own messages" ON messages;
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (
    auth.uid() = sender_id OR 
    (recipient_id IS NOT NULL AND auth.uid() = recipient_id)
  );

-- =====================================================
-- 11. ENHANCED APPLICATIONS TABLE
-- =====================================================

ALTER TABLE applications ADD COLUMN IF NOT EXISTS proposed_timeline_days INTEGER;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS portfolio_links JSONB DEFAULT '[]';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS questions_answers JSONB DEFAULT '[]';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS viewed_by_client BOOLEAN DEFAULT false;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS shortlisted BOOLEAN DEFAULT false;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- =====================================================
-- 12. INDEXES FOR NEW TABLES
-- =====================================================

-- Indexes with IF NOT EXISTS are safe, but let's be extra cautious
DO $$ 
BEGIN
  -- Client profiles indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_client_profiles_user_id') THEN
    CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);
  END IF;
  
  -- Certifications indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_certifications_user_id') THEN
    CREATE INDEX idx_certifications_user_id ON certifications(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_certifications_verified') THEN
    CREATE INDEX idx_certifications_verified ON certifications(is_verified);
  END IF;
  
  -- Reviews indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reviews_reviewee_id') THEN
    CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reviews_reviewer_id') THEN
    CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_reviews_contract_id') THEN
    CREATE INDEX idx_reviews_contract_id ON reviews(contract_id);
  END IF;
  
  -- Verification requests indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_verification_requests_user_id') THEN
    CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_verification_requests_status') THEN
    CREATE INDEX idx_verification_requests_status ON verification_requests(status);
  END IF;
  
  -- Notifications indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user_id') THEN
    CREATE INDEX idx_notifications_user_id ON notifications(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_read') THEN
    CREATE INDEX idx_notifications_read ON notifications(is_read);
  END IF;
  
  -- Messages indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_conversation') THEN
    CREATE INDEX idx_messages_conversation ON messages(conversation_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_sender') THEN
    CREATE INDEX idx_messages_sender ON messages(sender_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_recipient') THEN
    CREATE INDEX idx_messages_recipient ON messages(recipient_id);
  END IF;
  
  -- User activity indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_activity_user_id') THEN
    CREATE INDEX idx_user_activity_user_id ON user_activity_log(user_id);
  END IF;
  
  -- Users table indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_online_status') THEN
    CREATE INDEX idx_users_online_status ON users(is_online);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_verification_status') THEN
    CREATE INDEX idx_users_verification_status ON users(verification_status);
  END IF;
END $$;

-- =====================================================
-- 13. TRIGGERS FOR UPDATED_AT
-- =====================================================

DROP TRIGGER IF EXISTS update_client_profiles_updated_at ON client_profiles;
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_certifications_updated_at ON certifications;
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_verification_requests_updated_at ON verification_requests;
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 14. FUNCTIONS FOR PROFILE COMPLETION
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_worker_profile_completion(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  completion INTEGER := 0;
  user_record RECORD;
  profile_record RECORD;
BEGIN
  -- Get user data
  SELECT * INTO user_record FROM users WHERE id = user_uuid;
  SELECT * INTO profile_record FROM worker_profiles WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Personal Information (25 points)
  IF user_record.full_name IS NOT NULL THEN completion := completion + 3; END IF;
  IF user_record.email IS NOT NULL AND user_record.email_verified THEN completion := completion + 4; END IF;
  IF user_record.phone IS NOT NULL AND user_record.phone_verified THEN completion := completion + 4; END IF;
  IF user_record.date_of_birth IS NOT NULL THEN completion := completion + 2; END IF;
  IF user_record.gender IS NOT NULL THEN completion := completion + 2; END IF;
  IF user_record.profile_photo_url IS NOT NULL THEN completion := completion + 5; END IF;
  IF user_record.city IS NOT NULL AND user_record.state IS NOT NULL THEN completion := completion + 3; END IF;
  IF user_record.address IS NOT NULL THEN completion := completion + 2; END IF;
  
  -- Professional Information (30 points)
  IF profile_record.profession IS NOT NULL THEN completion := completion + 5; END IF;
  IF profile_record.experience_years > 0 THEN completion := completion + 5; END IF;
  IF array_length(profile_record.skills, 1) >= 3 THEN completion := completion + 7; END IF;
  IF profile_record.hourly_rate > 0 THEN completion := completion + 3; END IF;
  IF profile_record.bio IS NOT NULL AND length(profile_record.bio) >= 100 THEN completion := completion + 10; END IF;
  
  -- Verification (25 points)
  IF user_record.government_id_url IS NOT NULL THEN completion := completion + 10; END IF;
  IF user_record.address_proof_url IS NOT NULL THEN completion := completion + 10; END IF;
  IF user_record.verification_status = 'verified' THEN completion := completion + 5; END IF;
  
  -- Additional (20 points)
  IF profile_record.portfolio_url IS NOT NULL OR profile_record.website_url IS NOT NULL THEN completion := completion + 5; END IF;
  IF EXISTS (SELECT 1 FROM certifications WHERE user_id = user_uuid AND is_verified = true) THEN completion := completion + 10; END IF;
  IF jsonb_array_length(profile_record.worker_references) >= 2 THEN completion := completion + 5; END IF;
  
  RETURN LEAST(completion, 100);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_client_profile_completion(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  completion INTEGER := 0;
  user_record RECORD;
  profile_record RECORD;
BEGIN
  -- Get user data
  SELECT * INTO user_record FROM users WHERE id = user_uuid;
  SELECT * INTO profile_record FROM client_profiles WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Company Information (30 points)
  IF profile_record.company_name IS NOT NULL THEN completion := completion + 5; END IF;
  IF profile_record.company_type IS NOT NULL THEN completion := completion + 3; END IF;
  IF profile_record.industry IS NOT NULL THEN completion := completion + 3; END IF;
  IF profile_record.company_logo_url IS NOT NULL THEN completion := completion + 5; END IF;
  IF profile_record.company_description IS NOT NULL AND length(profile_record.company_description) >= 50 THEN completion := completion + 7; END IF;
  IF profile_record.website_url IS NOT NULL THEN completion := completion + 4; END IF;
  IF profile_record.founded_year IS NOT NULL THEN completion := completion + 3; END IF;
  
  -- Contact Information (25 points)
  IF user_record.full_name IS NOT NULL THEN completion := completion + 5; END IF;
  IF user_record.email IS NOT NULL AND user_record.email_verified THEN completion := completion + 7; END IF;
  IF user_record.phone IS NOT NULL AND user_record.phone_verified THEN completion := completion + 7; END IF;
  IF profile_record.business_address IS NOT NULL THEN completion := completion + 6; END IF;
  
  -- Verification (30 points)
  IF profile_record.gst_number IS NOT NULL THEN completion := completion + 10; END IF;
  IF profile_record.company_registration_number IS NOT NULL THEN completion := completion + 10; END IF;
  IF profile_record.pan_number IS NOT NULL THEN completion := completion + 5; END IF;
  IF user_record.verification_status = 'verified' THEN completion := completion + 5; END IF;
  
  -- Additional (15 points)
  IF profile_record.linkedin_url IS NOT NULL THEN completion := completion + 5; END IF;
  IF profile_record.company_size IS NOT NULL THEN completion := completion + 5; END IF;
  IF profile_record.designation IS NOT NULL THEN completion := completion + 5; END IF;
  
  RETURN LEAST(completion, 100);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 15. FUNCTION TO UPDATE PROFILE COMPLETION
-- =====================================================

CREATE OR REPLACE FUNCTION update_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  completion INTEGER;
BEGIN
  IF NEW.user_type = 'worker' THEN
    completion := calculate_worker_profile_completion(NEW.id);
  ELSIF NEW.user_type = 'client' THEN
    completion := calculate_client_profile_completion(NEW.id);
  ELSE
    completion := 0;
  END IF;
  
  UPDATE users SET profile_completion_percentage = completion WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on users table
DROP TRIGGER IF EXISTS trigger_update_profile_completion ON users CASCADE;
CREATE TRIGGER trigger_update_profile_completion
  AFTER INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();

-- Trigger on worker_profiles table
DROP TRIGGER IF EXISTS trigger_update_worker_profile_completion ON worker_profiles CASCADE;
CREATE TRIGGER trigger_update_worker_profile_completion
  AFTER INSERT OR UPDATE ON worker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();

-- Trigger on client_profiles table
DROP TRIGGER IF EXISTS trigger_update_client_profile_completion ON client_profiles CASCADE;
CREATE TRIGGER trigger_update_client_profile_completion
  AFTER INSERT OR UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();

-- =====================================================
-- 16. FUNCTION TO UPDATE ONLINE STATUS
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_online_status(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET 
    is_online = true,
    last_seen = NOW(),
    availability_status = 'online'
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 17. ADMIN ANALYTICS VIEWS
-- =====================================================

DROP VIEW IF EXISTS verification_queue CASCADE;
CREATE OR REPLACE VIEW verification_queue AS
SELECT 
  vr.id,
  vr.user_id,
  u.full_name,
  u.email,
  u.user_type,
  vr.verification_type,
  vr.status,
  vr.created_at,
  vr.documents
FROM verification_requests vr
JOIN users u ON u.id = vr.user_id
WHERE vr.status IN ('pending', 'in_review')
ORDER BY vr.created_at ASC;

DROP VIEW IF EXISTS user_engagement_stats CASCADE;
CREATE OR REPLACE VIEW user_engagement_stats AS
SELECT
  u.id as user_id,
  u.full_name,
  u.email,
  u.user_type,
  u.profile_completion_percentage,
  u.verification_status,
  u.is_online,
  u.last_seen,
  u.created_at as joined_date,
  CASE 
    WHEN u.user_type = 'worker' THEN wp.completed_projects
    WHEN u.user_type = 'client' THEN cp.projects_completed
    ELSE 0
  END as completed_projects,
  CASE
    WHEN u.user_type = 'worker' THEN wp.total_earnings
    WHEN u.user_type = 'client' THEN cp.total_spent
    ELSE 0
  END as total_transaction_value
FROM users u
LEFT JOIN worker_profiles wp ON wp.user_id = u.id
LEFT JOIN client_profiles cp ON cp.user_id = u.id;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Investor-Ready Professional Upgrade completed successfully!';
  RAISE NOTICE '📊 New features:';
  RAISE NOTICE '   • Enhanced user profiles with mandatory fields';
  RAISE NOTICE '   • Complete verification system';
  RAISE NOTICE '   • Profile completion tracking';
  RAISE NOTICE '   • Online/offline status';
  RAISE NOTICE '   • Certification management';
  RAISE NOTICE '   • Reviews & ratings';
  RAISE NOTICE '   • Anonymous messaging';
  RAISE NOTICE '   • Admin verification panel';
  RAISE NOTICE '   • Professional dashboards ready';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Your platform is now investor-ready!';
END $$;
