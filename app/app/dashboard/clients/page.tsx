import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Search, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClientsList } from '@/components/clients/clients-list'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { search?: string; type?: string }
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

  // Build query
  let query = supabase
    .from('clients')
    .select('*, cases(count)')
    .eq('organization_id', userProfile.organization_id)

  // Apply search filter
  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,email.ilike.%${searchParams.search}%,phone.ilike.%${searchParams.search}%`)
  }

  // Apply type filter
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('type', searchParams.type)
  }

  const { data: clients, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching clients:', error)
  }

  // Get stats
  const { data: stats } = await supabase
    .from('clients')
    .select('type')
    .eq('organization_id', userProfile.organization_id)

  const totalClients = stats?.length || 0
  const individualClients = stats?.filter((s) => s.type === 'individual').length || 0
  const companyClients = stats?.filter((s) => s.type === 'company').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Clients
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your law firm's clients and their cases
          </p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Clients
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalClients}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Individuals
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {individualClients}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Companies
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {companyClients}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search clients by name, email, or phone..."
            className="pl-10"
            defaultValue={searchParams.search}
            name="search"
          />
        </div>
        <select
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          defaultValue={searchParams.type || 'all'}
          name="type"
        >
          <option value="all">All Types</option>
          <option value="individual">Individual</option>
          <option value="company">Company</option>
        </select>
      </div>

      {/* Clients List */}
      <ClientsList clients={clients || []} />
    </div>
  )
}

