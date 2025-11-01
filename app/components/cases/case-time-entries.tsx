'use client'

import { Button } from '@/components/ui/button'
import { Clock, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface CaseTimeEntriesProps {
  caseId: string
  timeEntries: any[]
}

export function CaseTimeEntries({ caseId, timeEntries }: CaseTimeEntriesProps) {
  const totalHours = timeEntries.reduce(
    (sum, entry) => sum + parseFloat(entry.hours || 0),
    0
  )

  const billableHours = timeEntries
    .filter((e) => e.is_billable)
    .reduce((sum, entry) => sum + parseFloat(entry.hours || 0), 0)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Time Tracking</h2>
          <p className="text-sm text-slate-600">
            {totalHours.toFixed(1)}h total · {billableHours.toFixed(1)}h billable
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Log Time
        </Button>
      </div>

      {timeEntries.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">
            No time entries yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {timeEntries.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {entry.activity || 'No description'}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-600">
                  <span>{entry.users?.full_name}</span>
                  <span>·</span>
                  <span>{format(new Date(entry.entry_date), 'MMM d, yyyy')}</span>
                  {entry.is_billable && (
                    <>
                      <span>·</span>
                      <span className="text-green-600 font-medium">Billable</span>
                    </>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {entry.hours}h
              </span>
            </div>
          ))}

          {timeEntries.length > 5 && (
            <Button variant="outline" className="w-full" size="sm">
              View All Time Entries
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

