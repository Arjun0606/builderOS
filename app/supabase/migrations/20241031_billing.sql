-- Billing and Subscription Tables

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Razorpay details
  razorpay_subscription_id VARCHAR(255) UNIQUE,
  razorpay_plan_id VARCHAR(255),
  
  -- Subscription details
  status VARCHAR(50) DEFAULT 'inactive', -- 'active', 'inactive', 'cancelled', 'past_due'
  project_count INT DEFAULT 1,
  license_count INT DEFAULT 10,
  amount NUMERIC(12,2) NOT NULL, -- Total monthly amount in rupees
  
  -- Billing periods
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  
  -- Cancellation
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Razorpay details
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_subscription_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  
  -- Payment details
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed'
  description TEXT,
  
  -- Payment method
  method VARCHAR(50), -- 'card', 'netbanking', 'upi', 'wallet'
  card_last4 VARCHAR(4),
  card_brand VARCHAR(50),
  
  -- Error handling
  error_code VARCHAR(100),
  error_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing Invoices
CREATE TABLE IF NOT EXISTS billing_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Razorpay details
  razorpay_subscription_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  
  -- Invoice details
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  amount NUMERIC(12,2) NOT NULL,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) GENERATED ALWAYS AS (amount + tax_amount) STORED,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  
  -- PDF
  pdf_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking (for analytics)
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Feature usage
  feature VARCHAR(100) NOT NULL, -- 'cost_guard', 'rera', 'contract_analyzer', 'cash_flow'
  action VARCHAR(100) NOT NULL, -- 'invoice_upload', 'qpr_generated', 'contract_analyzed', etc.
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay ON subscriptions(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment ON payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_subscription ON billing_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON billing_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON billing_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON billing_invoices(invoice_date DESC);

CREATE INDEX IF NOT EXISTS idx_usage_logs_org ON usage_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_feature ON usage_logs(feature);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON usage_logs(created_at DESC);

-- RLS Policies for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for billing_invoices
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices"
  ON billing_invoices
  FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for usage_logs
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org's usage logs"
  ON usage_logs
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert usage logs"
  ON usage_logs
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_billing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_billing_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_billing_updated_at();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON billing_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_billing_updated_at();

