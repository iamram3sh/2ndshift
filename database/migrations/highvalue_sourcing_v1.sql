-- =====================================================
-- 2ndShift High-Value Microtasks & Sourcing System V1
-- Migration: Add sourcing, priority pool, and alert tables
-- =====================================================

-- Worker Availability Table
CREATE TABLE IF NOT EXISTS worker_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  availability JSONB DEFAULT '{}',
  open_to_work BOOLEAN DEFAULT false,
  priority_tier TEXT DEFAULT 'standard' CHECK (priority_tier IN ('standard', 'priority', 'elite')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_worker_availability_user ON worker_availability(user_id);
CREATE INDEX IF NOT EXISTS idx_worker_availability_open ON worker_availability(open_to_work) WHERE open_to_work = true;
CREATE INDEX IF NOT EXISTS idx_worker_availability_tier ON worker_availability(priority_tier);
CREATE INDEX IF NOT EXISTS idx_worker_availability_availability_gin ON worker_availability USING gin(availability);

-- Priority Pool Members Table
CREATE TABLE IF NOT EXISTS priority_pool_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('standard', 'priority', 'elite')),
  credits_locked BOOLEAN DEFAULT false,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tier)
);

CREATE INDEX IF NOT EXISTS idx_priority_pool_user ON priority_pool_members(user_id);
CREATE INDEX IF NOT EXISTS idx_priority_pool_tier ON priority_pool_members(tier);

-- Sourcing Requests Table
CREATE TABLE IF NOT EXISTS sourcing_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flags JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'escalated', 'in_progress', 'fulfilled', 'closed')),
  escalate_after_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sourcing_requests_job ON sourcing_requests(job_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_requests_client ON sourcing_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_requests_status ON sourcing_requests(status);
CREATE INDEX IF NOT EXISTS idx_sourcing_requests_created ON sourcing_requests(created_at DESC);

-- Sourcing Matches Table
CREATE TABLE IF NOT EXISTS sourcing_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES sourcing_requests(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score DECIMAL(5, 2) DEFAULT 0,
  contacted BOOLEAN DEFAULT false,
  contact_method TEXT,
  response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sourcing_matches_request ON sourcing_matches(request_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_matches_worker ON sourcing_matches(worker_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_matches_score ON sourcing_matches(score DESC);
CREATE INDEX IF NOT EXISTS idx_sourcing_matches_contacted ON sourcing_matches(contacted);

-- Alert Events Table
CREATE TABLE IF NOT EXISTS alert_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'whatsapp')),
  delivered_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_events_user ON alert_events(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_events_job ON alert_events(job_id);
CREATE INDEX IF NOT EXISTS idx_alert_events_delivered ON alert_events(delivered_at);
CREATE INDEX IF NOT EXISTS idx_alert_events_responded ON alert_events(responded_at);

-- Update Jobs Table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_hard_to_find BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS sourcing_status TEXT DEFAULT NULL CHECK (sourcing_status IN ('auto_match', 'sourcing_requested', 'escalated', 'fulfilled', 'closed'));

CREATE INDEX IF NOT EXISTS idx_jobs_hard_to_find ON jobs(is_hard_to_find) WHERE is_hard_to_find = true;
CREATE INDEX IF NOT EXISTS idx_jobs_sourcing_status ON jobs(sourcing_status);

-- Add GIN index on skills JSONB in profiles if not exists
CREATE INDEX IF NOT EXISTS idx_profiles_skills_gin ON profiles USING gin(skills);

-- Add updated_at trigger for worker_availability
CREATE OR REPLACE FUNCTION update_worker_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_worker_availability_updated_at ON worker_availability;
CREATE TRIGGER update_worker_availability_updated_at
  BEFORE UPDATE ON worker_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_availability_updated_at();

-- Add updated_at trigger for sourcing_requests
CREATE OR REPLACE FUNCTION update_sourcing_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_sourcing_requests_updated_at ON sourcing_requests;
CREATE TRIGGER update_sourcing_requests_updated_at
  BEFORE UPDATE ON sourcing_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_sourcing_requests_updated_at();

-- RLS Policies
ALTER TABLE worker_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE priority_pool_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_events ENABLE ROW LEVEL SECURITY;

-- Worker availability: users can read/update their own
DROP POLICY IF EXISTS worker_availability_own ON worker_availability;
CREATE POLICY worker_availability_own ON worker_availability
  FOR ALL USING (auth.uid() = user_id);

-- Worker availability: public read for open_to_work
DROP POLICY IF EXISTS worker_availability_public_read ON worker_availability;
CREATE POLICY worker_availability_public_read ON worker_availability
  FOR SELECT USING (open_to_work = true);

-- Priority pool: users can read their own
DROP POLICY IF EXISTS priority_pool_own ON priority_pool_members;
CREATE POLICY priority_pool_own ON priority_pool_members
  FOR SELECT USING (auth.uid() = user_id);

-- Sourcing requests: clients can read their own, admins can read all
DROP POLICY IF EXISTS sourcing_requests_own ON sourcing_requests;
CREATE POLICY sourcing_requests_own ON sourcing_requests
  FOR SELECT USING (auth.uid() = client_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin'
  ));

-- Sourcing matches: admins and related users can read
DROP POLICY IF EXISTS sourcing_matches_read ON sourcing_matches;
CREATE POLICY sourcing_matches_read ON sourcing_matches
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
    OR EXISTS (SELECT 1 FROM sourcing_requests WHERE id = request_id AND client_id = auth.uid())
    OR worker_id = auth.uid()
  );

-- Alert events: users can read their own
DROP POLICY IF EXISTS alert_events_own ON alert_events;
CREATE POLICY alert_events_own ON alert_events
  FOR SELECT USING (auth.uid() = user_id);

COMMENT ON TABLE worker_availability IS 'Worker availability and priority tier tracking';
COMMENT ON TABLE priority_pool_members IS 'Priority pool membership for high-value sourcing';
COMMENT ON TABLE sourcing_requests IS 'Human-assisted sourcing requests for hard-to-fill jobs';
COMMENT ON TABLE sourcing_matches IS 'Worker matches for sourcing requests with contact tracking';
COMMENT ON TABLE alert_events IS 'Alert delivery and response tracking for job notifications';
