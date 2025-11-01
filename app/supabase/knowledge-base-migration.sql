-- ================================================
-- KNOWLEDGE BASE MIGRATION
-- Adds vector search capabilities for RAG
-- ================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create document_embeddings table for vector storage
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Content
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  page_number INTEGER,
  
  -- Vector embedding (OpenAI text-embedding-3-small = 1536 dimensions)
  embedding vector(1536) NOT NULL,
  
  -- Metadata
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  document_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast vector similarity search
CREATE INDEX idx_document_embeddings_org ON document_embeddings(organization_id);
CREATE INDEX idx_document_embeddings_doc ON document_embeddings(document_id);
CREATE INDEX idx_document_embeddings_case ON document_embeddings(case_id);

-- Vector similarity search index (IVFFlat)
CREATE INDEX idx_document_embeddings_vector 
ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Enable Row Level Security
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Organizations can view their embeddings"
ON document_embeddings FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM users WHERE organization_id = document_embeddings.organization_id
  )
);

CREATE POLICY "Organizations can insert their embeddings"
ON document_embeddings FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM users WHERE organization_id = document_embeddings.organization_id
  )
);

CREATE POLICY "Organizations can delete their embeddings"
ON document_embeddings FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM users WHERE organization_id = document_embeddings.organization_id
  )
);

-- Function to search similar documents
CREATE OR REPLACE FUNCTION search_documents(
  query_embedding vector(1536),
  match_org_id UUID,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_text TEXT,
  chunk_index INTEGER,
  similarity FLOAT,
  case_id UUID,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_embeddings.id,
    document_embeddings.document_id,
    document_embeddings.chunk_text,
    document_embeddings.chunk_index,
    1 - (document_embeddings.embedding <=> query_embedding) AS similarity,
    document_embeddings.case_id,
    document_embeddings.metadata
  FROM document_embeddings
  WHERE document_embeddings.organization_id = match_org_id
    AND 1 - (document_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Auto-update timestamp trigger
CREATE TRIGGER update_document_embeddings_updated_at
  BEFORE UPDATE ON document_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON document_embeddings TO authenticated;
GRANT EXECUTE ON FUNCTION search_documents TO authenticated;

-- Comments
COMMENT ON TABLE document_embeddings IS 'Stores vector embeddings of document chunks for semantic search';
COMMENT ON COLUMN document_embeddings.embedding IS 'Vector embedding from OpenAI text-embedding-3-small (1536 dimensions)';
COMMENT ON FUNCTION search_documents IS 'Performs cosine similarity search on document embeddings';

