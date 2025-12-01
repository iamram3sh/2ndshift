-- ============================================
-- 2NDSHIFT - PAYMENT ESCROW SYSTEM
-- Secure payment locking for verified transactions
-- ============================================

-- ============================================
-- PAYMENT ESCROW STATUS
-- ============================================

CREATE TYPE escrow_status AS ENUM (
  'pending',           -- Waiting for client to fund
  'funded',            -- Client has locked funds
  'work_started',      -- Professional has started work
  'work_submitted',    -- Professional submitted for review
  'revision_requested',-- Client requested changes
  'approved',          -- Client approved the work
  'released',          -- Payment released to professional
  'disputed',          -- In dispute resolution
  'refunded',          -- Refunded to client
  'cancelled'          -- Cancelled before work started
);

-- ============================================
-- PAYMENT ESCROW TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS payment_escrow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id),
  professional_id UUID NOT NULL REFERENCES users(id),
  
  -- Amount Details
  total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),
  platform_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
  tds_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  gst_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  professional_payout DECIMAL(12,2) NOT NULL,
  
  -- Status
  status escrow_status DEFAULT 'pending',
  
  -- Payment Details
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  payment_method TEXT,
  funded_at TIMESTAMPTZ,
  
  -- Work Tracking
  work_started_at TIMESTAMPTZ,
  work_submitted_at TIMESTAMPTZ,
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 2,
  
  -- Approval
  approved_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  
  -- Performance Review (required before release)
  client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
  client_review TEXT,
  rating_submitted_at TIMESTAMPTZ,
  
  -- Dispute
  dispute_reason TEXT,
  dispute_opened_at TIMESTAMPTZ,
  dispute_resolved_at TIMESTAMPTZ,
  dispute_resolution TEXT,
  
  -- Refund
  refund_amount DECIMAL(12,2),
  refund_reason TEXT,
  refunded_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(contract_id)
);

-- ============================================
-- MILESTONE PAYMENTS (for larger projects)
-- ============================================

CREATE TABLE IF NOT EXISTS escrow_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_id UUID NOT NULL REFERENCES payment_escrow(id) ON DELETE CASCADE,
  
  milestone_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Amount
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  
  -- Status
  status escrow_status DEFAULT 'pending',
  
  -- Tracking
  due_date DATE,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  
  -- Rating for this milestone
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(escrow_id, milestone_number)
);

-- ============================================
-- PAYMENT RELEASE LOG
-- ============================================

