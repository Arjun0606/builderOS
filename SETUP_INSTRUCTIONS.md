# BuilderOS - Setup Instructions

**Complete guide to set up your production-ready SaaS**

---

## 🚀 Quick Start (15 minutes)

### **Step 1: Create Supabase Project** (5 min)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. **Important:** Select **Mumbai** region (ap-south-1) for India hosting
4. Project name: `builderos-prod`
5. Database password: **Save this securely!**
6. Wait for project to initialize (~2 minutes)

7. Get your project credentials:
   - Go to **Settings → API**
   - Copy `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - Copy `anon/public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Copy `service_role` key (SUPABASE_SERVICE_ROLE_KEY) **⚠️ Keep secret!**

---

### **Step 2: Run Database Schema** (2 min)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Open `/app/supabase/schema.sql` from this project
4. Copy entire contents and paste into Supabase SQL Editor
5. Click **"Run"**
6. You should see: ✅ "BuilderOS database schema created successfully!"

**What this creates:**
- 15+ tables (organizations, projects, users, invoices, contracts, alerts)
- Row Level Security (RLS) policies
- Indexes for performance
- Helper functions (health scores, etc.)
- Initial RERA state data

---

### **Step 3: Configure Environment Variables** (3 min)

1. In the `/app` directory, create `.env.local`:

```bash
cd /Users/arjun/BuilderOS/app
cp .env.example .env.local
```

2. Edit `.env.local` and add your credentials:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Models (Required for features)
ANTHROPIC_API_KEY=sk-ant-...  # Get from https://console.anthropic.com
GOOGLE_AI_API_KEY=...          # Get from https://ai.google.dev

# AWS Textract (Required for Contract Analyzer)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1

# Notifications (Optional for MVP, required for production)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@builderos.com

# Payments (Optional for MVP, required for billing)
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

### **Step 4: Run the App** (5 min)

```bash
cd /Users/arjun/BuilderOS/app

# Install dependencies (if not done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 🔑 API Keys Setup Guide

### **1. Anthropic (Claude 4.5 Sonnet)** - REQUIRED

**Where it's used:** Cost Guard, RERA monitoring, Contract Analyzer

**Setup:**
1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Create account (sign up with Google/email)
3. Go to **API Keys**
4. Click **"Create Key"**
5. Copy key: `sk-ant-api03-...`
6. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

**Cost:** ~₹25K/month at 50 customers (pay-as-you-go)

**Free tier:** $5 credit (enough for testing)

---

### **2. Google AI (Gemini 2.5 Pro)** - OPTIONAL (Backup)

**Where it's used:** Backup for 500+ page contracts

**Setup:**
1. Go to [https://ai.google.dev](https://ai.google.dev)
2. Click **"Get API Key"**
3. Create/select Google Cloud project
4. Enable Gemini API
5. Copy API key
6. Add to `.env.local`: `GOOGLE_AI_API_KEY=...`

**Cost:** ~₹15K/month if used as primary (cheaper than Claude)

**Free tier:** Generous free quota for testing

---

### **3. AWS Textract** - REQUIRED (for Contract Analyzer)

**Where it's used:** OCR for scanned contracts (PDFs with images)

**Setup:**
1. Go to [https://aws.amazon.com](https://aws.amazon.com)
2. Create AWS account (needs credit card, but we'll stay in free tier)
3. Go to **IAM → Users → Create User**
4. User name: `builderos-textract`
5. Attach policy: `AmazonTextractFullAccess`
6. Click **"Create access key" → Command Line Interface (CLI)**
7. Copy:
   - Access Key ID
   - Secret Access Key
8. Add to `.env.local`:
   ```
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=ap-south-1
   ```

**Cost:** ~₹8K/month at 50 customers (₹0.13 per contract)

**Free tier:** 1,000 pages/month free for first 3 months

---

### **4. Twilio (WhatsApp)** - OPTIONAL (for WhatsApp alerts)

**Where it's used:** Critical alerts via WhatsApp

**Setup:**
1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Create account (free trial: $15 credit)
3. Go to **Console → Messaging → Try WhatsApp**
4. Get WhatsApp Sandbox number
5. Copy:
   - Account SID
   - Auth Token
   - WhatsApp Number: `whatsapp:+14155238886`
6. Add to `.env.local`

**Cost:** ~₹5K/month at 50 customers (₹1/message)

**For production:** Apply for WhatsApp Business API (takes 2-3 weeks)

---

### **5. SendGrid (Email)** - OPTIONAL (for email alerts)

**Where it's used:** Email notifications, alerts, invoices

**Setup:**
1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Create account (free tier: 100 emails/day)
3. Go to **Settings → API Keys → Create API Key**
4. Name: `builderos-prod`
5. Permissions: **Full Access**
6. Copy API key (starts with `SG.`)
7. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG....
   SENDGRID_FROM_EMAIL=noreply@builderos.com
   ```

