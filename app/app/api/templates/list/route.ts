import { NextResponse } from 'next/server';
import { COMPREHENSIVE_TEMPLATES, TEMPLATE_CATEGORIES, PRACTICE_AREAS, getTemplatesByCategory, getTemplatesByPracticeArea, searchTemplates, getTemplateStats } from '@/lib/templates-full';

/**
 * GET /api/templates/list
 * Get list of available templates, optionally filtered by category or search query
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const practiceArea = searchParams.get('practiceArea');
    const query = searchParams.get('query');

    let templates = COMPREHENSIVE_TEMPLATES;

    // Filter by category
    if (category && category !== 'all') {
      templates = getTemplatesByCategory(category);
    }

    // Filter by practice area
    if (practiceArea && practiceArea !== 'all') {
      templates = getTemplatesByPracticeArea(practiceArea);
    }

    // Search
    if (query) {
      templates = searchTemplates(query);
    }

    return NextResponse.json({
      templates,
      categories: TEMPLATE_CATEGORIES,
      practiceAreas: PRACTICE_AREAS,
      total: templates.length,
      stats: getTemplateStats(),
    });

  } catch (error: any) {
    console.error('Error listing templates:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

