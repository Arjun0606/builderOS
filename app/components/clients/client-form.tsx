'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface ClientFormProps {
  organizationId: string
  userId: string
  client?: any
}

export function ClientForm({ organizationId, userId, client }: ClientFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientType, setClientType] = useState<'individual' | 'company'>(
    client?.type || 'individual'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const clientData = {
      organization_id: organizationId,
      name: formData.get('name') as string,
      type: clientType,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      address: formData.get('address') as string || null,
      city: formData.get('city') as string || null,
      state: formData.get('state') as string || null,
      pincode: formData.get('pincode') as string || null,
      notes: formData.get('notes') as string || null,
      created_by: userId,
    }

    // Add individual-specific fields
    if (clientType === 'individual') {
      Object.assign(clientData, {
        pan: formData.get('pan') as string || null,
      })
    }

    // Add company-specific fields
    if (clientType === 'company') {
      Object.assign(clientData, {
        company_name: formData.get('company_name') as string || null,
        company_cin: formData.get('company_cin') as string || null,
        company_pan: formData.get('company_pan') as string || null,
        company_gstin: formData.get('company_gstin') as string || null,
      })
    }

    try {
      let result

      if (client) {
        // Update existing client
        result = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', client.id)
          .select()
          .single()
      } else {
        // Create new client
        result = await supabase
          .from('clients')
          .insert([clientData])
          .select()
          .single()
      }

      if (result.error) throw result.error

      router.push(`/dashboard/clients/${result.data.id}`)
      router.refresh()
    } catch (err: any) {
      console.error('Error saving client:', err)
      setError(err.message || 'Failed to save client')
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

      {/* Client Type */}
      <div className="space-y-2">
        <Label>Client Type</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="individual"
              checked={clientType === 'individual'}
              onChange={() => setClientType('individual')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-slate-700">
              Individual
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="company"
              checked={clientType === 'company'}
              onChange={() => setClientType('company')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-slate-700">Company</span>
          </label>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              {clientType === 'individual' ? 'Full Name' : 'Contact Person Name'} *
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={client?.name}
              placeholder="John Doe"
            />
          </div>

          {clientType === 'company' && (
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                name="company_name"
                required
                defaultValue={client?.company_name}
                placeholder="ABC Pvt Ltd"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={client?.email}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={client?.phone}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Tax Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {clientType === 'individual' ? (
            <div className="space-y-2">
              <Label htmlFor="pan">PAN</Label>
              <Input
                id="pan"
                name="pan"
                defaultValue={client?.pan}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="company_pan">Company PAN</Label>
                <Input
                  id="company_pan"
                  name="company_pan"
                  defaultValue={client?.company_pan}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_cin">CIN</Label>
                <Input
                  id="company_cin"
                  name="company_cin"
                  defaultValue={client?.company_cin}
                  placeholder="U12345MH2020PTC123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_gstin">GSTIN</Label>
                <Input
                  id="company_gstin"
                  name="company_gstin"
                  defaultValue={client?.company_gstin}
                  placeholder="27ABCDE1234F1Z5"
                  maxLength={15}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Address</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={client?.address}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                defaultValue={client?.city}
                placeholder="Mumbai"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                defaultValue={client?.state}
                placeholder="Maharashtra"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                defaultValue={client?.pincode}
                placeholder="400001"
                maxLength={6}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={client?.notes}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Additional notes about this client..."
        />
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
          {client ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  )
}

