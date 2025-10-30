# BuilderOS Setup & Deployment Guide

Complete instructions for local development, testing, and production deployment.

---

## Prerequisites

### Required Software
- **Node.js**: 18+ and npm
- **Git**: For version control
- **Supabase CLI**: For local database and Edge Functions

### Required Accounts
- **Supabase**: Free tier works for development
- **Anthropic**: Claude API key
- **AWS**: For Textract OCR
- **Twilio**: For WhatsApp Business API (optional for dev)
- **SendGrid**: For email (optional for dev)
- **Vercel**: For deployment (free tier available)

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/builderos.git
cd builderos
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (via Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

#### Initialize Supabase locally

```bash
supabase init
supabase start
```

This starts local Postgres, PostgREST API, Auth server, and Studio.

**Output will show:**
```
API URL: http://localhost:54321
Studio URL: http://localhost:54323
anon key: eyJhbGc...  (copy this)
service_role key: eyJhbGc...  (copy this)
```

### 4. Environment Variables

Copy example env file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # From supabase start output
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...      # From supabase start output

# AI Services
ANTHROPIC_API_KEY=sk-ant-your-key-here
# Get free trial key: https://console.anthropic.com/

# AWS (for Textract)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1  # Mumbai region

# Notifications (optional for dev, can use mocks)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=alerts@builderos.com

# Payment Gateway (optional, can stub)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Run Database Migrations

```bash
supabase db push
```

This creates all tables, indexes, RLS policies from the migration files.

### 6. Seed Demo Data

```bash
supabase db seed
```

This populates:
- 2 demo organizations
- 3 demo projects (Mumbai, Pune, Hyderabad)
- 1 admin user (email: admin@builderos.com, password sent via OTP)
- Sample invoices, bank transactions, BOQs
- Sample RERA submissions and deadlines

### 7. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

**Login credentials:**
- Email: admin@builderos.com
- OTP will be logged to console (Supabase local doesn't send real emails)

---

## Project Structure

```
builderos/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── verify-otp/
│   │       └── page.tsx
│   ├── (dashboard)/              # Main app (requires auth)
│   │   ├── layout.tsx            # Dashboard shell (sidebar, header)
│   │   ├── page.tsx              # Portfolio overview
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # Project dashboard
│   │   │   │   ├── documents/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── cost-guard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── escrow/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── rera/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx      # Project onboarding wizard
│   │   ├── insights/
│   │   │   └── page.tsx          # Executive dashboard
│   │   ├── billing/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── verify/
│   │   ├── documents/
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   └── process/
│   │   │       └── route.ts
│   │   ├── ai/
│   │   │   └── process/
│   │   │       └── route.ts
│   │   ├── rera/
│   │   │   ├── draft-qpr/
│   │   │   │   └── route.ts
│   │   │   └── updates/
│   │   │       └── route.ts
│   │   ├── cost-guard/
│   │   │   └── scan/
│   │   │       └── route.ts
│   │   ├── escrow/
│   │   │   └── calculate/
│   │   │       └── route.ts
│   │   └── billing/
│   │       └── webhook/
│   │           └── route.ts
│   ├── p/                        # Public pages
│   │   └── [rera_id]/
│   │       └── page.tsx          # Public progress widget
│   ├── globals.css
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── otp-input.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── project-card.tsx
│   ├── documents/
│   │   ├── dropzone.tsx
│   │   ├── document-list.tsx
│   │   └── review-queue.tsx
│   ├── cost-guard/
│   │   ├── anomaly-list.tsx
│   │   └── leakage-chart.tsx
│   ├── rera/
│   │   ├── qpr-draft.tsx
│   │   ├── deadline-calendar.tsx
│   │   └── updates-feed.tsx
│   └── charts/
│       ├── cost-trend-chart.tsx
│       ├── escrow-gauge.tsx
│       └── leakage-pie.tsx
│
├── lib/                          # Core utilities
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── middleware.ts
│   │   └── types.ts              # Generated types
│   ├── ai/
│   │   ├── orchestrator.ts       # Main AI router
│   │   ├── claude.ts             # Anthropic client
│   │   ├── textract.ts           # AWS Textract wrapper
│   │   ├── prompts.ts            # Prompt templates
│   │   └── schemas.ts            # Zod schemas for AI outputs
│   ├── rera/
│   │   ├── rules.ts              # State-wise rule engine
│   │   ├── scraper.ts            # Web scraping logic
│   │   ├── pdf-generator.ts     # PDFKit wrapper
│   │   └── states/               # JSON configs per state
│   │       ├── maharashtra.json
│   │       ├── karnataka.json
│   │       └── ...
│   ├── cost-guard/
│   │   ├── duplicate-detector.ts
│   │   ├── rate-analyzer.ts
│   │   └── gst-validator.ts
│   ├── escrow/
│   │   ├── calculator.ts
│   │   └── reconciler.ts
│   ├── notifications/
│   │   ├── whatsapp.ts           # Twilio client
│   │   ├── email.ts              # SendGrid client
│   │   └── templates.ts
│   ├── billing/
│   │   ├── pricing.ts            # Volume discount logic
│   │   └── seat-enforcer.ts
│   └── utils.ts
│
├── schemas/                      # Zod validation schemas
│   ├── invoice.ts
│   ├── bank-statement.ts
│   ├── boq.ts
│   ├── rera-form.ts
│   └── user.ts
│
├── supabase/
│   ├── migrations/
│   │   └── 20250101000000_initial_schema.sql
│   ├── functions/                # Edge Functions
│   │   ├── rera-scraper/
│   │   │   └── index.ts
│   │   ├── weekly-digest/
│   │   │   └── index.ts
│   │   ├── deadline-reminders/
│   │   │   └── index.ts
│   │   └── cost-guard-scan/
│   │       └── index.ts
│   └── seed.sql                  # Demo data
│
├── public/
│   ├── images/
│   └── fonts/
│
├── docs/                         # Documentation
│   ├── README.md
│   ├── FEATURES.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── SETUP.md
│   └── BUSINESS.md
│
├── .env.local.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Development Workflow

### Running the App

```bash
# Start Next.js dev server
npm run dev

# In separate terminal, start Supabase (if not already running)
supabase start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Testing

```bash
# Unit tests (Jest)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Database Operations

```bash
# View local database in browser
supabase db studio  # Opens http://localhost:54323

# Reset database (warning: deletes all data)
supabase db reset

# Create new migration
supabase migration new your_migration_name

# Generate TypeScript types from schema
supabase gen types typescript --local > lib/supabase/types.ts
```

### Edge Functions

```bash
# Create new Edge Function
supabase functions new function-name

# Run function locally
supabase functions serve function-name

# Deploy function (requires Supabase project linked)
supabase functions deploy function-name

# View function logs
supabase functions logs function-name
```

---

## Production Deployment

### 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose **Mumbai (ap-south-1)** region (lowest latency for Indian users)
4. Note down:
   - Project URL: `https://your-project.supabase.co`
   - Anon key: `eyJhbGc...`
   - Service role key: `eyJhbGc...`

### 2. Link Local Project to Remote

```bash
supabase link --project-ref your-project-ref
```

### 3. Push Database Schema

```bash
supabase db push
```

This creates all tables, RLS policies in production.

### 4. Seed Production Data (Optional)

```bash
# Don't run full seed.sql in production (it's demo data)
# Instead, manually create first organization via Supabase Studio
```

### 5. Deploy Edge Functions

```bash
# Set secrets for Edge Functions
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here
supabase secrets set AWS_ACCESS_KEY_ID=AKIA...
supabase secrets set AWS_SECRET_ACCESS_KEY=...
# ... set all required secrets

# Deploy all functions
supabase functions deploy rera-scraper
supabase functions deploy weekly-digest
supabase functions deploy deadline-reminders
supabase functions deploy cost-guard-scan
```

### 6. Setup Cron Jobs

In Supabase Dashboard → Database → Cron:

```sql
-- RERA scraper: Daily at 2 AM IST
SELECT cron.schedule(
  'rera-scraper-daily',
  '30 20 * * *',  -- 2:30 AM IST = 8:30 PM UTC (IST - 5:30)
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/rera-scraper',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);

-- Weekly digest: Sundays at 8 PM IST
SELECT cron.schedule(
  'weekly-digest',
  '30 14 * * 0',  -- Sunday 8:30 PM IST = 2:30 PM UTC
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/weekly-digest',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);

-- Deadline reminders: Daily at 9 AM IST
SELECT cron.schedule(
  'deadline-reminders',
  '30 3 * * *',  -- 9:30 AM IST = 3:30 AM UTC
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/deadline-reminders',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);

-- Cost Guard scan: Daily at midnight IST
SELECT cron.schedule(
  'cost-guard-scan',
  '30 18 * * *',  -- 12:30 AM IST = 6:30 PM UTC
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/cost-guard-scan',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### 7. Deploy Frontend to Vercel

#### Via CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

#### Via GitHub (Recommended):

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM`
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`
5. Deploy

**Auto-deployment**: Every push to `main` branch auto-deploys.

### 8. Configure Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `builderos.com` and `www.builderos.com`
3. Add DNS records (provided by Vercel)
4. Wait for SSL certificate (automatic)

### 9. Setup Monitoring

**Supabase:**
- Dashboard → Project Settings → API → Enable "Log all queries"
- Set up email alerts for:
  - Database CPU >80%
  - Connection pool exhausted
  - Failed Edge Function runs

**Vercel:**
- Analytics enabled by default
- Set up alerts for:
  - Error rate >1%
  - Page load time >3s

**Sentry (Error Tracking):**

```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

Add to `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### 10. Backup Strategy

**Database backups (Supabase):**
- Pro plan: Daily automatic backups (30-day retention)
- Download backup:
  ```bash
  supabase db dump -f backup.sql
  ```

**Storage backups:**
- Supabase Storage auto-replicates across availability zones
- For extra safety: Sync to S3 via scheduled Edge Function

---

## Troubleshooting

### Common Issues

**1. Supabase CLI not connecting:**
```bash
# Reset Supabase local setup
supabase stop
supabase start
```

**2. TypeScript errors after schema changes:**
```bash
# Regenerate types
supabase gen types typescript --local > lib/supabase/types.ts
npm run type-check
```

**3. Edge Function failing with "Module not found":**
```bash
# Edge Functions use Deno, not Node.js
# Import from URLs, not npm packages
# Example:
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
```

**4. RLS policy blocking queries:**
```bash
# Check RLS policies in Supabase Studio
# Test with service_role key (bypasses RLS) to confirm
```

**5. CORS errors from API routes:**
```typescript
// Add CORS headers to API route
export async function POST(req: Request) {
  // ... your logic

  return new Response(JSON.stringify(data), {
    headers: {
      'Access-Control-Allow-Origin': 'https://builderos.com',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

### Debug Mode

Enable verbose logging:

```env
# .env.local
DEBUG=true
LOG_LEVEL=debug
```

View logs:
```bash
# Next.js logs
npm run dev

# Supabase Edge Function logs
supabase functions logs rera-scraper --tail

# Database logs
supabase db logs
```

---

## Performance Optimization

### 1. Database Indexes

Already created in schema. Verify with:

```sql
SELECT * FROM pg_indexes WHERE tablename = 'invoices';
```

### 2. Next.js Caching

```typescript
// Revalidate every 5 minutes
export const revalidate = 300;

export default async function ProjectDashboard({ params }) {
  const project = await getProject(params.id);
  return <DashboardUI project={project} />;
}
```

### 3. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="BuilderOS"
/>
```

### 4. Bundle Size

```bash
# Analyze bundle
npm run build
npm run analyze  # Add script: "analyze": "ANALYZE=true next build"
```

---

## Security Checklist

- [ ] All API routes validate input with Zod
- [ ] RLS enabled on all tables
- [ ] Service role key never exposed to frontend
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] Rate limiting configured (Vercel Edge Config)
- [ ] Audit logs enabled
- [ ] Secrets stored in environment variables (not committed to Git)
- [ ] CORS configured to allow only builderos.com
- [ ] JWT tokens expire after 1 hour
- [ ] Refresh tokens stored in HttpOnly cookies

---

## Support

**Issues:** https://github.com/yourusername/builderos/issues  
**Email:** support@builderos.com  
**Docs:** https://docs.builderos.com

---

**Congratulations! BuilderOS is now running.** 🚀

Visit your deployed site and start onboarding your first project!

