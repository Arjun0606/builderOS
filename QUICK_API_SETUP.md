# 🔑 Quick API Setup Guide for BuilderOS

## ✅ DONE:
- [x] Supabase (Database, Auth, Storage)

## 🔄 TODO (15 minutes total):

---

### 1️⃣ **ANTHROPIC (Claude AI)** - 3 minutes
**Cost:** Pay-as-you-go (~$5 for testing, $50-100/month in production)

**Steps:**
1. Go to: https://console.anthropic.com/
2. Click **"Sign Up"** or **"Log In"**
3. Verify email
4. Go to **"API Keys"** → **"Create Key"**
5. Copy the key (starts with `sk-ant-api03-...`)

**Add to .env.local:**
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

---

### 2️⃣ **GOOGLE AI (Gemini)** - 3 minutes
**Cost:** FREE up to 60 requests/minute

**Steps:**
1. Go to: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy the key (starts with `AIzaSy...`)

**Add to .env.local:**
```
GOOGLE_AI_API_KEY=AIzaSyxxxxx
```

---

### 3️⃣ **RAZORPAY (Payments)** - 3 minutes
**Cost:** FREE (2% transaction fee on payments)

**Steps:**
1. Go to: https://dashboard.razorpay.com/signup
2. Sign up with your business details
3. Go to **Settings** → **API Keys**
4. Click **"Generate Test Key"** (for now)
5. Copy both:
   - Key ID (starts with `rzp_test_...`)
   - Key Secret

**Add to .env.local:**
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

**Note:** You'll also need to create a webhook later, but we can skip for now.

---

### 4️⃣ **TWILIO (WhatsApp Notifications)** - 3 minutes
**Cost:** FREE trial ($15.50 credit), then ~₹0.37/message

**Steps:**
1. Go to: https://www.twilio.com/try-twilio
2. Sign up (verify phone number)
3. Go to **Console** → **Account** → **API Keys & Tokens**
4. Copy:
   - Account SID (starts with `AC...`)
   - Auth Token
5. WhatsApp number: Use `+14155238886` (Twilio Sandbox)

**Add to .env.local:**
```
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
```

---

### 5️⃣ **SENDGRID (Email Notifications)** - 3 minutes
**Cost:** FREE up to 100 emails/day

**Steps:**
1. Go to: https://signup.sendgrid.com/
2. Sign up (verify email + add sender identity)
3. Go to **Settings** → **API Keys** → **Create API Key**
4. Name it "BuilderOS"
5. Copy the key (starts with `SG....`)

**Add to .env.local:**
```
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@builderos.in
SENDGRID_FROM_NAME=BuilderOS
```

**Note:** You'll need to verify your domain later for production emails.

---

### 6️⃣ **AWS TEXTRACT (Optional - for OCR)** - SKIP FOR NOW
**Cost:** First 1000 pages/month free

**We can add this later if needed for scanned documents.**

---

## 🎯 **PRIORITY:**

For **MVP launch**, you only need:
1. ✅ Supabase (DONE)
2. ✅ Anthropic (Claude) - CRITICAL
3. ✅ Google AI (Gemini) - CRITICAL
4. ⏭️ Razorpay - Can use test mode
5. ⏭️ Twilio - Can skip for now
6. ⏭️ SendGrid - Can skip for now

---

## 🚀 **MINIMAL LAUNCH (5 minutes):**

If you want to deploy NOW:
1. Get **Anthropic** (Claude)
2. Get **Google AI** (Gemini)
3. Deploy to Vercel with these 2 + Supabase
4. Add Razorpay/Twilio/SendGrid later

---

## 🤔 **YOUR CHOICE:**

**Option A:** Get all 5 keys now (15 mins) → Full production ready  
**Option B:** Get 2 keys now (5 mins) → Deploy fast, add rest later

**Which option?**

