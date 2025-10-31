-- Cash Flow Analysis Tables

-- Cash flow analyses (stores AI analysis results)
CREATE TABLE IF NOT EXISTS cash_flow_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Transaction data
  transaction_count INT NOT NULL DEFAULT 0,
  total_inflow NUMERIC(15,2) DEFAULT 0,
  total_outflow NUMERIC(15,2) DEFAULT 0,
  net_position NUMERIC(15,2) DEFAULT 0,
  
  -- Escrow data
  escrow_balance NUMERIC(15,2) DEFAULT 0,
  escrow_withdrawable NUMERIC(15,2) DEFAULT 0,
  escrow_utilization_percentage NUMERIC(5,2) DEFAULT 0,
  
  -- AI Forecasts
  forecast_30d JSONB DEFAULT '{}',
  forecast_60d JSONB DEFAULT '{}',
  forecast_90d JSONB DEFAULT '{}',
  
  -- AI Alerts and Insights
  alerts JSONB DEFAULT '[]',
  insights JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank transactions (parsed from uploaded CSVs)
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_date DATE NOT NULL,
  description TEXT,
  debit NUMERIC(15,2) DEFAULT 0,
  credit NUMERIC(15,2) DEFAULT 0,
  balance NUMERIC(15,2),
  
  -- Bank details
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  account_type VARCHAR(50), -- 'RERA_ESCROW', 'OPERATIONS', 'VENDOR_PAYMENTS', etc.
  
  -- AI categorization
  category VARCHAR(100), -- 'CUSTOMER_PAYMENT', 'CONTRACTOR', 'MATERIALS', 'SALARIES', etc.
  subcategory VARCHAR(100),
  vendor_name VARCHAR(255),
  
  -- Matching
  matched_invoice_id UUID REFERENCES invoices(id),
  is_matched BOOLEAN DEFAULT FALSE,
  
  -- Source file
  source_file_path TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for cash flow analyses
CREATE INDEX IF NOT EXISTS idx_cash_flow_analyses_user ON cash_flow_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_analyses_project ON cash_flow_analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_analyses_org ON cash_flow_analyses(organization_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_analyses_created ON cash_flow_analyses(created_at DESC);

-- Indexes for bank transactions
CREATE INDEX IF NOT EXISTS idx_bank_transactions_org ON bank_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_project ON bank_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON bank_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_bank ON bank_transactions(bank_name);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_category ON bank_transactions(category);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_matched ON bank_transactions(is_matched);

-- RLS Policies for cash_flow_analyses
ALTER TABLE cash_flow_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org's cash flow analyses"
  ON cash_flow_analyses
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own cash flow analyses"
  ON cash_flow_analyses
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- RLS Policies for bank_transactions
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org's bank transactions"
  ON bank_transactions
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert bank transactions"
  ON bank_transactions
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own bank transactions"
  ON bank_transactions
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cash_flow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_cash_flow_analyses_updated_at
  BEFORE UPDATE ON cash_flow_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_cash_flow_updated_at();

CREATE TRIGGER update_bank_transactions_updated_at
  BEFORE UPDATE ON bank_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_cash_flow_updated_at();

