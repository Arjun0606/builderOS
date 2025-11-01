import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { CaseHeader } from '@/components/cases/case-header'
import { CaseOverview } from '@/components/cases/case-overview'
import { CaseTimeline } from '@/components/cases/case-timeline'
import { CaseDocuments } from '@/components/cases/case-documents'
import { CaseCourtDates } from '@/components/cases/case-court-dates'
import { CaseTasks } from '@/components/cases/case-tasks'
import { CaseTimeEntries } from '@/components/cases/case-time-entries'

export default async function CaseDetailsPage({
  params,
}: {
  params: { id: string }
}) {
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
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!userProfile?.organization_id) {
    redirect('/onboarding')
  }

  // Fetch case details
  const { data: caseData, error } = await supabase
    .from('cases')
    .select(`
      *,
      clients(id, name, type, email, phone_number),
      users!cases_lead_lawyer_fkey(id, full_name, email)
    `)
    .eq('id', params.id)
    .eq('organization_id', userProfile.organization_id)
    .single()

  if (error || !caseData) {
    notFound()
  }

  // Fetch court dates for this case
  const { data: courtDates } = await supabase
    .from('court_dates')
    .select('*')
    .eq('case_id', params.id)
    .order('hearing_date', { ascending: true })

  // Fetch documents for this case
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('case_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch tasks for this case
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, assigned_to:users!tasks_assigned_to_fkey(full_name)')
    .eq('case_id', params.id)
    .order('due_date', { ascending: true })

  // Fetch time entries for this case
  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select('*, users(full_name)')
    .eq('case_id', params.id)
    .order('entry_date', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      {/* Case Header */}
      <CaseHeader caseData={caseData} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Overview */}
          <CaseOverview caseData={caseData} />

          {/* Court Dates */}
          <CaseCourtDates 
            caseId={params.id} 
            courtDates={courtDates || []} 
          />

          {/* Tasks */}
          <CaseTasks 
            caseId={params.id} 
            tasks={tasks || []} 
          />

          {/* Time Entries */}
          <CaseTimeEntries 
            caseId={params.id} 
            timeEntries={timeEntries || []} 
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Timeline / Activity */}
          <CaseTimeline caseId={params.id} />

          {/* Documents */}
          <CaseDocuments 
            caseId={params.id}
            organizationId={userProfile.organization_id}
            documents={documents || []} 
          />
        </div>
      </div>
    </div>
  )
}

