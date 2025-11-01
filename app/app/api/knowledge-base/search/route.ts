import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/embeddings';

/**
 * POST /api/knowledge-base/search
 * Search knowledge base using semantic similarity
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const { data: userProfile } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!userProfile?.organization_id) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 400 });
    }

    const { query, limit = 10, threshold = 0.7, caseId } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Generate embedding for query
    const { embedding } = await generateEmbedding(query);

    // Search similar documents using Supabase function
    const { data, error } = await supabase.rpc('search_documents', {
      query_embedding: JSON.stringify(embedding),
      match_org_id: userProfile.organization_id,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      console.error('Error searching documents:', error);
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      );
    }

    // If caseId provided, also include exact matches from that case
    let caseContext = [];
    if (caseId) {
      const { data: caseData } = await supabase
        .from('document_embeddings')
        .select('id, chunk_text, chunk_index, case_id, metadata')
        .eq('case_id', caseId)
        .eq('organization_id', userProfile.organization_id)
        .order('chunk_index')
        .limit(5);

      if (caseData) {
        caseContext = caseData;
      }
    }

    // Combine results
    const results = {
      semanticMatches: data || [],
      caseContext: caseContext,
      totalMatches: (data || []).length,
    };

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Error in knowledge base search:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

