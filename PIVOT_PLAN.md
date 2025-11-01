# 🔄 BUILDEROS → LEGALOS PIVOT PLAN

**Date:** November 1, 2025  
**Status:** In Progress

---

## 📊 WHAT WE'RE KEEPING (80%)

### **✅ Tech Stack (100% Reuse)**
- Next.js 15 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres, Auth, Storage, Edge Functions)
- Claude 4.5 Sonnet (already have API key: `sk-ant-api03-g1dKup6RB...`)
- Gemini 2.5 Pro (already have API key: `AIzaSyC3CFwki...`)
- Vercel hosting
- Razorpay payments

### **✅ Core Architecture (100% Reuse)**
- Multi-tenant (organization-based)
- Row Level Security (RLS)
- Auth system (Supabase)
- File storage (Supabase Storage)
- API routes structure

### **✅ Reusable Components (80% Reuse)**
- Authentication (login, signup, logout)
- Dashboard layout (sidebar, header)
- AI Assistant interface (chat)
- Document upload/storage
- User management
- Billing/subscription system
- ROI Monitor (can adapt)
- Health Bar (can adapt)

### **✅ Reusable Code**
```
/app/lib/                   ← 100% reuse
/app/components/ui/         ← 100% reuse  
/app/components/auth/       ← 100% reuse
/app/components/dashboard/  ← 80% reuse (rebrand)
/app/middleware.ts          ← 100% reuse
/app/app/api/               ← 50% reuse (adapt logic)
```

---

## 🔧 WHAT NEEDS TO CHANGE

### **1. Branding & UI** (2-3 days)

**Changes:**
- Rename "BuilderOS" → "LegalOS" across all files
- Update logo/colors (purple/gold → navy/gold for legal feel)
- Update landing page copy
- Update email templates

**Files to update:**
```
/app/app/layout.tsx
/app/components/dashboard/header.tsx
/app/components/dashboard/sidebar.tsx
/app/public/ (logo files)
README.md
```

---

### **2. Database Schema** (1 day)

**Remove tables:**
- `projects` → `cases`
- `invoices` (Cost Guard) → `invoices` (billing)
- `alerts` (RERA/construction) → `alerts` (legal deadlines)
- `contracts` (keep but repurpose)
- `bank_transactions` → DELETE
- `cash_flow_analyses` → DELETE
- `qpr_drafts` → DELETE
- `rera_updates` → DELETE

**Add tables:**
- `clients` (law firm clients)
- `cases` (legal cases)
- `court_dates` (hearing dates)
- `templates` (legal document templates)
- `ai_conversations` (chat history)
- `time_entries` (billable hours)
- `invoices` (client billing)

**Update tables:**
- `organizations` → law firms (not construction companies)
- `users` → lawyers (add `role: partner/associate/paralegal`)
- `documents` → case documents (update metadata)

**New schema file:**
```
/app/supabase/LEGALOS_SCHEMA.sql
```

---

### **3. AI Assistant** (3-4 days)

**Keep:**
- ✅ Claude integration
- ✅ Gemini integration (for large docs)
- ✅ Chat interface

**Change:**
- ❌ Remove BuilderOS context (RERA, Cost Guard, etc.)
- ✅ Add Indian law context (IPC, CPC, CrPC, Companies Act)
- ✅ Integrate Indian Kanoon API (case law search)
- ✅ Add citation formatting
- ✅ Add document summarization mode
- ✅ Add contract review mode

**Files to update:**
```
/app/app/api/ai/chat/route.ts (update system prompt)
/app/app/api/ai/analyze-document/route.ts (repurpose for legal docs)
/app/components/ai/chat-interface.tsx (rebrand)
```

**New files:**
```
/app/app/api/ai/case-law-search/route.ts
/app/app/api/ai/contract-review/route.ts
/app/lib/indian-kanoon.ts (API wrapper)
```

---

### **4. Core Features** (5-7 days)

#### **A. Case Management** (Replace Projects)

**What it does:**
- Manage clients (instead of projects)
- Manage cases (instead of RERA projects)
- Track court dates (instead of project milestones)
- Store case documents (instead of invoices/contracts)

**Pages to create:**
```
/app/app/dashboard/clients/page.tsx (list)
/app/app/dashboard/clients/[id]/page.tsx (details)
/app/app/dashboard/cases/page.tsx (list)
/app/app/dashboard/cases/[id]/page.tsx (case details)
/app/app/dashboard/cases/[id]/documents/page.tsx
/app/app/dashboard/cases/[id]/timeline/page.tsx
```

