import Link from 'next/link'
import { Briefcase, ArrowRight, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

interface Case {
  id: string
  case_title: string
  case_number: string | null
  case_type: string
  case_status: string
  created_at: string
  clients: {
    id: string
    name: string
    type: string
  } | null
  users: {
    full_name: string
  } | null
}

interface RecentCasesProps {
  cases: Case[]
}

export function RecentCases({ cases }: RecentCasesProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent Cases</h2>
        <Link href="/dashboard/cases">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">
            No cases yet. Create your first case to get started.
          </p>
          <Link href="/dashboard/cases/new">
            <Button className="mt-4">Add Case</Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {cases.map((caseItem) => (
            <Link
              key={caseItem.id}
              href={`/dashboard/cases/${caseItem.id}`}
              className="block p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {caseItem.case_title}
                      </p>
                      {caseItem.case_number && (
                        <p className="text-sm text-slate-600">
                          {caseItem.case_number}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                    {caseItem.clients && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {caseItem.clients.name}
                      </div>
                    )}
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                      {caseItem.case_type}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(caseItem.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    caseItem.case_status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : caseItem.case_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {caseItem.case_status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

