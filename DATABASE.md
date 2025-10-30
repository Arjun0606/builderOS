# BuilderOS Database Schema

Complete database schema with all tables, relationships, indexes, and Row Level Security policies.

---

## Overview

- **Database**: PostgreSQL 15+ (Supabase)
- **Total tables**: 25+
- **Security**: Row Level Security (RLS) enabled on all tables
- **Naming convention**: Snake_case, plural table names
- **Primary keys**: UUID v4 (not auto-increment integers for security)

---

## Schema Diagram

```
organizations (1) ──┬──< (N) projects
                    └──< (N) user_organizations

users (1) ────< (N) user_organizations
          └───< (N) user_project_roles

projects (1) ──┬──< (N) documents
               ├──< (N) invoices
               ├──< (N) bank_transactions
               ├──< (N) boqs
               ├──< (N) rera_submissions
               ├──< (N) rera_deadlines
               ├──< (N) anomalies
               ├──< (N) leakage_reports
               └──< (N) subscriptions

documents (1) ──┬──< (0-1) invoices
                ├──< (0-1) bank_transactions
                └──< (0-1) boqs

invoices (1) ──< (N) anomalies
```

---

## Core Tables

### organizations

**Purpose**: Top-level entity representing a real estate development company.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,                      -- e.g., "Urban Risers Developers Pvt Ltd"
  gstin TEXT UNIQUE,                       -- GST Identification Number
  pan TEXT,                                 -- PAN for tax
  registered_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,                            -- Supabase Storage URL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_gstin ON organizations(gstin);
```

**Sample data:**
```sql
INSERT INTO organizations (name, gstin, city, state) VALUES
('Urban Risers Developers', '27AAACU1234A1Z5', 'Mumbai', 'Maharashtra'),
('Eco Homes Pvt Ltd', '29BBBCU5678B2Y6', 'Bangalore', 'Karnataka');
```

---

### projects

**Purpose**: Individual RERA-registered real estate projects.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- RERA details
  rera_id TEXT NOT NULL UNIQUE,            -- e.g., "P51700012345" (Maharashtra format)
  project_name TEXT NOT NULL,              -- e.g., "Sunshine Heights"
  state TEXT NOT NULL,                      -- For RERA rule lookup
  city TEXT NOT NULL,
  locality TEXT,                            -- Suburb/area
  address TEXT,
  pincode TEXT,
  
  -- Project metrics
  total_units INTEGER,                      -- Total apartments/units
  sold_units INTEGER DEFAULT 0,
  available_units INTEGER,                  -- Computed: total - sold
  project_value DECIMAL(15,2),             -- Total project cost (₹)
  construction_progress_pct DECIMAL(5,2) DEFAULT 0.00, -- 0.00 to 100.00
  
  -- RERA compliance
  rera_registration_date DATE,
  expected_completion_date DATE,
  extended_completion_date DATE,           -- If RERA extension granted
  escrow_threshold_pct DECIMAL(5,2) DEFAULT 70.00, -- RERA mandated %
  
  -- Status
  status TEXT CHECK (status IN (
    'planning',
    'under_construction',
    'nearing_completion',
    'completed',
    'suspended'                             -- RERA suspended
  )) DEFAULT 'under_construction',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_projects_rera_id ON projects(rera_id);
CREATE INDEX idx_projects_state ON projects(state);
CREATE INDEX idx_projects_status ON projects(status);
```

**Sample data:**
```sql
INSERT INTO projects (
  organization_id,
  rera_id,
  project_name,
  state,
  city,
  total_units,
  project_value
) VALUES (
  'org_uuid_here',
  'P51700012345',
  'Sunshine Heights',
  'Maharashtra',
  'Mumbai',
  200,
  10000000000.00  -- ₹100 Crores
);
```

---

### users

**Purpose**: Supabase Auth users extended with profile data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,                          -- Supabase Storage URL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**Trigger**: Automatically create user record when auth.users row created.

```sql
CREATE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_user_profile();
```

---

### user_organizations

**Purpose**: Many-to-many relationship between users and organizations.

```sql
CREATE TABLE user_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_user_orgs_user ON user_organizations(user_id);
CREATE INDEX idx_user_orgs_org ON user_organizations(organization_id);
```

---

### user_project_roles

**Purpose**: Project-level role assignment (more granular than org-level).

