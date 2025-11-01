# 🚀 LEGALOS - QUICK SETUP GUIDE

**Get LegalOS running in 15 minutes**

---

## ⚡ STEP 1: INSTALL DEPENDENCIES

```bash
cd /Users/arjun/BuilderOS/app
npm install
```

**Required packages (should auto-install):**
- ✅ Next.js 15
- ✅ Supabase client
- ✅ Anthropic SDK (Claude)
- ✅ Google Generative AI (Gemini)
- ✅ React Dropzone
- ✅ date-fns
- ✅ shadcn/ui components

---

## ⚡ STEP 2: SETUP SUPABASE

### **2.1: Create Supabase Project**

1. Go to https://supabase.com
2. Click "New Project"
3. Choose **Mumbai** region (India hosting)
4. Name: "legalos-production"
5. Generate strong database password
6. Click "Create project" (wait 2-3 minutes)

### **2.2: Apply Database Schema**

1. In Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy **entire content** from:
   ```
   /Users/arjun/BuilderOS/app/supabase/LEGALOS_SCHEMA.sql
   ```
4. Paste in SQL Editor
5. Click "Run" (bottom right)
6. Wait for success message ✅

### **2.3: Create Storage Buckets**

**Bucket 1: case-documents**
1. Supabase → Storage → "New Bucket"
2. Name: `case-documents`
3. Public: **NO** (private)
4. File size limit: `52428800` (50 MB)
5. Allowed MIME types: Leave empty (allow all for now)
6. Create bucket

**Bucket 2: knowledge-base**
1. Supabase → Storage → "New Bucket"
2. Name: `knowledge-base`
3. Public: **NO** (private)
4. File size limit: `104857600` (100 MB)
5. Create bucket

### **2.4: Set Storage Policies**

In SQL Editor, run:

```sql
-- Allow authenticated users to upload to case-documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'case-documents' AND
  auth.role() = 'authenticated'
);

-- Allow users to read their own documents
CREATE POLICY "Users can read documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'case-documents' AND
  auth.role() = 'authenticated'
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'case-documents' AND
  auth.role() = 'authenticated'
);

-- Repeat for knowledge-base bucket
CREATE POLICY "Authenticated users can upload to knowledge base"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'knowledge-base' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can read knowledge base"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'knowledge-base' AND
  auth.role() = 'authenticated'
);
```

### **2.5: Configure Auth**

1. Supabase → Authentication → URL Configuration
2. **Site URL:** `http://localhost:3000` (for now)
3. **Redirect URLs:** Add:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Save

### **2.6: Get API Keys**

