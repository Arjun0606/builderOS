'use client'

import { Button } from '@/components/ui/button'
import { FileText, Upload, Download, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'

interface CaseDocumentsProps {
  caseId: string
  documents: any[]
}

export function CaseDocuments({ caseId, documents }: CaseDocumentsProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Documents</h2>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">
            No documents uploaded yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.slice(0, 5).map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-100">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {doc.document_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {doc.created_at && format(new Date(doc.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {documents.length > 5 && (
            <Button variant="outline" className="w-full" size="sm">
              View All {documents.length} Documents
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

