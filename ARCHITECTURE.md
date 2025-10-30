# BuilderOS Architecture

Complete technical architecture, tech stack rationale, data flows, and system design.

---

## Tech Stack & Rationale

### Frontend

**Next.js 15 (App Router)**
- **Why**: React framework with SSR, streaming, server components
- **Benefits**:
  - Fast initial load (server-side rendering)
  - SEO-friendly (public progress widget needs good SEO)
  - Incremental Static Regeneration for dashboard caching
  - Streaming: Show data as it loads (better UX for large datasets)

**TypeScript**
- **Why**: Type safety prevents runtime errors
- **Benefits**:
  - Catches bugs at compile time
  - Better IDE autocomplete
  - Self-documenting code (types = inline documentation)
  - Safer refactoring

**Tailwind CSS**
- **Why**: Utility-first CSS framework
- **Benefits**:
  - Rapid UI development
  - Consistent design system
  - Small bundle size (purges unused CSS)
  - No CSS naming conflicts
  - Mobile-first responsive by default

**shadcn/ui**
- **Why**: High-quality React component library
- **Benefits**:
  - Built on Radix UI (accessible, keyboard navigable)
  - Copy-paste components (no NPM bloat)
  - Customizable (not black-box like Material-UI)
  - Dark mode support built-in
  - Professional, minimal aesthetic

**Recharts**
- **Why**: Composable charting library
- **Benefits**:
  - React-first (not jQuery wrapper like Chart.js)
  - Declarative syntax
  - Responsive by default
  - Good TypeScript support
  - Handles large datasets (virtualization)

### Backend

