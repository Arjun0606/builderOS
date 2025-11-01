import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { CaseForm } from '@/components/cases/case-form'

export default async function NewCasePage({
  searchParams,
}: {
  searchParams: { client?: string }
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

  // Fetch clients for dropdown
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, type')
    .eq('organization_id', userProfile.organization_id)
    .order('name')

  // Fetch team members for assignment
  const { data: teamMembers } = await supabase
    .from('users')
    .select('id, full_name, role')
    .eq('organization_id', userProfile.organization_id)
    .order('full_name')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/cases"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cases
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Add New Case
        </h1>
        <p className="mt-2 text-slate-600">
          Create a new legal case for your law firm
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <CaseForm
          organizationId={userProfile.organization_id}
          userId={user.id}
          clients={clients || []}
          teamMembers={teamMembers || []}
          preselectedClientId={searchParams.client}
        />
      </div>
    </div>
  )
}

