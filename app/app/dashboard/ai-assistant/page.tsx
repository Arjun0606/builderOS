import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AIChat } from '@/components/ai/ai-chat'
import { Bot, Sparkles, Scale, BookOpen } from 'lucide-react'

export default async function AIAssistantPage() {
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
    .select('organization_id, full_name')
    .eq('id', user.id)
    .single()

  if (!userProfile?.organization_id) {
    redirect('/onboarding')
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              AI Legal Assistant
            </h1>
            <p className="mt-1 text-slate-600">
              Ask questions about Indian law, draft documents, or get legal research help
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Legal Questions
              </p>
              <p className="text-xs text-blue-700">
                Ask about IPC, CPC, Companies Act, etc.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-semibold text-purple-900">
                Draft Documents
              </p>
              <p className="text-xs text-purple-700">
                Generate notices, contracts, pleadings
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                Case Law Research
              </p>
              <p className="text-xs text-green-700">
                Find relevant judgments & precedents
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 min-h-0">
        <AIChat
          organizationId={userProfile.organization_id}
          userId={user.id}
          userName={userProfile.full_name}
        />
      </div>
    </div>
  )
}

