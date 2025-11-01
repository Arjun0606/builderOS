'use client'

import { File, Download, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_size: number;
  file_url: string;
  created_at: string;
  users?: {
    full_name: string;
  };
}

interface DocumentsListProps {
  documents: Document[];
  onDelete?: () => void;
}

export function DocumentsList({ documents, onDelete }: DocumentsListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (documentId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setDeleting(documentId);

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('case-documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      toast.success('Document deleted successfully');
      if (onDelete) onDelete();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error(error.message || 'Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map(doc => (
        <div
          key={doc.id}
          className="flex items-center justify-between border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <File className="h-8 w-8 text-slate-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {doc.document_name}
              </p>
              <p className="text-xs text-slate-500">
                {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                {doc.created_at && ` • ${format(new Date(doc.created_at), 'MMM d, yyyy')}`}
                {doc.users && ` • Uploaded by ${doc.users.full_name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(doc.file_url, '_blank')}
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(doc.file_url, doc.document_name)}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(doc.id, doc.file_url.split('/').pop() || '')}
              disabled={deleting === doc.id}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

