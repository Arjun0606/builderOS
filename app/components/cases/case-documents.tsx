'use client'

import { Button } from '@/components/ui/button'
import { FileText, Upload } from 'lucide-react'
import { DocumentUpload } from '../documents/document-upload'
import { DocumentsList } from '../documents/documents-list'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CaseDocumentsProps {
  caseId: string
  organizationId: string
  documents: any[]
}

export function CaseDocuments({ caseId, organizationId, documents }: CaseDocumentsProps) {
  const [showUpload, setShowUpload] = useState(false)
  const router = useRouter()

  const handleUploadComplete = () => {
    setShowUpload(false)
    router.refresh()
  }

  const handleDelete = () => {
    router.refresh()
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Documents ({documents?.length || 0})
        </h2>
        <Button size="sm" onClick={() => setShowUpload(!showUpload)}>
          <Upload className="mr-2 h-4 w-4" />
          {showUpload ? 'Cancel' : 'Upload'}
        </Button>
      </div>

      {showUpload && (
        <div className="mb-6">
          <DocumentUpload
            caseId={caseId}
            organizationId={organizationId}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      )}

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
            <div key={doc.id} className="border-b border-slate-100 last:border-0 pb-2 last:pb-0">
              <DocumentsList documents={[doc]} onDelete={handleDelete} />
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
