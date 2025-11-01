import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/knowledge-base/stats
 * Get knowledge base statistics for the organization
 */
export async function GET() {
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

    // Get total documents
    const { count: totalDocuments } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', userProfile.organization_id);

    // Get processed documents
    const { count: processedDocuments } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', userProfile.organization_id)
      .eq('processed', true);

    // Get total embeddings (chunks)
    const { count: totalChunks } = await supabase
      .from('document_embeddings')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', userProfile.organization_id);

    // Get unique cases in knowledge base
    const { data: uniqueCases } = await supabase
      .from('document_embeddings')
      .select('case_id')
      .eq('organization_id', userProfile.organization_id)
      .not('case_id', 'is', null);

    const uniqueCaseCount = new Set(uniqueCases?.map(e => e.case_id)).size;

    // Get recent uploads
    const { data: recentUploads } = await supabase
      .from('documents')
      .select('id, document_name, created_at, processed')
      .eq('organization_id', userProfile.organization_id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      totalDocuments: totalDocuments || 0,
      processedDocuments: processedDocuments || 0,
      totalChunks: totalChunks || 0,
      uniqueCases: uniqueCaseCount,
      recentUploads: recentUploads || [],
    });

  } catch (error: any) {
    console.error('Error getting knowledge base stats:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

