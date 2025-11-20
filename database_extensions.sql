-- =====================================================
-- 2ndShift Platform - Database Extensions
-- Critical Features: Reviews, Messaging, Verification, Disputes
-- Execute this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- REVIEWS & RATINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  response_text TEXT,
  is_visible BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contract_id, reviewer_id)
);

-- RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible reviews" ON reviews
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Users can create reviews for their contracts" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE id = contract_id 
      AND (worker_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM projects WHERE id = contracts.project_id AND client_id = auth.uid()))
    )
  );

CREATE POLICY "Reviewees can respond to their reviews" ON reviews
  FOR UPDATE USING (auth.uid() = reviewee_id);

CREATE POLICY "Admins can moderate reviews" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

-- =====================================================
-- VERIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('email', 'phone', 'pan', 'aadhar', 'bank_account', 'address')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  document_urls TEXT[],
  verification_data JSONB,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for verifications
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verifications" ON verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own verifications" ON verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verifications" ON verifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

CREATE POLICY "Admins can update verifications" ON verifications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  attachment_urls TEXT[],
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages" ON messages
  FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Admins can view all messages" ON messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('application', 'contract', 'payment', 'message', 'review', 'system', 'verification')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- DISPUTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  raised_by UUID REFERENCES users(id) ON DELETE CASCADE,
  against_user UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  resolution TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for disputes
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disputes" ON disputes
  FOR SELECT USING (auth.uid() = raised_by OR auth.uid() = against_user);

CREATE POLICY "Users can create disputes" ON disputes
  FOR INSERT WITH CHECK (auth.uid() = raised_by);

CREATE POLICY "Admins can manage all disputes" ON disputes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

-- =====================================================
-- REPORTS TABLE (flagged content)
-- =====================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_by UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_user UUID REFERENCES users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('user', 'project', 'message', 'review', 'profile')),
  reference_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
  reviewed_by UUID REFERENCES users(id),
  admin_notes TEXT,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = reported_by);

CREATE POLICY "Admins can manage all reports" ON reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

-- =====================================================
-- SAVED PROJECTS TABLE (bookmarks)
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- RLS for saved projects
ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved projects" ON saved_projects
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PLATFORM SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for platform settings
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage platform settings" ON platform_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type IN ('admin', 'superadmin'))
  );

CREATE POLICY "Anyone can view public settings" ON platform_settings
  FOR SELECT USING (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_verifications_user_id ON verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_type ON verifications(verification_type);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON disputes(raised_by);
CREATE INDEX IF NOT EXISTS idx_disputes_priority ON disputes(priority);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user ON reports(reported_user);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS FOR CALCULATIONS
-- =====================================================

-- Calculate average rating for a user
CREATE OR REPLACE FUNCTION get_user_average_rating(user_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT ROUND(AVG(rating)::numeric, 2)
  FROM reviews
  WHERE reviewee_id = user_uuid AND is_visible = true;
$$ LANGUAGE SQL STABLE;

-- Get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::integer
  FROM messages
  WHERE receiver_id = user_uuid AND is_read = false;
$$ LANGUAGE SQL STABLE;

-- Get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::integer
  FROM notifications
  WHERE user_id = user_uuid AND is_read = false;
$$ LANGUAGE SQL STABLE;

-- =====================================================
-- INITIAL PLATFORM SETTINGS
-- =====================================================
INSERT INTO platform_settings (setting_key, setting_value, description) VALUES
  ('platform_fee_percentage', '10', 'Platform commission percentage'),
  ('tds_percentage', '2', 'TDS deduction percentage'),
  ('min_project_budget', '5000', 'Minimum project budget in INR'),
  ('max_project_budget', '10000000', 'Maximum project budget in INR'),
  ('verification_required_for_withdrawal', 'true', 'Whether verification is required before withdrawal'),
  ('max_applications_per_project', '50', 'Maximum applications allowed per project'),
  ('review_cooldown_days', '7', 'Days after contract completion before review is allowed')
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- ADMIN ANALYTICS VIEWS
-- =====================================================

-- Enhanced admin stats view
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE user_type = 'worker') as total_workers,
  (SELECT COUNT(*) FROM users WHERE user_type = 'client') as total_clients,
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM projects WHERE status IN ('in_progress', 'assigned')) as active_projects,
  (SELECT COUNT(*) FROM projects WHERE status = 'completed') as completed_projects,
  (SELECT COUNT(*) FROM applications) as total_applications,
  (SELECT COUNT(*) FROM applications WHERE status = 'pending') as pending_applications,
  (SELECT COUNT(*) FROM contracts) as total_contracts,
  (SELECT COUNT(*) FROM contracts WHERE status = 'active') as active_contracts,
  (SELECT COALESCE(SUM(platform_fee), 0) FROM payments WHERE status = 'completed') as total_platform_revenue,
  (SELECT COALESCE(SUM(net_amount), 0) FROM payments WHERE status = 'completed') as total_worker_earnings,
  (SELECT COUNT(*) FROM reviews) as total_reviews,
  (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE is_visible = true) as average_platform_rating,
  (SELECT COUNT(*) FROM verifications WHERE status = 'pending') as pending_verifications,
  (SELECT COUNT(*) FROM disputes WHERE status IN ('open', 'under_review')) as active_disputes,
  (SELECT COUNT(*) FROM reports WHERE status = 'pending') as pending_reports;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database extensions created successfully!';
  RAISE NOTICE '📊 New tables: reviews, verifications, messages, notifications, disputes, reports, saved_projects, platform_settings';
  RAISE NOTICE '🔒 RLS policies applied to all tables';
  RAISE NOTICE '⚡ Indexes created for performance';
  RAISE NOTICE '🎯 Admin analytics views updated';
END $$;
