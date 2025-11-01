-- =====================================================
-- LEGALOS DATABASE SCHEMA
-- AI-Powered Legal Assistant for Indian Law Firms
-- =====================================================
-- Version: 1.0
-- Date: November 1, 2025
-- Multi-tenant architecture with Row Level Security (RLS)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- 1. ORGANIZATIONS (Law Firms)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- "ABC Law Associates"
  slug TEXT UNIQUE NOT NULL, -- "abc-law" for branded portal URL
  logo_url TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  gst_number TEXT,
  pan TEXT,
  
  -- Subscription
  subscription_status TEXT NOT NULL DEFAULT 'trial', -- trial, active, past_due, cancelled
  subscription_plan TEXT DEFAULT 'standard',
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  
  -- Billing
  billing_email TEXT,
  razorpay_customer_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS (Lawyers, Paralegals, Admins)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  
  -- Role
  role TEXT NOT NULL DEFAULT 'associate', -- admin, partner, associate, paralegal
  
  -- Billing
  is_billable BOOLEAN DEFAULT TRUE, -- charged ₹10K/month?
  
  -- Preferences
  preferences JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- 3. CLIENTS
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL, -- "John Doe" or "ABC Pvt Ltd"
  type TEXT NOT NULL, -- individual, company
  email TEXT,
  phone TEXT,
  
  -- Individual
  pan TEXT,
  aadhaar TEXT, -- encrypted
  date_of_birth DATE,
  
  -- Company
  company_name TEXT,
  company_cin TEXT,
  company_pan TEXT,
  company_gstin TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  
  -- Billing
  billing_rate INTEGER, -- hourly rate in INR
  payment_terms TEXT, -- "Net 30"
  
  -- Metadata
  client_since DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  tags TEXT[],
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CASES
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Case Details
  case_number TEXT, -- "WP 12345/2025"
  case_title TEXT NOT NULL, -- "ABC Ltd v. XYZ Corp"
  case_type TEXT NOT NULL, -- civil, criminal, corporate, IP, tax, labor, family, other
  
  -- Court Details
  court_name TEXT, -- "Bombay High Court"
  court_location TEXT, -- "Mumbai"
  judge_name TEXT,
  case_filed_number TEXT,
  
  -- Parties
  our_side TEXT, -- plaintiff, defendant, petitioner, respondent, applicant
  opposing_party TEXT,
  opposing_counsel TEXT,
  
  -- Dates
  filing_date DATE,
  next_hearing_date DATE,
  
  -- Status
  case_status TEXT DEFAULT 'active', -- active, pending, disposed, withdrawn, settled
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  
  -- Details
  case_summary TEXT,
  cause_of_action TEXT,
  relief_sought TEXT,
  
  -- Financial
  estimated_value INTEGER, -- in INR
  court_fees_paid INTEGER,
  
  -- Assignment
  lead_lawyer UUID REFERENCES users(id),
  assigned_to UUID[] DEFAULT ARRAY[]::UUID[], -- array of user IDs
  
  -- Metadata
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- 5. DOCUMENTS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- File Info
  file_name TEXT NOT NULL,
  file_type TEXT, -- pdf, docx, jpg, png
  file_size BIGINT, -- bytes
  storage_path TEXT NOT NULL, -- Supabase Storage path
  
  -- Classification
  document_type TEXT, -- contract, notice, petition, affidavit, evidence, order, judgment, correspondence, other
  document_category TEXT, -- pleading, filing, correspondence, evidence, etc.
  
  -- Content
  ocr_text TEXT, -- extracted text for search
  ai_summary TEXT, -- AI-generated summary
  
  -- Metadata
  document_date DATE, -- date on the document (not upload date)
  tags TEXT[],
  is_confidential BOOLEAN DEFAULT TRUE,
  
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_case ON documents(case_id);
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_documents_ocr_search ON documents USING gin(to_tsvector('english', ocr_text));

