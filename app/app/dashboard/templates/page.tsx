import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Search, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'

// Placeholder template data - will be replaced with database later
const TEMPLATE_CATEGORIES = [
  {
    name: 'Notices',
    templates: [
      { id: 1, name: 'Legal Notice - Cheque Bounce (Section 138)', description: 'Notice under Section 138 of Negotiable Instruments Act' },
      { id: 2, name: 'Legal Notice - General', description: 'General legal notice template' },
      { id: 3, name: 'Cease & Desist Notice', description: 'Notice to stop unlawful activity' },
      { id: 4, name: 'Eviction Notice', description: 'Notice to vacate premises' },
    ],
  },
  {
    name: 'Contracts',
    templates: [
      { id: 5, name: 'Non-Disclosure Agreement (NDA)', description: 'Mutual or one-way NDA' },
      { id: 6, name: 'Share Purchase Agreement (SPA)', description: 'Agreement for purchase of shares' },
      { id: 7, name: 'Shareholders Agreement (SHA)', description: 'Agreement between shareholders' },
      { id: 8, name: 'Employment Agreement', description: 'Contract for employment' },
      { id: 9, name: 'Service Agreement', description: 'Agreement for services' },
      { id: 10, name: 'Lease Agreement', description: 'Rental/lease contract' },
    ],
  },
  {
    name: 'Court Filings',
    templates: [
      { id: 11, name: 'Writ Petition (Article 226)', description: 'Petition to High Court' },
      { id: 12, name: 'Civil Suit', description: 'Plaint for civil suit' },
      { id: 13, name: 'Written Statement', description: 'Defendant\'s response' },
      { id: 14, name: 'Bail Application', description: 'Application for bail' },
      { id: 15, name: 'Affidavit', description: 'Sworn statement' },
    ],
  },
  {
    name: 'Corporate',
    templates: [
      { id: 16, name: 'Board Resolution', description: 'Resolution by board of directors' },
      { id: 17, name: 'Shareholders Resolution', description: 'Resolution by shareholders' },
      { id: 18, name: 'MOA/AOA Amendment', description: 'Amendment to company documents' },
      { id: 19, name: 'Power of Attorney', description: 'Authorization document' },
    ],
  },
]

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: { search?: string }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Document Templates
        </h1>
        <p className="mt-2 text-slate-600">
          Generate legal documents instantly with AI-powered templates
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-10"
            defaultValue={searchParams.search}
            name="search"
          />
        </div>
      </div>

      {/* Templates by Category */}
      <div className="space-y-8">
        {TEMPLATE_CATEGORIES.map((category) => (
          <div key={category.name}>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.templates.map((template) => (
                <div
                  key={template.id}
                  className="group relative rounded-lg border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {template.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">
              Template Generation Coming Soon
            </h3>
            <p className="mt-2 text-sm text-blue-700">
              Click on any template to generate a customized document using AI. 
              Simply provide the required details, and our AI will draft a complete 
              legal document in seconds based on your inputs and case information.
            </p>
            <p className="mt-2 text-sm text-blue-700">
              <strong>Current Status:</strong> Template library is ready. 
              Generation functionality will be activated once database is deployed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