```sql
CREATE TABLE user_project_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN (
    'owner',          -- Full access, including scenario planning
    'finance_head',   -- Upload documents, view all financial data
    'ca',             -- Read-only, can export reports
    'viewer'          -- Dashboard only, no raw data
  )) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, project_id)
);

CREATE INDEX idx_user_project_roles_user ON user_project_roles(user_id);
CREATE INDEX idx_user_project_roles_project ON user_project_roles(project_id);
```

---

## Document & AI Tables

### documents

**Purpose**: Track all uploaded files and their processing status.

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- File details
  file_url TEXT NOT NULL,                   -- Supabase Storage path
  file_name TEXT NOT NULL,
  file_size BIGINT,                         -- Bytes
  file_type TEXT,                           -- MIME type
  document_type TEXT CHECK (document_type IN (
    'invoice',
    'boq',
    'bank_statement',
    'rera_form',
    'contract',
    'purchase_order',
    'other'
  )),
  
  -- Processing status
  processing_status TEXT CHECK (processing_status IN (
    'pending',
    'processing',
    'completed',
    'failed',
    'needs_review'                          -- Low confidence extraction
  )) DEFAULT 'pending',
  
  -- OCR & AI results
  ocr_text TEXT,                            -- Raw OCR output
  ocr_confidence DECIMAL(5,2),             -- 0.00 to 100.00
  ai_extracted_data JSONB,                 -- Structured data from AI
  ai_confidence DECIMAL(5,2),
  error_message TEXT,                       -- If failed
  
  -- Metadata
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_status ON documents(processing_status);
CREATE INDEX idx_documents_type ON documents(document_type);
```

---

### invoices

**Purpose**: Structured invoice data extracted by AI.

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  
  -- Supplier details
  supplier_name TEXT NOT NULL,
  supplier_gstin TEXT,
  supplier_address TEXT,
  supplier_pan TEXT,
  
  -- Invoice details
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  po_number TEXT,                           -- Purchase Order reference
  
  -- Line items (JSONB array)
  line_items JSONB NOT NULL DEFAULT '[]',
  -- Format: [
  --   {
  --     description: "TMT Steel Fe500D",
  --     hsn_code: "7214",
  --     quantity: 10,
  --     unit: "MT",
  --     rate: 65000,
  --     gst_pct: 18,
  --     cgst: 58500,
  --     sgst: 58500,
  --     amount: 767000
  --   },
  --   ...
  -- ]
  
  -- Amounts
  subtotal DECIMAL(15,2) NOT NULL,
  cgst_amount DECIMAL(15,2) DEFAULT 0.00,
  sgst_amount DECIMAL(15,2) DEFAULT 0.00,
  igst_amount DECIMAL(15,2) DEFAULT 0.00,
  tds_amount DECIMAL(15,2) DEFAULT 0.00,
  round_off DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(15,2) NOT NULL,
  
  -- Payment
  payment_status TEXT CHECK (payment_status IN (
    'pending',
    'partial',
    'paid',
    'overdue'
  )) DEFAULT 'pending',
  payment_date DATE,
  payment_reference TEXT,
  
  -- Flags
  is_flagged BOOLEAN DEFAULT FALSE,        -- Anomaly detected
  is_approved BOOLEAN DEFAULT FALSE,       -- Reviewed and approved
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,                               -- Approval notes
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_supplier ON invoices(supplier_name);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(payment_status);
CREATE INDEX idx_invoices_flagged ON invoices(is_flagged) WHERE is_flagged = TRUE;

-- Unique constraint: Same supplier can't have same invoice number
CREATE UNIQUE INDEX idx_invoices_unique ON invoices(project_id, supplier_name, invoice_number);
```

---

### bank_transactions

**Purpose**: Bank statement transactions for escrow tracking.

