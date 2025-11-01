'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface Client {
  id: string
  name: string
  type: string
}

interface TeamMember {
  id: string
  full_name: string
  role: string
}

interface CaseFormProps {
  organizationId: string
  userId: string
  clients: Client[]
  teamMembers: TeamMember[]
  caseData?: any
  preselectedClientId?: string
}

export function CaseForm({
  organizationId,
  userId,
  clients,
  teamMembers,
  caseData,
  preselectedClientId,
}: CaseFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const newCaseData = {
      organization_id: organizationId,
      client_id: formData.get('client_id') as string,
      case_title: formData.get('case_title') as string,
      case_number: formData.get('case_number') as string || null,
      case_type: formData.get('case_type') as string,
      court_name: formData.get('court_name') as string || null,
      court_location: formData.get('court_location') as string || null,
      judge_name: formData.get('judge_name') as string || null,
      our_side: formData.get('our_side') as string || null,
      opposing_party: formData.get('opposing_party') as string || null,
      opposing_counsel: formData.get('opposing_counsel') as string || null,
      filing_date: formData.get('filing_date') as string || null,
      next_hearing_date: formData.get('next_hearing_date') as string || null,
      case_status: formData.get('case_status') as string || 'active',
      priority: formData.get('priority') as string || 'medium',
      lead_lawyer: formData.get('lead_lawyer') as string || null,
      case_summary: formData.get('case_summary') as string || null,
      cause_of_action: formData.get('cause_of_action') as string || null,
      relief_sought: formData.get('relief_sought') as string || null,
      created_by: userId,
    }

    try {
      let result

      if (caseData) {
        // Update existing case
        result = await supabase
          .from('cases')
          .update(newCaseData)
          .eq('id', caseData.id)
          .select()
          .single()
      } else {
        // Create new case
        result = await supabase
          .from('cases')
          .insert([newCaseData])
          .select()
          .single()
      }

      if (result.error) throw result.error

      router.push(`/dashboard/cases/${result.data.id}`)
      router.refresh()
    } catch (err: any) {
      console.error('Error saving case:', err)
      setError(err.message || 'Failed to save case')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Case Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Case Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="case_title">Case Title *</Label>
            <Input
              id="case_title"
              name="case_title"
              required
              defaultValue={caseData?.case_title}
              placeholder="ABC Ltd v. XYZ Corp"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_number">Case Number</Label>
            <Input
              id="case_number"
              name="case_number"
              defaultValue={caseData?.case_number}
              placeholder="WP 12345/2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_id">Client *</Label>
            <select
              id="client_id"
              name="client_id"
              required
              defaultValue={preselectedClientId || caseData?.client_id}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.type})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_type">Case Type *</Label>
            <select
              id="case_type"
              name="case_type"
              required
              defaultValue={caseData?.case_type || 'civil'}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="civil">Civil</option>
              <option value="criminal">Criminal</option>
              <option value="corporate">Corporate</option>
              <option value="IP">Intellectual Property</option>
              <option value="tax">Tax</option>
              <option value="labor">Labor</option>
              <option value="family">Family</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              name="priority"
              defaultValue={caseData?.priority || 'medium'}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Court Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Court Details
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="court_name">Court Name</Label>
            <Input
              id="court_name"
              name="court_name"
              defaultValue={caseData?.court_name}
              placeholder="Bombay High Court"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="court_location">Court Location</Label>
            <Input
              id="court_location"
              name="court_location"
              defaultValue={caseData?.court_location}
              placeholder="Mumbai"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="judge_name">Judge Name</Label>
            <Input
              id="judge_name"
              name="judge_name"
              defaultValue={caseData?.judge_name}
              placeholder="Justice A. B. Sharma"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="our_side">Our Side</Label>
            <select
              id="our_side"
              name="our_side"
              defaultValue={caseData?.our_side || 'plaintiff'}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="plaintiff">Plaintiff</option>
              <option value="defendant">Defendant</option>
              <option value="petitioner">Petitioner</option>
              <option value="respondent">Respondent</option>
              <option value="applicant">Applicant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Opposing Party
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="opposing_party">Opposing Party Name</Label>
            <Input
              id="opposing_party"
              name="opposing_party"
              defaultValue={caseData?.opposing_party}
              placeholder="XYZ Corporation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opposing_counsel">Opposing Counsel</Label>
            <Input
              id="opposing_counsel"
              name="opposing_counsel"
              defaultValue={caseData?.opposing_counsel}
              placeholder="Advocate Name"
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Important Dates
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="filing_date">Filing Date</Label>
            <Input
              id="filing_date"
              name="filing_date"
              type="date"
              defaultValue={caseData?.filing_date}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_hearing_date">Next Hearing Date</Label>
            <Input
              id="next_hearing_date"
              name="next_hearing_date"
              type="date"
              defaultValue={caseData?.next_hearing_date}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_status">Status</Label>
            <select
              id="case_status"
              name="case_status"
              defaultValue={caseData?.case_status || 'active'}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="disposed">Disposed</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="settled">Settled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Assignment
        </h3>

        <div className="space-y-2">
          <Label htmlFor="lead_lawyer">Lead Lawyer</Label>
          <select
            id="lead_lawyer"
            name="lead_lawyer"
            defaultValue={caseData?.lead_lawyer}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Lead Lawyer</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.full_name} ({member.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Case Details
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="case_summary">Case Summary</Label>
            <textarea
              id="case_summary"
              name="case_summary"
              rows={4}
              defaultValue={caseData?.case_summary}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Brief summary of the case..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cause_of_action">Cause of Action</Label>
            <textarea
              id="cause_of_action"
              name="cause_of_action"
              rows={3}
              defaultValue={caseData?.cause_of_action}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Describe the cause of action..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relief_sought">Relief Sought</Label>
            <textarea
              id="relief_sought"
              name="relief_sought"
              rows={3}
              defaultValue={caseData?.relief_sought}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Describe the relief being sought..."
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {caseData ? 'Update Case' : 'Create Case'}
        </Button>
      </div>
    </form>
  )
}

