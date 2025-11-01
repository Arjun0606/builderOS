import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Briefcase, ArrowLeft, Edit, Trash2, MoreHorizontal } from 'lucide-react'

interface CaseHeaderProps {
  caseData: any
}

export function CaseHeader({ caseData }: CaseHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-4">
        {/* Back Button */}
        <Link href="/dashboard/cases">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Button>
        </Link>

        {/* Case Title & Info */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100">
            <Briefcase className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {caseData.case_title}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
              {caseData.case_number && (
                <span className="font-medium">{caseData.case_number}</span>
              )}
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                {caseData.case_type}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  caseData.case_status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : caseData.case_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {caseData.case_status}
              </span>
              {caseData.priority && (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    caseData.priority === 'urgent'
                      ? 'bg-red-100 text-red-700'
                      : caseData.priority === 'high'
                      ? 'bg-orange-100 text-orange-700'
                      : caseData.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {caseData.priority} priority
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/cases/${caseData.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Button variant="outline">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

