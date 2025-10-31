'use client'

import Link from 'next/link'
import { Building2, AlertCircle, MapPin, Calendar } from 'lucide-react'
import { formatCrores, formatDate, cn } from '@/lib/utils'

interface ProjectCardProps {
  project: any
}

function getHealthScore(project: any): number {
  // Mock calculation - will use DB function later
  const baseScore = 85
  const alertPenalty = Math.min(project.unresolvedAlerts * 5, 30)
  return Math.max(baseScore - alertPenalty, 0)
}

function getHealthColor(score: number) {
  if (score >= 90) return { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' }
  if (score >= 70) return { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' }
  return { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const healthScore = getHealthScore(project)
  const colors = getHealthColor(healthScore)

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group block rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
              {project.name}
            </h3>
            <p className="text-sm text-slate-600">RERA: {project.rera_id}</p>
          </div>
        </div>
        
        {/* Health Score Badge */}
        <div className={cn('rounded-full px-3 py-1 text-sm font-semibold', colors.bg, colors.text)}>
          {healthScore}
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4" />
          <span>{project.state}</span>
        </div>
        
        {project.budget && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">Budget:</span>
            <span>{formatCrores(project.budget * 10000000)}</span>
          </div>
        )}

        {project.target_completion && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>Target: {formatDate(project.target_completion)}</span>
          </div>
        )}
      </div>

      {/* Health Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Health Score</span>
          <span className={cn('font-semibold', colors.text)}>
            {healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Needs Attention'}
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
          <div
            className={cn('h-2 rounded-full transition-all', colors.bar)}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Alerts */}
      {project.unresolvedAlerts > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span>{project.unresolvedAlerts} unresolved {project.unresolvedAlerts === 1 ? 'alert' : 'alerts'}</span>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Created {formatDate(project.created_at)}
        </p>
      </div>
    </Link>
  )
}

