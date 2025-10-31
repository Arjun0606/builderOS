import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ContractsStats } from '@/components/contracts/contracts-stats'
import { UploadContract } from '@/components/contracts/upload-contract'
import { ContractsList } from '@/components/contracts/contracts-list'

export default async function ContractsPage() {
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

  // Fetch contracts
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, projects(name, rera_id)')
    .eq('organization_id', userProfile.organization_id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Calculate stats
  const { count: totalContracts } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', userProfile.organization_id)

  const highRiskContracts = contracts?.filter(c => c.risk_score && c.risk_score >= 7) || []
  const analyzedContracts = contracts?.filter(c => c.analyzed_at) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Contract Analyzer
          </h1>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            AI
          </span>
        </div>
        <p className="mt-2 text-slate-600">
          AI-powered risk analysis for your contracts in 60 seconds
        </p>
      </div>

      {/* Stats */}
      <ContractsStats
        totalContracts={totalContracts || 0}
        analyzedContracts={analyzedContracts.length}
        highRiskContracts={highRiskContracts.length}
      />

      {/* Upload Section */}
      <UploadContract organizationId={userProfile.organization_id} />

      {/* Contracts List */}
      <ContractsList contracts={contracts || []} />
    </div>
  )
}

