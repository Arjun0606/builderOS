import { NextResponse } from 'next/server';
import { LEGAL_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates } from '@/lib/templates';

/**
 * GET /api/templates/list
 * Get list of available templates, optionally filtered by category or search query
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    let templates = LEGAL_TEMPLATES;

    // Filter by category
    if (category && category !== 'all') {
      templates = getTemplatesByCategory(category);
    }

    // Search
    if (query) {
      templates = searchTemplates(query);
    }

    return NextResponse.json({
      templates,
      categories: TEMPLATE_CATEGORIES,
      total: templates.length,
    });

  } catch (error: any) {
    console.error('Error listing templates:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

