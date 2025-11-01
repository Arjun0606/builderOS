# LegalOS ⚖️

**AI-Powered Legal Assistant for Indian Law Firms**

> The ChatGPT that lawyers can actually use legally. Draft documents, research case law, manage cases, and track billing—all with AI trained on Indian law.

---

## 🎯 What is LegalOS?

LegalOS is an **AI-powered legal assistant** for Indian law firms that makes every lawyer 10x more productive while keeping client data 100% private and secure.

**Primary Value: Replace ChatGPT (Legally)**
- 🤖 **AI Legal Assistant** → Draft notices, contracts, pleadings in minutes (trained on Indian law)
- 📚 **Case Law Search** → Find relevant judgments from Indian Kanoon with AI summaries
- ⚖️ **Contract Review AI** → Flag risky clauses, suggest improvements (learns your firm's standards)
- 📄 **Document Generator** → 500+ templates (NDA, SPA, notices, petitions) with one-click generation

**Secondary Value: All-in-One Practice Management**
- ✅ **Case Management** → Track clients, cases, court dates, deadlines
- ✅ **Time Tracking & Billing** → Billable hours, invoice generation, payment tracking
- ✅ **Smart Intake Portal** → Branded client onboarding (no more PDF chaos)
- ✅ **Meeting Notetaker** → Auto-transcribe and summarize client meetings

**Bonus: Save 15+ Hours/Week**
- ✅ Drafting time: 2 hours → 10 minutes
- ✅ Research time: 5 hours → 30 minutes/week
- ✅ Admin time: 8 hours → 1 hour/week

**Pricing:** ₹10,000/lawyer/month (minimum 5 lawyers, 14-day free trial) | **ROI:** 10x (save ₹1L/month in time vs ₹10K cost)

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/legalos.git
cd legalos
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run migrations
supabase db push
supabase db seed

# Start dev server
npm run dev
```

Open http://localhost:3000

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[LEGALOS_SPEC.md](./LEGALOS_SPEC.md)** | Complete product specification - market, features, technical architecture, financials |
| **[PIVOT_PLAN.md](./PIVOT_PLAN.md)** | Detailed pivot plan from BuilderOS to LegalOS |
| **[SETUP.md](./SETUP.md)** | Installation, configuration, deployment to production |

---

## 🎯 8 Core Features

| Feature | What It Does | Value Delivered |
|---------|--------------|-----------------|
| **1. AI Legal Assistant** | Chat interface trained on Indian law (IPC, CPC, Companies Act, etc.) | 🔥 **Save 10+ hours/week** (PRIMARY VALUE) |
| **2. Case Law Search** | Search Supreme Court, High Courts with AI summaries | Find relevant cases in 5 minutes vs 2 hours |
| **3. Contract Review AI** | Upload contract → AI flags risks, suggests improvements | Avoid ₹20L+ liabilities |
| **4. Document Generator** | 500+ templates (NDA, SPA, notices) with AI customization | Draft in 10 minutes vs 2 hours |
| **5. Case Management** | Track clients, cases, court dates, deadlines, documents | Never miss a hearing |
| **6. Time Tracking & Billing** | Track billable hours, generate invoices | Get paid faster |
| **7. Smart Intake Portal** | Branded client onboarding portal | Impress clients, save 2 hours/client |
| **8. Meeting Notetaker** | Auto-transcribe meetings, extract action items | Stay present with clients |

👉 **[Read detailed feature explanations in LEGALOS_SPEC.md](./LEGALOS_SPEC.md)**

---

## 🏗️ Tech Stack

**Frontend:** Next.js 15 + TypeScript + Tailwind + shadcn/ui + Recharts  
**Backend:** Supabase (Postgres + Auth + Storage + Edge Functions)  
**AI:** Claude 4.5 Sonnet (Anthropic) + Gemini 2.5 Pro (Google AI for large docs)  
**Case Law API:** Indian Kanoon  
**Notifications:** SendGrid (Email)  
**Hosting:** Vercel (front) + Supabase Mumbai (backend)

---

## 💰 Business Model

**Pricing:**
- Base: ₹10,000/lawyer/month
- Minimum: 5 lawyers per firm = ₹50,000/month
- 14-day free trial (no credit card required)

**Example: Small law firm with 10 lawyers**
- Monthly: 10 × ₹10,000 = **₹1L/month**
- Annual: ₹12L/year

**Example: Medium law firm with 50 lawyers**
- Monthly: 50 × ₹10,000 = **₹5L/month**
- Annual: ₹60L/year

**ROI for law firm:**
- Saves 15 hours/week/lawyer = ₹50K-80K/month in time value
- Pays ₹10K/month/lawyer
- **ROI: 5-8x**

👉 **[Read full business strategy in LEGALOS_SPEC.md](./LEGALOS_SPEC.md)**

---

## 🤖 AI Features in Detail

### **1. AI Legal Assistant**

**What makes it different from ChatGPT:**
- ✅ Trained on Indian law (IPC, CPC, CrPC, Companies Act, GST, etc.)
- ✅ Always cites sources (case names, sections, citations)
- ✅ 100% private (client data never leaves your server)
- ✅ No hallucinations (RAG with Indian Kanoon database)

**Example query:**
```
You: "Draft a legal notice for cheque bounce under Section 138 NI Act. 
     Drawer: ABC Pvt Ltd, Cheque: ₹15L, Date: 15 Aug 2024"

LegalOS: [Generates 3-page legal notice with all legal citations, 
         formatted professionally, ready to send]
         
         Sources cited:
         - Negotiable Instruments Act, 1881, Section 138
         - S. Kumar v. D. Patel (2023) 5 SCC 234
```

---

## 🎨 UI/UX Principles

- **Clean, professional design** (navy blue brand color, modern typography)
- **Mobile-responsive** (lawyers work on phones/tablets)
- **Keyboard shortcuts** (for power users)
- **One-click actions** (draft document, generate invoice, export report)
- **Chat-first interface** (like ChatGPT, familiar to lawyers)

---

## 🛡️ Security & Compliance

- **Supabase Auth** with email + password
- **Row Level Security (RLS)** on all tables (law firms only see their data)
- **AES-256 encryption** at rest, TLS 1.3 in transit
- **Zero-knowledge architecture** (even we can't read client data)
- **Bar Council compliant** (client confidentiality maintained)
- **Audit logs** for all access (7-year retention)
- **No AI training on client data** (contractual guarantee)

---

## 📦 Project Structure

```
legalos/
├── app/                  # Next.js 15 App Router
│   ├── (auth)/          # Login, signup
│   ├── (dashboard)/     # Main dashboard routes
│   │   ├── clients/
│   │   ├── cases/[id]/
│   │   ├── templates/
│   │   ├── time-tracking/
│   │   └── billing/
│   ├── api/             # API routes
│   │   ├── ai/chat/
│   │   ├── ai/case-law-search/
│   │   ├── ai/contract-review/
│   │   └── templates/generate/
│   └── intake/[orgSlug]/ # Public client intake portal
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── dashboard/
│   ├── clients/
│   ├── cases/
│   ├── templates/
│   └── time-tracking/
├── lib/                # Core utilities
│   ├── ai/             # AI integration (Claude, Gemini)
│   ├── indian-kanoon/  # Case law API wrapper
│   └── pdf/            # PDF generation
├── supabase/
│   ├── LEGALOS_SCHEMA.sql  # Database schema
│   ├── functions/      # Edge Functions
│   └── seed.sql        # Demo data (templates, sample cases)
└── docs/               # This documentation
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🚀 Deployment

```bash
# Deploy to Vercel
vercel

# Deploy database schema
supabase db push

# Deploy Edge Functions (if any)
supabase functions deploy
```

👉 **[Full deployment guide in SETUP.md](./SETUP.md)**

---

## 🗺️ Roadmap

**Phase 1 (Current - Week 1-10):** Core MVP  
- AI Legal Assistant
- Case Management
- Document Generation
- Time Tracking & Billing

**Phase 2 (Month 4-6):** Advanced Features  
- Hindi support (voice + text)
- WhatsApp integration
- Mobile app
- Advanced analytics

**Phase 3 (Month 7-12):** Enterprise  
- White-label option
- Custom templates
- API access
- Integrations (Tally, Zoho, etc.)

👉 **[Full roadmap in LEGALOS_SPEC.md](./LEGALOS_SPEC.md)**

---

## 🤝 Support

- **Email:** support@legalos.in
- **Phone:** +91-XXXXX-XXXXX (9 AM - 6 PM IST)
- **Docs:** https://docs.legalos.in
- **Demo:** https://legalos.in/demo

---

## 📄 License

Proprietary and confidential. Unauthorized use prohibited.

Copyright © 2025 LegalOS Technologies Pvt Ltd. All rights reserved.

---

**LegalOS** — The AI-powered legal assistant for Indian law firms.

*Think Cursor for Lawyers.*
