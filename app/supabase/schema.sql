-- BuilderOS Production Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table (scoped to organization)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  rera_id VARCHAR(50) UNIQUE NOT NULL,
  state VARCHAR(50) NOT NULL,
  budget DECIMAL(15,2),
  start_date DATE,
  target_completion DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member', -- owner, pm, finance, procurement, member
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Project Access (many-to-many)
CREATE TABLE IF NOT EXISTS user_project_access (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  access_level VARCHAR(50) DEFAULT 'full', -- full, view_only
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, project_id)
);

-- ============================================
-- COST GUARD TABLES
-- ============================================

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  supplier VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  invoice_number VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(50), -- cement, steel, labor, electrical, plumbing, etc.
  gst_rate DECIMAL(5,2),
  tds_rate DECIMAL(5,2),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue
  is_duplicate BOOLEAN DEFAULT false,
  flagged_by_cost_guard BOOLEAN DEFAULT false,
  flag_reason TEXT,
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RERA COMPLIANCE TABLES
-- ============================================

-- RERA Pages (scraped website content)
CREATE TABLE IF NOT EXISTS rera_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state VARCHAR(50) NOT NULL,
  page_type VARCHAR(50) NOT NULL, -- form, circular, deadline, announcement
  url TEXT NOT NULL,
  content_hash VARCHAR(64), -- MD5 hash for change detection
  full_text TEXT,
  screenshot_url TEXT,
  last_scraped TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_changed TIMESTAMP WITH TIME ZONE
);

-- RERA Updates (detected changes)
CREATE TABLE IF NOT EXISTS rera_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state VARCHAR(50) NOT NULL,
  update_type VARCHAR(50) NOT NULL, -- form_update, deadline_change, new_circular
  summary TEXT, -- AI-generated summary
  impact_analysis TEXT, -- AI analysis of impact
  severity VARCHAR(20) DEFAULT 'info', -- critical, important, info
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT false
);

-- QPR Drafts
CREATE TABLE IF NOT EXISTS qpr_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  quarter VARCHAR(10) NOT NULL, -- Q1-2025, Q2-2025, etc.
  financial_data JSONB,
  progress_data JSONB,
  compliance_checks JSONB,
  pdf_url TEXT,
  status VARCHAR(20) DEFAULT 'draft', -- draft, reviewed, submitted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONTRACT ANALYZER TABLES
-- ============================================

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_type VARCHAR(50) NOT NULL, -- contractor, supplier, consultant, loan, lease
  counterparty VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  page_count INTEGER,
  analysis_result JSONB, -- AI analysis results
  risk_score DECIMAL(3,1), -- 0.0-10.0
  critical_issues INTEGER DEFAULT 0,
  moderate_issues INTEGER DEFAULT 0,
  low_issues INTEGER DEFAULT 0,
  marked_pdf_url TEXT, -- PDF with highlighted risks
  analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal Cases (cached from Indian Kanoon)
CREATE TABLE IF NOT EXISTS legal_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_title TEXT NOT NULL,
  state VARCHAR(50),
  year INTEGER,
  case_type VARCHAR(100),
  outcome TEXT,
  penalty_amount DECIMAL(12,2),
  source_url TEXT,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ALERTS & NOTIFICATIONS
-- ============================================

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- cost_guard, rera, contract, deadline
  severity VARCHAR(20) NOT NULL, -- critical, important, info
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB, -- Additional structured data
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BILLING & SUBSCRIPTIONS
-- ============================================

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) DEFAULT 'standard', -- standard, enterprise
  status VARCHAR(50) DEFAULT 'active', -- active, cancelled, past_due
  billing_period VARCHAR(20) DEFAULT 'monthly', -- monthly, annual
  project_count INTEGER DEFAULT 0,
  user_count INTEGER DEFAULT 0,
  monthly_amount DECIMAL(12,2) NOT NULL,
  razorpay_subscription_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices (billing)
CREATE TABLE IF NOT EXISTS billing_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  invoice_number VARCHAR(100) UNIQUE,
  razorpay_payment_id VARCHAR(255),
  pdf_url TEXT,
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Organizations indexes
CREATE INDEX idx_organizations_created_at ON organizations(created_at);

-- Projects indexes
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_projects_rera ON projects(rera_id);
CREATE INDEX idx_projects_state ON projects(state);

-- Users indexes
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- Invoices indexes
CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_supplier ON invoices(supplier);
CREATE INDEX idx_invoices_date ON invoices(date);
CREATE INDEX idx_invoices_flagged ON invoices(flagged_by_cost_guard) WHERE flagged_by_cost_guard = true;

-- RERA indexes
CREATE INDEX idx_rera_pages_state ON rera_pages(state);
CREATE INDEX idx_rera_updates_state ON rera_updates(state);
CREATE INDEX idx_rera_updates_detected ON rera_updates(detected_at);

-- Contracts indexes
CREATE INDEX idx_contracts_org ON contracts(organization_id);
CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_contracts_analyzed ON contracts(analyzed_at);

