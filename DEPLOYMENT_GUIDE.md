# 🚀 BuilderOS Deployment Guide

**Complete step-by-step guide to deploy BuilderOS to production**

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub account (to push code)
- [ ] Vercel account (for hosting)
- [ ] Supabase account (for database)
- [ ] Anthropic API key (for Claude AI)
- [ ] Razorpay account (for payments)
- [ ] Twilio account (for WhatsApp)
- [ ] SendGrid account (for email)
- [ ] Custom domain (optional, can use Vercel subdomain)

---

## 🔧 Step 1: Local Setup & Testing

### 1.1 Install Dependencies

```bash
cd /Users/arjun/BuilderOS/app
npm install
```

### 1.2 Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region: **Mumbai (ap-south-1)**
4. Set database password (save it!)
5. Wait for project to be created (~2 minutes)

6. Get API keys:
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role` key (keep secret!)

7. Create storage buckets:
   - Go to Storage → Create bucket
   - Create: `bank-statements`, `invoices`, `contracts`
   - Set all to **private** (authenticated users only)

8. Run database migrations:
   - Go to SQL Editor → New query
   - Copy contents of `/app/supabase/migrations/20241031_initial.sql`
   - Click "Run"
   - Repeat for all migration files:
     - `20241031_cash_flow.sql`
     - `20241031_billing.sql`

### 1.3 Set Up Anthropic (Claude AI)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to API Keys → Create Key
4. Copy the key (starts with `sk-ant-`)
5. Save it (you can't see it again!)

### 1.4 Set Up Razorpay

1. Go to [razorpay.com](https://razorpay.com)
2. Sign up with business details
3. Complete KYC verification (takes 1-2 days)

4. **Test Mode (for development):**
   - Go to Settings → API Keys (Test Mode)
   - Generate Test Key
   - Copy Key ID (`rzp_test_...`) and Secret

5. **Create Subscription Plan:**
   - Go to Subscriptions → Plans → Create Plan
   - Plan Name: "BuilderOS Pro - Per Project"
   - Billing Interval: Monthly
   - Amount: ₹1,00,000 (₹1 Lakh)
   - Copy Plan ID (`plan_...`)

6. **Set Up Webhook:**
   - Go to Settings → Webhooks
   - Create webhook URL: `https://your-domain.com/api/billing/webhook`
   - Select events:
     - `subscription.charged`
     - `subscription.activated`
     - `subscription.cancelled`
     - `payment.failed`
   - Copy webhook secret

7. **Live Mode (for production):**
   - After KYC approved, switch to Live Mode
   - Generate Live API keys
   - Create same subscription plan in Live Mode

### 1.5 Set Up Twilio (WhatsApp)

