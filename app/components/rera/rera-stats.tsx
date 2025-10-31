'use client'

import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface ReraStatsProps {
  projects: any[]
  updates: any[]
}

export function ReraStats({ projects, updates }: ReraStatsProps) {
  const criticalUpdates = updates.filter(u => u.severity === 'critical').length
  const recentUpdates = updates.filter(u => {
    const detected = new Date(u.detected_at)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return detected > sevenDaysAgo
  }).length

  // Mock upcoming QPRs (would be calculated from project data)
  const upcomingQprs = projects.filter(p => {
    // Placeholder logic - in production, calculate based on project timeline
    return Math.random() > 0.7
  }).length

  const stats = [
    {
      name: 'Monitored Projects',
      value: projects.length,
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Critical Updates',
      value: criticalUpdates,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Updates (7 days)',
      value: recentUpdates,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Upcoming QPRs',
      value: upcomingQprs,
      icon: Clock,
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

