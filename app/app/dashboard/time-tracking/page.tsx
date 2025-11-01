import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Clock, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TimeTracker } from '@/components/time-tracking/time-tracker'

export default async function TimeTrackingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's organization
  const { data: userProfile } = await supabase
    .from('users')
    .select('organization_id, full_name')
    .eq('id', user.id)
    .single()

  if (!userProfile?.organization_id) {
    redirect('/onboarding')
  }

  // Fetch cases for dropdown
  const { data: cases } = await supabase
    .from('cases')
    .select('id, case_title, case_number, clients(name)')
    .eq('organization_id', userProfile.organization_id)
    .order('case_title')

  // Fetch recent time entries
  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select(`
      *,
      cases(id, case_title, case_number),
      clients(id, name)
    `)
    .eq('organization_id', userProfile.organization_id)
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false })
    .limit(50)

  // Calculate totals
  const today = new Date().toISOString().split('T')[0]
  const todayEntries = timeEntries?.filter(e => e.entry_date === today) || []
  const todayHours = todayEntries.reduce((sum, e) => sum + parseFloat(e.hours || 0), 0)

  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())
  const weekEntries = timeEntries?.filter(e => new Date(e.entry_date) >= thisWeekStart) || []
  const weekHours = weekEntries.reduce((sum, e) => sum + parseFloat(e.hours || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Time Tracking
        </h1>
        <p className="mt-2 text-slate-600">
          Track billable hours for your cases and clients
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Today</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {todayHours.toFixed(1)}h
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">This Week</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {weekHours.toFixed(1)}h
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Billable Today
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {todayEntries.filter(e => e.is_billable).reduce((sum, e) => sum + parseFloat(e.hours || 0), 0).toFixed(1)}h
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Time Tracker Component */}
      <TimeTracker
        userId={user.id}
        organizationId={userProfile.organization_id}
        cases={cases || []}
        timeEntries={timeEntries || []}
      />
    </div>
  )
}