**Components to create:**
```
/app/components/cases/case-card.tsx
/app/components/cases/case-form.tsx
/app/components/cases/court-dates-calendar.tsx
/app/components/clients/client-card.tsx
/app/components/clients/client-form.tsx
```

---

#### **B. Document Generation** (Replace Cost Guard)

**What it does:**
- Library of 100+ legal templates
- AI fills templates with case/client data
- Export as PDF/Word

**Pages to create:**
```
/app/app/dashboard/templates/page.tsx (library)
/app/app/dashboard/templates/[id]/generate/page.tsx
```

**Components:**
```
/app/components/templates/template-library.tsx
/app/components/templates/template-generator.tsx
```

**API routes:**
```
/app/app/api/templates/list/route.ts
/app/app/api/templates/generate/route.ts (AI fills template)
/app/app/api/documents/export-pdf/route.ts
```

---

#### **C. Contract Review** (Keep & Rebrand)

**What it does:**
- Upload contract (PDF/Word)
- AI analyzes for risks
- Flag risky clauses
- Suggest improvements

**Already have:**
- ✅ `/app/app/dashboard/contracts/page.tsx`
- ✅ `/app/components/contracts/upload-contract.tsx`
- ✅ `/app/supabase/functions/analyze-contract/index.ts`

**Changes needed:**
- Update AI prompt (construction → legal)
- Update risk categories (RERA compliance → Indian Contract Act)
- Update UI copy

---

#### **D. Time Tracking & Billing** (Replace Cash Command Center)

**What it does:**
- Track billable hours per case/client
- Generate invoices
- Track payments

**Pages to create:**
```
/app/app/dashboard/time-tracking/page.tsx
/app/app/dashboard/billing/page.tsx (already exists, repurpose)
```

**Components:**
```
/app/components/time-tracking/time-entry-form.tsx
/app/components/time-tracking/timer.tsx
/app/components/billing/invoice-generator.tsx (already exists)
```

---

#### **E. Smart Intake Portal** (New Feature)

**What it does:**
- Client-facing branded portal
- Collect client info via forms
- Upload documents
- Auto-sync to case management

**Pages to create:**
```
/app/app/intake/[orgSlug]/page.tsx (public-facing)
/app/app/dashboard/intake/configure/page.tsx (admin)
```

**Components:**
```
/app/components/intake/intake-form-builder.tsx
/app/components/intake/intake-form-client.tsx
```

---

#### **F. Meeting Notetaker** (New Feature)

**What it does:**
- Upload audio/video of meeting
- AI transcribes
- AI generates summary
- Store in case file

**Pages to create:**
```
/app/app/dashboard/cases/[id]/meetings/page.tsx
```

**API routes:**
```
/app/app/api/meetings/transcribe/route.ts
/app/app/api/meetings/summarize/route.ts
```

---

### **5. Navigation & Sidebar** (1 day)

**Remove menu items:**
- ❌ Cost Guard
- ❌ RERA Compliance
- ❌ Cash Flow
- ❌ Contracts (standalone) → move under Cases

**Add menu items:**
- ✅ Clients
- ✅ Cases
- ✅ AI Assistant
- ✅ Templates
- ✅ Time Tracking
- ✅ Billing
- ✅ Settings

**File to update:**
```
/app/components/dashboard/sidebar.tsx
```

---

### **6. Dashboard (Home Page)** (1 day)

**Remove widgets:**
- ❌ Project Health Cards
- ❌ RERA Alerts
- ❌ Cost Guard Savings

**Add widgets:**
- ✅ Recent Cases
- ✅ Upcoming Court Dates
- ✅ Pending Tasks
- ✅ This Month's Billable Hours
- ✅ AI Usage Stats

**File to update:**
```
/app/app/dashboard/page.tsx
```

---

### **7. Onboarding** (1 day)

**Change onboarding questions:**
- OLD: "What's your RERA ID? Location? Project name?"
- NEW: "What's your law firm name? Practice areas? Team size?"

**File to update:**
```
/app/components/onboarding/onboarding-form.tsx
```

---

## 📅 EXECUTION PLAN

### **Week 1: Database + Branding** (Nov 1-8)
- [ ] Day 1: Create LEGALOS_SCHEMA.sql
- [ ] Day 2: Run migration, test RLS policies
- [ ] Day 3-4: Rebrand UI (BuilderOS → LegalOS)
- [ ] Day 5: Update onboarding flow
- [ ] Day 6-7: Test auth, user management