1. Go to [twilio.com](https://twilio.com)
2. Sign up / Log in
3. Go to Messaging → Try WhatsApp
4. Follow setup wizard
5. Get credentials:
   - Account SID (starts with `AC...`)
   - Auth Token
   - WhatsApp number: `+1 415 523 8886` (Twilio sandbox)

6. **For production:** Apply for WhatsApp Business API (takes 2-4 weeks)

### 1.6 Set Up SendGrid (Email)

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up / Log in
3. Go to Settings → API Keys → Create API Key
4. Choose "Full Access"
5. Copy the key (starts with `SG.`)

6. Verify sender email:
   - Go to Settings → Sender Authentication
   - Verify your domain or single sender
   - Use verified email as `SENDGRID_FROM_EMAIL`

### 1.7 Create .env.local

```bash
cd /Users/arjun/BuilderOS/app
cp .env.example .env.local
```

Edit `.env.local` with your actual keys:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
RAZORPAY_PLAN_ID=plan_xxxxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# SendGrid
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=BuilderOS

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 1.8 Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 1.9 Test Everything

**Test Auth:**
- [ ] Sign up with email
- [ ] Receive magic link
- [ ] Log in successfully

**Test Organization:**
- [ ] Create organization
- [ ] Add project
- [ ] Invite user

**Test Cost Guard:**
- [ ] Upload Tally CSV
- [ ] See invoice list
- [ ] Check for duplicate detection

**Test RERA:**
- [ ] View RERA dashboard
- [ ] Check scraper status
- [ ] Generate sample QPR

**Test Contracts:**
- [ ] Upload PDF contract
- [ ] See AI analysis
- [ ] View risk summary

**Test Cash Flow:**
- [ ] Upload bank CSV
- [ ] See cash position
- [ ] View AI forecast

**Test Billing:**
- [ ] View subscription
- [ ] Check license count
- [ ] View payment history

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Push to GitHub

```bash
cd /Users/arjun/BuilderOS
git add -A
git commit -m "Production ready - all features complete"
git push origin main
```

### 2.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click "New Project"
4. Import `builderOS` repository
5. Configure:
   - Framework: Next.js
   - Root Directory: `app`
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. Add Environment Variables:
   - Click "Environment Variables"
   - Add ALL variables from `.env.local`
   - **Use production keys (not test keys!)**
   - For Razorpay: Use Live Mode keys
   - For Twilio: Use production WhatsApp number (if approved)

7. Click "Deploy"

8. Wait for deployment (~2-3 minutes)

9. Get deployment URL: `https://builder-os-xxxxx.vercel.app`

### 2.3 Configure Custom Domain (Optional)

1. Buy domain (e.g., `builderos.com`) from:
   - Namecheap
   - GoDaddy
   - Google Domains

2. In Vercel:
   - Go to Project → Settings → Domains
   - Add custom domain
   - Follow DNS configuration instructions

3. Wait for DNS propagation (~1-24 hours)

4. Your site is now at: `https://builderos.com` ✅

### 2.4 Update Supabase Redirect URLs

1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add:
   - Site URL: `https://builderos.com`
   - Redirect URLs: `https://builderos.com/auth/callback`

### 2.5 Update Razorpay Webhook

1. Go to Razorpay Dashboard
2. Settings → Webhooks
3. Update webhook URL: `https://builderos.com/api/billing/webhook`

---

## 🔒 Step 3: Security Hardening

### 3.1 Enable Supabase Row Level Security

Already done in migrations! Just verify:
- All tables have RLS enabled
- Policies are in place
- Test with different users

### 3.2 Set Up Vercel Environment Variables

- [ ] All secrets are in environment variables (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] Production uses different keys than development

### 3.3 Enable HTTPS Only

Vercel does this automatically ✅

### 3.4 Set Up Domain Security Headers

Add to `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

---

## 📊 Step 4: Set Up Monitoring

### 4.1 Vercel Analytics

1. Go to Vercel Dashboard → Analytics
2. Enable (free tier available)
3. Track:
   - Page views
   - User sessions
   - Performance metrics

### 4.2 Supabase Monitoring

1. Go to Supabase Dashboard → Reports
2. Monitor:
   - Database size
   - API requests
   - Auth usage

### 4.3 Error Tracking (Optional)

Install Sentry:

```bash
npm install @sentry/nextjs
```

Configure in `sentry.client.config.js`

---

## 🧪 Step 5: Post-Deployment Testing

### 5.1 Test Production Site

Go through entire user flow on production:
- [ ] Sign up
- [ ] Create org
- [ ] Add project
- [ ] Upload CSV
- [ ] Upload contract
- [ ] Upload bank statements
- [ ] View billing
- [ ] Test payment (with test card)

### 5.2 Test Mobile Responsive

Open on:
- [ ] iPhone
- [ ] Android
- [ ] Tablet
- [ ] Desktop

### 5.3 Test Performance

- [ ] Page load < 2 seconds
- [ ] CSV upload works smoothly
- [ ] PDF parsing is fast
- [ ] No console errors

### 5.4 Test API Limits

Check rate limits:
- [ ] Anthropic: 50 requests/minute (Tier 1)
- [ ] Supabase: Check your plan limits
- [ ] Razorpay: Unlimited test transactions

---

## 🚀 Step 6: Go Live!

### 6.1 Switch Razorpay to Live Mode

1. In Vercel environment variables
2. Replace test keys with live keys
3. Update webhook URL (live mode)
4. Redeploy

### 6.2 Test Payment with Real Card

Use your own card to test:
- [ ] Subscription creation works
- [ ] Payment goes through
- [ ] Webhook updates database
- [ ] Invoice is generated

### 6.3 Launch Checklist

- [ ] All APIs are production-ready
- [ ] All keys are live (not test)
- [ ] Custom domain is working
- [ ] SSL certificate is active
- [ ] Mobile responsive
- [ ] No console errors
- [ ] All features tested
- [ ] Monitoring enabled

### 6.4 Announce Launch! 🎉

You're live! Time to sell:

1. Call your 5 builder friends
2. "Hey, I launched BuilderOS. Can I show your finance team?"
3. Demo Cost Guard + Cash Flow
4. Close first customer
5. Get that ₹1L/month MRR! 💰

---

## 🆘 Troubleshooting

### Issue: Build fails on Vercel

**Solution:**
- Check build logs
- Ensure all dependencies in `package.json`
- Verify `next.config.js` is correct
- Check for TypeScript errors

### Issue: Supabase connection error

**Solution:**
- Verify environment variables
- Check Supabase project is active
- Verify RLS policies don't block access

### Issue: AI API errors

**Solution:**
- Check Anthropic API key is valid
- Verify you have API credits
- Check rate limits

### Issue: Payment webhook not working

**Solution:**
- Verify webhook URL is correct
- Check webhook secret matches
- Look at Razorpay webhook logs
- Test webhook with Razorpay test mode

---

## 📞 Support

**Need help?**
- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: [supabase.com/support](https://supabase.com/support)
- Anthropic: [support.anthropic.com](https://support.anthropic.com)
- Razorpay: [razorpay.com/support](https://razorpay.com/support)

---

## 🎉 Congratulations!

**You just deployed a production SaaS!**

**Now go sell it to your 5 builder friends and make ₹1L/month!** 🚀