-- 6. TEMPLATES (Legal Document Templates)
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL = system template
  
  name TEXT NOT NULL, -- "Legal Notice - Cheque Bounce"
  category TEXT NOT NULL, -- Contracts, Notices, Court Filings, Corporate, Opinions
  subcategory TEXT, -- Within each category
  description TEXT,
  
  -- Template Content
  template_content TEXT NOT NULL, -- Markdown or HTML with {{variables}}
  variables JSONB DEFAULT '{}'::jsonb, -- {field_name: {type, label, required, default}}
  
  -- Type
  is_system BOOLEAN DEFAULT FALSE, -- provided by LegalOS?
  is_public BOOLEAN DEFAULT TRUE, -- visible to all in org?
  
  -- Usage Stats
  usage_count INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_org ON templates(organization_id);
CREATE INDEX idx_templates_category ON templates(category);

-- 7. AI CONVERSATIONS (Chat History)
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  conversation_title TEXT, -- "Cheque bounce query"
  conversation_type TEXT DEFAULT 'general', -- general, case_law, contract_review, drafting
  
  -- Messages
  messages JSONB DEFAULT '[]'::jsonb, 
  -- [{role: "user", content: "...", timestamp: "..."}, {role: "assistant", content: "...", sources: [...], timestamp: "..."}]
  
  -- Metadata
  token_count INTEGER DEFAULT 0,
  model_used TEXT, -- claude-3-5-sonnet, gemini-2.5-pro
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_case ON ai_conversations(case_id);

-- 8. TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL, -- "Draft reply"
  description TEXT,
  
  -- Assignment
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  
  -- Timing
  due_date DATE,
  due_time TIME,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  
  -- Reminders
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_case ON tasks(case_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- 9. COURT DATES (Hearings, Deadlines)
CREATE TABLE court_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  
  hearing_date DATE NOT NULL,
  hearing_time TIME,
  hearing_type TEXT, -- arguments, evidence, final_hearing, directions, mention
  
  court_room TEXT,
  judge_name TEXT,
  
  notes TEXT,
  outcome TEXT, -- what happened at this hearing
  next_date DATE, -- next hearing date mentioned by court
  
  -- Reminders
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_days_before INTEGER DEFAULT 2, -- send reminder 2 days before
  
  -- Attendance
  attended_by UUID[] DEFAULT ARRAY[]::UUID[], -- which lawyers attended
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_court_dates_case ON court_dates(case_id);
CREATE INDEX idx_court_dates_date ON court_dates(hearing_date);

-- 10. TIME ENTRIES (Billable Hours)
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Time
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  hours DECIMAL(5,2) NOT NULL, -- 2.5 hours
  
  -- Activity
  activity TEXT NOT NULL, -- "Drafted reply"
  activity_type TEXT, -- drafting, research, court, meeting, review, correspondence
  
  -- Billing
  is_billable BOOLEAN DEFAULT TRUE,
  hourly_rate INTEGER NOT NULL, -- ₹5000/hour
  amount INTEGER GENERATED ALWAYS AS (ROUND(hours * hourly_rate)) STORED,
  
  -- Invoice
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  invoiced_at TIMESTAMPTZ,
  
  -- Timer
  timer_start TIMESTAMPTZ,
  timer_end TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_time_entries_user ON time_entries(user_id);
CREATE INDEX idx_time_entries_case ON time_entries(case_id);
CREATE INDEX idx_time_entries_date ON time_entries(entry_date);
CREATE INDEX idx_time_entries_invoice ON time_entries(invoice_id);

-- 11. INVOICES (Client Billing)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Invoice Details
  invoice_number TEXT UNIQUE NOT NULL, -- "INV-2025-001"
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL, -- invoice_date + payment_terms
  
  -- Line Items (from time_entries)
  line_items JSONB DEFAULT '[]'::jsonb,
  -- [{entry_id, date, activity, hours, rate, amount}, ...]
  
  -- Amounts
  subtotal INTEGER NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 18.00, -- GST 18%
  tax_amount INTEGER GENERATED ALWAYS AS (ROUND(subtotal * tax_rate / 100)) STORED,
  total_amount INTEGER GENERATED ALWAYS AS (subtotal + ROUND(subtotal * tax_rate / 100)) STORED,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  sent_at TIMESTAMPTZ,
  
  -- Payment
  payment_date DATE,
  payment_mode TEXT, -- bank_transfer, cheque, upi, cash
  payment_reference TEXT,
  
  -- Notes
  notes TEXT,
  terms_and_conditions TEXT,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);

