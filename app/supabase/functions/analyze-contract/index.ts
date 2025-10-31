// Supabase Edge Function: Contract Analyzer
// Analyzes contracts for risks using Claude AI + AWS Textract
// Deploy: supabase functions deploy analyze-contract

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ContractRisk {
  severity: 'critical' | 'moderate' | 'low'
  title: string
  description: string
  location: string // "Page 12, Clause 8.2"
  financialExposure?: string // "₹20-55L"
  suggestedFix?: string
}

async function extractTextFromPDF(pdfUrl: string): Promise<string> {
  // In production, use AWS Textract for OCR
  // For now, assume PDF is text-based
  try {
    const response = await fetch(pdfUrl)
    const arrayBuffer = await response.arrayBuffer()
    
    // Simple extraction (in production, use pdf-parse or Textract)
    // This is a placeholder - real implementation would use Textract
    return "CONTRACT TEXT EXTRACTED" // Placeholder
  } catch (error) {
    console.error('PDF extraction error:', error)
    return ''
  }
}

async function analyzeWithClaude(
  contractText: string,
  contractType: string,
  state: string
): Promise<{
  riskScore: number
  risks: ContractRisk[]
}> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
  
  if (!anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY not found')
  }

  const prompt = `You are a legal expert analyzing a ${contractType} agreement in ${state}, India.

CONTRACT TEXT:
${contractText.slice(0, 100000)} 

Analyze this contract for risks. Focus on:
1. RERA compliance violations
2. Risky penalty clauses (unlimited liability, no caps)
3. Missing critical clauses (force majeure, insurance, scope)
4. Unfair terms (one-sided liability)
5. Financial exposure

Respond in JSON format:
{
  "riskScore": 7.2, // 0-10, where 10 is highest risk
  "risks": [
    {
      "severity": "critical|moderate|low",
      "title": "Short title",
      "description": "Detailed description",
      "location": "Page X, Clause Y",
      "financialExposure": "₹X-YL" // Optional
      "suggestedFix": "How to fix" // Optional
    }
  ]
}

Be thorough but focus on material risks. Include financial exposure estimates.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
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

    return {
      riskScore: result.riskScore,
      risks: result.risks,
    }
  } catch (error) {
    console.error('Claude analysis error:', error)
    throw error
  }
}

serve(async (req) => {
  try {
    const { contractId } = await req.json()

    if (!contractId) {
      return new Response(
        JSON.stringify({ error: 'contractId required' }),
        { status: 400 }
      )
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch contract
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('*, projects(state)')
      .eq('id', contractId)
      .single()

    if (fetchError || !contract) {
      throw new Error('Contract not found')
    }

    // Extract text from PDF
    const contractText = await extractTextFromPDF(contract.file_url)

    if (!contractText) {
      throw new Error('Failed to extract contract text')
    }

    // Analyze with Claude
    const analysis = await analyzeWithClaude(
      contractText,
      contract.contract_type,
      contract.projects?.state || 'India'
    )

    // Count issues by severity
    const criticalCount = analysis.risks.filter(r => r.severity === 'critical').length
    const moderateCount = analysis.risks.filter(r => r.severity === 'moderate').length
    const lowCount = analysis.risks.filter(r => r.severity === 'low').length

    // Update contract with analysis
    const { error: updateError } = await supabase
      .from('contracts')
      .update({
        analysis_result: analysis.risks,
        risk_score: analysis.riskScore,
        critical_issues: criticalCount,
        moderate_issues: moderateCount,
        low_issues: lowCount,
        analyzed_at: new Date().toISOString(),
      })
      .eq('id', contractId)

    if (updateError) {
      throw updateError
    }

    // TODO: Generate marked-up PDF (future enhancement)
    // TODO: Create alert if high risk (future enhancement)

    return new Response(
      JSON.stringify({
        success: true,
        contractId,
        riskScore: analysis.riskScore,
        issuesFound: criticalCount + moderateCount + lowCount,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Contract analysis error:', error)
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

