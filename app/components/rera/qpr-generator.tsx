'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Download, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate, cn } from '@/lib/utils'

interface QprGeneratorProps {
  projects: any[]
  qprDrafts: any[]
}

export function QprGenerator({ projects, qprDrafts }: QprGeneratorProps) {
  const [selectedProject, setSelectedProject] = useState<string>('')

  const getQprStatus = (project: any) => {
    // Mock logic - in production, calculate based on project timeline
    const random = Math.random()
    if (random > 0.7) return { status: 'due', daysLeft: 3, color: 'text-red-600' }
    if (random > 0.4) return { status: 'upcoming', daysLeft: 15, color: 'text-orange-600' }
    return { status: 'ok', daysLeft: 45, color: 'text-green-600' }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Generate QPR */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Generate QPR
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Auto-generate Quarterly Progress Report from your data
            </p>
          </div>
          <FileText className="h-6 w-6 text-slate-400" />
        </div>

        <div className="mt-6 space-y-4">
          {/* Project Selection */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Select Project
            </label>
            <select
              className="mt-2 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Choose a project...</option>
              {projects.map((project) => {
                const status = getQprStatus(project)
                return (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.state}) - QPR due in {status.daysLeft} days
                  </option>
                )
              })}
            </select>
          </div>

          {/* Quarter Selection */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Quarter
            </label>
            <select
              className="mt-2 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
              disabled={!selectedProject}
            >
              <option>Q4-2025 (Oct-Dec)</option>
              <option>Q3-2025 (Jul-Sep)</option>
              <option>Q2-2025 (Apr-Jun)</option>
              <option>Q1-2025 (Jan-Mar)</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">What we'll include:</p>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>✓ Financial data from Cost Guard</li>
              <li>✓ Physical progress (you'll review)</li>
              <li>✓ Contractor payments</li>
              <li>✓ Compliance checks</li>
            </ul>
          </div>

          {/* Generate Button */}
          <Button
            className="w-full"
            disabled={!selectedProject}
          >
            <Plus className="mr-2 h-4 w-4" />
            Generate Draft QPR
          </Button>

          <p className="text-xs text-center text-slate-500">
            Takes ~30 seconds • You'll review before submission
          </p>
        </div>
      </div>

      {/* Recent QPRs */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent QPRs
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Drafts and submitted reports
            </p>
          </div>
        </div>

        <div className="mt-6">
          {qprDrafts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-sm text-slate-600">
                No QPRs yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Generate your first QPR to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {qprDrafts.map((qpr) => {
                const statusConfig = {
                  draft: { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Draft' },
                  reviewed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Reviewed' },
                  submitted: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Submitted' },
                }
                const config = statusConfig[qpr.status as keyof typeof statusConfig] || statusConfig.draft
                const Icon = config.icon

                return (
                  <div
                    key={qpr.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('rounded-full p-2', config.bg)}>
                        <Icon className={cn('h-4 w-4', config.color)} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {qpr.projects?.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {qpr.quarter} • {formatDate(qpr.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', config.color, config.bg)}>
                        {config.label}
                      </span>
                      {qpr.pdf_url && (
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Project Status Overview */}
        {projects.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="text-sm font-medium text-slate-700 mb-3">
              QPR Status by Project:
            </p>
            <div className="space-y-2">
              {projects.slice(0, 5).map((project) => {
                const status = getQprStatus(project)
                return (
                  <div key={project.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{project.name}</span>
                    <span className={cn('font-medium', status.color)}>
                      {status.daysLeft} days
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

