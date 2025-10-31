import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CostGuardStats } from '@/components/cost-guard/cost-guard-stats'
import { UploadInvoices } from '@/components/cost-guard/upload-invoices'
import { AnomaliesList } from '@/components/cost-guard/anomalies-list'

export default async function CostGuardPage() {
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

  // Fetch flagged invoices (anomalies)
  const { data: flaggedInvoices } = await supabase
    .from('invoices')
    .select('*, projects(name)')
    .eq('organization_id', userProfile.organization_id)
    .eq('flagged_by_cost_guard', true)
    .order('created_at', { ascending: false })
    .limit(50)

  // Calculate stats
  const { count: totalInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', userProfile.organization_id)

  const { count: flaggedCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', userProfile.organization_id)
    .eq('flagged_by_cost_guard', true)

  const { data: duplicates } = await supabase
    .from('invoices')
    .select('amount')
    .eq('organization_id', userProfile.organization_id)
    .eq('is_duplicate', true)

  const totalSaved = duplicates?.reduce((sum, inv) => sum + inv.amount, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Cost Guard
          </h1>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            AI
          </span>
        </div>
        <p className="mt-2 text-slate-600">
          AI-powered financial anomaly detection for your Tally/ERP data
        </p>
      </div>

      {/* Stats */}
      <CostGuardStats
        totalInvoices={totalInvoices || 0}
        flaggedCount={flaggedCount || 0}
        totalSaved={totalSaved}
      />

      {/* Upload Section */}
      <UploadInvoices organizationId={userProfile.organization_id} />

      {/* Anomalies List */}
      <AnomaliesList invoices={flaggedInvoices || []} />
    </div>
  )
}

