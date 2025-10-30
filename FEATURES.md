# BuilderOS Features - Complete Breakdown

This document explains **every feature** in BuilderOS, **why it's needed**, and **how it helps** real estate developers.

---

## Module 1: Authentication & Organization Management

### What it is
Multi-tenant authentication system with organization → project hierarchy and role-based access control.

### Why it's needed
Real estate companies have complex structures: one organization (e.g., "Urban Risers Developers") manages multiple legal entities/projects, each with separate RERA registrations, bank accounts, and teams. Different team members need different access levels.

### How it helps

**Supabase Auth with Email + OTP:**
- No passwords to remember or reset
- OTP sent to registered email
- Session management with JWT tokens

**Organization Hierarchy:**
- One organization → Multiple projects
- Example: "Urban Risers Developers" has 20 projects across 5 states
- Portfolio dashboard shows all projects in one view
- But billing is per-project (scales revenue with value)

**Role-Based Access:**
- **Owner**: Full access including scenario planning (internal budgets)
  - Can see "private" transactions
  - Can approve/reject anomalies
  - Can invite/remove team members
- **Finance Head**: All financial data, can upload documents, view reports
  - Processes invoices
  - Reviews Cost Guard alerts
  - Exports reports for auditors
- **CA/Auditor**: Read-only access to books, can export reports
  - Cannot modify data
  - Can see official books (not scenario planning)
- **Viewer**: Dashboard insights only, no raw data access
  - For site managers, junior staff
  - Sees charts and summaries only

**Seat Management:**
- Base plan includes 5 users per project
- 6th user added → System auto-charges ₹12K/month seat fee
- Admin gets confirmation prompt before adding
- Billing dashboard shows seat count per project

**Audit Trail:**
- Every action logged: Who uploaded, who approved, who exported
- Immutable logs (cannot be deleted)
- 7-year retention for compliance
- Shows: User, timestamp, IP address, action, old/new values