1. Supabase → Project Settings → API
2. Copy:
   - **Project URL** (starts with https://xxx.supabase.co)
   - **anon public** key (starts with eyJ...)
   - **service_role** key (starts with eyJ... but longer)

---

## ⚡ STEP 3: SETUP ENVIRONMENT VARIABLES

### **3.1: Create `.env.local` file**

```bash
cd /Users/arjun/BuilderOS/app
cp .env.example .env.local
```

### **3.2: Add Your Keys**

Edit `app/.env.local`:

```bash
# Supabase (from Step 2.6)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Google AI (Gemini)
GOOGLE_AI_API_KEY=AIzaSyYour-key-here

# Optional (for future features)
SENDGRID_API_KEY=SG.your_key_here
INDIAN_KANOON_API_KEY=your_key_here
```

### **3.3: Get AI API Keys**

**Anthropic (Claude):**
1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Settings → API Keys
4. Create new key
5. Copy and paste in `.env.local`

**Google AI (Gemini):**
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy and paste in `.env.local`

---

## ⚡ STEP 4: TEST LOCALLY

### **4.1: Start Dev Server**

```bash
cd /Users/arjun/BuilderOS/app
npm run dev
```

### **4.2: Open Browser**

Visit: http://localhost:3000

### **4.3: Test Flow**

1. **Go to /login**
   - Enter your email
   - Check email for magic link
   - Click link

2. **Onboarding**
   - Fill law firm details
   - Complete setup
   - Should redirect to dashboard

3. **Dashboard**
   - See stats (0 clients, 0 cases)
   - Navigation works
   - No errors in console

4. **Test Features:**
   - ✅ Click "Clients" → Add client → Save
   - ✅ Click "Cases" → Add case → Save
   - ✅ Click "AI Assistant" → Ask a question
   - ✅ Click "Court Dates" → Add date → Save
   - ✅ Go to a case → Upload document

### **4.4: Check Database**

In Supabase → Table Editor:
- `organizations` - Should have 1 row (your firm)
- `users` - Should have 1 row (you)
- `clients` - Should have your test client
- `cases` - Should have your test case
- `documents` - Should have your uploaded file

---

## ⚡ STEP 5: DEPLOY TO PRODUCTION

### **5.1: Push to GitHub**

```bash
cd /Users/arjun/BuilderOS
git add -A
git commit -m "LegalOS ready for deployment"
git push origin main
```

### **5.2: Deploy to Vercel**

```bash
cd /Users/arjun/BuilderOS/app

# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Or use Vercel Dashboard:**
1. https://vercel.com → New Project
2. Import from GitHub
3. Select repo: BuilderOS
4. Root Directory: `app`
5. Framework: Next.js (auto-detected)
6. Add environment variables (from `.env.local`)
7. Deploy

### **5.3: Update Supabase Auth URLs**

1. Supabase → Authentication → URL Configuration
2. **Site URL:** `https://your-app.vercel.app`
3. **Redirect URLs:** Add:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`
4. Save

### **5.4: Configure Custom Domain**

In Vercel:
1. Project Settings → Domains
2. Add `legalos.in`
3. Add DNS records (provided by Vercel)

---

## ✅ VERIFICATION CHECKLIST

### **Local Development:**
- [ ] `npm run dev` starts without errors
- [ ] `/login` page loads
- [ ] Magic link authentication works
- [ ] Onboarding flow completes
- [ ] Dashboard loads with data
- [ ] All pages accessible
- [ ] AI Assistant responds (check console for API calls)
- [ ] Document upload works
- [ ] No console errors

### **Database:**
- [ ] All tables created (15 tables)
- [ ] RLS enabled on all tables
- [ ] Storage buckets created (2 buckets)
- [ ] Storage policies set
- [ ] Auth configured

### **Production:**
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] Supabase auth URLs updated
- [ ] Domain configured (optional)
- [ ] SSL active
- [ ] Test signup flow
- [ ] Test all features

---

## 🐛 TROUBLESHOOTING

### **"Can't find module '@/components/ui/button'"**
```bash
cd app
npx shadcn-ui@latest add button input label select
```

### **"Supabase client not found"**
Check `.env.local` file exists and has correct keys.

### **"Magic link not working"**
1. Check Supabase email settings
2. Check spam folder
3. Try with different email provider

### **"Document upload fails"**
1. Check storage bucket exists (`case-documents`)
2. Check storage policies are set
3. Check file size < 50 MB

### **"AI not responding"**
1. Check API keys in `.env.local`
2. Check Anthropic API credits
3. Check Google AI API is enabled
4. Check console for error messages

### **"Database connection failed"**
1. Check Supabase project is active
2. Check API keys are correct
3. Check `NEXT_PUBLIC_SUPABASE_URL` format

---

## 📞 SUPPORT

**Issues:**
- Check console errors
- Check Network tab (browser dev tools)
- Check Supabase logs (Dashboard → Logs)
- Check Vercel logs (if deployed)

**Common Solutions:**
- Clear browser cache
- Restart dev server (`npm run dev`)
- Check environment variables
- Re-run database schema

---

## 🎉 SUCCESS!

If you can:
- ✅ Sign in
- ✅ See dashboard
- ✅ Add a client
- ✅ Create a case
- ✅ Upload a document
- ✅ Ask AI a question

**YOU'RE READY TO LAUNCH!** 🚀

---

**Next:** Read `FINAL_DEPLOYMENT_GUIDE.md` for go-to-market strategy and customer acquisition.

