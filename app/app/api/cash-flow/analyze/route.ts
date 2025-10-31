import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filePaths } = await request.json();

    if (!filePaths || filePaths.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Download and parse CSV files from Supabase Storage
    const bankData = await Promise.all(
      filePaths.map(async (path: string) => {
        const { data, error } = await supabase.storage
          .from('bank-statements')
          .download(path);

        if (error) throw error;

        const text = await data.text();
        return parseBankCSV(text);
      })
    );

    // Combine all transactions
    const allTransactions = bankData.flat();

    // Analyze with Claude AI
    const analysis = await analyzeWithClaude(allTransactions);

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('cash_flow_analyses')
      .insert({
        user_id: user.id,
        transaction_count: allTransactions.length,
        total_inflow: analysis.totalInflow,
        total_outflow: analysis.totalOutflow,
        net_position: analysis.netPosition,
        escrow_balance: analysis.escrowBalance,
        escrow_withdrawable: analysis.escrowWithdrawable,
        forecast_30d: analysis.forecast30d,
        forecast_60d: analysis.forecast60d,
        forecast_90d: analysis.forecast90d,
        alerts: analysis.alerts,
        insights: analysis.insights
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({
      success: true,
      analysis: savedAnalysis
    });
  } catch (error) {
    console.error('Cash flow analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze cash flow' },
      { status: 500 }
    );
  }
}

function parseBankCSV(csvText: string): any[] {
  // Simple CSV parser - TODO: Handle different bank formats
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const transaction: any = {};
    
    headers.forEach((header, index) => {
      transaction[header] = values[index]?.trim();
    });
    
    return transaction;
  });
}

async function analyzeWithClaude(transactions: any[]) {
  const prompt = `You are a financial analyst for an Indian real estate developer.

Analyze these bank transactions and provide:
1. Total cash inflow and outflow
2. Current cash position
3. RERA escrow balance and withdrawable amount
4. Cash flow forecast for next 30/60/90 days
5. Identify any risks or anomalies
6. Actionable recommendations

Transactions:
${JSON.stringify(transactions.slice(0, 100), null, 2)}

Output as JSON:
{
  "totalInflow": number,
  "totalOutflow": number,
  "netPosition": number,
  "escrowBalance": number,
  "escrowWithdrawable": number,
  "forecast30d": { "inflow": number, "outflow": number, "balance": number },
  "forecast60d": { "inflow": number, "outflow": number, "balance": number },
  "forecast90d": { "inflow": number, "outflow": number, "balance": number },
  "alerts": [
    {
      "severity": "high|medium|low",
      "type": "string",
      "message": "string",
      "action": "string"
    }
  ],
  "insights": ["string"]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const content = message.content[0];
  if (content.type === 'text') {
    // Extract JSON from Claude's response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  }

  throw new Error('Failed to parse AI response');
}