### Key Features
- Email/OTP authentication
- Organization creation wizard
- Project onboarding (RERA ID → auto-fetch project details from RERA portal)
- Team invitation via email
- Role assignment and permission enforcement
- Row Level Security (RLS) in database (users can ONLY query their org's data)

---

## Module 2: Intelligent Document Processing Pipeline

### What it is
AI-powered OCR and data extraction system that converts PDFs, images, and CSVs into structured, searchable data.

### Why it's needed
Builders deal with hundreds of documents monthly:
- Supplier invoices (paper + PDF)
- Contractor bills
- Bank statements (downloaded CSV or scanned PDF)
- RERA forms
- BOQs (Bill of Quantities) from architects
- Purchase orders

**The manual process:**
- Finance staff manually types data from each invoice into Tally/Excel
- 5-10 minutes per invoice × 500 invoices/month = 200+ hours
- Prone to typos: ₹8,20,000 becomes ₹8,02,000 (₹18K error)

**Legacy OCR problems:**
- Adobe Acrobat extracts text but doesn't understand structure
- Result: "Amount: ₹820000 GST: ₹147600 Total: ₹967600" → Which number is which?
- Still requires manual data entry

### How it helps

**Step 1: Drag-Drop Upload**
- Simple interface: "Drop invoices, BOQs, or bank statements here"
- Supports: PDF, JPG, PNG, CSV
- Bulk upload: Drop 100 files at once
- Progress bar shows: "Processing 23/100..."

**Step 2: AWS Textract OCR**
- Extracts text, tables, and key-value pairs
- Understands form structure: "Invoice Number: [value]"
- Handles poor scans, rotated images, handwritten annotations
- 95%+ accuracy on printed documents

**Step 3: Claude AI Extraction**
- Understands document context
- For invoices, extracts:
  - **Supplier details**: Name, GSTIN, address
  - **Invoice metadata**: Number, date, PO reference
  - **Line items**: Description, HSN code, quantity, unit, rate, GST%, amount
  - **Totals**: Subtotal, CGST, SGST, IGST, TDS, round-off, total
- For bank statements:
  - **Transaction details**: Date, ID, party name, debit, credit, balance, narration
  - **Smart categorization**: "NEFT to ABC Constructions" → Construction cost
- For BOQs:
  - **Work items**: Category, description, unit, quantity, rate, total
  - **Milestones**: Links items to project phases

**Step 4: Schema Validation**
- AI output validated against Zod schema
- Example schema for invoice:
  ```typescript
  {
    supplier_name: string (required, min 2 chars)
    supplier_gstin: string (optional, must match GST format)
    invoice_number: string (required)
    invoice_date: date (required, must be <= today)
    line_items: array (min 1 item) {
      description: string
      quantity: number (> 0)
      rate: number (> 0)
      gst_pct: number (0, 5, 12, 18, 28)
    }
    total_amount: number (> 0)
  }
  ```
- If invalid: Extract error, send back to AI: "Fix this error: {error message}"
- Retry up to 3 times
- If still fails: Flag for human review

**Step 5: Confidence Scoring**
- Each field gets confidence score (0-100%)
- Example: supplier_name: 98%, invoice_date: 95%, line_items[2].rate: 62%
- Low confidence (<75%) → Flag for human review
- User reviews: Accepts or corrects value
- Corrections feed back into AI training (future improvement)

**Step 6: Duplicate Detection**
- Before saving, check if invoice already exists
- Fuzzy match on: Supplier + amount (±5%) + date (±30 days)
- If match found: "⚠️ Possible duplicate: Invoice #4567 already exists"
- User can: Skip (don't save) / Override (save anyway with note)

### Key Features
- Multi-file drag-drop upload
- Automatic document type detection (invoice vs BOQ vs bank statement)
- OCR → AI → Validation pipeline
- Human review queue for low-confidence extractions
- Bulk import: Upload 100 invoices → Process overnight → Email when done
- Export extracted data to CSV/Excel

### Accuracy & Human Review (Critical)

**Reality check on AI accuracy:**
- AWS Textract OCR: 95-98% accuracy
- Claude AI extraction: 85-95% accuracy
- **Combined end-to-end: 80-93% accuracy**

**This means: AI will make mistakes. Human review is MANDATORY.**

**Human-in-the-loop workflow:**
1. AI extracts data → Shows in review queue
2. Finance head sees:
   - **Confidence score** per field (Green >90%, Yellow 75-90%, Red <75%)
   - **Original document** (side-by-side with extracted data)
   - **Edit buttons** (click any field to correct)
3. Finance head reviews, corrects errors (10-15 min per batch of 20 invoices)
4. Clicks "Approve" → Data saved to system
5. **Nothing auto-saves without approval** (too risky for ₹100Cr projects)

**Liability protection:**
- Terms clearly state: "AI-assisted, human-verified"
- User responsible for final accuracy
- Digital signature on all RERA submissions (audit trail)
- Professional indemnity insurance (₹10Cr cover)

**Gradual accuracy improvement:**
- Month 1: User corrects 30-40% of extractions (AI learning)
- Month 3: Corrections drop to 10-15% (AI learned patterns)
- Month 6: Corrections down to 5% (high trust)

**Manual override always available:**
- If OCR/AI completely fails → Manual entry form
- Finance head can skip AI and enter directly
- Bulk import via CSV (for clean digital data)

### Time Saved (Realistic)
**Before BuilderOS:** 200 hours/month of manual data entry  
**After BuilderOS:** 30 hours/month (20 hrs review + 10 hrs corrections)  
**Savings:** 170 hours = ₹1.4L/month (assuming ₹8K per data entry staff)

**Additional value beyond time savings:**
- **Error prevention**: Duplicate detection, rate anomalies (saves ₹8L+/month)
- **Penalty prevention**: RERA compliance autopilot (saves ₹20L+/year)
- **Peace of mind**: Continuous monitoring, early alerts

---

## Module 3: RERA Compliance Autopilot Engine

### What it is
Automated RERA submission system that drafts quarterly/annual reports, tracks deadlines, generates PDFs, and monitors regulatory changes across all 36 Indian states/UTs.

### Why it's needed

**RERA compliance is the #1 stress point for developers:**

1. **36 different authorities**: Each state has different forms, deadlines, fees, rules
   - Maharashtra: QPR due 21st of next quarter's first month
   - Karnataka: QPR due 30th of next quarter's first month
   - Form formats completely different

2. **Frequent changes**: States update forms/rules WITHOUT advance notice
   - Real example: Maharashtra RERA changed QPR Form 4 in July 2023
   - Added 2 new fields: CSR expenditure, green building compliance
   - Builders who didn't notice → Used old form → Rejected → Late penalty

3. **Strict deadlines**: Miss a QPR → ₹10-50L penalty + project sales suspended
   - No grace period
   - Penalty accrues daily after deadline
   - Sales freeze means cannot sell units = cash flow crisis

4. **Complex calculations**: QPR requires:
   - Escrow % (funds collected vs utilized)
   - Construction progress % (physically measured + financially spent)
   - Unit sales (sold, unsold, occupied)
   - Fund utilization (category-wise: land, construction, approvals)
   - Data scattered across: Tally (accounting), bank statements, site reports, sales CRM

5. **Consultant dependency**: Developers pay ₹80K-1.5L/month to RERA consultants
   - Consultants manually compile data from multiple sources
   - 3-5 day turnaround time
   - Still miss deadlines sometimes (consultant busy with other clients)

### How it helps

#### A. State-Wise Rule Engine

**JSON config files for all 36 states:**

Example: `lib/rera/states/maharashtra.json`
```json
{
  "state": "Maharashtra",
  "authority": "MahaRERA",
  "website": "https://maharera.mahaonline.gov.in",
  "forms": {
    "qpr": {
      "name": "Form 4 - Quarterly Progress Report",
      "version": "3.2",
      "updated_date": "2023-07-15",
      "due_date_rule": "21st of first month of next quarter",
      "fields": [
        "project_details",
        "construction_progress_pct",
        "funds_collected",
        "funds_utilized",
        "escrow_balance",
        "units_sold",
        "csr_expenditure",
        "green_building_compliance"
      ]
    },
    "annual_audit": {
      "name": "Form 5 - Annual Audit Certificate",
      "due_date": "May 31 every year",
      "requires_ca_signature": true
    }
  },
  "fees": {
    "qpr_late_fee": "₹10,000 per day",
    "max_penalty": "₹50,00,000"
  }
}
```

**System automatically:**
- Loads correct form template based on project's state
- Calculates due dates based on rules
- Validates submission against current form version

#### B. Auto-Population of QPR

**AI drafts QPR by pulling data from:**

1. **Invoices → Construction cost incurred**
   - Filters invoices by category: Construction (cement, steel, labor)
   - Sums amounts for quarter
   - Example: Q1 2025 construction cost = ₹2.3Cr

2. **Bank statements → Funds utilized from escrow**
   - Filters transactions: Debits from escrow account
   - Categorizes: Land, construction, approvals, interest
   - Calculates escrow %: (Funds utilized / Funds collected) × 100

3. **Sales data → Units sold/available**
   - Queries: Units with status = "sold" vs "available"
   - Example: 120 sold / 200 total = 60% sold

4. **Project milestones → Construction progress %**
   - Example: Foundation (100%) | Structure (75%) | Finishing (30%)
   - Weighted average based on BOQ costs

**Result: QPR draft ready in 2 minutes (vs 3 days with consultant)**

#### C. PDF Generation

**Using PDFKit:**
- Generates submission-ready PDF
- Includes all annexures:
  - Financial statement
  - Bank escrow certificate
  - Engineer's progress certificate
  - Unit sales register
- Digital signature placeholders (builder signs with DSC)
- Automatically formatted per state requirements

#### D. Deadline Tracking & Reminders

**Smart alert system:**

- **7 days before deadline**: WhatsApp + email
  - "📅 Reminder: Maharashtra QPR for Project Sunshine Heights due Oct 21. Draft now: [link]"
  - User clicks link → Reviews pre-filled QPR → Makes any edits → Approves

- **3 days before**: Urgent alert
  - "🚨 URGENT: QPR due in 3 days. Please review draft."
  - Includes draft preview in email

- **1 day before**: Critical alert to owner
  - "🔴 CRITICAL: QPR due tomorrow. Immediate action required."
  - SMS + WhatsApp + email + dashboard notification

- **Day of deadline**: Final reminder at 9 AM
  - "⏰ LAST DAY: QPR must be submitted by 5 PM today."

**Calendar view:**
- Shows all upcoming deadlines across all projects
- Color-coded: Green (done) | Yellow (upcoming) | Red (overdue)
- Export to Google Calendar / Outlook

#### E. Daily RERA Scraper (Mission-Critical)

**This is the killer feature that justifies BuilderOS pricing.**

**What it does:**
- Runs every day at 2 AM IST (Supabase Edge Function with cron)
- Scrapes all 36 state RERA websites
- Monitors specific pages:
  - Notifications/circulars
  - Forms/downloads
  - News/updates
  - Deadlines/calendar

**Technology:**
- Playwright (headless browser)
- Handles dynamic sites (JavaScript-rendered content)
- Takes screenshots for archival

**What it scrapes:**
- New circulars/notifications
- Form updates (new versions)
- Deadline changes (extensions, holidays)
- Fee structure revisions
- New regulations

**Change Detection Algorithm:**

1. **Hash-based comparison:**
   - Calculate SHA-256 hash of page content
   - Compare to previous hash stored in database
   - If different → Content changed

2. **Content diff:**
   - Extract text from new vs old version
   - Generate line-by-line diff (like Git)
   - Highlight: Red (removed), green (added), yellow (modified)

3. **AI semantic analysis:**
   - Send diff to Claude: "Is this a material change or cosmetic?"
   - Material: Form field added, deadline changed, fee increased
   - Cosmetic: Typo fixed, formatting changed, contact number updated
   - AI classifies + extracts key changes

**Immediate Alerts:**

**Example alert (material change detected):**
```
🚨 CRITICAL RERA UPDATE

State: Maharashtra
Date: Oct 28, 2025, 2:14 AM

CHANGE: QPR Form 4 updated (v3.2 → v3.3)

NEW FIELDS ADDED:
1. EWS unit allocation % (mandatory)
2. Rainwater harvesting compliance (yes/no)

AFFECTED PROJECTS:
- Sunshine Heights (P51700012345)
- Eco Towers (P51700023456)

ACTION REQUIRED:
Update your next QPR submission with these fields.

View full changes: https://builderos.com/rera-updates/MH-2025-10-28

---
Sent by BuilderOS at 2:14 AM IST
```

**Delivery:**
- WhatsApp message (immediate)
- Email with full diff attached
- Dashboard notification
- SMS to owner (if critical)

**Diff View in Dashboard:**

Side-by-side comparison:
```
OLD FORM (v3.2)          | NEW FORM (v3.3)
-------------------------|---------------------------
1. Project Name          | 1. Project Name
2. RERA ID               | 2. RERA ID  
3. Construction Progress | 3. Construction Progress
4. Funds Utilized        | 4. Funds Utilized
                         | 5. EWS Allocation % [NEW]
                         | 6. Rainwater Harvesting [NEW]
5. Signature             | 7. Signature
```

**Fallback & Monitoring:**

- If scraper fails (site down, structure changed):
  - Admin dashboard shows red alert
  - BuilderOS team manually checks within 2 hours
  - Updates scraper config if site structure changed

- Health dashboard shows:
  - Last successful scrape for each state
  - Success rate (95%+ target)
  - Errors logged

**Historical Archive:**
- Every form version stored
- Audit trail: "Why did we use Form 4 v3.2 on Oct 15?"
  - Answer: "Because it was current version on submission date"
- Protects against RERA disputes

**Websites Monitored (15 major markets covering 90%+ of Indian real estate):**

**Tier 1 Markets (Primary focus):**
1. **Maharashtra**: maharera.mahaonline.gov.in
   - Coverage: Mumbai, Pune, Thane, Navi Mumbai, MMR
2. **Karnataka**: rera.karnataka.gov.in
   - Coverage: Bangalore, Mysore
3. **Telangana**: rera.telangana.gov.in
   - Coverage: Hyderabad, Secunderabad
4. **Tamil Nadu**: www.tnrera.in
   - Coverage: Chennai, Coimbatore
5. **Delhi**: rera.delhi.gov.in
   - Coverage: Delhi NCR (includes Gurgaon, Noida via Haryana/UP RERA)
6. **Haryana**: haryanarera.gov.in
   - Coverage: Gurgaon, Faridabad
7. **Uttar Pradesh**: www.up-rera.in
   - Coverage: Noida, Greater Noida, Lucknow

**Tier 2 Markets (Secondary focus):**
8. **Gujarat**: gujrera.gujarat.gov.in
   - Coverage: Ahmedabad, Surat
9. **West Bengal**: wbhira.gov.in
   - Coverage: Kolkata
10. **Kerala**: rera.kerala.gov.in
    - Coverage: Kochi, Trivandrum
11. **Goa**: rera.goa.gov.in
12. **Rajasthan**: rera.rajasthan.gov.in
    - Coverage: Jaipur

**Why not all 36 states?**
- These 15 markets account for 90%+ of projects valued ₹100Cr+
- Easier to maintain and fix if scraper breaks
- Faster response time (fewer sites to monitor)
- Can add more states on customer demand (2-week turnaround)

**For remaining states:**
- Manual monitoring by BuilderOS team
- Email alerts forwarded to customers
- Custom state addition available (if 3+ customers need it)

### Key Features
- One-click QPR draft generation
- Human review before submission (liability stays with builder)
- PDF pack with all annexures
- Calendar view of deadlines
- Compliance score: "8/10 submissions on time this year"
- Regulatory news feed on dashboard
- Archive of all past submissions
- Daily scraper with immediate alerts

### Value Delivered
- **Prevents penalties**: ₹20L+ per year (avg builder misses 1 deadline)
- **Eliminates consultant fee**: ₹1.2L/month = ₹14.4L/year
- **Reduces stress**: No more last-minute scrambles
- **Audit-ready**: All documentation in one place
- **Competitive advantage**: Know about changes before competitors

---

## Module 4: Cost Guard (Intelligent Leakage Detection)

### What it is
AI-powered financial anomaly detection system that catches duplicate bills, rate drift, GST/TDS errors, and vendor irregularities BEFORE payments are made.

### Why it's needed

**Cost leakage in construction projects:**

- **Industry statistic**: 0.5-1% of project cost leaks through errors/fraud
- **For ₹100Cr project**: ₹50L-1Cr lost
- **Common causes**:
  1. **Duplicate invoices**: Supplier submits same bill twice (different invoice number, same items/amounts)
  2. **Rate drift**: Steel ₹55/kg in Jan → ₹75/kg in Mar (market rate ₹58/kg)
  3. **GST/TDS errors**: Wrong tax %, missing TDS deduction
  4. **Overbilling**: BOQ says ₹500/sqft, invoice charges ₹650/sqft
  5. **Ghost quantities**: Invoice claims 1000 bags cement, site received 800

**Why it happens:**
- Finance teams process 500+ invoices/month
- Cannot manually cross-check every invoice against:
  - Historical purchases
  - BOQ rates
  - Market rates
  - Tax rules
  - Site delivery records
- Time pressure: Vendor threatens to stop supply if payment delayed

### How it helps

#### A. Duplicate Detection Algorithm

**Fuzzy matching on:**
- Supplier name (handles typos: "ABC Constructions" vs "ABC Construction")
- Amount (±5% tolerance: ₹8.2L vs ₹8.3L considered duplicate)
- Date (±30 days: If same supplier, similar amount within month)
- Line items (same products, quantities)

**Example:**
```
🚨 POSSIBLE DUPLICATE DETECTED

Invoice #4567 (uploaded today):
- Supplier: ABC Constructions Pvt Ltd
- Date: Oct 25, 2025
- Amount: ₹8,20,000
- Items: 10 MT TMT steel, 500 bags cement

MATCHES existing invoice #4521:
- Supplier: ABC Construction Ltd (95% name match)
- Date: Oct 10, 2025 (15 days ago)
- Amount: ₹8,30,000 (₹10K difference = 1.2%)
- Items: 10 MT TMT steel, 500 bags cement (exact match)

Confidence: 97% (definitely duplicate)

ACTIONS:
[Reject Invoice] [Override & Save] [View Both Invoices]
```

**Confidence scoring:**
- 90-100%: Definitely duplicate (red flag)
- 70-89%: Likely duplicate (yellow flag, review recommended)
- <70%: Low match (allowed through)

#### B. Rate Benchmarking

**Historical comparison:**
```
⚠️ RATE ANOMALY DETECTED

Invoice #4789 - Steel purchase:
- Rate: ₹68/kg for TMT Fe500D
- Quantity: 50 MT
- Total: ₹34,00,000

HISTORICAL RATES (last 6 months):
- Jan 2025: ₹52/kg
- Feb 2025: ₹54/kg
- Mar 2025: ₹56/kg
- Average: ₹54/kg

VARIANCE: +25.9% (₹14/kg higher)
POTENTIAL OVERCHARGE: ₹7,00,000

MARKET RATE: ₹58/kg (as of Oct 25, 2025)

POSSIBLE REASONS:
- Market price spike (check commodity news)
- Supplier changed (premium vendor?)
- Error in invoice

ACTIONS:
[Query Vendor] [Accept (Add Note)] [Reject]
```

**Vendor comparison:**
- Track rates from multiple vendors for same items
- Example: "Vendor A charges ₹500/sqft for plumbing, Vendor B charges ₹650/sqft"
- Alerts: "Consider switching to Vendor A for 23% savings (₹4.5L potential)"

**Market rate integration (future):**
- Fetch live commodity prices from APIs
- Steel, cement, copper, aluminum
- Compare invoice rates to market rates

#### C. GST/TDS Validation

**HSN code lookup:**
- Every item has HSN (Harmonized System of Nomenclature) code
- HSN determines GST %
- Example: Cement (HSN 2523) = 28% GST
- If invoice shows cement with 18% GST → Flag error

**TDS calculation:**
- Section 194C: 1% TDS on payments to contractors (2% if no PAN)
- Section 194J: 10% TDS on professional services
- System auto-calculates required TDS
- If invoice doesn't show TDS deduction → Alert

**Reverse charge:**
- GTA (Goods Transport Agency) services → Reverse charge applies
- Recipient (builder) pays GST, not supplier
- If GTA invoice shows GST charged → Flag error

**Example alert:**
```
🚨 TAX ERROR DETECTED

Invoice #4912 - Cement purchase:
- Item: Portland Pozzolana Cement (PPC)
- HSN Code: 2523
- Quantity: 5000 bags
- Rate: ₹350/bag
- GST shown: 18%

CORRECT GST: 28% for HSN 2523

IMPACT:
- GST short-charged: ₹1,75,000
- Risk: Input tax credit may be disallowed in GST return

ACTIONS:
[Return to Vendor] [Accept (Add Note)] [Auto-Correct Invoice]
```

#### D. BOQ Variance

**Bill of Quantities (BOQ) comparison:**
- BOQ = Contract agreed with architect/contractor
- Lists unit rates for all work items
- Example: "RCC work: ₹600/sqft"

**System matches:**
- Invoice line item → BOQ item (by description/category)
- Compares invoice rate vs BOQ rate
- Flags if variance >10%

**Example:**
```
⚠️ BOQ VARIANCE

Invoice #5023 - Plumbing work:
- Scope: Bathroom plumbing, Floor 3-5
- Area: 120 sqft per flat × 15 flats = 1800 sqft
- Invoice rate: ₹750/sqft
- Invoice amount: ₹13,50,000

BOQ RATE: ₹600/sqft (Plumbing work - Bathrooms)
BOQ AMOUNT: ₹10,80,000

VARIANCE: +25% (₹2,70,000 over-budget)

POSSIBLE REASONS:
- Scope change (extra work beyond BOQ)
- Premium materials used
- Error in invoice

ACTIONS:
[Query Contractor] [Approve with Note] [Reject]
```

#### E. Vendor Performance Scoring

**Track metrics:**
- On-time delivery %
- Quality issues (rejections, rework)
- Price consistency (stable vs fluctuating rates)
- Payment disputes
- Responsiveness (invoice corrections)

**Scoring system (0-5 stars):**
```
VENDOR SCORECARD: ABC Constructions Pvt Ltd

Overall Rating: 4.2 ⭐⭐⭐⭐

Metrics:
- On-time delivery: 85% (12/14 orders)
- Quality score: 4.5/5 (1 minor rework)
- Price variance: 8% (stable)
- Disputes: 2 (both resolved)
- Total business: ₹2.3Cr across 3 projects

RED FLAGS:
- 5+ disputed invoices in last 6 months
- Inconsistent pricing (>20% variance)
- Frequent delivery delays

RECOMMENDATION: Approved vendor ✅
```

#### F. Weekly Leakage Report

**Automated email every Monday:**
```
📊 COST GUARD WEEKLY REPORT
Week of Oct 21-27, 2025
Project: Sunshine Heights

SUMMARY:
✅ 23 invoices processed (₹1.8Cr)
🚨 5 anomalies detected

SAVINGS:
💰 3 duplicates caught: ₹4.2L saved
💰 2 rate anomalies: ₹1.8L saved
💰 1 GST error: ₹45K saved
TOTAL SAVED THIS WEEK: ₹6.45L

YEAR-TO-DATE:
💰 Total saved: ₹48.2L
📊 Detection rate: 4.3% of invoices flagged
⏱️ Avg review time: 8 minutes per anomaly

TOP ANOMALY TYPES:
1. Duplicate invoices: 45%
2. Rate drift: 30%
3. GST errors: 15%
4. BOQ variance: 10%

[View Detailed Report] [Download CSV]
```

**Dashboard widget:**
- Real-time counter: "₹48.2L saved this year"
- Animated number (increases when anomaly approved)
- Builds trust: "BuilderOS is paying for itself"

### Key Features
- Real-time anomaly detection during upload
- Approve/reject workflow
- Override option (if rate increase legitimate, can approve with note)
- Leakage dashboard with Recharts graphs
- Vendor scorecards
- Export flagged invoices report for auditor

### Value Delivered
- **Prevents ₹50L-1Cr leakage** per ₹100Cr project
- **ROI visible within first month** (pays for itself immediately)
- **Reduces audit queries** (clean books)
- **Improves vendor relationships** (legitimate errors caught early)

---

[Continue with remaining modules: Escrow Mirror, Scenario Planning, Progress Widget, Insights Dashboard, AI Orchestrator, Billing, Notifications...]

**Note: This is Part 1 of FEATURES.md. The file continues with detailed explanations of Modules 5-12. Would you like me to continue?**

