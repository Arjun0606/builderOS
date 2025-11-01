# 🚀 LEGALOS DEPLOYMENT GUIDE

**Complete Step-by-Step Guide to Deploy LegalOS**

---

## 📋 PREREQUISITES

Before you start, make sure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn installed
- ✅ Git installed
- ✅ Supabase account (free tier works)
- ✅ Anthropic API key (Claude)
- ✅ Google AI API key (Gemini)
- ✅ Vercel account (for hosting - optional)

---

## 🗄️ STEP 1: DEPLOY DATABASE

### **1.1 Go to Supabase Dashboard**

```
URL: https://supabase.com/dashboard
```

- Login to your account
- Select your project (or create new one)
- Note your project URL and anon key

---

### **1.2 Deploy Database Schema**

1. Click **"SQL Editor"** in left sidebar
2. Click **"New Query"**
3. Open file: `/app/supabase/LEGALOS_SCHEMA.sql`
4. Copy ALL contents (600+ lines)
5. Paste into SQL Editor
6. Click **"Run"** button (or press Cmd/Ctrl + Enter)

**Expected Output:**
```
✅ Success! No errors.
```

**What This Creates:**
- 15 tables (organizations, users, clients, cases, etc.)
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for auto-updates
- Full audit trail

---

### **1.3 Verify Database**

In Supabase Dashboard:
1. Click **"Table Editor"** in left sidebar
2. You should see 15 tables:
   - organizations
   - users
   - clients
   - cases
   - documents
   - templates
   - ai_conversations
   - tasks
   - court_dates
   - time_entries
   - invoices
   - subscriptions
   - alerts
   - intake_forms
   - intake_submissions

**If all 15 tables are there → SUCCESS!** ✅

---

## 🔑 STEP 2: GET API KEYS

### **2.1 Supabase Keys**

In Supabase Dashboard:
1. Click **"Settings"** (gear icon)
2. Click **"API"**
3. Copy:
   - **Project URL:** `https://[your-project].supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1...` (long string)

---

### **2.2 Anthropic API Key (Claude)**

1. Go to: https://console.anthropic.com/
2. Sign up or login
3. Click **"API Keys"**
4. Click **"Create Key"**
5. Copy the key: `sk-ant-api03-...`

**Pricing:** ~$0.03-0.15 per query (pay as you go)

---

### **2.3 Google AI API Key (Gemini)**

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key: `AIza...`

**Pricing:** Cheaper than Claude for large documents

---

## 💻 STEP 3: SETUP LOCAL ENVIRONMENT

### **3.1 Clone Repository** (if not already)

```bash
cd /Users/arjun/BuilderOS
```

---

### **3.2 Install Dependencies**

```bash
cd app
npm install
```

**This installs:**
- Next.js, React
- Supabase client
- Anthropic SDK
- Google Generative AI SDK
- UI components (shadcn)
- And 40+ other packages

**Time:** 2-3 minutes

---

### **3.3 Create Environment File**

```bash
cd app
cp .env.example .env.local
```

---

### **3.4 Add Your API Keys**

Edit `app/.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...

# AI Models
ANTHROPIC_API_KEY=sk-ant-api03-...
GOOGLE_AI_API_KEY=AIza...

# Application URL (for local dev)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `[your-project]` with your Supabase project ID
- Paste your actual API keys

---

## 🧪 STEP 4: TEST LOCALLY

### **4.1 Start Development Server**

```bash
cd app
npm run dev
```

**Expected Output:**
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Ready in 2.1s
```

---

### **4.2 Open Browser**

Go to: http://localhost:3000

**You should see:**
- LegalOS landing page
- Login/Signup buttons
- Professional legal-tech UI

---

### **4.3 Create Test Account**

1. Click **"Sign Up"**
2. Enter:
   - Email: test@example.com
   - Password: Test123456!
3. Click **"Sign Up"**

**Expected:**
- Redirect to onboarding
- Create organization
- Access dashboard

---

### **4.4 Test Core Features**

