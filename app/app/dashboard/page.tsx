import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OverviewStats } from '@/components/dashboard/overview-stats'
import { AlertsList } from '@/components/dashboard/alerts-list'
import { ProjectHealthCards } from '@/components/dashboard/project-health-cards'
import { ROIMonitor } from '@/components/dashboard/roi-monitor'
import { FinanceHealthBar } from '@/components/dashboard/finance-health-bar'

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
    .select('organization_id')
    .eq('id', user.id)
    .single()

  // If no organization, redirect to onboarding
  if (!userProfile?.organization_id) {
    redirect('/onboarding')
  }

  // Fetch user's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', userProfile.organization_id)
    .order('created_at', { ascending: false })

  // Fetch unresolved alerts
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('organization_id', userProfile.organization_id)
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Overview of all your projects and alerts
        </p>
      </div>

      {/* ROI Monitor & Finance Health Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROI Monitor - Takes 1 column */}
        <div className="lg:col-span-1">
          <ROIMonitor />
        </div>
        
        {/* Finance Health Bar - Takes 2 columns */}
        <div className="lg:col-span-2">
          <FinanceHealthBar />
        </div>
      </div>

      {/* Overview Stats */}
      <OverviewStats projects={projects || []} alerts={alerts || []} />

      {/* Project Health Cards */}
      <ProjectHealthCards projects={projects || []} />

      {/* Recent Alerts */}
      <AlertsList alerts={alerts || []} />
    </div>
  )
}

