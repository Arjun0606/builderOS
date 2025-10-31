'use client'

import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'
import { cn, formatCrores } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ProjectHealthCardsProps {
  projects: any[]
}

function getHealthColor(score: number) {
  if (score >= 90) return { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' }
  if (score >= 70) return { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' }
  return { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' }
}

export function ProjectHealthCards({ projects }: ProjectHealthCardsProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Building2 className="h-6 w-6 text-slate-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No projects yet
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Get started by creating your first project
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/projects/new">Create Project</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your Projects</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projects">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 6).map((project) => {
          // Mock health score (will be calculated from database function)
          const healthScore = Math.floor(Math.random() * 30) + 70
          const colors = getHealthColor(healthScore)

          return (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    RERA: {project.rera_id}
                  </p>
                  {project.budget && (
                    <p className="mt-1 text-sm text-slate-600">
                      Budget: {formatCrores(project.budget)}
                    </p>
                  )}
                </div>
                <div className={cn('rounded-full px-3 py-1 text-xs font-semibold', colors.bg, colors.text)}>
                  {healthScore}
                </div>
              </div>

              {/* Health Score Bar */}
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

              {/* State Badge */}
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {project.state}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