**Test Dashboard:**
- Go to: http://localhost:3000/dashboard
- Should see: Stats, quick actions, empty state

**Test Clients:**
- Go to: http://localhost:3000/dashboard/clients
- Click **"Add New Client"**
- Fill form, click **"Save"**
- Should see client in list

**Test Cases:**
- Go to: http://localhost:3000/dashboard/cases
- Click **"Add New Case"**
- Fill form, click **"Save"**
- Should see case in list

**Test AI Assistant:**
- Go to: http://localhost:3000/dashboard/ai-assistant
- Type: "What is Section 138 of NI Act?"
- Click **"Send"**
- Should get AI response with Indian law citation

---

## 🚀 STEP 5: DEPLOY TO PRODUCTION

### **Option A: Deploy to Vercel (Recommended)**

---

#### **5.1 Push to GitHub**

```bash
cd /Users/arjun/BuilderOS
git push origin main
```

---

#### **5.2 Deploy to Vercel**

1. Go to: https://vercel.com
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select **"BuilderOS"** repo
5. Configure:
   - **Framework:** Next.js (auto-detected)
   - **Root Directory:** `app`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

---

#### **5.3 Add Environment Variables**

In Vercel project settings:
1. Click **"Settings"**
2. Click **"Environment Variables"**
3. Add each variable:

```
NEXT_PUBLIC_SUPABASE_URL = https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbG...
ANTHROPIC_API_KEY = sk-ant-api03-...
GOOGLE_AI_API_KEY = AIza...
NEXT_PUBLIC_APP_URL = https://[your-vercel-domain].vercel.app
```

4. Click **"Save"**

---

#### **5.4 Deploy**

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site is live!

**Your URL:** `https://[your-project].vercel.app`

---

### **Option B: Deploy to Other Platforms**

**Railway:**
- Similar to Vercel
- Connect GitHub → Deploy
- Add environment variables

**DigitalOcean App Platform:**
- Import repo
- Set build command: `cd app && npm run build`
- Add environment variables

**AWS/GCP:**
- More complex, requires Docker
- Not recommended for MVP

---

## ✅ STEP 6: POST-DEPLOYMENT CHECKLIST

### **6.1 Verify Deployment**

Visit your live URL and test:

- [ ] Landing page loads
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Can create client
- [ ] Can create case
- [ ] AI Assistant responds
- [ ] Templates page loads
- [ ] Time tracking works

---

### **6.2 Create First Real Account**

1. Sign up with your real email
2. Create organization (your law firm name)
3. Explore all features
4. Report any bugs

---

### **6.3 Monitor Costs**

**Supabase (Free Tier):**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- Should be enough for 10-20 test users

**Anthropic (Pay-as-you-go):**
- $3-15 per 1M tokens
- Estimate: $20-50/month for testing
- Monitor usage in console

**Gemini (Pay-as-you-go):**
- $1.25-5 per 1M tokens
- Cheaper for large documents
- Monitor in Google AI Studio

**Vercel (Free Tier):**
- 100 GB bandwidth
- Unlimited deployments
- Should be enough for MVP

---

### **6.4 Setup Custom Domain (Optional)**

In Vercel:
1. Click **"Settings"** → **"Domains"**
2. Add your domain (e.g., legalos.in)
3. Update DNS records
4. Wait 24-48 hours for propagation

---

## 🔧 TROUBLESHOOTING

### **Database Issues:**

**"Table does not exist"**
- Solution: Re-run LEGALOS_SCHEMA.sql in Supabase

**"RLS policy violation"**
- Solution: Make sure user is logged in
- Check organization_id is set

---

### **AI Issues:**

**"AI not responding"**
- Check API keys in .env.local
- Verify Anthropic account has credits
- Check browser console for errors

**"Invalid API key"**
- Regenerate API key
- Make sure no extra spaces
- Restart dev server after updating .env

---

### **Build Issues:**

**"Module not found"**
- Solution: `cd app && npm install`

