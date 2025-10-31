# 🔧 COMPLETE Setup Guide - EVERYTHING You Need

**This is the DEFINITIVE list. Nothing is missing.**

---

## ✅ **ALL ACCOUNTS YOU NEED TO CREATE:**

### **1. Supabase (Database, Auth, Storage)** ⭐ REQUIRED
- **URL:** https://supabase.com
- **What it does:** Database, authentication, file storage
- **Cost:** Free tier (enough to start)
- **What you get:**
  - Project URL
  - Anon key (public)
  - Service role key (secret)
- **Setup time:** 10 minutes

### **2. Anthropic (Claude AI)** ⭐ REQUIRED
- **URL:** https://console.anthropic.com
- **What it does:** Primary AI for all features
- **Cost:** Pay-as-you-go (~$10-20/month for 10 customers)
- **What you get:**
  - API key (starts with `sk-ant-`)
- **Setup time:** 5 minutes
- **Used for:**
  - Cost Guard analysis
  - RERA change detection
  - Contract analysis (up to 150 pages)
  - Cash flow forecasting

### **3. Google AI (Gemini)** ⭐ REQUIRED FOR LARGE CONTRACTS
- **URL:** https://aistudio.google.com/app/apikey
- **What it does:** Backup AI for large contracts (150+ pages)
- **Cost:** Free tier available, then pay-as-you-go
- **What you get:**
  - API key (starts with `AIza`)
- **Setup time:** 5 minutes
- **Used for:**
  - Contracts 150-500 pages (Gemini 2.5 Pro)
  - Contracts 500+ pages (chunked analysis)

### **4. Razorpay (Payments)** ⭐ REQUIRED
- **URL:** https://razorpay.com
- **What it does:** Accept payments from customers
- **Cost:** 2% transaction fee
- **What you get:**
  - Key ID (Test: `rzp_test_...`, Live: `rzp_live_...`)
  - Key Secret
  - Webhook Secret
  - Plan ID (subscription plan you create)
- **Setup time:** 20 minutes (+ 1-2 days KYC)
- **Steps:**
  1. Sign up with business details
  2. Complete KYC verification
  3. Get Test Mode keys
  4. Create subscription plan (₹1L/month)
  5. Get Live Mode keys (after KYC)

### **5. Twilio (WhatsApp Notifications)** ⭐ REQUIRED
- **URL:** https://twilio.com
- **What it does:** Send WhatsApp alerts to customers
- **Cost:** ~₹0.50 per message
- **What you get:**
  - Account SID (starts with `AC...`)
  - Auth Token
  - WhatsApp number (sandbox: `+14155238886`)
- **Setup time:** 10 minutes
- **Used for:**
  - Daily cash position summary
  - RERA deadline alerts
  - Duplicate invoice alerts

### **6. SendGrid (Email Notifications)** ⭐ REQUIRED
- **URL:** https://sendgrid.com
- **What it does:** Send email notifications
- **Cost:** Free tier (100 emails/day)
- **What you get:**
  - API key (starts with `SG.`)
- **Setup time:** 10 minutes
- **Used for:**
  - Magic link authentication
  - Weekly reports
  - Invoice emails

### **7. AWS (Textract for OCR)** ⏸️ OPTIONAL
- **URL:** https://aws.amazon.com
- **What it does:** Extract text from scanned documents
- **Cost:** Pay-as-you-go (~$1.50 per 1000 pages)
- **What you get:**
  - Access Key ID
  - Secret Access Key
- **Setup time:** 15 minutes
- **Status:** OPTIONAL - can use `pdf-parse` library instead (free)
- **Only needed if:** Customers upload scanned PDFs (not typed)

---

## 📋 **COMPLETE .env.local FILE:**