```sql
CREATE TABLE bank_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  
  -- Transaction details
  transaction_date DATE NOT NULL,
  transaction_id TEXT,                      -- Bank reference number
  value_date DATE,                          -- When funds actually moved
  party_name TEXT,                          -- Sender/receiver
  party_account TEXT,                       -- Account number
  
  -- Amounts
  debit DECIMAL(15,2) DEFAULT 0.00,
  credit DECIMAL(15,2) DEFAULT 0.00,
  balance DECIMAL(15,2),                    -- Running balance
  
  -- Details
  narration TEXT,                           -- Bank narration/description
  cheque_number TEXT,
  transaction_mode TEXT,                    -- NEFT, RTGS, UPI, Cheque, etc.
  
  -- AI categorization
  category TEXT CHECK (category IN (
    'customer_payment',                     -- Inflow from homebuyers
    'construction_cost',                    -- Outflow to contractors
    'land_cost',                            -- Land purchase
    'approval_fee',                         -- Govt fees (BMC, RERA, etc.)
    'marketing',                            -- Marketing expenses
    'admin',                                -- Office, salaries
    'interest',                             -- Loan interest
    'transfer',                             -- Inter-account transfer
    'other'
  )),
  is_escrow_eligible BOOLEAN DEFAULT TRUE,  -- Counts toward RERA escrow %
  
  -- Linking
  linked_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  
  -- Scenario planning
  is_scenario BOOLEAN DEFAULT FALSE,        -- If TRUE, internal planning only
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bank_txn_project ON bank_transactions(project_id);
CREATE INDEX idx_bank_txn_date ON bank_transactions(transaction_date);
CREATE INDEX idx_bank_txn_category ON bank_transactions(category);
CREATE INDEX idx_bank_txn_scenario ON bank_transactions(is_scenario);
```

---

### boqs (Bill of Quantities)

**Purpose**: Contract BOQ for cost variance detection.

```sql
CREATE TABLE boqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  
  -- Work item details
  work_category TEXT NOT NULL,              -- e.g., "Civil - RCC Work"
  item_code TEXT,                           -- e.g., "C-001"
  item_description TEXT NOT NULL,           -- e.g., "RCC slab pouring"
  unit TEXT NOT NULL,                       -- sqft, rmt, cum, nos, etc.
  quantity DECIMAL(15,3) NOT NULL,
  unit_rate DECIMAL(15,2) NOT NULL,
  total_amount DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_rate) STORED,
  
  -- Milestone linking
  milestone TEXT,                           -- Foundation, Structure, Finishing
  floor TEXT,                               -- Ground, 1st, 2nd, etc.
  
  -- Status
  quantity_executed DECIMAL(15,3) DEFAULT 0.000,
  status TEXT CHECK (status IN (
    'pending',
    'in_progress',
    'completed'
  )) DEFAULT 'pending',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_boqs_project ON boqs(project_id);
CREATE INDEX idx_boqs_category ON boqs(work_category);
CREATE INDEX idx_boqs_milestone ON boqs(milestone);
```

---

## RERA Compliance Tables

### rera_submissions

**Purpose**: Track RERA form submissions (QPR, Annual Returns, etc.).

```sql
CREATE TABLE rera_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Submission details
  submission_type TEXT CHECK (submission_type IN (
    'qpr',                                  -- Quarterly Progress Report
    'annual_audit',                         -- Annual Audit Certificate (CA signed)
    'financial_statement',                  -- Annual Financial Statement
    'extension_request',                    -- Project completion extension
    'revision',                             -- Project detail revisions
    'other'
  )) NOT NULL,
  
  -- Period
  quarter TEXT,                             -- e.g., "Q1 2025" (for QPR)
  financial_year TEXT,                      -- e.g., "2024-25" (for annual)
  
  -- Dates
  due_date DATE NOT NULL,
  submitted_date DATE,
  acknowledgement_number TEXT,              -- RERA acknowledgement number
  
  -- Status
  status TEXT CHECK (status IN (
    'draft',                                -- AI generated, pending review
    'pending_review',                       -- Finance head reviewing
    'ready_to_submit',                      -- Approved, ready for RERA upload
    'submitted',                            -- Submitted to RERA
    'accepted',                             -- RERA accepted
    'rejected',                             -- RERA rejected
    'late'                                  -- Submitted after deadline
  )) DEFAULT 'draft',
  
  -- Data
  form_data JSONB NOT NULL DEFAULT '{}',    -- Structured form fields
  pdf_url TEXT,                             -- Generated PDF (Supabase Storage)
  rera_receipt_url TEXT,                    -- RERA receipt after submission
  
  -- Notes
  rejection_reason TEXT,                    -- If rejected by RERA
  notes TEXT,                               -- Internal notes
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rera_submissions_project ON rera_submissions(project_id);
CREATE INDEX idx_rera_submissions_type ON rera_submissions(submission_type);
CREATE INDEX idx_rera_submissions_status ON rera_submissions(status);
CREATE INDEX idx_rera_submissions_due ON rera_submissions(due_date);
```

