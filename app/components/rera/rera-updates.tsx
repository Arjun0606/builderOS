'use client'

import { useState } from 'react'
import { AlertCircle, AlertTriangle, Info, RefreshCw, ExternalLink } from 'lucide-react'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ReraUpdatesProps {
  updates: any[]
  states: string[]
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

export function ReraUpdates({ updates, states }: ReraUpdatesProps) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Trigger manual RERA check (would call Edge Function)
    setTimeout(() => setRefreshing(false), 2000)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            RERA Updates
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Monitoring {states.length} {states.length === 1 ? 'state' : 'states'}: {states.join(', ')}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')} />
          {refreshing ? 'Checking...' : 'Check Now'}
        </Button>
      </div>

      {updates.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Info className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            All up to date!
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            No RERA updates detected in the last 30 days
          </p>
          <p className="mt-4 text-xs text-slate-500">
            We check daily at 2 AM IST
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {updates.map((update) => {
            const config = severityConfig[update.severity as keyof typeof severityConfig] || severityConfig.info
            const Icon = config.icon

            return (
              <div
                key={update.id}
                className={cn('p-6 transition-colors hover:bg-slate-50', config.bgColor)}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {update.state}
                          </h3>
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase',
                              config.color,
                              config.bgColor
                            )}
                          >
                            {update.severity}
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {update.update_type.replace(/_/g, ' ').toUpperCase()}
                        </p>

                        {update.summary && (
                          <p className="mt-2 text-sm text-slate-600">
                            {update.summary}
                          </p>
                        )}

                        {update.impact_analysis && (
                          <div className="mt-3 rounded-md bg-white p-3 text-sm">
                            <p className="font-medium text-slate-900">Impact:</p>
                            <p className="mt-1 text-slate-700">
                              {update.impact_analysis}
                            </p>
                          </div>
                        )}

                        <p className="mt-3 text-xs text-slate-500">
                          Detected {formatRelativeTime(update.detected_at)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on RERA Website
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* AI Monitoring Status */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>
            AI monitoring active • Next check: Tomorrow at 2:00 AM IST
          </span>
        </div>
      </div>
    </div>
  )
}

