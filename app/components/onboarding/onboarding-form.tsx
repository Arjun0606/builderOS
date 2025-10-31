'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { AlertCircle, Building2, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Gujarat',
  'Kerala',
  'Delhi',
  'Haryana',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Punjab',
  'Andhra Pradesh',
  'Odisha',
]

interface OnboardingFormProps {
  user: User
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  // Form data
  const [formData, setFormData] = useState({
    // Organization
    organizationName: '',
    fullName: user.email?.split('@')[0] || '',
    role: 'owner',
    // First Project
    projectName: '',
    reraId: '',
    state: '',
    budget: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Step 1: Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.organizationName,
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Step 2: Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          organization_id: org.id,
          email: user.email!,
          full_name: formData.fullName,
          role: formData.role,
        })

      if (userError) throw userError

      // Step 3: Create first project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          organization_id: org.id,
          name: formData.projectName,
          rera_id: formData.reraId,
          state: formData.state,
          budget: parseFloat(formData.budget) || null,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Step 4: Grant user access to project
      const { error: accessError } = await supabase
        .from('user_project_access')
        .insert({
          user_id: user.id,
          project_id: project.id,
          access_level: 'full',
        })

      if (accessError) throw accessError

      // Success! Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Onboarding error:', err)
      setError(err.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'
            }`}
          >
            {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
          </div>
          <span className="text-sm font-medium">Organization</span>
        </div>
        <div className="h-px flex-1 bg-slate-200 mx-4" />
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'
            }`}
          >
            2
          </div>
          <span className="text-sm font-medium">First Project</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Organization Setup */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create Your Organization
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              This is your company or construction firm
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="organizationName">
                Organization Name *
              </Label>
              <Input
                id="organizationName"
                placeholder="e.g., Urban Risers Builders"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="fullName">Your Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Rajesh Kumar"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="role">Your Role</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                disabled={loading}
              >
                <option value="owner">Owner</option>
                <option value="pm">Project Manager</option>
                <option value="finance">Finance Manager</option>
              </select>
            </div>
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={() => setStep(2)}
            disabled={!formData.organizationName || !formData.fullName}
          >
            Continue to Project Setup
          </Button>
        </div>
      )}

      {/* Step 2: First Project */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Your First Project
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              We'll help you monitor compliance and catch errors
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="e.g., Sunshine Heights"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="reraId">RERA ID *</Label>
              <Input
                id="reraId"
                placeholder="e.g., MH123456789"
                value={formData.reraId}
                onChange={(e) =>
                  setFormData({ ...formData, reraId: e.target.value })
                }
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-slate-500">
                This is your project's unique RERA registration number
              </p>
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <select
                id="state"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                required
                disabled={loading}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="budget">Project Budget (₹ Crores)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                placeholder="e.g., 200"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                disabled={loading}
              />
              <p className="mt-1 text-xs text-slate-500">
                Optional - helps us provide better insights
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={loading}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.projectName ||
                !formData.reraId ||
                !formData.state
              }
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}