CREATE TABLE IF NOT EXISTS payment_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_id UUID NOT NULL REFERENCES payment_escrow(id),
  milestone_id UUID REFERENCES escrow_milestones(id),
  
  amount DECIMAL(12,2) NOT NULL,
  platform_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
  tds_deducted DECIMAL(12,2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(12,2) NOT NULL,
  
  -- Transfer Details
  transfer_id TEXT,
  transfer_status TEXT,
  transferred_at TIMESTAMPTZ,
  
  -- Receipt
  invoice_number TEXT,
  invoice_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLATFORM CONFIGURATION
-- ============================================

CREATE TABLE IF NOT EXISTS platform_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO platform_config (key, value, description) VALUES
  ('platform_fee_percent', '10', 'Platform fee percentage'),
  ('tds_rate', '10', 'TDS rate for payments > 30000'),
  ('tds_threshold', '30000', 'TDS threshold amount'),
  ('gst_rate', '18', 'GST rate percentage'),
  ('min_escrow_amount', '500', 'Minimum escrow amount in INR'),
  ('max_revisions', '2', 'Default max revisions per project'),
  ('auto_release_days', '7', 'Days after approval to auto-release'),
  ('dispute_resolution_days', '14', 'Days to resolve disputes')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_escrow_contract ON payment_escrow(contract_id);
CREATE INDEX IF NOT EXISTS idx_escrow_client ON payment_escrow(client_id);
CREATE INDEX IF NOT EXISTS idx_escrow_professional ON payment_escrow(professional_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON payment_escrow(status);
CREATE INDEX IF NOT EXISTS idx_escrow_funded_at ON payment_escrow(funded_at);
CREATE INDEX IF NOT EXISTS idx_milestones_escrow ON escrow_milestones(escrow_id);
CREATE INDEX IF NOT EXISTS idx_releases_escrow ON payment_releases(escrow_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Calculate professional payout
CREATE OR REPLACE FUNCTION calculate_professional_payout(
  p_total_amount DECIMAL,
  p_platform_fee_percent DECIMAL DEFAULT 10,
  p_tds_rate DECIMAL DEFAULT 10,
  p_tds_threshold DECIMAL DEFAULT 30000
) RETURNS TABLE (
  platform_fee DECIMAL,
  tds_amount DECIMAL,
  professional_payout DECIMAL
) AS $$
DECLARE
  v_platform_fee DECIMAL;
  v_after_fee DECIMAL;
  v_tds DECIMAL;
BEGIN
  -- Calculate platform fee
  v_platform_fee := p_total_amount * (p_platform_fee_percent / 100);
  v_after_fee := p_total_amount - v_platform_fee;
  
  -- Calculate TDS (only if above threshold)
  IF v_after_fee > p_tds_threshold THEN
    v_tds := v_after_fee * (p_tds_rate / 100);
  ELSE
    v_tds := 0;
  END IF;
  
  RETURN QUERY SELECT 
    v_platform_fee,
    v_tds,
    v_after_fee - v_tds;
END;
$$ LANGUAGE plpgsql;

-- Create escrow for contract
CREATE OR REPLACE FUNCTION create_escrow_for_contract(
  p_contract_id UUID
) RETURNS UUID AS $$
DECLARE
  v_contract RECORD;
  v_payout RECORD;
  v_escrow_id UUID;
BEGIN
  -- Get contract details
  SELECT * INTO v_contract FROM contracts WHERE id = p_contract_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contract not found';
  END IF;
  
  -- Calculate payout
  SELECT * INTO v_payout FROM calculate_professional_payout(v_contract.contract_amount);
  
  -- Create escrow
  INSERT INTO payment_escrow (
    contract_id, project_id, client_id, professional_id,
    total_amount, platform_fee, tds_amount, professional_payout,
    status
  ) VALUES (
    v_contract.id, v_contract.project_id, 
    (SELECT client_id FROM projects WHERE id = v_contract.project_id),
    v_contract.worker_id,
    v_contract.contract_amount, v_payout.platform_fee, 
    v_payout.tds_amount, v_payout.professional_payout,
    'pending'
  ) RETURNING id INTO v_escrow_id;
  
  RETURN v_escrow_id;
END;
$$ LANGUAGE plpgsql;

-- Fund escrow
CREATE OR REPLACE FUNCTION fund_escrow(
  p_escrow_id UUID,
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_payment_method TEXT DEFAULT 'razorpay'
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE payment_escrow SET
    status = 'funded',
    razorpay_order_id = p_razorpay_order_id,
    razorpay_payment_id = p_razorpay_payment_id,
    payment_method = p_payment_method,
    funded_at = NOW(),
    updated_at = NOW()
  WHERE id = p_escrow_id AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Submit work for review
CREATE OR REPLACE FUNCTION submit_work_for_review(
  p_escrow_id UUID,
  p_professional_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE payment_escrow SET
    status = 'work_submitted',
    work_submitted_at = NOW(),
    updated_at = NOW()
  WHERE id = p_escrow_id 
    AND professional_id = p_professional_id
    AND status IN ('funded', 'work_started', 'revision_requested');
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Approve work and release payment
CREATE OR REPLACE FUNCTION approve_and_release_payment(
  p_escrow_id UUID,
  p_client_id UUID,
  p_rating INTEGER,
  p_review TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_escrow RECORD;
BEGIN
  -- Validate
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  -- Get escrow
  SELECT * INTO v_escrow FROM payment_escrow 
  WHERE id = p_escrow_id AND client_id = p_client_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Escrow not found or unauthorized';
  END IF;
  
  IF v_escrow.status != 'work_submitted' THEN
    RAISE EXCEPTION 'Work must be submitted before approval';
  END IF;
  
  -- Update escrow
  UPDATE payment_escrow SET
    status = 'released',
    client_rating = p_rating,
    client_review = p_review,
    rating_submitted_at = NOW(),
    approved_at = NOW(),
    released_at = NOW(),
    updated_at = NOW()
  WHERE id = p_escrow_id;
  
  -- Create payment release record
  INSERT INTO payment_releases (
    escrow_id, amount, platform_fee, tds_deducted, net_amount
  ) VALUES (
    p_escrow_id, v_escrow.total_amount, v_escrow.platform_fee, 
    v_escrow.tds_amount, v_escrow.professional_payout
  );
  
  -- Update contract status
  UPDATE contracts SET 
    status = 'completed',
    completed_at = NOW()
  WHERE id = v_escrow.contract_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Request revision
CREATE OR REPLACE FUNCTION request_revision(
  p_escrow_id UUID,
  p_client_id UUID,
  p_feedback TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_escrow RECORD;
BEGIN
  SELECT * INTO v_escrow FROM payment_escrow 
  WHERE id = p_escrow_id AND client_id = p_client_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Escrow not found or unauthorized';
  END IF;
  
  IF v_escrow.revision_count >= v_escrow.max_revisions THEN
    RAISE EXCEPTION 'Maximum revisions reached';
  END IF;
  
  UPDATE payment_escrow SET
    status = 'revision_requested',
    revision_count = revision_count + 1,
    updated_at = NOW()
  WHERE id = p_escrow_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE payment_escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_releases ENABLE ROW LEVEL SECURITY;

-- Escrow: Client and professional can view their own
CREATE POLICY escrow_view_policy ON payment_escrow
  FOR SELECT USING (
    auth.uid() = client_id OR auth.uid() = professional_id
  );

-- Escrow: Only authenticated users can insert (through functions)
CREATE POLICY escrow_insert_policy ON payment_escrow
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Milestones: Same as escrow
CREATE POLICY milestones_view_policy ON escrow_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM payment_escrow e 
      WHERE e.id = escrow_id 
        AND (e.client_id = auth.uid() OR e.professional_id = auth.uid())
    )
  );

-- Releases: Same as escrow
CREATE POLICY releases_view_policy ON payment_releases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM payment_escrow e 
      WHERE e.id = escrow_id 
        AND (e.client_id = auth.uid() OR e.professional_id = auth.uid())
    )
  );
