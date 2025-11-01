import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Search, Briefcase, Scale, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CasesList } from '@/components/cases/cases-list'

export default async function CasesPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; type?: string }
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
    .from('cases')
    .select(`
      *,
      clients(id, name, type),
      users!cases_lead_lawyer_fkey(id, full_name)
    `)
    .eq('organization_id', userProfile.organization_id)

  // Apply search filter
  if (searchParams.search) {
    query = query.or(`case_title.ilike.%${searchParams.search}%,case_number.ilike.%${searchParams.search}%`)
  }

  // Apply status filter
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('case_status', searchParams.status)
  }

  // Apply type filter
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('case_type', searchParams.type)
  }

  const { data: cases, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cases:', error)
  }

  // Get stats
  const { data: stats } = await supabase
    .from('cases')
    .select('case_status')
    .eq('organization_id', userProfile.organization_id)

  const totalCases = stats?.length || 0
  const activeCases = stats?.filter((s) => s.case_status === 'active').length || 0
  const pendingCases = stats?.filter((s) => s.case_status === 'pending').length || 0
  const disposedCases = stats?.filter((s) => s.case_status === 'disposed').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Cases
          </h1>
          <p className="mt-2 text-slate-600">
            Manage all legal cases for your law firm
          </p>
        </div>
        <Link href="/dashboard/cases/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Case
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Cases
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalCases}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Active
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {activeCases}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Scale className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Pending
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {pendingCases}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Disposed
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {disposedCases}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Briefcase className="h-6 w-6 text-gray-600" />
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
            placeholder="Search cases by title or case number..."
            className="pl-10"
            defaultValue={searchParams.search}
            name="search"
          />
        </div>
        <select
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          defaultValue={searchParams.status || 'all'}
          name="status"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="disposed">Disposed</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="settled">Settled</option>
        </select>
        <select
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          defaultValue={searchParams.type || 'all'}
          name="type"
        >
          <option value="all">All Types</option>
          <option value="civil">Civil</option>
          <option value="criminal">Criminal</option>
          <option value="corporate">Corporate</option>
          <option value="IP">IP</option>
          <option value="tax">Tax</option>
          <option value="labor">Labor</option>
          <option value="family">Family</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Cases List */}
      <CasesList cases={cases || []} />
    </div>
  )
}