**"TypeScript errors"**
- Solution: `cd app && npm run type-check`
- Fix any type errors

**"Supabase client error"**
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Check anon key is correct
- Verify project is active in Supabase

---

## 📊 MONITORING & MAINTENANCE

### **Daily:**
- Check Vercel logs for errors
- Monitor Supabase dashboard
- Check AI API usage

### **Weekly:**
- Review user signups
- Check for bugs/feedback
- Update dependencies if needed

### **Monthly:**
- Review costs (Supabase, AI APIs, Vercel)
- Backup database
- Plan new features

---

## 💰 COST ESTIMATES

### **Testing Phase (0-10 users):**
- Supabase: Free
- Anthropic: $20-50/month
- Gemini: $10-20/month
- Vercel: Free
- **Total: $30-70/month**

### **Early Stage (10-50 users):**
- Supabase: Free
- Anthropic: $100-200/month
- Gemini: $50-100/month
- Vercel: Free
- **Total: $150-300/month**

### **Growth Stage (50-200 users):**
- Supabase: $25/month (Pro plan)
- Anthropic: $500-1,000/month
- Gemini: $200-400/month
- Vercel: $20/month
- **Total: $745-1,445/month**

**At 200 users paying ₹10k/month:**
- Revenue: ₹20L/month ($24k/month)
- Costs: $1,500/month
- Margin: 94% 🤯

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

### **Immediate (Week 1):**
1. ✅ Test all features
2. ✅ Create demo account
3. ✅ Record demo video
4. ✅ Setup analytics (PostHog/Mixpanel)

### **Short-term (Week 2-4):**
5. ✅ Onboard 5 beta users
6. ✅ Collect feedback
7. ✅ Fix critical bugs
8. ✅ Add missing features

### **Medium-term (Month 2-3):**
9. ✅ Launch to first 20 firms
10. ✅ Setup payment processing (Razorpay)
11. ✅ Build sales page
12. ✅ Start marketing

---

## 📞 SUPPORT

**If you get stuck:**

1. Check browser console (F12)
2. Check Vercel logs
3. Check Supabase logs
4. Review this guide again

**Common Issues:**
- 90% are environment variable problems
- Check .env.local has all required keys
- Make sure no trailing spaces
- Restart server after changes

---

## ✅ DEPLOYMENT CHECKLIST

```
Phase 1: Database
[ ] Supabase project created
[ ] LEGALOS_SCHEMA.sql deployed
[ ] All 15 tables visible
[ ] RLS policies working

Phase 2: API Keys
[ ] Supabase URL and key copied
[ ] Anthropic API key obtained
[ ] Google AI API key obtained
[ ] All keys added to .env.local

Phase 3: Local Testing
[ ] Dependencies installed (npm install)
[ ] Dev server running (npm run dev)
[ ] Can signup/login
[ ] Can create clients
[ ] Can create cases
[ ] AI Assistant works

Phase 4: Production Deploy
[ ] Code pushed to GitHub
[ ] Vercel project created
[ ] Environment variables added
[ ] Site deployed successfully
[ ] Custom domain added (optional)

Phase 5: Verification
[ ] All features work on production
[ ] No console errors
[ ] Mobile responsive
[ ] AI responses working
[ ] Data persisting correctly

Phase 6: Launch Prep
[ ] Demo account created
[ ] Help docs written
[ ] Pricing page ready
[ ] Payment setup (later)
[ ] Marketing plan ready
```

---

## 🎉 YOU'RE LIVE!

Once all checkboxes are complete, **LegalOS is deployed and ready for users!**

**Your live product includes:**
- ✅ Full case management
- ✅ Client management
- ✅ AI Legal Assistant (unlimited queries)
- ✅ 500+ document templates
- ✅ Time tracking & billing
- ✅ Multi-tenant architecture
- ✅ Production-ready security

**Start selling!** 🚀

---

**Questions?** Review this guide step-by-step.  
**Stuck?** 90% of issues are API key related - double-check .env.local

**GOOD LUCK!** 🍀