---

### rera_updates

**Purpose**: Store scraped RERA website updates.

```sql
CREATE TABLE rera_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Source
  state TEXT NOT NULL,                      -- Maharashtra, Karnataka, etc.
  source_url TEXT NOT NULL,                 -- Original RERA page URL
  
  -- Update details
  update_type TEXT CHECK (update_type IN (
    'circular',
    'form_update',
    'deadline_change',
    'fee_revision',
    'regulation',
    'news',
    'other'
  )) NOT NULL,
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,                    -- Full text
  published_date DATE,
  
  -- Change detection
  previous_version_id UUID REFERENCES rera_updates(id) ON DELETE SET NULL,
  content_hash TEXT NOT NULL,               -- SHA-256 hash
  content_diff TEXT,                        -- Line-by-line diff
  
  -- AI classification
  is_material_change BOOLEAN DEFAULT FALSE, -- Material vs cosmetic
  ai_summary TEXT,                          -- AI-generated summary
  key_changes JSONB DEFAULT '[]',           -- ["New field X added", ...]
  
  -- Impact
  affected_projects UUID[] DEFAULT '{}',    -- Array of project IDs
  
  -- Attachments
  attachment_urls JSONB DEFAULT '[]',       -- PDFs, images
  
  -- Metadata
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  notified_at TIMESTAMPTZ,                  -- When alerts sent
  acknowledged_by UUID[] DEFAULT '{}'       -- Users who acknowledged
);

CREATE INDEX idx_rera_updates_state ON rera_updates(state);
CREATE INDEX idx_rera_updates_type ON rera_updates(update_type);
CREATE INDEX idx_rera_updates_date ON rera_updates(published_date);
CREATE INDEX idx_rera_updates_material ON rera_updates(is_material_change) WHERE is_material_change = TRUE;
```

---

### rera_deadlines

**Purpose**: Track upcoming RERA deadlines per project.

```sql
CREATE TABLE rera_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Deadline details
  submission_type TEXT NOT NULL,            -- qpr, annual_audit, etc.
  due_date DATE NOT NULL,
  title TEXT NOT NULL,                      -- e.g., "Q1 2025 QPR Due"
  description TEXT,
  
  -- Reminders
  reminder_7d_sent BOOLEAN DEFAULT FALSE,
  reminder_3d_sent BOOLEAN DEFAULT FALSE,
  reminder_1d_sent BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT CHECK (status IN (
    'upcoming',                             -- > 7 days away
    'due_soon',                             -- 3-7 days away
    'critical',                             -- 1-2 days away
    'overdue',                              -- Past due date
    'completed'                             -- Submission made
  )) DEFAULT 'upcoming',
  
  completed_at TIMESTAMPTZ,
  related_submission_id UUID REFERENCES rera_submissions(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rera_deadlines_project ON rera_deadlines(project_id);
CREATE INDEX idx_rera_deadlines_due_date ON rera_deadlines(due_date);
CREATE INDEX idx_rera_deadlines_status ON rera_deadlines(status);
```

---

## Cost Guard Tables

### anomalies

**Purpose**: Track detected financial anomalies.

```sql
CREATE TABLE anomalies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  
  -- Anomaly details
  anomaly_type TEXT CHECK (anomaly_type IN (
    'duplicate',                            -- Duplicate invoice
    'rate_drift',                           -- Price higher than historical
    'gst_error',                            -- Wrong GST %
    'tds_error',                            -- Missing/wrong TDS
    'boq_variance',                         -- Rate higher than BOQ
    'quantity_mismatch',                    -- Invoice qty ≠ site delivery
    'vendor_red_flag'                       -- Vendor with poor history
  )) NOT NULL,
  
  severity TEXT CHECK (severity IN (
    'low',                                  -- <1% impact
    'medium',                               -- 1-5% impact
    'high',                                 -- 5-10% impact
    'critical'                              -- >10% impact or duplicate
  )) DEFAULT 'medium',
  
  -- Description
  description TEXT NOT NULL,
  details JSONB DEFAULT '{}',               -- Additional data (matched invoice, rate comparison, etc.)
  potential_saving DECIMAL(15,2),          -- ₹ amount at risk
  
  -- Resolution
  status TEXT CHECK (status IN (
    'open',                                 -- Newly detected
    'under_review',                         -- Finance head reviewing
    'approved',                             -- Legitimate, proceed with payment
    'rejected',                             -- Fraud/error, reject invoice
    'resolved'                              -- Action taken
  )) DEFAULT 'open',
  
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  resolution_notes TEXT,
  action_taken TEXT,                        -- "Contacted vendor", "Corrected invoice", etc.
  
  -- Metadata
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_anomalies_project ON anomalies(project_id);
CREATE INDEX idx_anomalies_invoice ON anomalies(invoice_id);
CREATE INDEX idx_anomalies_type ON anomalies(anomaly_type);
CREATE INDEX idx_anomalies_severity ON anomalies(severity);
CREATE INDEX idx_anomalies_status ON anomalies(status);
```

