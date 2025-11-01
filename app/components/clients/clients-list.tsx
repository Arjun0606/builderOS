'use client'

import Link from 'next/link'
import { Building2, Mail, Phone, User, Briefcase, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'

interface Client {
  id: string
  name: string
  type: 'individual' | 'company'
  email: string | null
  phone: string | null
  company_name: string | null
  city: string | null
  cases: { count: number }[]
  created_at: string
}

interface ClientsListProps {
  clients: Client[]
}

export function ClientsList({ clients }: ClientsListProps) {
  if (!clients || clients.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
        <User className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No clients yet
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Get started by adding your first client
        </p>
        <Link href="/dashboard/clients/new">
          <Button className="mt-4">Add Client</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Cases
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Added
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      {client.type === 'company' ? (
                        <Building2 className="h-5 w-5 text-blue-600" />
                      ) : (
                        <User className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-blue-600">
                        {client.name}
                      </p>
                      {client.type === 'company' && client.company_name && (
                        <p className="text-sm text-slate-600">
                          {client.company_name}
                        </p>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      client.type === 'company'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {client.type === 'company' ? 'Company' : 'Individual'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-3.5 w-3.5" />
                        {client.email}
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-3.5 w-3.5" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">
                    {client.city || '—'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      {client.cases[0]?.count || 0}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">
                    {formatDistanceToNow(new Date(client.created_at), {
                      addSuffix: true,
                    })}
                  </p>
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
                        <Link href={`/dashboard/clients/${client.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/clients/${client.id}/edit`}>
                          Edit Client
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/cases/new?client=${client.id}`}>
                          Create Case
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

