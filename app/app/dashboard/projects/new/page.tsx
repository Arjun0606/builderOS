import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectForm } from '@/components/projects/project-form'

export default async function NewProjectPage() {
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Add New Project
        </h1>
        <p className="mt-2 text-slate-600">
          Create a new construction project to monitor
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <ProjectForm organizationId={userProfile.organization_id} />
      </div>
    </div>
  )
}