```bash
# ============================================================================
# SUPABASE (Database, Auth, Storage) - REQUIRED
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ============================================================================
# ANTHROPIC (Claude AI) - REQUIRED
# ============================================================================
# Primary AI for Cost Guard, RERA, Cash Flow, Contracts (<150 pages)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# ============================================================================
# GOOGLE AI (Gemini) - REQUIRED FOR LARGE CONTRACTS
# ============================================================================
# Used for contracts 150+ pages (Gemini 2.5 Pro)
GOOGLE_AI_API_KEY=AIzaSyxxxxx

# ============================================================================
# RAZORPAY (Payments) - REQUIRED
# ============================================================================
# Test Mode (for development)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
RAZORPAY_PLAN_ID=plan_xxxxx

# Live Mode (for production - replace above keys)
# RAZORPAY_KEY_ID=rzp_live_xxxxx
# RAZORPAY_KEY_SECRET=xxxxx
# RAZORPAY_WEBHOOK_SECRET=xxxxx
# RAZORPAY_PLAN_ID=plan_xxxxx

# ============================================================================
# TWILIO (WhatsApp) - REQUIRED
# ============================================================================
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# ============================================================================
# SENDGRID (Email) - REQUIRED
# ============================================================================
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@builderos.com
SENDGRID_FROM_NAME=BuilderOS

# ============================================================================
# AWS TEXTRACT (OCR) - OPTIONAL
# ============================================================================
# Only needed for scanned PDFs (not typed PDFs)
# AWS_ACCESS_KEY_ID=AKIAxxxxx
# AWS_SECRET_ACCESS_KEY=xxxxx
# AWS_REGION=ap-south-1

# ============================================================================
# APPLICATION SETTINGS
# ============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🚀 **STEP-BY-STEP SETUP (30 MINUTES):**

### **Step 1: Install Dependencies (3 minutes)**
```bash
cd /Users/arjun/BuilderOS/app
npm install
```

### **Step 2: Create Supabase Project (10 minutes)**

1. Go to https://supabase.com → Sign up
2. Click "New Project"
3. Settings:
   - Organization: Your name
   - Project name: "BuilderOS"
   - Database password: (save this!)
   - Region: **Mumbai (ap-south-1)**
4. Wait ~2 minutes for project creation
5. Get API keys:
   - Settings → API
   - Copy "Project URL"
   - Copy "anon public" key
   - Copy "service_role" key (keep secret!)

6. Create Storage Buckets:
   - Storage → New bucket
   - Create 3 buckets:
     - `bank-statements` (Private)
     - `invoices` (Private)
     - `contracts` (Private)

7. Run Database Migrations:
   - SQL Editor → New query
   - Copy `/app/supabase/migrations/20241031_initial.sql`
   - Click "Run"
   - Repeat for:
     - `20241031_cash_flow.sql`
     - `20241031_billing.sql`
   - Verify: Table Editor should show 25+ tables

### **Step 3: Get AI API Keys (10 minutes)**

**Anthropic (Claude):**
1. Go to https://console.anthropic.com
2. Sign up / Log in
3. API Keys → Create Key
4. Copy key (starts with `sk-ant-`)
5. Save it (can't see again!)

**Google AI (Gemini):**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy key (starts with `AIza`)
5. Save it

### **Step 4: Set Up Razorpay (20 minutes + KYC wait)**

1. Go to https://razorpay.com → Sign up
2. Enter business details
3. Complete KYC (upload documents)
   - Takes 1-2 days for approval
4. **Test Mode (start here):**
   - Settings → API Keys (Test Mode)
   - Generate Test Key
   - Copy Key ID (`rzp_test_...`)
   - Copy Key Secret
5. Create Subscription Plan:
   - Products → Subscriptions → Plans
   - Create Plan:
     - Name: "BuilderOS Pro"
     - Billing Interval: Monthly
     - Amount: ₹100000 (₹1 Lakh)
     - Currency: INR
   - Copy Plan ID (`plan_...`)
6. Set Up Webhook:
   - Settings → Webhooks
   - Webhook URL: `https://localhost:3000/api/billing/webhook` (change later)
   - Select events:
     - subscription.charged
     - subscription.activated
     - subscription.cancelled
     - payment.failed
   - Copy Webhook Secret
7. **Live Mode (after KYC approved):**
   - Switch to Live Mode
   - Generate Live API keys
   - Create same subscription plan
   - Update webhook URL to production domain

### **Step 5: Set Up Twilio (10 minutes)**

1. Go to https://twilio.com → Sign up
2. Verify phone number
3. Explore Products → Messaging
4. Try WhatsApp → Follow setup
5. Get credentials:
   - Console → Account Info
   - Copy Account SID (`AC...`)
   - Copy Auth Token
   - WhatsApp Sandbox number: `+14155238886`
6. **For production:** Apply for WhatsApp Business API

### **Step 6: Set Up SendGrid (10 minutes)**

1. Go to https://sendgrid.com → Sign up
2. Settings → API Keys
3. Create API Key:
   - Name: "BuilderOS"
   - Permissions: Full Access
