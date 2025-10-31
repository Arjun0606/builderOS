'use client'

import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AlertsListProps {
  alerts: any[]
}

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  important: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
}

export function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Info className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          All clear!
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          No unresolved alerts. Great job keeping things on track.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent Alerts</h2>
        <p className="mt-1 text-sm text-slate-600">
          {alerts.length} unresolved {alerts.length === 1 ? 'alert' : 'alerts'}
        </p>
      </div>
      <div className="divide-y divide-slate-200">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity as keyof typeof severityConfig]
          const Icon = config.icon

          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-4 p-6 transition-colors hover:bg-slate-50',
                config.bgColor
              )}
            >
              <div className={`rounded-full p-2 ${config.bgColor}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {alert.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {alert.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      config.color,
                      config.bgColor
                    )}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {formatRelativeTime(alert.created_at)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

