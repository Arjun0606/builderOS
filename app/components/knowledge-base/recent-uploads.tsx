import { FileText, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface RecentUploadsProps {
  uploads: any[]
}

export function RecentUploads({ uploads }: RecentUploadsProps) {
  if (uploads.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-4 text-sm text-slate-600">
          No documents uploaded yet. Start building your knowledge base!
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Recent Uploads
      </h2>
      <div className="space-y-2">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {upload.document_name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {upload.cases && (
                  <span className="text-xs text-slate-600">
                    {upload.cases.case_title}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {format(new Date(upload.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <div className="text-xs text-green-600 font-medium">
              Indexed
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

