'use client'

import { useEffect, useState } from 'react'
import { Shield, Filter } from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'
import { format } from 'date-fns'

interface AuditLog {
  id: string
  action: string
  resource: string | null
  details: any
  created_at: string
  users: {
    full_name: string
    email: string
  }
}

export function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/audit-logs?limit=100')
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }
      
      const data = await response.json()
      setLogs(data.logs)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogs = logs.filter(log =>
    !filter ||
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.users.full_name.toLowerCase().includes(filter.toLowerCase())
  )

  const getActionBadgeColor = (action: string) => {
    if (action.includes('created')) return 'bg-green-100 text-green-700'
    if (action.includes('updated')) return 'bg-blue-100 text-blue-700'
    if (action.includes('deleted')) return 'bg-red-100 text-red-700'
    if (action.includes('login') || action.includes('logout')) return 'bg-purple-100 text-purple-700'
    return 'bg-slate-100 text-slate-700'
  }

  if (isLoading) {
    return <Loading text="Loading audit logs..." />
  }

  if (error) {
    return <ErrorMessage message={error} type="error" onRetry={fetchLogs} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Shield className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Audit Logs</h2>
            <p className="text-sm text-slate-500">{logs.length} total events</p>
          </div>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-slate-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                TIME
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                USER
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                ACTION
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                RESOURCE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                  No audit logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">
                      {log.users.full_name}
                    </div>
                    <div className="text-xs text-slate-500">{log.users.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getActionBadgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {log.resource || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

