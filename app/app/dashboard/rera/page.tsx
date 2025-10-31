import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReraStats } from '@/components/rera/rera-stats'
import { ReraUpdates } from '@/components/rera/rera-updates'
import { QprGenerator } from '@/components/rera/qpr-generator'

export default async function ReraPage() {
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

  // Fetch user's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', userProfile.organization_id)
    .order('created_at', { ascending: false })

  // Get unique states from projects
  const states = [...new Set(projects?.map(p => p.state) || [])]

  // Fetch RERA updates for user's states
  const { data: reraUpdates } = await supabase
    .from('rera_updates')
    .select('*')
    .in('state', states)
    .order('detected_at', { ascending: false })
    .limit(20)

  // Fetch recent QPR drafts
  const projectIds = projects?.map(p => p.id) || []
  const { data: qprDrafts } = await supabase
    .from('qpr_drafts')
    .select('*, projects(name, rera_id)')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            RERA Compliance
          </h1>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            AI
          </span>
        </div>
        <p className="mt-2 text-slate-600">
          Automated RERA monitoring for {states.join(', ')}
        </p>
      </div>

      {/* Stats */}
      <ReraStats 
        projects={projects || []} 
        updates={reraUpdates || []}
      />

      {/* RERA Updates */}
      <ReraUpdates updates={reraUpdates || []} states={states} />

      {/* QPR Generator */}
      <QprGenerator projects={projects || []} qprDrafts={qprDrafts || []} />
    </div>
  )
}