**Cost:** Free for <100 emails/day, then ₹1.2K/month for 40K emails

---

### **6. Razorpay (Payments)** - OPTIONAL (for billing)

**Where it's used:** Subscription billing, invoice payments

**Setup:**
1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up (needs business details, GST)
3. Go to **Settings → API Keys**
4. Mode: **Test** (for development)
5. Copy:
   - Key ID
   - Key Secret
6. Add to `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   ```

**For production:** 
- Switch to **Live mode**
- Complete KYC (2-3 days)
- Get live API keys

**Cost:** 2% transaction fee (₹2K fee on ₹1L payment)

---

## 📝 What's Already Built

### ✅ **Completed (Ready to Use)**

1. **Project Structure**
   - Next.js 15 with App Router
   - TypeScript (strict mode)
   - Tailwind CSS + shadcn/ui components
   - Production-ready folder structure

2. **Database Schema**
   - Multi-tenant architecture (complete isolation)
   - Row Level Security (RLS) policies
   - 15+ tables (organizations, projects, users, invoices, contracts, alerts)
   - Indexes for performance
   - Helper functions (health scores)

3. **Authentication Foundation**
   - Supabase Auth integration
   - Middleware for session management
   - Protected routes
   - Client/server Supabase clients

4. **Utilities**
   - Currency formatting (₹, lakhs, crores)
   - Date formatting (Indian format)
   - Helper functions (debounce, sleep, etc.)
   - TypeScript types

---

### 🚧 **Next Steps (Building Now)**

1. **Week 1 (Remaining)**
   - Auth UI (login, signup, magic link)
   - Dashboard layout
   - Organization/project setup flow

2. **Week 2**
   - Project management UI
   - User invites
   - Multi-project dashboard

3. **Week 3**
   - Cost Guard feature (CSV upload, duplicate detection)

4. **Week 4-5**
   - RERA Compliance AI (scraper, QPR generation)

5. **Week 6-7**
   - Contract Analyzer (PDF upload, AI analysis)

6. **Week 8-10**
   - Multi-project features, billing, polish

---

## 🧪 Testing Your Setup

### **Test 1: Database Connection**

1. Run the app: `npm run dev`
2. Check terminal for errors
3. If connected: You'll see Next.js running on `http://localhost:3000`
4. If errors: Check `.env.local` credentials

### **Test 2: Supabase Connection**

Create a test file: `/app/test-db.ts`

```typescript
import { createClient } from '@/lib/supabase/server'

export async function testDatabase() {
  const supabase = await createClient()
  
  // Test: Fetch organizations
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Database error:', error)
    return false
  }
  
  console.log('✅ Database connected!')
  console.log('Organizations:', data)
  return true
}
```

Run in your code to test.

### **Test 3: Claude API**

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello, Claude!"}]
  }'
```

Should return: `{"content":[{"text":"Hello! How can I help you today?","type":"text"}],...}`

---

## 🚨 Common Issues & Fixes

### **Issue 1: "Invalid API key" (Supabase)**

**Fix:**
- Check `.env.local` has correct keys
- Restart dev server: `npm run dev`
- Keys must start with:
  - URL: `https://`
  - Anon key: `eyJ...` (long JWT token)
  - Service role: `eyJ...` (long JWT token)

---

### **Issue 2: "CORS error" or "Network error"**

**Fix:**
- Check Supabase URL is correct
- Check no trailing slashes in `NEXT_PUBLIC_SUPABASE_URL`
- Restart dev server

---

### **Issue 3: "Row Level Security (RLS) policy violation"**

**Fix:**
- Make sure you ran the full `schema.sql` in Supabase
- Check that RLS policies were created:
  - Go to Supabase → Database → Policies
  - Should see policies for each table
- If missing, re-run `schema.sql`

---

### **Issue 4: "Module not found" errors**

**Fix:**
```bash
cd /Users/arjun/BuilderOS/app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📦 Production Deployment (Week 10)

### **Deploy to Vercel**

1. Push code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables (same as `.env.local`)
5. Deploy!

**Custom domain:**
- Add `builderos.com` in Vercel dashboard
- Update DNS records (provided by Vercel)
- SSL auto-configured

---

## 💡 Next: Start Building Features

**You're all set!** The foundation is ready.

**Current progress:**
- ✅ Development environment
- ✅ Database schema
- ✅ Authentication foundation
- ✅ Utilities & types
- 🚧 Building auth UI next...

**Run the app and let's continue building! 🚀**

```bash
cd /Users/arjun/BuilderOS/app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

**Need help?** Check:
- `/app/README.md` - Project overview
- `/FINAL_SPEC.md` - Complete feature spec
- `/EXECUTIVE_SUMMARY.md` - Business overview

