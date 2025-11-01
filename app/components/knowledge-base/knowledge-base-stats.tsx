import { FileText, Briefcase, Brain, CheckCircle } from 'lucide-react'

interface KnowledgeBaseStatsProps {
  documentCount: number
  caseCount: number
}

export function KnowledgeBaseStats({ documentCount, caseCount }: KnowledgeBaseStatsProps) {
  // Estimate paragraphs (avg 50 paragraphs per document)
  const estimatedParagraphs = documentCount * 50
  
  // AI training status
  const isAITrained = documentCount > 10

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Documents Indexed</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {documentCount.toLocaleString()}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Cases in Library</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {caseCount.toLocaleString()}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Briefcase className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Searchable Chunks</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {estimatedParagraphs.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">~50 per document</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Brain className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">AI Training Status</p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {isAITrained ? 'Active' : 'Needs Data'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {isAITrained ? 'AI can reference your cases' : 'Upload 10+ documents'}
            </p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isAITrained ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <CheckCircle className={`h-6 w-6 ${
              isAITrained ? 'text-green-600' : 'text-orange-600'
            }`} />
          </div>
        </div>
      </div>
    </div>
  )
}

