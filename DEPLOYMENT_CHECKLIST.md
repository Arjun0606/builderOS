# 🚀 **LEGALOS DEPLOYMENT CHECKLIST**

## ✅ **COMPLETE PRE-DEPLOYMENT CHECKLIST**

---

## **PHASE 1: LOCAL SETUP (30 minutes)**

### **Step 1: Install Dependencies**
```bash
cd app
npm install
```

### **Step 2: Configure Environment Variables**

Create `.env.local` file:
```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Models (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...

# Email (REQUIRED)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Secret (generate random string)
CRON_SECRET=your_random_secret_here
```

### **Step 3: Set Up Supabase Database**

**Option A: Manual SQL Execution**
1. Go to your Supabase project SQL editor
2. Copy contents of `app/supabase/LEGALOS_SCHEMA.sql`
3. Execute
4. Copy contents of `app/supabase/knowledge-base-migration.sql`
5. Execute

**Option B: Run Migration Script** (if ts-node is set up)
```bash
cd app
npx ts-node scripts/run-migrations.ts
```

### **Step 4: Test Locally**
```bash
cd app
npm run dev
```

Open http://localhost:3000

**Test checklist:**
- [ ] Can access login page
- [ ] Can sign up with email
- [ ] Receive magic link email
- [ ] Can complete onboarding
- [ ] Redirected to dashboard
- [ ] Can add a client
- [ ] Can add a case
- [ ] Can chat with AI assistant
- [ ] Can logout
- [ ] After logout, cannot access dashboard (redirects to login)

---

## **PHASE 2: VERCEL DEPLOYMENT (20 minutes)**

### **Step 1: Connect GitHub Repo**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Select `app` folder as root directory

### **Step 2: Configure Environment Variables**

Add all variables from `.env.local` to Vercel:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
- GOOGLE_AI_API_KEY
- OPENAI_API_KEY
- SENDGRID_API_KEY
- SENDGRID_FROM_EMAIL
- NEXT_PUBLIC_APP_URL (change to your Vercel URL)
- CRON_SECRET

### **Step 3: Deploy**
Click "Deploy"

Wait 3-5 minutes for build to complete.

### **Step 4: Set Up Cron Job (Vercel)**

Create `vercel.json` in app folder:
```json
{
  "crons": [{
    "path": "/api/notifications/court-reminder",
    "schedule": "0 9 * * *"
  }]
}
```

Commit and push to trigger redeploy.

### **Step 5: Test Production**

Go to your Vercel URL (e.g., https://legalos.vercel.app)

**Test checklist:**
- [ ] Can access site
- [ ] Can sign up
- [ ] Can login
- [ ] Dashboard loads
- [ ] AI assistant works
- [ ] Can upload documents
- [ ] Can generate templates
- [ ] Can logout

---

## **PHASE 3: POST-DEPLOYMENT (10 minutes)**

### **Step 1: Configure Supabase Auth**

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to "Site URL"
3. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`

### **Step 2: Configure SendGrid**

1. Go to SendGrid Dashboard
2. Verify your sender email/domain
3. Test by sending yourself a court reminder

### **Step 3: Test Email Notifications**

1. Add a court date for tomorrow
2. Wait until 9 AM (or trigger cron manually)
3. Verify email received

---

## **PHASE 4: FINAL CHECKS (10 minutes)**

### **Security:**
- [ ] Environment variables not exposed in client
- [ ] RLS policies working (users can't see other firms' data)
- [ ] API routes require authentication
- [ ] Session expiry working

### **Performance:**
- [ ] Pages load in < 3 seconds
- [ ] AI responses in < 10 seconds
- [ ] No console errors

### **Features:**
- [ ] All nav links work
- [ ] Forms submit correctly
- [ ] File uploads work
- [ ] PDF generation works (if implemented)
- [ ] Search works
- [ ] Filters work

### **Mobile:**
- [ ] Responsive on phone
- [ ] Can navigate
- [ ] Forms work on mobile

---

## **COMMON ISSUES & FIXES**

### **Issue: "Invalid API key"**
**Fix:** Check that all API keys are correct in Vercel environment variables

### **Issue: "Supabase connection failed"**
**Fix:** Verify NEXT_PUBLIC_SUPABASE_URL and keys are correct

### **Issue: "Database tables not found"**
**Fix:** Run migrations in Supabase SQL editor

### **Issue: "Cannot access dashboard after login"**
**Fix:** Check middleware.ts is deployed and working

### **Issue: "Middleware redirect loop"**
**Fix:** Check that user has organization_id in database

### **Issue: "AI responses failing"**
**Fix:** Verify Anthropic/Google/OpenAI API keys and quotas

### **Issue: "File uploads failing"**
**Fix:** Check Supabase storage buckets are created with correct policies

---

## **DEPLOYMENT STATUS TRACKER**

```
[ ] Local setup complete
[ ] Database migrated
[ ] Local testing passed
[ ] Vercel project created
[ ] Environment variables configured
[ ] Production deployed
[ ] Post-deployment config done
[ ] Final checks passed
[ ] Ready for customer demos
```

---

## **NEXT STEPS AFTER DEPLOYMENT**

1. ✅ Record demo video (5 min)
2. ✅ Create simple landing page (optional)
3. ✅ Make list of 50 law firms to call
4. ✅ Prepare demo script
5. ✅ Start calling customers!

---

## **SUPPORT CONTACTS**

**If you encounter issues:**
- Supabase: https://supabase.com/dashboard/support
- Vercel: https://vercel.com/support
- SendGrid: https://support.sendgrid.com

---

**YOU'RE READY TO LAUNCH!** 🚀

Once all checkboxes are ✅, you're production-ready and can start demoing to customers.

