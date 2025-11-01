import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { LEGAL_TEMPLATES, fillTemplate } from '@/lib/templates';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/templates/generate
 * Generate a legal document using AI based on template and user inputs
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId, inputs, customInstructions } = await request.json();

    if (!templateId || !inputs) {
      return NextResponse.json(
        { error: 'Template ID and inputs required' },
        { status: 400 }
      );
    }

    // Find template
    const template = LEGAL_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Fill template with basic inputs
    let document = fillTemplate(template, inputs);

    // Use AI to enhance/refine the document if custom instructions provided
    if (customInstructions) {
      const prompt = `You are an expert Indian legal document drafter.

I have a draft legal document that needs refinement based on the following instructions:

INSTRUCTIONS:
${customInstructions}

CURRENT DRAFT:
${document}

Please provide an improved version of this document that:
1. Incorporates the instructions provided
2. Maintains proper legal language and formatting
3. Ensures all sections are complete and professional
4. Uses appropriate Indian legal terminology and citations where relevant
5. Maintains the structure but improves clarity and completeness

Return ONLY the refined document, no explanations or comments.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const refinedContent = response.content[0];
      if (refinedContent.type === 'text') {
        document = refinedContent.text;
      }
    }

    return NextResponse.json({
      document,
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
      },
    });

  } catch (error: any) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