4. Copy key (starts with `SG.`)
5. Save it (can't see again!)
6. Verify Sender:
   - Settings → Sender Authentication
   - Single Sender Verification
   - Enter your email
   - Verify email link

### **Step 7: Create .env.local (5 minutes)**

```bash
cd /Users/arjun/BuilderOS/app
cp .env.example .env.local
```

Open `.env.local` and fill in ALL your API keys from above.

### **Step 8: Test Locally (2 minutes)**

```bash
npm run dev
```

Open http://localhost:3000

**Test:**
- Sign up works (magic link email)
- Dashboard loads
- Can create org
- Can add project
- All features accessible

---

## 💰 **COST BREAKDOWN (Monthly):**

**For 10 customers:**

| Service | Cost | Notes |
|---------|------|-------|
| Supabase | $0 (free tier) | Upgrade to $25/mo after 50 customers |
| Anthropic (Claude) | ~$15-20 | Pay per use, varies by usage |
| Google AI (Gemini) | ~$5-10 | Only for large contracts |
| Razorpay | 2% of revenue | ₹10L revenue = ₹20K fees |
| Twilio | ~$10 | ~₹0.50 per WhatsApp message |
| SendGrid | $0 (free tier) | 100 emails/day free |
| AWS Textract | $0 (optional) | Only if you use it |

**Total: ~₹3,500-4,500/month for 10 customers**

**Your revenue with 10 customers:** ₹10L/month  
**Your costs:** ₹4.5K/month  
**Your profit:** ₹9.95L/month 💰

---

## ⚠️ **COMMON SETUP MISTAKES:**

**❌ Mistake 1: Forgetting Gemini**
- Contract analyzer won't work for large contracts
- Add Google AI API key!

**❌ Mistake 2: Using Test Keys in Production**
- Razorpay test keys won't charge real money
- Switch to Live Mode keys before launch!

**❌ Mistake 3: Not Running ALL Migrations**
- App will crash with "table does not exist"
- Run all 3 migration files in Supabase!

**❌ Mistake 4: Wrong Supabase Region**
- Choose Mumbai (ap-south-1) for best performance
- Closest to your Indian customers!

**❌ Mistake 5: Not Verifying SendGrid Sender**
- Emails won't send without verified sender
- Click verification link in email!

---

## ✅ **VERIFICATION CHECKLIST:**

After setup, verify everything works:

- [ ] **Supabase:** Can see 25+ tables in Table Editor
- [ ] **Claude:** API key doesn't show "Invalid" error
- [ ] **Gemini:** API key is valid (test in Google AI Studio)
- [ ] **Razorpay:** Test mode dashboard shows API keys
- [ ] **Twilio:** Can send test WhatsApp from console
- [ ] **SendGrid:** Sender email is verified
- [ ] **.env.local:** All 11+ keys filled in
- [ ] **npm install:** No critical errors
- [ ] **npm run dev:** Site loads at localhost:3000
- [ ] **Sign up:** Magic link email arrives
- [ ] **Dashboard:** Can create org and project

---

## 🆘 **TROUBLESHOOTING:**

### **Issue: npm install fails**
```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### **Issue: Supabase connection error**
- Check SUPABASE_URL ends with `.supabase.co`
- Check keys are from correct project
- Check RLS policies allow insert/select

### **Issue: AI API errors**
- Anthropic: Check you have credits (add payment method)
- Gemini: Check API key is enabled for Gemini API
- Check rate limits (Claude: 50 req/min free tier)

### **Issue: Payment webhook not working**
- Check webhook URL is correct
- Check webhook secret matches
- Look at Razorpay webhook logs for errors
- Test with Razorpay test mode first

### **Issue: WhatsApp not sending**
- Check you're using sandbox number in test
- Check phone number is in correct format (+91...)
- For production, need approved WhatsApp Business

---

## 🎯 **READY CHECKLIST:**

When you have ALL of these, you're ready to test:

- [ ] ✅ Supabase project created (Mumbai region)
- [ ] ✅ Database migrations run (25+ tables)
- [ ] ✅ Storage buckets created (3 buckets)
- [ ] ✅ Anthropic API key obtained
- [ ] ✅ Gemini API key obtained
- [ ] ✅ Razorpay account created (KYC submitted)
- [ ] ✅ Razorpay Test Mode keys
- [ ] ✅ Razorpay subscription plan created
- [ ] ✅ Twilio account created
- [ ] ✅ SendGrid account created
- [ ] ✅ SendGrid sender verified
- [ ] ✅ .env.local created with ALL keys
- [ ] ✅ npm install completed
- [ ] ✅ npm run dev works
- [ ] ✅ Can sign up and log in

**When all ✅ are checked, you're ready to test all features!**

---

## 🚀 **NEXT: TEST EVERYTHING**

Once setup is complete, test each feature:

1. **Test Auth:** Sign up, get magic link, log in
2. **Test Project:** Create org, add project
3. **Test Cost Guard:** Upload sample Tally CSV
4. **Test Cash Flow:** Upload sample bank CSV  
5. **Test RERA:** View dashboard, try QPR generation
6. **Test Contracts:** Upload sample PDF
7. **Test Billing:** View subscription page

If all work → **YOU'RE READY TO DEPLOY!** 🎉

---

**NO MORE FORGOTTEN REQUIREMENTS. THIS IS EVERYTHING.** ✅