-- Alerts indexes
CREATE INDEX idx_alerts_org ON alerts(organization_id);
CREATE INDEX idx_alerts_project ON alerts(project_id);
CREATE INDEX idx_alerts_unresolved ON alerts(is_resolved) WHERE is_resolved = false;
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created ON alerts(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE rera_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rera_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE qpr_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's organization_id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE;

-- Organizations: Users can only see their own organization
CREATE POLICY "Users see own organization"
  ON organizations FOR SELECT
  USING (id = get_user_org_id());

CREATE POLICY "Users can update own organization"
  ON organizations FOR UPDATE
  USING (id = get_user_org_id());

-- Projects: Users can only see projects in their organization
CREATE POLICY "Users see own org projects"
  ON projects FOR SELECT
  USING (organization_id = get_user_org_id());

CREATE POLICY "Users can insert projects in own org"
  ON projects FOR INSERT
  WITH CHECK (organization_id = get_user_org_id());

CREATE POLICY "Users can update own org projects"
  ON projects FOR UPDATE
  USING (organization_id = get_user_org_id());

-- Users: Can only see users in same organization
CREATE POLICY "Users see own org users"
  ON users FOR SELECT
  USING (organization_id = get_user_org_id());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Invoices: Scoped to organization
CREATE POLICY "Users see own org invoices"
  ON invoices FOR SELECT
  USING (organization_id = get_user_org_id());

CREATE POLICY "Users can insert invoices in own org"
  ON invoices FOR INSERT
  WITH CHECK (organization_id = get_user_org_id());

CREATE POLICY "Users can update own org invoices"
  ON invoices FOR UPDATE
  USING (organization_id = get_user_org_id());

-- Contracts: Scoped to organization
CREATE POLICY "Users see own org contracts"
  ON contracts FOR SELECT
  USING (organization_id = get_user_org_id());

CREATE POLICY "Users can insert contracts in own org"
  ON contracts FOR INSERT
  WITH CHECK (organization_id = get_user_org_id());

-- Alerts: Scoped to organization
CREATE POLICY "Users see own org alerts"
  ON alerts FOR SELECT
  USING (organization_id = get_user_org_id());

CREATE POLICY "Users can update own org alerts"
  ON alerts FOR UPDATE
  USING (organization_id = get_user_org_id());

-- RERA data: Public read (all users can see)
CREATE POLICY "Anyone can read RERA pages"
  ON rera_pages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read RERA updates"
  ON rera_updates FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read legal cases"
  ON legal_cases FOR SELECT
  USING (true);

-- QPR Drafts: Scoped to project (via organization)
CREATE POLICY "Users see own org QPRs"
  ON qpr_drafts FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE organization_id = get_user_org_id()
  ));

CREATE POLICY "Users can insert QPRs in own org"
  ON qpr_drafts FOR INSERT
  WITH CHECK (project_id IN (
    SELECT id FROM projects WHERE organization_id = get_user_org_id()
  ));

-- Subscriptions: Scoped to organization
CREATE POLICY "Users see own org subscription"
  ON subscriptions FOR SELECT
  USING (organization_id = get_user_org_id());

-- Billing Invoices: Scoped to organization
CREATE POLICY "Users see own org billing invoices"
  ON billing_invoices FOR SELECT
  USING (organization_id = get_user_org_id());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate project health score
CREATE OR REPLACE FUNCTION calculate_project_health_score(project_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  financial_score INTEGER;
  compliance_score INTEGER;
  contract_score INTEGER;
  timeline_score INTEGER;
  overall_score INTEGER;
  critical_alerts INTEGER;
  important_alerts INTEGER;
BEGIN
  -- Count unresolved critical alerts
  SELECT COUNT(*) INTO critical_alerts
  FROM alerts
  WHERE project_id = project_uuid
    AND severity = 'critical'
    AND is_resolved = false;

  -- Count unresolved important alerts
  SELECT COUNT(*) INTO important_alerts
  FROM alerts
  WHERE project_id = project_uuid
    AND severity = 'important'
    AND is_resolved = false;

  -- Calculate scores (simplified for now)
  financial_score := GREATEST(0, 100 - (critical_alerts * 15) - (important_alerts * 5));
  compliance_score := GREATEST(0, 100 - (critical_alerts * 10));
  contract_score := 90; -- Placeholder
  timeline_score := 85; -- Placeholder

  -- Overall weighted score
  overall_score := ROUND(
    (financial_score * 0.30) +
    (compliance_score * 0.30) +
    (contract_score * 0.25) +
    (timeline_score * 0.15)
  );

  -- Build result JSON
  result := json_build_object(
    'overall', overall_score,
    'breakdown', json_build_object(
      'financial', financial_score,
      'compliance', compliance_score,
      'contracts', contract_score,
      'timeline', timeline_score
    ),
    'alerts', json_build_object(
      'critical', critical_alerts,
      'important', important_alerts
    )
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Insert test RERA states
INSERT INTO rera_pages (state, page_type, url, content_hash) VALUES
  ('Maharashtra', 'dashboard', 'https://maharerait.mahaonline.gov.in/', ''),
  ('Karnataka', 'dashboard', 'https://rera.karnataka.gov.in/', ''),
  ('Tamil Nadu', 'dashboard', 'https://www.tnrera.in/', ''),
  ('Telangana', 'dashboard', 'https://tgrera.telangana.gov.in/', ''),
  ('Gujarat', 'dashboard', 'https://gujrera.gujarat.gov.in/', ''),
  ('Kerala', 'dashboard', 'https://rera.kerala.gov.in/', ''),
  ('Delhi', 'dashboard', 'https://delhirera.nic.in/', ''),
  ('Haryana', 'dashboard', 'https://haryanarera.gov.in/', ''),
  ('Uttar Pradesh', 'dashboard', 'https://up-rera.in/', ''),
  ('West Bengal', 'dashboard', 'https://wbrera.wb.gov.in/', '')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'BuilderOS database schema created successfully! ✅';
  RAISE NOTICE 'Run: SELECT calculate_project_health_score(project_id) to test health scores';
END $$;

