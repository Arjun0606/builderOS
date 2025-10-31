'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Building2, Loader2 } from 'lucide-react'

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

interface ProjectFormProps {
  organizationId: string
  initialData?: any
  isEditing?: boolean
}

export function ProjectForm({ organizationId, initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    reraId: initialData?.rera_id || '',
    state: initialData?.state || '',
    budget: initialData?.budget || '',
    startDate: initialData?.start_date || '',
    targetCompletion: initialData?.target_completion || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const projectData = {
        organization_id: organizationId,
        name: formData.name,
        rera_id: formData.reraId,
        state: formData.state,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        start_date: formData.startDate || null,
        target_completion: formData.targetCompletion || null,
      }

      if (isEditing && initialData) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', initialData.id)

        if (updateError) throw updateError

        router.push(`/dashboard/projects/${initialData.id}`)
      } else {
        // Create new project
        const { data: project, error: insertError } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single()

        if (insertError) throw insertError

        // Grant user access to the project
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          await supabase.from('user_project_access').insert({
            user_id: user.id,
            project_id: project.id,
            access_level: 'full',
          })
        }

        router.push('/dashboard/projects')
      }

      router.refresh()
    } catch (err: any) {
      console.error('Project form error:', err)
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} project`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Sunshine Heights"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        {/* RERA ID */}
        <div>
          <Label htmlFor="reraId">RERA ID *</Label>
          <Input
            id="reraId"
            placeholder="e.g., MH123456789"
            value={formData.reraId}
            onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
            required
            disabled={loading || isEditing}
          />
          <p className="mt-1 text-xs text-slate-500">
            Unique RERA registration number for this project
          </p>
        </div>

        {/* State */}
        <div>
          <Label htmlFor="state">State *</Label>
          <select
            id="state"
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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

        {/* Budget */}
        <div>
          <Label htmlFor="budget">Budget (₹ Crores)</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            placeholder="e.g., 200"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            disabled={loading}
          />
          <p className="mt-1 text-xs text-slate-500">
            Total project budget in crores (optional)
          </p>
        </div>

        {/* Start Date */}
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            disabled={loading}
          />
        </div>

        {/* Target Completion */}
        <div>
          <Label htmlFor="targetCompletion">Target Completion</Label>
          <Input
            id="targetCompletion"
            type="date"
            value={formData.targetCompletion}
            onChange={(e) => setFormData({ ...formData, targetCompletion: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.name || !formData.reraId || !formData.state}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Building2 className="mr-2 h-4 w-4" />
              {isEditing ? 'Update Project' : 'Create Project'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

