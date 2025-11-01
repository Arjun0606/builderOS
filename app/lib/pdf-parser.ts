import pdf from 'pdf-parse';

/**
 * PDF Parser for Knowledge Base
 * Extracts text from PDF files and chunks them for embedding
 */

export interface PDFChunk {
  text: string;
  pageNumber: number;
  chunkIndex: number;
}

export interface PDFParseResult {
  text: string;
  pages: number;
  chunks: PDFChunk[];
  metadata: {
    title?: string;
    author?: string;
    creationDate?: Date;
  };
}

/**
 * Parse PDF file and extract text
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  try {
    const data = await pdf(buffer);

    return {
      text: data.text,
      pages: data.numpages,
      chunks: chunkText(data.text, data.numpages),
      metadata: {
        title: data.info?.Title,
        author: data.info?.Author,
        creationDate: data.info?.CreationDate,
      },
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Chunk text into smaller pieces for embedding
 * Strategy: Split by paragraphs, combine small chunks, limit to ~500 tokens
 */
function chunkText(text: string, totalPages: number): PDFChunk[] {
  const chunks: PDFChunk[] = [];
  
  // Clean text
  const cleanedText = text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
    .trim();

  // Split into paragraphs
  const paragraphs = cleanedText.split(/\n\n+/);
  
  let currentChunk = '';
  let chunkIndex = 0;
  const maxChunkSize = 2000; // Roughly 500 tokens (1 token ≈ 4 chars)
  const minChunkSize = 200; // Minimum size to avoid tiny chunks

  for (const paragraph of paragraphs) {
    // Skip empty paragraphs
    if (paragraph.trim().length === 0) continue;

    // If adding this paragraph exceeds max size, save current chunk
    if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > minChunkSize) {
      chunks.push({
        text: currentChunk.trim(),
        pageNumber: estimatePageNumber(chunkIndex, chunks.length, totalPages),
        chunkIndex,
      });
      chunkIndex++;
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  // Add final chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      pageNumber: estimatePageNumber(chunkIndex, chunks.length, totalPages),
      chunkIndex,
    });
  }

  return chunks;
}

/**
 * Estimate page number based on chunk position
 */
function estimatePageNumber(chunkIndex: number, totalChunks: number, totalPages: number): number {
  if (totalChunks === 0) return 1;
  return Math.ceil((chunkIndex / totalChunks) * totalPages);
}

/**
 * Extract key information from legal documents
 */
export function extractLegalMetadata(text: string): {
  caseNumber?: string;
  court?: string;
  parties?: string[];
  date?: string;
} {
  const metadata: any = {};

  // Try to extract case number (various formats)
  const caseNumberPatterns = [
    /Case\s+No[.:]?\s*([A-Z0-9/-]+)/i,
    /Suit\s+No[.:]?\s*([A-Z0-9/-]+)/i,
    /Petition\s+No[.:]?\s*([A-Z0-9/-]+)/i,
  ];

  for (const pattern of caseNumberPatterns) {
    const match = text.match(pattern);
    if (match) {
      metadata.caseNumber = match[1];
      break;
    }
  }

  // Try to extract court name
  const courtPatterns = [
    /(Supreme Court of India)/i,
    /(High Court of [A-Za-z\s]+)/i,
    /(District Court[A-Za-z\s]*)/i,
  ];

  for (const pattern of courtPatterns) {
    const match = text.match(pattern);
    if (match) {
      metadata.court = match[1];
      break;
    }
  }

  // Try to extract parties (simplified)
  const vsMatch = text.match(/([A-Z][A-Za-z\s&.]+)\s+v[s]?\.\s+([A-Z][A-Za-z\s&.]+)/);
  if (vsMatch) {
    metadata.parties = [vsMatch[1].trim(), vsMatch[2].trim()];
  }

  return metadata;
}

