'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Play, Pause, Plus, Clock, Briefcase } from 'lucide-react'
import { format } from 'date-fns'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Case {
  id: string
  case_title: string
  case_number: string | null
  clients: { name: string } | null
}

interface TimeEntry {
  id: string
  entry_date: string
  hours: number
  activity: string
  is_billable: boolean
  cases: { case_title: string; case_number: string | null } | null
  clients: { name: string } | null
}

interface TimeTrackerProps {
  userId: string
  organizationId: string
  cases: Case[]
  timeEntries: TimeEntry[]
}

export function TimeTracker({ userId, organizationId, cases, timeEntries }: TimeTrackerProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const supabase = createClientComponentClient()

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Active Timer
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-slate-600 mb-2">Current Time</p>
            <p className="text-4xl font-bold text-slate-900">
              {Math.floor(timerSeconds / 3600)}:{String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={isTimerRunning ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isTimerRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowManualEntry(!showManualEntry)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Manual Entry Form */}
      {showManualEntry && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Add Manual Entry
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                step="0.25"
                placeholder="2.5"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="case_id">Case</Label>
              <select
                id="case_id"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Case (Optional)</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.case_title} {c.case_number && `(${c.case_number})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="activity">Activity Description</Label>
              <textarea
                id="activity"
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Drafted reply, reviewed documents, client meeting..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_billable"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <Label htmlFor="is_billable" className="font-normal">
                Billable
              </Label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowManualEntry(false)}
            >
              Cancel
            </Button>
            <Button>Save Entry</Button>
          </div>
        </div>
      )}

      {/* Time Entries List */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Time Entries
          </h2>
        </div>

        {timeEntries.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-sm text-slate-600">
              No time entries yet. Start tracking time to see entries here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="p-6 hover:bg-slate-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        {entry.cases ? (
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {entry.activity || 'No description'}
                        </p>
                        {entry.cases && (
                          <p className="text-sm text-slate-600">
                            {entry.cases.case_title}
                            {entry.cases.case_number && ` (${entry.cases.case_number})`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                      <span>{format(new Date(entry.entry_date), 'MMM d, yyyy')}</span>
                      <span className="font-semibold">{entry.hours}h</span>
                      {entry.is_billable && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Billable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

