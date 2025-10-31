'use client'

import { AlertCircle, Building2, CheckCircle, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface OverviewStatsProps {
  projects: any[]
  alerts: any[]
}

export function OverviewStats({ projects, alerts }: OverviewStatsProps) {
  const totalProjects = projects.length
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  
  const stats = [
    {
      name: 'Total Projects',
      value: totalProjects,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Critical Alerts',
      value: criticalAlerts,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Portfolio Value',
      value: formatCurrency(totalBudget),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Resolved This Month',
      value: 12, // Placeholder
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600">{stat.name}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
            <div className={`rounded-full p-3 ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

