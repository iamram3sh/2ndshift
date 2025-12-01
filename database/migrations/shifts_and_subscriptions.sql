-- ============================================
-- 2NDSHIFT - SHIFTS & SUBSCRIPTIONS SCHEMA
-- Premium Credits and Subscription Management
-- ============================================

-- ============================================
-- SHIFTS BALANCE TABLE
-- Tracks user's current Shifts balance
-- ============================================
CREATE TABLE IF NOT EXISTS shifts_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  free_balance INTEGER NOT NULL DEFAULT 0 CHECK (free_balance >= 0),
  lifetime_purchased INTEGER NOT NULL DEFAULT 0,
  lifetime_used INTEGER NOT NULL DEFAULT 0,
  last_free_credit_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- SHIFTS TRANSACTIONS TABLE
-- Log of all Shifts purchases and usage
-- ============================================
CREATE TYPE shifts_transaction_type AS ENUM (
  'purchase',        -- Bought Shifts
  'free_credit',     -- Monthly free Shifts
  'referral_bonus',  -- Bonus from referral
  'promo_credit',    -- Promotional credits
  'boost_profile',   -- Used for profile boost
  'boost_application', -- Used to boost application
  'direct_message',  -- Used to message client/worker
  'feature_job',     -- Used to feature a job
  'urgent_badge',    -- Used for urgent badge
  'direct_invite',   -- Used to invite a worker
  'ai_recommendation', -- Used for AI recommendations
  'refund',          -- Refunded Shifts
  'expired'          -- Free Shifts that expired
);

CREATE TABLE IF NOT EXISTS shifts_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type shifts_transaction_type NOT NULL,
  amount INTEGER NOT NULL, -- Positive for credits, negative for debits
  balance_after INTEGER NOT NULL,
  description TEXT,
  reference_id UUID, -- Links to related entity (project_id, application_id, etc.)
  reference_type TEXT, -- 'project', 'application', 'message', etc.
  payment_id UUID, -- Links to payment record if purchase
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SHIFTS PACKAGES TABLE
-- Available Shifts packages for purchase
-- ============================================
CREATE TABLE IF NOT EXISTS shifts_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  shifts_amount INTEGER NOT NULL,
  price_inr INTEGER NOT NULL, -- Price in paise (100 = ₹1)
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'client', 'both')),
  is_popular BOOLEAN DEFAULT FALSE,
  discount_percent INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default packages
INSERT INTO shifts_packages (name, shifts_amount, price_inr, user_type, is_popular, discount_percent) VALUES
  ('Starter', 10, 9900, 'worker', false, 0),
  ('Popular', 25, 19900, 'worker', true, 20),
  ('Value', 50, 34900, 'worker', false, 30),
  ('Pro', 100, 59900, 'worker', false, 40),
  ('Starter', 10, 14900, 'client', false, 0),
  ('Popular', 25, 29900, 'client', true, 20),
  ('Value', 50, 49900, 'client', false, 30),
  ('Pro', 100, 84900, 'client', false, 40)
ON CONFLICT DO NOTHING;

-- ============================================
-- SUBSCRIPTION PLANS TABLE
-- Available subscription tiers
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'client')),
  price_monthly_inr INTEGER NOT NULL, -- Price in paise
  price_yearly_inr INTEGER, -- Optional yearly pricing
  platform_fee_percent DECIMAL(5,2) NOT NULL,
  free_shifts_monthly INTEGER NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (name, slug, user_type, price_monthly_inr, platform_fee_percent, free_shifts_monthly, features) VALUES
  ('Free', 'worker-free', 'worker', 0, 10.00, 5, '["Create professional profile", "Apply to unlimited projects", "Basic search visibility", "Email support"]'),
  ('Professional', 'worker-professional', 'worker', 49900, 8.00, 30, '["Everything in Free", "Profile boost (1 week/month)", "Featured in recommendations", "Priority in search", "Skills verification badges", "Priority support"]'),
  ('Expert', 'worker-expert', 'worker', 99900, 5.00, 100, '["Everything in Professional", "Permanent profile boost", "Top placement in searches", "Expert badge", "Early access to premium projects", "Dedicated account manager", "Phone support"]'),
  ('Starter', 'client-starter', 'client', 0, 12.00, 5, '["Post unlimited projects", "Access to all professionals", "Basic filters and search", "Email support"]'),
  ('Business', 'client-business', 'client', 149900, 10.00, 50, '["Everything in Starter", "3 featured job listings/month", "AI-powered recommendations", "Advanced filters & analytics", "Priority matching", "Priority support"]'),
  ('Enterprise', 'client-enterprise', 'client', 0, 5.00, 0, '["Everything in Business", "Custom platform fee", "Unlimited Shifts", "Unlimited featured listings", "Custom integrations (API)", "Dedicated account manager", "Custom contracts & SLA"]')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- USER SUBSCRIPTIONS TABLE