-- 12. SUBSCRIPTIONS (LegalOS Billing for Law Firms)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Plan
  plan_type TEXT DEFAULT 'standard',
  price_per_user INTEGER DEFAULT 10000, -- ₹10,000/lawyer/month
  
  -- Users
  billable_users_count INTEGER DEFAULT 0,
  monthly_amount INTEGER GENERATED ALWAYS AS (billable_users_count * price_per_user) STORED,
  
  -- Billing Cycle
  billing_cycle_start DATE NOT NULL,
  billing_cycle_end DATE NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'trial', -- trial, active, past_due, cancelled
  trial_ends_at TIMESTAMPTZ,
  
  -- Razorpay
  razorpay_subscription_id TEXT,
  razorpay_plan_id TEXT,
  
  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ALERTS (Reminders, Deadlines, Notifications)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- who should see this alert
  
  alert_type TEXT NOT NULL, -- hearing, deadline, task, payment, system
  severity TEXT DEFAULT 'info', -- info, warning, critical
  
  title TEXT NOT NULL,
  description TEXT,
  
  action_url TEXT, -- link to case, task, etc.
  
  -- Status
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  
  -- Timing
  alert_date DATE, -- when this alert is for
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_case ON alerts(case_id);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);

-- 14. INTAKE FORMS (Client Onboarding)
CREATE TABLE intake_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  form_name TEXT NOT NULL, -- "New Client Intake"
  form_slug TEXT NOT NULL, -- "new-client" for URL
  
  -- Form Fields
  form_schema JSONB NOT NULL, 
  -- [{field_name, field_type, label, required, options}, ...]
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  success_message TEXT,
  notification_email TEXT, -- who gets notified when form submitted
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, form_slug)
);

-- 15. INTAKE SUBMISSIONS (Client Responses)
CREATE TABLE intake_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  intake_form_id UUID NOT NULL REFERENCES intake_forms(id) ON DELETE CASCADE,
  
  -- Submission Data
  submission_data JSONB NOT NULL, -- {field_name: value, ...}
  
  -- Status
  status TEXT DEFAULT 'new', -- new, reviewed, converted (to client/case)
  
  -- Conversion
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  
  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  
  -- Source
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_intake_submissions_form ON intake_submissions(intake_form_id);
CREATE INDEX idx_intake_submissions_status ON intake_submissions(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own organization
CREATE POLICY org_access ON organizations
  FOR ALL
  USING (id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- Users: Users can see users in their organization
CREATE POLICY users_access ON users
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- All other tables: Users can only access data from their organization
CREATE POLICY clients_access ON clients
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY cases_access ON cases
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY documents_access ON documents
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY templates_access ON templates
  FOR ALL
  USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) 
    OR is_system = TRUE
  );

CREATE POLICY ai_conversations_access ON ai_conversations
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY tasks_access ON tasks
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY court_dates_access ON court_dates
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY time_entries_access ON time_entries
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY invoices_access ON invoices
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY subscriptions_access ON subscriptions
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY alerts_access ON alerts
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY intake_forms_access ON intake_forms
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- Intake submissions: READ for org members, INSERT for public (no auth)
CREATE POLICY intake_submissions_read ON intake_submissions
  FOR SELECT
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY intake_submissions_insert ON intake_submissions
  FOR INSERT
  WITH CHECK (TRUE); -- Allow anyone to submit

CREATE POLICY intake_submissions_update ON intake_submissions
  FOR UPDATE
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_court_dates_updated_at BEFORE UPDATE ON court_dates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_intake_forms_updated_at BEFORE UPDATE ON intake_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update subscription billable_users_count
CREATE OR REPLACE FUNCTION update_billable_users_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE subscriptions
  SET billable_users_count = (
    SELECT COUNT(*) FROM users 
    WHERE organization_id = NEW.organization_id 
    AND is_billable = TRUE
  )
  WHERE organization_id = NEW.organization_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_billable_count_on_user_change
  AFTER INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_billable_users_count();

-- =====================================================
-- SEED DATA (System Templates)
-- =====================================================

-- We'll add 100+ templates via a separate seed script
-- For now, just create the structure

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ LegalOS Database Schema Created Successfully!';
  RAISE NOTICE '📊 Tables Created: 15';
  RAISE NOTICE '🔒 RLS Enabled: Yes';
  RAISE NOTICE '🚀 Ready for LegalOS!';
END $$;

