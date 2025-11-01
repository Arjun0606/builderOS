import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchCaseLaw } from '@/lib/indian-kanoon';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/case-law/search
 * Search Indian case law and provide AI-generated summaries
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, limit = 10, generateSummary = false } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Search case law
    const results = await searchCaseLaw(query, limit);

    // Generate AI summary if requested
    let aiSummary = null;
    if (generateSummary && results.length > 0) {
      try {
        const prompt = `You are an expert Indian legal analyst. 

The user searched for: "${query}"

Here are the top case law results:

${results.map((r, i) => `
${i + 1}. ${r.title}
   Citation: ${r.citation}
   Court: ${r.court}
   Date: ${r.date}
   ${r.excerpt}
`).join('\n')}

Please provide:
1. A brief overview of what these cases establish
2. Key legal principles from these cases
3. Relevance to the search query
4. Any important precedents set

Keep it concise (max 300 words).`;

        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const content = response.content[0];
        if (content.type === 'text') {
          aiSummary = content.text;
        }
      } catch (error) {
        console.error('Error generating AI summary:', error);
        // Continue without summary
      }
    }

    // Save search to history (optional)
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (userProfile?.organization_id) {
        await supabase.from('case_law_searches').insert({
          organization_id: userProfile.organization_id,
          user_id: user.id,
          query,
          results_count: results.length,
        });
      }
    } catch (error) {
      console.error('Error saving search history:', error);
      // Don't fail the request
    }

    return NextResponse.json({
      query,
      results,
      aiSummary,
      total: results.length,
    });

  } catch (error: any) {
    console.error('Error in case law search:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

