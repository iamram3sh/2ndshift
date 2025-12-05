-- Dashboard entities migration
-- Adds tables for kanban cards, analytics events, and enhances existing tables

-- Kanban Cards table (for client proposal management)
CREATE TABLE IF NOT EXISTS kanban_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('proposal', 'lead', 'project')),
  reference_id UUID NOT NULL,
  column_key VARCHAR(50) NOT NULL,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kanban_cards_client_id ON kanban_cards(client_id);
CREATE INDEX idx_kanban_cards_column_key ON kanban_cards(column_key);
CREATE INDEX idx_kanban_cards_reference_id ON kanban_cards(reference_id);

-- Analytics Events table (for tracking user actions and metrics)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB DEFAULT '{}',
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);

-- Enhance users table if needed (verification_status, hourly_rate, profile_summary)
-- These might already exist, so we use IF NOT EXISTS pattern
DO $$ 
BEGIN
  -- Add verification_status if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE users ADD COLUMN verification_status VARCHAR(20) DEFAULT 'unverified' 
      CHECK (verification_status IN ('unverified', 'pending', 'verified'));
  END IF;

  -- Add hourly_rate if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'hourly_rate'
  ) THEN
    ALTER TABLE users ADD COLUMN hourly_rate DECIMAL(10, 2);
  END IF;

  -- Add profile_summary if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'profile_summary'
  ) THEN
    ALTER TABLE users ADD COLUMN profile_summary TEXT;
  END IF;
END $$;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_hourly_rate ON users(hourly_rate);

-- Enhance projects/jobs table if needed (tags, industry_id)
DO $$
BEGIN
  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'tags'
  ) THEN
    ALTER TABLE jobs ADD COLUMN tags JSONB DEFAULT '[]';
  END IF;

  -- Add industry_id if it doesn't exist (category_id might already serve this purpose)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'industry_id'
  ) THEN
    ALTER TABLE jobs ADD COLUMN industry_id UUID REFERENCES categories(id);
  END IF;
END $$;

-- Create full-text search index for jobs
CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- Add indexes for proposals/applications
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker_id ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Add indexes for transactions (if transactions table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transactions') THEN
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
  END IF;
END $$;

-- Comments
COMMENT ON TABLE kanban_cards IS 'Kanban board cards for client proposal management';
COMMENT ON TABLE analytics_events IS 'User action tracking and analytics events';
COMMENT ON COLUMN kanban_cards.column_key IS 'Column identifier: contacted, negotiation, offer_sent, deal_closed';
COMMENT ON COLUMN analytics_events.event_type IS 'Event type: page_view, button_click, form_submit, etc.';
