// Supabase Edge Function: RERA Scraper
// Schedule: Daily at 2 AM IST via cron
// Deploy: supabase functions deploy rera-scraper

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RERA_WEBSITES = [
  { state: 'Maharashtra', url: 'https://maharerait.mahaonline.gov.in/' },
  { state: 'Karnataka', url: 'https://rera.karnataka.gov.in/' },
  { state: 'Tamil Nadu', url: 'https://www.tnrera.in/' },
  { state: 'Telangana', url: 'https://tgrera.telangana.gov.in/' },
  { state: 'Gujarat', url: 'https://gujrera.gujarat.gov.in/' },
  { state: 'Kerala', url: 'https://rera.kerala.gov.in/' },
  { state: 'Delhi', url: 'https://delhirera.nic.in/' },
  { state: 'Haryana', url: 'https://haryanarera.gov.in/' },
  { state: 'Uttar Pradesh', url: 'https://up-rera.in/' },
  { state: 'West Bengal', url: 'https://wbrera.wb.gov.in/' },
]

interface ReraChange {
  state: string
  updateType: string
  summary: string
  impactAnalysis: string
  severity: 'critical' | 'important' | 'info'
}

async function scrapeReraWebsite(state: string, url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BuilderOS-RERA-Monitor/1.0',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${state}: ${response.status}`)
    }

    const html = await response.text()
    return html
  } catch (error) {
    console.error(`Error scraping ${state}:`, error)
    return ''
  }
}

function calculateContentHash(content: string): string {
  // Simple hash function (in production, use crypto)
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(16)
}

async function analyzeChangeWithAI(
  state: string,
  oldContent: string,
  newContent: string
): Promise<ReraChange | null> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
  
  if (!anthropicApiKey) {
    console.error('ANTHROPIC_API_KEY not found')
    return null
  }

  try {
    const prompt = `You are a RERA compliance expert analyzing changes to ${state} RERA website.

OLD CONTENT (last check):
${oldContent.slice(0, 5000)}

NEW CONTENT (today):
${newContent.slice(0, 5000)}

Analyze if there are any meaningful changes. Focus on:
- New forms or form updates
- Deadline changes
- New circulars or notifications
- Rule changes
- Fee structure updates

If there IS a change, respond in JSON format:
{
  "hasChange": true,
  "updateType": "form_update|deadline_change|new_circular|rule_change",
  "summary": "Brief summary of what changed (1-2 sentences)",
  "impactAnalysis": "How this affects builders with projects in ${state} (2-3 sentences)",
  "severity": "critical|important|info"
}

If there is NO meaningful change, respond:
{
  "hasChange": false
}

Be conservative - only flag real, actionable changes.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.content[0].text

    // Parse JSON response
    const result = JSON.parse(text)

    if (!result.hasChange) {
      return null
    }

    return {
      state,
      updateType: result.updateType,
      summary: result.summary,
      impactAnalysis: result.impactAnalysis,
      severity: result.severity,
    }
  } catch (error) {
    console.error(`Error analyzing change for ${state}:`, error)
    return null
  }
}

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const results = []

    // Scrape each RERA website
    for (const { state, url } of RERA_WEBSITES) {
      console.log(`Scraping ${state}...`)

      // Fetch current content
      const newContent = await scrapeReraWebsite(state, url)
      
      if (!newContent) {
        results.push({ state, status: 'error', error: 'Failed to fetch' })
        continue
      }

      const newHash = calculateContentHash(newContent)

      // Get previous content from database
      const { data: previousPage } = await supabase
        .from('rera_pages')
        .select('content_hash, full_text')
        .eq('state', state)
        .eq('page_type', 'dashboard')
        .single()

      // If content hasn't changed, skip AI analysis
      if (previousPage && previousPage.content_hash === newHash) {
        results.push({ state, status: 'no_change' })
        
        // Update last_scraped timestamp
        await supabase
          .from('rera_pages')
          .update({ last_scraped: new Date().toISOString() })
          .eq('state', state)
          .eq('page_type', 'dashboard')
        
        continue
      }

      // Content changed - analyze with AI
      const change = await analyzeChangeWithAI(
        state,
        previousPage?.full_text || '',
        newContent
      )

      if (change) {
        // Store update in database
        await supabase.from('rera_updates').insert({
          state: change.state,
          update_type: change.updateType,
          summary: change.summary,
          impact_analysis: change.impactAnalysis,
          severity: change.severity,
          detected_at: new Date().toISOString(),
          notified: false,
        })

        // TODO: Send notifications (WhatsApp/Email) to affected users

        results.push({ 
          state, 
          status: 'change_detected', 
          severity: change.severity,
          summary: change.summary 
        })
      } else {
        results.push({ state, status: 'no_meaningful_change' })
      }

      // Update rera_pages with new content
      await supabase
        .from('rera_pages')
        .upsert({
          state,
          page_type: 'dashboard',
          url,
          content_hash: newHash,
          full_text: newContent,
          last_scraped: new Date().toISOString(),
          last_changed: change ? new Date().toISOString() : previousPage?.last_changed,
        })
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        results,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('RERA scraper error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

