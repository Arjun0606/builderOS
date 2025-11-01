import Link from 'next/link'
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, formatDistanceToNow, isBefore, addDays } from 'date-fns'

interface Hearing {
  id: string
  hearing_date: string
  hearing_time: string | null
  hearing_type: string | null
  court_room: string | null
  cases: {
    id: string
    case_title: string
    case_number: string | null
    clients: {
      name: string
    } | null
  } | null
}

interface UpcomingHearingsProps {
  hearings: Hearing[]
}

export function UpcomingHearings({ hearings }: UpcomingHearingsProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Upcoming Hearings
        </h2>
        <Link href="/dashboard/cases">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {hearings.length === 0 ? (
        <div className="p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">
            No upcoming hearings scheduled
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 max-h-[500px] overflow-y-auto">
          {hearings.map((hearing) => {
            const hearingDate = new Date(hearing.hearing_date)
            const isUrgent = isBefore(hearingDate, addDays(new Date(), 3))

            return (
              <Link
                key={hearing.id}
                href={`/dashboard/cases/${hearing.cases?.id}`}
                className="block p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isUrgent ? 'bg-red-100' : 'bg-orange-100'
                    }`}
                  >
                    <Calendar
                      className={`h-5 w-5 ${
                        isUrgent ? 'text-red-600' : 'text-orange-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {hearing.cases?.case_title || 'Untitled Case'}
                        </p>
                        {hearing.cases?.case_number && (
                          <p className="text-sm text-slate-600">
                            {hearing.cases.case_number}
                          </p>
                        )}
                      </div>
                      {isUrgent && (
                        <div className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                          <AlertCircle className="h-3 w-3" />
                          Urgent
                        </div>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Date & Time</p>
                        <p className="font-medium text-slate-900">
                          {format(hearingDate, 'MMM d, yyyy')}
                          {hearing.hearing_time && ` at ${hearing.hearing_time}`}
                        </p>
                        <p className="text-xs text-slate-600">
                          {formatDistanceToNow(hearingDate, { addSuffix: true })}
                        </p>
                      </div>
                      {hearing.hearing_type && (
                        <div>
                          <p className="text-xs text-slate-500">Type</p>
                          <p className="font-medium text-slate-900 capitalize">
                            {hearing.hearing_type.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                    </div>

                    {hearing.court_room && (
                      <div className="mt-2">
                        <p className="text-xs text-slate-500">Court Room</p>
                        <p className="text-sm font-medium text-slate-900">
                          {hearing.court_room}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

