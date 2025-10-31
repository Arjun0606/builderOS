# RERA Scraper Edge Function

**Purpose:** Daily monitoring of 10 state RERA websites for changes

**Schedule:** Runs daily at 2 AM IST via Supabase cron

---

## Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Link to your project

```bash
cd /Users/arjun/BuilderOS/app
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Set environment variables

```bash
# In Supabase Dashboard → Edge Functions → Secrets
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Deploy function

```bash
supabase functions deploy rera-scraper
```

### 5. Set up cron schedule

In Supabase Dashboard → Database → Cron Jobs:

```sql
-- Run RERA scraper daily at 2 AM IST
SELECT cron.schedule(
  'rera-scraper-daily',
  '0 2 * * *', -- 2 AM IST (adjust for timezone)
  $$
  SELECT
    net.http_post(
        url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/rera-scraper',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);
```

---

## How It Works

### 1. **Scraping (Daily 2 AM)**
- Visits 10 RERA websites
- Fetches HTML content
- Calculates content hash (MD5)

### 2. **Change Detection**
- Compares today's hash vs yesterday's hash
- If different → Send to Claude AI for analysis

### 3. **AI Analysis (Claude 4.5 Sonnet)**
```
Prompt: "Compare old content vs new content.
Did anything change? If yes, what and why does it matter?"

Response: {
  hasChange: true,
  updateType: "form_update",
  summary: "Form 4 (QPR) updated with new mandatory field",
  impactAnalysis: "Builders must use new form by Nov 1...",
  severity: "critical"
}
```

### 4. **Store Results**
- Save update in `rera_updates` table
- Update `rera_pages` with new content

### 5. **Notify Users (TODO)**
- WhatsApp alerts (Twilio)
- Email alerts (SendGrid)
- Dashboard notifications

---

## Manual Testing

```bash
# Test locally
supabase functions serve rera-scraper

# Invoke manually
curl -X POST 'http://localhost:54321/functions/v1/rera-scraper' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'

# Check logs
supabase functions logs rera-scraper
```

---

## Cost Estimate

**Per day:**
- 10 RERA websites × 1 scrape = 10 requests
- AI analysis: ~2 changes detected per day (avg)
- Claude API: 2 × ₹15 = ₹30/day

**Per month:**
- ₹30/day × 30 days = ₹900/month

**At 50 customers:**
- ₹900/month (shared across all customers)
- ₹18 per customer per month

**Very affordable!** ✅

---

## What Gets Detected

**Critical Updates:**
- Form updates (new fields, format changes)
- Deadline changes (QPR submission dates)
- New penalties or fees
- Registration rule changes

**Important Updates:**
- New circulars
- Policy announcements
- Procedural changes

**Info:**
- General announcements
- Website updates
- FAQs

---

## Example Output

```json
{
  "success": true,
  "timestamp": "2025-10-30T02:00:00Z",
  "results": [
    {
      "state": "Maharashtra",
      "status": "change_detected",
      "severity": "critical",
      "summary": "Form 4 (QPR) updated with new mandatory fields"
    },
    {
      "state": "Karnataka",
      "status": "no_change"
    },
    {
      "state": "Tamil Nadu",
      "status": "no_change"
    },
    ...
  ]
}
```

---

## Troubleshooting

### Function fails to deploy
```bash
# Check function logs
supabase functions logs rera-scraper --limit 50

# Re-deploy
supabase functions deploy rera-scraper --no-verify-jwt
```

### AI analysis not working
- Check ANTHROPIC_API_KEY is set
- Verify Claude API quota
- Check function logs for errors

### Cron not running
- Verify cron schedule in Supabase Dashboard
- Check pg_cron extension is enabled
- Test manual invocation first

---

## Next Steps

1. Deploy function
2. Test manually
3. Set up cron
4. Add WhatsApp/Email notifications
5. Monitor for first detected changes

**This prevents ₹20L/year RERA penalties!** 🚀

