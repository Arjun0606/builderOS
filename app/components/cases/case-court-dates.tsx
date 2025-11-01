'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Plus, Clock, MapPin } from 'lucide-react'
import { format, isBefore, addDays } from 'date-fns'
import Link from 'next/link'

interface CaseCourtDatesProps {
  caseId: string
  courtDates: any[]
}

export function CaseCourtDates({ caseId, courtDates }: CaseCourtDatesProps) {
  const upcomingDates = courtDates.filter(
    (date) => new Date(date.hearing_date) >= new Date()
  )

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Court Dates</h2>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Date
        </Button>
      </div>

      {upcomingDates.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">
            No upcoming court dates scheduled
          </p>
          <Button className="mt-4" variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add First Court Date
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingDates.slice(0, 5).map((courtDate) => {
            const hearingDate = new Date(courtDate.hearing_date)
            const isUrgent = isBefore(hearingDate, addDays(new Date(), 3))

            return (
              <div
                key={courtDate.id}
                className={`rounded-lg border p-4 ${
                  isUrgent
                    ? 'border-red-200 bg-red-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isUrgent ? 'bg-red-100' : 'bg-blue-100'
                        }`}
                      >
                        <Calendar
                          className={`h-5 w-5 ${
                            isUrgent ? 'text-red-600' : 'text-blue-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {courtDate.hearing_type
                            ? courtDate.hearing_type.replace('_', ' ').toUpperCase()
                            : 'Hearing'}
                        </p>
                        <p className="text-sm text-slate-600">
                          {format(hearingDate, 'EEEE, MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                      {courtDate.hearing_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {courtDate.hearing_time}
                        </div>
                      )}
                      {courtDate.court_room && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {courtDate.court_room}
                        </div>
                      )}
                    </div>
                  </div>

                  {isUrgent && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {upcomingDates.length > 5 && (
            <Button variant="outline" className="w-full" size="sm">
              View All {upcomingDates.length} Court Dates
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