-- Tracks active user subscriptions
-- ============================================
CREATE TYPE subscription_status AS ENUM (
  'active',
  'cancelled',
  'past_due',
  'expired',
  'trial'
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  razorpay_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- SHIFTS PURCHASES TABLE
-- Records of Shifts package purchases
-- ============================================
CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

CREATE TABLE IF NOT EXISTS shifts_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES shifts_packages(id),
  shifts_amount INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL, -- In paise
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- PROFILE BOOSTS TABLE
-- Tracks active profile/job boosts
-- ============================================
CREATE TYPE boost_type AS ENUM (
  'profile',
  'job',
  'application'
);

CREATE TABLE IF NOT EXISTS boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boost_type boost_type NOT NULL,
  reference_id UUID, -- project_id or application_id
  shifts_used INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_shifts_balance_user ON shifts_balance(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_transactions_user ON shifts_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_transactions_created ON shifts_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_boosts_user ON boosts(user_id);
CREATE INDEX IF NOT EXISTS idx_boosts_active ON boosts(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_shifts_purchases_user ON shifts_purchases(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to initialize Shifts balance for new users
CREATE OR REPLACE FUNCTION initialize_shifts_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO shifts_balance (user_id, balance, free_balance, last_free_credit_at)
  VALUES (NEW.id, 5, 5, NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Log the initial free credit
  INSERT INTO shifts_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'free_credit', 5, 5, 'Welcome bonus - 5 free Shifts');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create Shifts balance on user creation
DROP TRIGGER IF EXISTS trigger_initialize_shifts ON users;
CREATE TRIGGER trigger_initialize_shifts
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_shifts_balance();

-- Function to deduct Shifts
CREATE OR REPLACE FUNCTION deduct_shifts(
  p_user_id UUID,
  p_amount INTEGER,
  p_type shifts_transaction_type,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance with lock
  SELECT balance INTO v_current_balance
  FROM shifts_balance
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  v_new_balance := v_current_balance - p_amount;
  
  -- Update balance
  UPDATE shifts_balance
  SET 
    balance = v_new_balance,
    lifetime_used = lifetime_used + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO shifts_transactions (
    user_id, type, amount, balance_after, description, reference_id, reference_type
  ) VALUES (
    p_user_id, p_type, -p_amount, v_new_balance, p_description, p_reference_id, p_reference_type
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to add Shifts
CREATE OR REPLACE FUNCTION add_shifts(
  p_user_id UUID,
  p_amount INTEGER,
  p_type shifts_transaction_type,
  p_description TEXT DEFAULT NULL,
  p_payment_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Update balance
  UPDATE shifts_balance
  SET 
    balance = balance + p_amount,
    lifetime_purchased = CASE WHEN p_type = 'purchase' THEN lifetime_purchased + p_amount ELSE lifetime_purchased END,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING balance INTO v_new_balance;
  
  -- Create balance if doesn't exist
  IF v_new_balance IS NULL THEN
    INSERT INTO shifts_balance (user_id, balance, lifetime_purchased)
    VALUES (p_user_id, p_amount, CASE WHEN p_type = 'purchase' THEN p_amount ELSE 0 END)
    RETURNING balance INTO v_new_balance;
  END IF;
  
  -- Log transaction
  INSERT INTO shifts_transactions (
    user_id, type, amount, balance_after, description, payment_id
  ) VALUES (
    p_user_id, p_type, p_amount, v_new_balance, p_description, p_payment_id
  );
  
  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE shifts_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE boosts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY shifts_balance_user_policy ON shifts_balance
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY shifts_transactions_user_policy ON shifts_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_subscriptions_user_policy ON user_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY shifts_purchases_user_policy ON shifts_purchases
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY boosts_user_policy ON boosts
  FOR ALL USING (auth.uid() = user_id);

-- Everyone can read packages and plans
CREATE POLICY shifts_packages_read_policy ON shifts_packages
  FOR SELECT USING (true);

CREATE POLICY subscription_plans_read_policy ON subscription_plans
  FOR SELECT USING (true);
