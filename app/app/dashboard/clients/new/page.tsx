import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ClientForm } from '@/components/clients/client-form'

export default async function NewClientPage() {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Add New Client
        </h1>
        <p className="mt-2 text-slate-600">
          Create a new client profile for your law firm
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <ClientForm organizationId={userProfile.organization_id} userId={user.id} />
      </div>
    </div>
  )
}

