import { NextResponse } from 'next/server';
import { fetchLatestAmendments } from '@/lib/indian-law-data';

/**
 * GET /api/legal-data/amendments
 * Get latest legal amendments and updates
 */
export async function GET() {
  try {
    const amendments = await fetchLatestAmendments();

    return NextResponse.json({
      ...amendments,
      note: 'This data is updated daily from official government sources',
    });

  } catch (error: any) {
    console.error('Error fetching amendments:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