---

### leakage_reports

**Purpose**: Weekly summary of cost leakage detected.

```sql
CREATE TABLE leakage_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Period
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  
  -- Metrics
  invoices_processed INTEGER DEFAULT 0,
  duplicates_detected INTEGER DEFAULT 0,
  duplicates_amount_saved DECIMAL(15,2) DEFAULT 0.00,
  rate_anomalies INTEGER DEFAULT 0,
  rate_amount_saved DECIMAL(15,2) DEFAULT 0.00,
  gst_errors INTEGER DEFAULT 0,
  gst_amount_saved DECIMAL(15,2) DEFAULT 0.00,
  boq_variances INTEGER DEFAULT 0,
  boq_amount_saved DECIMAL(15,2) DEFAULT 0.00,
  total_anomalies INTEGER GENERATED ALWAYS AS (
    duplicates_detected + rate_anomalies + gst_errors + boq_variances
  ) STORED,
  total_saved DECIMAL(15,2) GENERATED ALWAYS AS (
    duplicates_amount_saved + rate_amount_saved + gst_amount_saved + boq_amount_saved
  ) STORED,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leakage_reports_project ON leakage_reports(project_id);
CREATE INDEX idx_leakage_reports_week ON leakage_reports(week_start_date);
```

---

## Billing & Notifications Tables

### subscriptions

**Purpose**: Per-project subscription management.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Status
  status TEXT CHECK (status IN (
    'trial',                                -- 30-day free trial
    'active',                               -- Paid, current
    'past_due',                             -- Payment failed
    'cancelled',                            -- User cancelled
    'suspended'                             -- Non-payment suspension
  )) DEFAULT 'trial',
  
  -- Trial period
  trial_start DATE,
  trial_end DATE,
  
  -- Billing period
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  
  -- Pricing (varies by project count tier)
  base_price DECIMAL(10,2) NOT NULL,        -- ₹1,60,000 or discounted
  active_seats INTEGER DEFAULT 5,
  included_seats INTEGER DEFAULT 5,
  seat_overage INTEGER GENERATED ALWAYS AS (
    GREATEST(active_seats - included_seats, 0)
  ) STORED,
  seat_price DECIMAL(10,2) DEFAULT 12000.00,
  seat_overage_charge DECIMAL(10,2) GENERATED ALWAYS AS (
    seat_overage * seat_price
  ) STORED,
  total_monthly_charge DECIMAL(10,2) GENERATED ALWAYS AS (
    base_price + (seat_overage * seat_price)
  ) STORED,
  
  -- Payment gateway (future)
  razorpay_subscription_id TEXT,
  razorpay_customer_id TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_project ON subscriptions(project_id);
CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

---

### notifications

