import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parsePDF, extractLegalMetadata } from '@/lib/pdf-parser';
import { generateEmbeddings } from '@/lib/embeddings';

/**
 * POST /api/knowledge-base/process
 * Process uploaded documents and generate embeddings
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

    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('organization_id', userProfile.organization_id)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Download file from storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('case-documents')
      .download(document.file_path);

    if (storageError || !fileData) {
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }

    // Convert to buffer
    const buffer = Buffer.from(await fileData.arrayBuffer());

    // Parse PDF
    const pdfResult = await parsePDF(buffer);
    
    // Extract legal metadata
    const legalMetadata = extractLegalMetadata(pdfResult.text);

    // Generate embeddings for all chunks
    const texts = pdfResult.chunks.map(chunk => chunk.text);
    const embeddings = await generateEmbeddings(texts);

    // Save embeddings to database
    const embeddingsToInsert = pdfResult.chunks.map((chunk, index) => ({
      document_id: documentId,
      organization_id: userProfile.organization_id,
      chunk_text: chunk.text,
      chunk_index: chunk.chunkIndex,
      page_number: chunk.pageNumber,
      embedding: JSON.stringify(embeddings[index].embedding), // Supabase will convert to vector
      case_id: document.case_id,
      document_type: document.document_type,
      metadata: {
        ...legalMetadata,
        pageCount: pdfResult.pages,
        tokens: embeddings[index].tokens,
      },
    }));

    const { error: insertError } = await supabase
      .from('document_embeddings')
      .insert(embeddingsToInsert);

    if (insertError) {
      console.error('Error inserting embeddings:', insertError);
      return NextResponse.json(
        { error: 'Failed to save embeddings' },
        { status: 500 }
      );
    }

    // Update document status
    await supabase
      .from('documents')
      .update({ 
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    return NextResponse.json({
      success: true,
      documentId,
      chunks: pdfResult.chunks.length,
      pages: pdfResult.pages,
      metadata: legalMetadata,
    });

  } catch (error: any) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

