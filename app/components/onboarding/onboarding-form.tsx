'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Scale, Loader2, Building2, MapPin, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OnboardingFormProps {
  user: User
}

export function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    // Law Firm Details
    firmName: '',
    fullName: user.email?.split('@')[0] || '',
    role: 'owner',
    phoneNumber: '',
    // Optional
    address: '',
    city: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Step 1: Create organization (law firm)
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.firmName,
          email: user.email,
          address: formData.address || null,
          subscription_plan: 'trial',
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
          phone_number: formData.phoneNumber || null,
          status: 'active',
        })

      if (userError) throw userError

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
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Law Firm Information
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Tell us about your law firm
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="firmName">
              Law Firm Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firmName"
              placeholder="e.g., Kumar & Associates"
              value={formData.firmName}
              onChange={(e) =>
                setFormData({ ...formData, firmName: e.target.value })
              }
              required
              disabled={loading}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">
                Your Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Rajesh Kumar"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="role">
                Your Role <span className="text-red-500">*</span>
              </Label>
              <select
                id="role"
                className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                disabled={loading}
              >
                <option value="owner">Managing Partner</option>
                <option value="admin">Senior Partner</option>
                <option value="lawyer">Lawyer</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              disabled={loading}
              className="h-11"
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g., Mumbai, Delhi, Bangalore"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              disabled={loading}
              className="h-11"
            />
          </div>

          <div>
            <Label htmlFor="address">Office Address (Optional)</Label>
            <Input
              id="address"
              placeholder="e.g., 123 High Court Lane, Fort"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              disabled={loading}
              className="h-11"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
          <Scale className="h-4 w-4" />
          What happens next?
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>✅ Your law firm dashboard will be created</li>
          <li>✅ You'll get access to AI Assistant, Case Management, and more</li>
          <li>✅ 14-day free trial starts (no credit card required)</li>
          <li>✅ You can invite your team members anytime</li>
        </ul>
      </div>

      <Button
        type="submit"
        disabled={loading || !formData.firmName || !formData.fullName}
        className="w-full h-11 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Setting up your firm...
          </>
        ) : (
          <>
            <Building2 className="mr-2 h-5 w-5" />
            Complete Setup & Start Trial
          </>
        )}
      </Button>

      <p className="text-xs text-center text-slate-500">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  )
}