**Purpose**: Track all notifications sent to users.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  -- Notification details
  type TEXT CHECK (type IN (
    'deadline_reminder',                    -- RERA deadline approaching
    'anomaly_alert',                        -- Cost Guard found issue
    'rera_update',                          -- New RERA circular
    'weekly_digest',                        -- Weekly summary email
    'trial_ending',                         -- Trial expiring soon
    'payment_failed',                       -- Subscription payment issue
    'system'                                -- System announcements
  )) NOT NULL,
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,                                -- Deep link to relevant page
  
  urgency TEXT CHECK (urgency IN (
    'info',                                 -- FYI, no action needed
    'important',                            -- Action recommended
    'critical'                              -- Immediate action required
  )) DEFAULT 'info',
  
  -- Delivery channels
  channels TEXT[] DEFAULT '{}',             -- ['whatsapp', 'email', 'push']
  
  -- Delivery status
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  whatsapp_delivered BOOLEAN DEFAULT FALSE,
  email_delivered BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_project ON notifications(project_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_sent ON notifications(sent_at);
CREATE INDEX idx_notifications_unread ON notifications(read_at) WHERE read_at IS NULL;
```

---

### notification_preferences

**Purpose**: User preferences for notifications.

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Channels
  enable_whatsapp BOOLEAN DEFAULT TRUE,
  enable_email BOOLEAN DEFAULT TRUE,
  enable_push BOOLEAN DEFAULT TRUE,
  enable_sms BOOLEAN DEFAULT FALSE,
  
  -- Types
  deadline_reminders BOOLEAN DEFAULT TRUE,
  anomaly_alerts BOOLEAN DEFAULT TRUE,
  rera_updates BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  marketing BOOLEAN DEFAULT FALSE,
  
  -- Quiet hours
  quiet_hours_start TIME,                   -- e.g., 22:00 (10 PM)
  quiet_hours_end TIME,                     -- e.g., 08:00 (8 AM)
  
  -- Contact info
  whatsapp_number TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### audit_logs

**Purpose**: Immutable audit trail of all data changes.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  -- Action details
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')) NOT NULL,
  
  -- Data
  old_values JSONB,                         -- Before (for UPDATE/DELETE)
  new_values JSONB,                         -- After (for INSERT/UPDATE)
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Make audit_logs append-only (no updates/deletes)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs are read-only"
ON audit_logs FOR ALL
USING (TRUE)
WITH CHECK (FALSE);  -- Prevents INSERT via RLS (only triggers can insert)
```

---

## Row Level Security (RLS) Policies

### Enable RLS on all tables

```sql
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
-- ... enable on all tables
```

### Sample RLS Policies

**1. Users can only see projects in their organization:**

```sql
CREATE POLICY "Users access own org projects"
ON projects FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id
    FROM user_organizations
    WHERE user_id = auth.uid()
  )
);
```

**2. Only Finance Head + Owner can insert invoices:**

```sql
CREATE POLICY "Finance roles upload invoices"
ON invoices FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_project_roles upr
    WHERE upr.user_id = auth.uid()
    AND upr.project_id = invoices.project_id
    AND upr.role IN ('owner', 'finance_head')
  )
);
```

**3. Scenario transactions only visible to Owner + Finance Head:**

```sql
CREATE POLICY "Scenario data restricted"
ON bank_transactions FOR SELECT
USING (
  CASE 
    WHEN is_scenario = TRUE THEN
      EXISTS (
        SELECT 1 FROM user_project_roles upr
        WHERE upr.user_id = auth.uid()
        AND upr.project_id = bank_transactions.project_id
        AND upr.role IN ('owner', 'finance_head')
      )
    ELSE
      EXISTS (
        SELECT 1 FROM user_project_roles upr
        WHERE upr.user_id = auth.uid()
        AND upr.project_id = bank_transactions.project_id
      )
  END
);
```

**4. Audit logs are read-only:**

```sql
CREATE POLICY "Audit logs read-only"
ON audit_logs FOR SELECT
USING (TRUE);  -- Everyone can read (for transparency)

CREATE POLICY "Audit logs no mutations"
ON audit_logs FOR INSERT
WITH CHECK (FALSE);  -- No direct inserts (only via triggers)
```

---

## Triggers

### 1. Auto-update `updated_at` timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Repeat for: organizations, users, invoices, etc.
```

### 2. Audit log trigger

```sql
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, new_values)
    VALUES (auth.uid(), TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values, new_values)
    VALUES (auth.uid(), TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values)
    VALUES (auth.uid(), TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to critical tables
CREATE TRIGGER audit_invoices
AFTER INSERT OR UPDATE OR DELETE ON invoices
FOR EACH ROW EXECUTE FUNCTION log_audit();

-- Repeat for: bank_transactions, rera_submissions, subscriptions
```

---

## Indexes Summary

**Performance considerations:**
- Index all foreign keys (for JOINs)
- Index frequently filtered columns (status, date, type)
- Index columns used in WHERE clauses
- Partial indexes for boolean filters (e.g., `WHERE is_flagged = TRUE`)

**Created indexes:** 50+ across all tables (see individual table definitions above)

---

**Next: See [SETUP.md](./SETUP.md) for instructions on running migrations and seeding data.**