**Supabase (Postgres + Auth + Storage + Edge Functions)**
- **Why**: Firebase alternative with SQL + real-time + auth in one
- **Benefits**:
  - **Postgres**: Relational database (better for financial data than NoSQL)
  - **Row Level Security (RLS)**: Database-level authorization (can't bypass)
  - **Real-time subscriptions**: Dashboard updates live when data changes
  - **PostgREST API**: Auto-generated REST API from schema
  - **Auth built-in**: Email/OTP, JWT tokens, session management
  - **Storage**: S3-compatible file storage
  - **Edge Functions**: Serverless Deno functions for cron jobs
  - **Mumbai region**: Low latency for Indian users

**Why Supabase over alternatives:**
- **vs Firebase**: SQL > NoSQL for financial data, better querying, RLS
- **vs AWS RDS**: Supabase includes auth + storage + realtime (AWS requires multiple services)
- **vs Custom backend**: Faster development, less maintenance, scales automatically

### AI & OCR

**Claude 4.5 Sonnet (Anthropic)**
- **Why**: Best-in-class for structured data extraction
- **Benefits**:
  - 200K context window (can process long documents)
  - Excellent at following complex instructions
  - JSON mode with schema adherence
  - Lower hallucination rate than GPT-4
  - Good at Indian context (understands GST, RERA, INR)

**AWS Textract**
- **Why**: Best OCR for tables and forms
- **Benefits**:
  - Extracts tables with row/column structure preserved
  - Key-value pair detection ("Invoice Number: [value]")
  - Handwriting recognition
  - Multi-language support (English + regional languages)
  - Handles poor quality scans

**Why not Google Vision OCR:**
- Textract better at tables (critical for BOQs)
- AWS region in Mumbai (lower latency)
- Cost: ~40% cheaper for our use case

### External Services

**Twilio WhatsApp Business API**
- **Why**: WhatsApp has 98% open rate in India (vs 20% for email)
- **Benefits**:
  - Template messages (pre-approved by WhatsApp)
  - Rich media (images, PDFs, buttons)
  - Two-way communication (future: chatbot)
  - Delivery receipts (know if message read)

**SendGrid**
- **Why**: Reliable transactional email service
- **Benefits**:
  - High deliverability (not marked as spam)
  - Templates with variables
  - Analytics (open rate, click rate)
  - Attachments (PDF reports)

**Razorpay/Dodo Payments**
- **Why**: Indian payment gateway (primary target market)
- **Benefits**:
  - UPI, cards, net banking, wallets
  - Subscription management
  - Webhooks for automation
  - GST-compliant invoicing
  - Lower fees than Stripe for INR

### DevOps

**Vercel**
- **Why**: Best Next.js hosting (made by Next.js creators)
- **Benefits**:
  - Zero-config deployment
  - Edge network (fast globally)
  - Automatic preview deployments (per PR)
  - Serverless functions
  - Analytics built-in

**Supabase Mumbai Region**
- **Why**: Database and backend close to users
- **Benefits**:
  - <50ms latency for Indian users
  - Data residency compliance (data stays in India)

**GitHub**
- **Why**: Version control + CI/CD
- **Benefits**:
  - GitHub Actions for automated testing
  - Pull request reviews
  - Issue tracking

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  Next.js 15 + Tailwind + shadcn/ui (Vercel Hosted)     │
│                                                          │
│  Routes:                                                 │
│  - (auth)/login, verify-otp                             │
│  - (dashboard)/projects/[id]/* (protected)              │
│  - p/[rera_id] (public progress widget)                 │
└────────────┬────────────────────────────────────────────┘
             │
             ├─→ API Routes (/app/api/*)
             │   │
             │   ├─→ /documents/upload
             │   │   └─→ AWS Textract → Claude AI
             │   │
             │   ├─→ /ai/process (AI Orchestrator)
             │   │   └─→ Claude API + validation
             │   │
             │   ├─→ /rera/draft-qpr
             │   │   └─→ Fetch data + generate PDF
             │   │
             │   ├─→ /cost-guard/scan
             │   │   └─→ Run anomaly detection
             │   │
             │   ├─→ /escrow/calculate
             │   │   └─→ Bank reconciliation logic
             │   │
             │   └─→ /billing/webhook
             │       └─→ Handle Razorpay events
             │
             ├─→ Server Components (RSC)
             │   ├─→ Dashboard layout
             │   ├─→ Data fetching from Supabase
             │   └─→ Real-time subscriptions
             │
             └─→ Client Components
                 ├─→ File upload dropzone
                 ├─→ Charts (Recharts)
                 └─→ Interactive forms

┌─────────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                       │
│            (Mumbai Region - Low Latency)                 │
└────────────┬────────────────────────────────────────────┘
             │
             ├─→ Postgres Database (25+ tables)
             │   │
             │   ├─→ Core: organizations, projects, users
             │   ├─→ Documents: documents, invoices, transactions
             │   ├─→ RERA: submissions, updates, deadlines
             │   ├─→ Cost Guard: anomalies, leakage_reports
             │   ├─→ Billing: subscriptions, usage_tracking
             │   └─→ Notifications: notifications, preferences
             │   │
             │   └─→ RLS Policies (row-level security)
             │       ├─→ Users see only their org's data
             │       ├─→ Scenario planning: owner + finance_head only
             │       └─→ Audit logs: read-only for all
             │
             ├─→ Supabase Auth
             │   ├─→ Email + OTP login
             │   ├─→ JWT tokens (1-hour expiry)
             │   ├─→ Refresh tokens (30-day)
             │   └─→ Session management
             │
             ├─→ Supabase Storage (S3-compatible)
             │   ├─→ /documents (uploaded PDFs/images)
             │   ├─→ /exports (generated reports)
             │   └─→ /avatars (user profile pics)
             │
             └─→ Supabase Edge Functions (Deno)
                 │
                 ├─→ rera-scraper (cron: daily 2 AM IST)
                 │   ├─→ Playwright scrapes 36 state sites
                 │   ├─→ Detects changes (hash comparison)
                 │   ├─→ AI classifies material vs cosmetic
                 │   └─→ Triggers WhatsApp/email alerts
                 │
                 ├─→ weekly-digest (cron: Sundays 8 PM)
                 │   ├─→ Queries data for past week
                 │   ├─→ Generates summary report
                 │   └─→ Sends via SendGrid
                 │
                 ├─→ deadline-reminders (cron: daily 9 AM)
                 │   ├─→ Checks upcoming deadlines (7/3/1 days)
                 │   └─→ Sends WhatsApp/email alerts
                 │
                 ├─→ cost-guard-scan (cron: daily midnight)
                 │   ├─→ Scans new invoices
                 │   ├─→ Runs anomaly detection
                 │   └─→ Flags duplicates, rate drift
                 │
                 └─→ billing-sync (cron: hourly)
                     ├─→ Checks trial expirations
                     ├─→ Calculates seat overages
                     └─→ Updates subscription charges

┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL AI SERVICES                    │
└────────────┬────────────────────────────────────────────┘
             │
             ├─→ AWS Textract (OCR)
             │   ├─→ Input: PDF/image URL from Supabase Storage
             │   ├─→ Process: Extract text, tables, key-values
             │   ├─→ Output: Structured JSON
             │   └─→ Cost: ~₹2-5 per document
             │
             └─→ Anthropic Claude 4.5 Sonnet
                 ├─→ Input: OCR text + schema + prompt
                 ├─→ Process: Extract structured data
                 ├─→ Output: JSON (validated by Zod)
                 ├─→ Retry: Up to 3 times if invalid
                 └─→ Cost: ~₹0.50-2 per document

┌─────────────────────────────────────────────────────────┐
│                NOTIFICATION SERVICES                     │
└────────────┬────────────────────────────────────────────┘
             │
             ├─→ Twilio WhatsApp API
             │   ├─→ Template messages (pre-approved)
             │   ├─→ Compliance reminders
             │   ├─→ Anomaly alerts
             │   ├─→ Daily/weekly digests
             │   └─→ Cost: ~₹0.50 per message
             │
             └─→ SendGrid Email
                 ├─→ Transactional emails (OTP, alerts)
                 ├─→ Weekly reports (PDF attached)
                 ├─→ Monthly summaries
                 └─→ Cost: ~₹0.02 per email

┌─────────────────────────────────────────────────────────┐
│              PAYMENT & BILLING (Future)                  │
└────────────┬────────────────────────────────────────────┘
             │
             └─→ Razorpay/Dodo Payments
                 ├─→ Subscription API (recurring billing)
                 ├─→ Webhooks (payment.captured, subscription.charged)
                 ├─→ Usage-based billing (seat add-ons)
                 ├─→ GST invoicing (18% on SaaS)
                 └─→ Cost: ~2% transaction fee
```

---

## Data Flow Examples

### Example 1: Invoice Upload → Cost Guard Alert

```
1. USER ACTION:
   - Finance head drags PDF invoice to upload dropzone
   - Frontend validates: file size <10MB, type = PDF/image

2. FRONTEND (Next.js):
   - Upload file to Supabase Storage (/documents bucket)
   - Get file URL: https://xxx.supabase.co/storage/v1/object/documents/invoice_123.pdf
   - Call API: POST /api/documents/upload { file_url, project_id, type: 'invoice' }

3. API ROUTE (/api/documents/upload):
   - Insert record in 'documents' table (status = 'processing')
   - Call AWS Textract API
   
4. AWS TEXTRACT:
   - Download PDF from Supabase Storage URL
   - Extract: Raw text, tables, key-value pairs
   - Return JSON: { text: "...", tables: [...], key_values: [...] }

5. API ROUTE:
   - Call /api/ai/process with:
     task_type = 'invoice_parse'
     input_data = Textract output
     schema = InvoiceSchema (Zod)

6. AI ORCHESTRATOR (/api/ai/process):
   - Load prompt template for invoice parsing
   - Send to Claude API:
     "Extract invoice data from this OCR output: {...}
      Return JSON matching this schema: {...}"
   - Receive Claude response: { supplier_name: "ABC", amount: 820000, ... }
   - Validate against Zod schema
   - If invalid: Retry with error feedback (max 3 times)
   - If valid: Return to upload API

7. API ROUTE:
   - Check for duplicates:
     SELECT * FROM invoices
     WHERE supplier_name SIMILAR TO 'ABC%'
     AND amount BETWEEN 779000 AND 861000  -- ±5%
     AND invoice_date > CURRENT_DATE - INTERVAL '30 days'
   
   - DUPLICATE FOUND!
   - Insert into 'anomalies' table:
     { type: 'duplicate', severity: 'high', invoice_id: ..., description: "..." }
   
   - DON'T insert into 'invoices' table yet (pending review)
   - Update document status: 'needs_review'

8. REALTIME SUBSCRIPTION (Supabase):
   - Frontend listens to 'anomalies' table INSERT events
   - Receives new anomaly in real-time

9. FRONTEND:
   - Show alert banner: "⚠️ Possible duplicate invoice detected"
   - Update review queue count badge
   - Play notification sound

10. BACKGROUND:
    - Edge Function 'cost-guard-scan' (runs at midnight)
    - Sends WhatsApp alert to finance head:
      "🚨 Duplicate invoice detected: ₹8.2L from ABC Suppliers. Review now: [link]"

11. USER REVIEW:
    - Finance head clicks link → Review page
    - Sees side-by-side comparison: New invoice vs existing
    - Clicks "Reject Invoice" button

12. API:
    - Update anomaly status: 'rejected'
    - Delete document record
    - Delete file from Storage
    - Log audit entry: "User X rejected invoice Y"

RESULT: ₹8.2L duplicate invoice caught, saved before payment made
```

### Example 2: RERA Scraper Detects Form Update

```
1. CRON TRIGGER:
   - Supabase cron: Every day at 2:00 AM IST
   - Triggers Edge Function: rera-scraper

2. EDGE FUNCTION (rera-scraper):
   - Loop through all 36 states
   - For Maharashtra:
     a) Launch Playwright browser (headless)
     b) Navigate to: https://maharera.mahaonline.gov.in/notifications
     c) Wait for page load (dynamic content)
     d) Extract HTML of notifications section
     e) Calculate SHA-256 hash of HTML
     f) Query database:
        SELECT content_hash FROM rera_updates
        WHERE state = 'Maharashtra'
        ORDER BY scraped_at DESC LIMIT 1
     g) Compare hashes:
        Old: a3f8d9e2...
        New: b7c4e1f5...  ← DIFFERENT!
     
     h) CHANGE DETECTED!
        - Extract new notifications
        - Generate diff (old HTML vs new HTML)
        - Take screenshot (archive)
        - Download new form PDF (if link found)

3. AI CLASSIFICATION:
   - Send diff to Claude:
     "Classify this change as material or cosmetic.
      Material = form update, deadline change, fee revision.
      Cosmetic = typo fix, formatting.
      Also extract key changes."
   
   - Claude response:
     {
       classification: "material",
       change_type: "form_update",
       summary: "QPR Form 4 updated from v3.2 to v3.3",
       key_changes: [
         "New field: EWS unit allocation %",
         "New field: Rainwater harvesting compliance"
       ]
     }

4. IDENTIFY AFFECTED PROJECTS:
   - Query:
     SELECT id, name FROM projects WHERE state = 'Maharashtra'
   - Result: [Project A, Project B]

5. INSERT UPDATE RECORD:
   - Insert into 'rera_updates' table:
     {
       state: 'Maharashtra',
       update_type: 'form_update',
       title: 'QPR Form 4 Updated (v3.2 → v3.3)',
       content: '...',
       url: 'https://...',
       is_material_change: true,
       affected_projects: [project_a_id, project_b_id]
     }

6. TRIGGER ALERTS:
   - For each affected project:
     - Get project's finance head + owner users
     - Send WhatsApp (Twilio):
       "🚨 CRITICAL RERA UPDATE\n\n
        Maharashtra updated QPR Form 4...\n
        View changes: [link]"
     
     - Send email (SendGrid):
       Subject: "🚨 Action Required: RERA Form Updated"
       Body: Full details + diff view
       Attachment: New form PDF

7. FRONTEND (Real-time):
   - User's dashboard subscribes to 'rera_updates' table
   - Receives INSERT event in real-time
   - Shows notification toast: "New RERA update for Maharashtra"
   - Badge on RERA Compliance tab

8. USER VIEWS UPDATE:
   - Clicks notification
   - Sees side-by-side diff:
     OLD FORM          | NEW FORM
     -----------------|-----------------
     1. Project Name   | 1. Project Name
     2. RERA ID        | 2. RERA ID
                       | 3. EWS Allocation % [NEW]
   
   - Marks as "Acknowledged"

RESULT: User alerted within 5 minutes of RERA website update
        Zero risk of using outdated form
```

---

## Security Architecture

### Authentication Flow

```
1. USER ENTERS EMAIL:
   - POST /auth/login { email }
   - Supabase Auth sends OTP to email

2. USER ENTERS OTP:
   - POST /auth/verify { email, otp }
   - Supabase validates OTP
   - Returns JWT access token (1-hour expiry)
   - Returns refresh token (30-day expiry)

3. FRONTEND STORES TOKENS:
   - Access token: Memory only (not localStorage - XSS risk)
   - Refresh token: HttpOnly cookie (not accessible to JavaScript)

4. API REQUESTS:
   - Every request includes: Authorization: Bearer {access_token}
   - Supabase validates JWT signature
   - Extracts user_id from token payload

5. TOKEN REFRESH:
   - Access token expires after 1 hour
   - Frontend detects 401 Unauthorized
   - Calls /auth/refresh (sends refresh token cookie)
   - Supabase issues new access token
   - Retry original request

6. LOGOUT:
   - POST /auth/logout
   - Revoke refresh token
   - Clear cookies
```

### Row Level Security (RLS)

**Concept**: Authorization enforced at database level (not application level)

**Why**: Application bugs can't bypass security (e.g., forgot WHERE clause in query)

**Example policies:**

```sql
-- Policy 1: Users can only see projects in their organization

CREATE POLICY "Users access own org projects"
ON projects FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = auth.uid()  -- auth.uid() = current logged-in user
  )
);

-- How it works:
-- User A (org 1) queries: SELECT * FROM projects
-- Postgres automatically adds: WHERE organization_id IN (1)
-- User A cannot see org 2's projects (even if they guess the ID)


-- Policy 2: Finance Head can insert invoices

CREATE POLICY "Finance Head upload invoices"
ON invoices FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_project_roles upr
    WHERE upr.user_id = auth.uid()
    AND upr.project_id = invoices.project_id
    AND upr.role IN ('owner', 'finance_head')
  )
);

-- How it works:
-- Viewer tries: INSERT INTO invoices (project_id, ...) VALUES (123, ...)
-- Postgres checks policy → User is 'viewer' → INSERT fails with 403


-- Policy 3: Scenario planning restricted

CREATE POLICY "Scenario data restricted"
ON transactions FOR SELECT
USING (
  CASE 
    WHEN is_scenario = true THEN
      -- Scenario transactions: Only owner + finance_head
      EXISTS (
        SELECT 1 FROM user_project_roles upr
        WHERE upr.user_id = auth.uid()
        AND upr.project_id = transactions.project_id
        AND upr.role IN ('owner', 'finance_head')
      )
    ELSE
      -- Official transactions: All project members
      EXISTS (
        SELECT 1 FROM user_project_roles upr
        WHERE upr.user_id = auth.uid()
        AND upr.project_id = transactions.project_id
      )
  END
);

-- How it works:
-- CA queries: SELECT * FROM transactions WHERE project_id = 123
-- Postgres filters: Returns only rows where is_scenario = false
-- CA cannot see scenario planning data (even if they modify frontend code)
```

### Data Encryption

**At Rest:**
- Supabase encrypts all data with AES-256
- Encryption keys managed by Supabase (automatic)
- Backups also encrypted

**In Transit:**
- All API calls use HTTPS (TLS 1.3)
- WebSocket connections (realtime) use WSS (WebSocket Secure)

**Sensitive Fields:**
- NO additional encryption for scenario planning (transparent to auditors)
- Rationale: If encrypted, looks like hiding data (legal risk)
- Instead: Access control via RLS (only authorized users see data)

### API Security

**Rate Limiting:**
```typescript
// Vercel edge config
export const config = {
  runtime: 'edge',
  rateLimit: {
    limit: 100,              // requests
    window: '1m',            // per minute
    onRateLimit: 'error'     // return 429 Too Many Requests
  }
};
```

**Input Validation:**
```typescript
// Every API route validates input with Zod
import { z } from 'zod';

const uploadSchema = z.object({
  file_url: z.string().url(),
  project_id: z.string().uuid(),
  type: z.enum(['invoice', 'boq', 'bank_statement'])
});

export async function POST(req: Request) {
  const body = await req.json();
  const validated = uploadSchema.parse(body);  // Throws if invalid
  // ... process validated data
}
```

**CORS Restrictions:**
```typescript
// Only builderos.com allowed
const allowedOrigins = [
  'https://builderos.com',
  'https://www.builderos.com',
  'http://localhost:3000'  // dev only
];

if (!allowedOrigins.includes(req.headers.get('origin'))) {
  return new Response('Forbidden', { status: 403 });
}
```

### Audit Logging

**Every mutation logged:**
```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  project_id uuid REFERENCES projects,
  table_name text,
  record_id uuid,
  action text,  -- INSERT | UPDATE | DELETE
  old_values jsonb,  -- Before update/delete
  new_values jsonb,  -- After insert/update
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Automatic trigger on all tables
CREATE TRIGGER audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON invoices
FOR EACH ROW EXECUTE FUNCTION log_audit();
```

**Retention**: 7 years (regulatory compliance)

**Immutable**: Cannot be edited or deleted (append-only)

---

## Scalability & Performance

### Database Optimization

**Indexes:**
```sql
-- Speed up queries
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_supplier ON invoices(supplier_name);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_rera_updates_state ON rera_updates(state, published_date);
```

**Partitioning (future):**
```sql
-- For large tables (10M+ rows), partition by date
CREATE TABLE invoices_2025 PARTITION OF invoices
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

**Query optimization:**
- Use `EXPLAIN ANALYZE` to identify slow queries
- Add indexes on frequently filtered columns
- Avoid N+1 queries (use JOINs or batch loading)

### Caching

**Server Components caching:**
```typescript
// Revalidate every 5 minutes
export const revalidate = 300;

export default async function ProjectDashboard({ params }) {
  const project = await getProject(params.id);  // Cached for 5 min
  return <DashboardUI project={project} />;
}
```

**API route caching:**
```typescript
// Cache expensive calculations
import { unstable_cache } from 'next/cache';

const getLeakageReport = unstable_cache(
  async (projectId: string) => {
    // Expensive aggregation query
    return await calculateLeakage(projectId);
  },
  ['leakage-report'],
  { revalidate: 3600 }  // Cache for 1 hour
);
```

### Load Testing Targets

- **API latency**: <200ms for 95% of requests
- **Dashboard load time**: <1.5s (First Contentful Paint)
- **Concurrent users**: 1000+ simultaneous
- **Throughput**: 10,000 API requests/minute

### Scaling Strategy

**Phase 1 (0-100 customers):**
- Single Supabase instance (sufficient for 10M+ rows)
- Vercel serverless functions (auto-scales)

**Phase 2 (100-500 customers):**
- Read replicas for analytics queries
- CDN caching for static assets
- Separate database for AI training data

**Phase 3 (500+ customers):**
- Database sharding (by organization)
- Microservices for heavy workloads (RERA scraper)
- Dedicated AI inference servers

---

## Deployment Architecture

### Production Environment

**Frontend (Vercel):**
- Region: All (edge network, serves from nearest location)
- Auto-scaling: Yes
- Zero downtime deployments: Yes

**Backend (Supabase):**
- Region: Mumbai (ap-south-1)
- Instance: Pro plan (dedicated compute)
- Backups: Daily automated backups (30-day retention)

**Edge Functions (Supabase):**
- Region: Mumbai
- Timeout: 5 minutes (for long-running scrapers)
- Memory: 512MB

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Run type check
      - Run unit tests
      - Run E2E tests

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Deploy to Vercel
      - Run database migrations
      - Deploy Edge Functions
      - Notify team (Slack)
```

### Monitoring & Alerts

**Supabase Dashboard:**
- Database CPU/memory usage
- Query performance (slow queries)
- Connection pool status

**Vercel Analytics:**
- Page load times
- Core Web Vitals
- Error rates

**Sentry (Error Tracking):**
- Frontend errors
- API errors
- Automatic error grouping
- Slack alerts for critical errors

**Custom Monitoring:**
- RERA scraper health dashboard
  - Last successful scrape per state
  - Success rate (target: 95%+)
  - Alert if 3+ consecutive failures

**Uptime Monitoring:**
- Pingdom/UptimeRobot
- Check every 1 minute
- Alert if down for 5+ minutes

---

## Development Workflow

### Local Setup

```bash
# 1. Clone repo
git clone https://github.com/builderos/builderos.git
cd builderos

# 2. Install dependencies
npm install

# 3. Setup Supabase locally
supabase init
supabase start  # Starts local Postgres + API

# 4. Run migrations
supabase db push

# 5. Seed data
supabase db seed

# 6. Start Next.js dev server
npm run dev
```

### Git Workflow

**Branching strategy:**
- `main`: Production (auto-deploys to Vercel)
- `develop`: Staging (auto-deploys to staging.builderos.com)
- Feature branches: `feature/rera-scraper`, `fix/duplicate-detection`

**Pull Request flow:**
1. Create feature branch from `develop`
2. Commit changes with conventional commits: `feat: add RERA scraper`
3. Open PR to `develop`
4. Automated checks run: TypeScript, tests, linting
5. Code review required (1 approval)
6. Merge to `develop`
7. Test on staging
8. Merge `develop` → `main` (production)

### Code Quality

**ESLint + Prettier:**
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

**Pre-commit hooks (Husky):**
```bash
# Runs before every commit
npm run lint
npm run type-check
```

---

**Next: See [DATABASE.md](./DATABASE.md) for complete schema documentation.**

