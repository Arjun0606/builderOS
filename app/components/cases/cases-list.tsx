'use client'

import Link from 'next/link'
import { Briefcase, User, Calendar, MoreVertical, Scale, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow, format } from 'date-fns'

interface Case {
  id: string
  case_number: string | null
  case_title: string
  case_type: string
  case_status: string
  priority: string
  court_name: string | null
  next_hearing_date: string | null
  filing_date: string | null
  clients: {
    id: string
    name: string
    type: string
  } | null
  users: {
    id: string
    full_name: string
  } | null
  created_at: string
}

interface CasesListProps {
  cases: Case[]
}

export function CasesList({ cases }: CasesListProps) {
  if (!cases || cases.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
        <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No cases yet
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Get started by adding your first case
        </p>
        <Link href="/dashboard/cases/new">
          <Button className="mt-4">Add Case</Button>
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'disposed':
        return 'bg-gray-100 text-gray-700'
      case 'withdrawn':
        return 'bg-orange-100 text-orange-700'
      case 'settled':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-slate-600'
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Case
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Court
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Next Hearing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Lead Lawyer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cases.map((caseItem) => (
              <tr
                key={caseItem.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/cases/${caseItem.id}`}
                    className="group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        caseItem.priority === 'urgent' ? 'bg-red-100' :
                        caseItem.priority === 'high' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        <Scale className={`h-5 w-5 ${getPriorityColor(caseItem.priority)}`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-blue-600">
                          {caseItem.case_title}
                        </p>
                        {caseItem.case_number && (
                          <p className="text-sm text-slate-600">
                            {caseItem.case_number}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {caseItem.clients ? (
                    <Link
                      href={`/dashboard/clients/${caseItem.clients.id}`}
                      className="flex items-center gap-2 text-sm text-slate-900 hover:text-blue-600"
                    >
                      <User className="h-4 w-4" />
                      {caseItem.clients.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                    {caseItem.case_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">
                    {caseItem.court_name || '—'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {caseItem.next_hearing_date ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {format(new Date(caseItem.next_hearing_date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(caseItem.next_hearing_date), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                      caseItem.case_status
                    )}`}
                  >
                    {caseItem.case_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {caseItem.users ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
                        {caseItem.users.full_name.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-900">
                        {caseItem.users.full_name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/cases/${caseItem.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/cases/${caseItem.id}/edit`}>
                          Edit Case
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/cases/${caseItem.id}/documents`}>
                          View Documents
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

