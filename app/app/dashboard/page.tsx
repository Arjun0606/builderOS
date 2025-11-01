import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LegalStats } from '@/components/dashboard/legal-stats'
import { RecentCases } from '@/components/dashboard/recent-cases'
import { UpcomingHearings } from '@/components/dashboard/upcoming-hearings'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has completed onboarding
  const { data: userProfile } = await supabase
    .from('users')
    .select('organization_id, full_name, organizations(name)')
    .eq('id', user.id)
    .single()

  // If no organization, redirect to onboarding
  if (!userProfile?.organization_id) {
    redirect('/onboarding')
  }

  // Fetch stats
  const { data: clients } = await supabase
    .from('clients')
    .select('id')
    .eq('organization_id', userProfile.organization_id)

  const { data: cases } = await supabase
    .from('cases')
    .select('id, case_status')
    .eq('organization_id', userProfile.organization_id)

  const { data: courtDates } = await supabase
    .from('court_dates')
    .select('id')
    .eq('organization_id', userProfile.organization_id)
    .gte('hearing_date', new Date().toISOString().split('T')[0])

  // Fetch recent cases
  const { data: recentCases } = await supabase
    .from('cases')
    .select(`
      *,
      clients(id, name, type),
      users!cases_lead_lawyer_fkey(full_name)
    `)
    .eq('organization_id', userProfile.organization_id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch upcoming hearings
  const { data: upcomingHearings } = await supabase
    .from('court_dates')
    .select(`
      *,
      cases(id, case_title, case_number, clients(name))
    `)
    .eq('organization_id', userProfile.organization_id)
    .gte('hearing_date', new Date().toISOString().split('T')[0])
    .order('hearing_date', { ascending: true })
    .limit(10)

  const stats = {
    totalClients: clients?.length || 0,
    totalCases: cases?.length || 0,
    activeCases: cases?.filter(c => c.case_status === 'active').length || 0,
    upcomingHearings: courtDates?.length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {userProfile.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="mt-2 text-slate-600">
          Here's what's happening with your law firm today - {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Overview */}
      <LegalStats stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <RecentCases cases={recentCases || []} />

        {/* Upcoming Hearings */}
        <UpcomingHearings hearings={upcomingHearings || []} />
      </div>
    </div>
  )
}

