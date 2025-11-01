import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { KnowledgeBaseUpload } from '@/components/knowledge-base/knowledge-base-upload'
import { KnowledgeBaseStats } from '@/components/knowledge-base/knowledge-base-stats'
import { RecentUploads } from '@/components/knowledge-base/recent-uploads'
import { Brain, Upload, Search, Zap } from 'lucide-react'

export default async function KnowledgeBasePage() {
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
    .select('organization_id, organizations(name)')
    .eq('id', user.id)
    .single()

  if (!userProfile?.organization_id) {
    redirect('/onboarding')
  }

  // Get document count
  const { count: documentCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', userProfile.organization_id)

  // Get case count
  const { count: caseCount } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', userProfile.organization_id)

  // Get recent uploads
  const { data: recentUploads } = await supabase
    .from('documents')
    .select('*, cases(case_title, case_number)')
    .eq('organization_id', userProfile.organization_id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Firm Knowledge Base
            </h1>
            <p className="mt-1 text-slate-600">
              Train AI on your firm's past cases - like GitHub Copilot for lawyers
            </p>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="flex items-start gap-4">
          <Zap className="h-6 w-6 text-purple-600 mt-1 shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 text-lg">
              Why Upload Your Past Cases?
            </h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-purple-800">📚 Institutional Knowledge</p>
                <p className="mt-1 text-purple-700">
                  AI learns from your 10+ years of case history
                </p>
              </div>
              <div>
                <p className="font-medium text-purple-800">✍️ Your Firm's Style</p>
                <p className="mt-1 text-purple-700">
                  Drafts documents using YOUR winning patterns
                </p>
              </div>
              <div>
                <p className="font-medium text-purple-800">🎯 Context-Aware</p>
                <p className="mt-1 text-purple-700">
                  References "Similar to case X we won in 2019..."
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-purple-700 italic">
              <strong>Example:</strong> When you ask AI to draft a notice, it will say:
              "Based on your firm's 35 successful cheque bounce cases, particularly Case CHQ-234/2019 where you recovered 100% in 3 months, here's a notice in your firm's style..."
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <KnowledgeBaseStats 
        documentCount={documentCount || 0}
        caseCount={caseCount || 0}
      />

      {/* Upload Section */}
      <KnowledgeBaseUpload 
        organizationId={userProfile.organization_id}
      />

      {/* Recent Uploads */}
      <RecentUploads uploads={recentUploads || []} />
    </div>
  )
}