### **Week 2: Core Features - Case Management** (Nov 9-15)
- [ ] Day 1-2: Clients CRUD (list, create, edit, delete)
- [ ] Day 3-4: Cases CRUD
- [ ] Day 5: Court dates calendar
- [ ] Day 6: Document upload/storage
- [ ] Day 7: Tasks management

### **Week 3: AI Features** (Nov 16-22)
- [ ] Day 1-2: Update AI assistant (Indian law context)
- [ ] Day 3: Integrate Indian Kanoon API
- [ ] Day 4: Contract review (repurpose existing)
- [ ] Day 5: Document summarization
- [ ] Day 6-7: Test AI accuracy

### **Week 4: Document Generation** (Nov 23-29)
- [ ] Day 1-2: Template library (seed 100 templates)
- [ ] Day 3: Template variable system
- [ ] Day 4: AI template filling
- [ ] Day 5: PDF/Word export
- [ ] Day 6-7: Test generation

### **Week 5: Time Tracking + Billing** (Nov 30-Dec 6)
- [ ] Day 1-2: Time entry UI + auto-timer
- [ ] Day 3: Invoice generation (repurpose existing)
- [ ] Day 4: Payment tracking
- [ ] Day 5-7: Test billing flow

### **Week 6: Smart Intake + Notetaker** (Dec 7-13)
- [ ] Day 1-3: Smart intake portal (form builder)
- [ ] Day 4-5: Meeting notetaker (transcription)
- [ ] Day 6-7: Polish UI

### **Week 7: Dashboard + Navigation** (Dec 14-20)
- [ ] Day 1-2: Update dashboard (new widgets)
- [ ] Day 3: Update sidebar navigation
- [ ] Day 4-5: ROI monitor (adapt for legal)
- [ ] Day 6-7: Health bar (adapt for legal)

### **Week 8: Testing + Bug Fixes** (Dec 21-27)
- [ ] Day 1-7: Full QA, fix bugs

### **Week 9: Beta Launch Prep** (Dec 28-Jan 3)
- [ ] Day 1-2: Help docs
- [ ] Day 3: Demo video
- [ ] Day 4: Marketing site
- [ ] Day 5-7: Onboard 5 beta firms

### **Week 10: Beta Launch** (Jan 4-10)
- [ ] Day 1-7: Support beta users, iterate

---

## 🎯 SUCCESS CRITERIA

**By Week 7 (Beta Ready):**
- ✅ 5 beta firms signed up
- ✅ AI assistant working (answers questions, drafts docs)
- ✅ Case management working (create cases, upload docs)
- ✅ Document generation working (100 templates)
- ✅ Billing working (track time, generate invoices)

**By Week 10 (Paid Launch):**
- ✅ 5 beta firms actively using (10+ queries/day)
- ✅ 3+ beta firms ready to convert to paid
- ✅ Razorpay subscriptions set up
- ✅ Ready for Bar Association demo

---

## 💡 QUICK WINS (Do First)

### **Day 1 Tasks** (Today)
1. ✅ Create LEGALOS_SPEC.md (DONE)
2. ✅ Create PIVOT_PLAN.md (DONE)
3. [ ] Create LEGALOS_SCHEMA.sql
4. [ ] Rename all "BuilderOS" → "LegalOS" in codebase
5. [ ] Update sidebar navigation
6. [ ] Test app still runs

### **Day 2 Tasks**
1. [ ] Run database migration
2. [ ] Update AI assistant system prompt (Indian law)
3. [ ] Create `/app/app/dashboard/clients/page.tsx`
4. [ ] Test client creation

### **Day 3 Tasks**
1. [ ] Create `/app/app/dashboard/cases/page.tsx`
2. [ ] Create case form
3. [ ] Test case creation + document upload

**By Day 3, you should have:**
- Rebranded app (LegalOS)
- Working client/case management
- AI assistant responding to legal queries

---

## 📝 NOTES

**Why This Will Be Fast:**
- 80% of code is reusable
- We're not building from scratch
- Database structure is similar (organizations → firms, projects → cases)
- AI integration already done
- Billing system already built

**Biggest Risks:**
1. Indian Kanoon API integration (might take 2-3 days to get right)
2. Template library (need 100 good templates, might take 3-4 days)
3. Meeting notetaker (transcription can be tricky)

**Mitigation:**
- Start with simple features first
- Skip notetaker for MVP (add in Week 8-9)
- Use community-sourced templates initially

---

## 🚀 LET'S START

**Next steps:**
1. I'll create the new database schema
2. Start rebranding the UI
3. Update the AI assistant
4. Create client/case management pages

**Ready to begin?** 🎯

