'use client'

import { Building2, Mail, MapPin } from 'lucide-react';

interface OrganizationSettingsProps {
  organization: any;
}

export function OrganizationSettings({ organization }: OrganizationSettingsProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Organization Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Organization Name
            </label>
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
              <Building2 className="h-5 w-5 text-slate-500" />
              <span className="text-sm text-slate-900">{organization.name}</span>
            </div>
          </div>

          {organization.email && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Email
              </label>
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
                <Mail className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-900">{organization.email}</span>
              </div>
            </div>
          )}

          {organization.address && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
                <MapPin className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-900">{organization.address}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subscription Plan
            </label>
            <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-sm font-medium text-blue-700">
                {organization.subscription_plan || 'Trial'}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          To update organization details, contact support at support@legalos.in
        </p>
      </div>
    </div>
  );
}

