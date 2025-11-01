'use client'

import { Activity } from 'lucide-react'

interface CaseTimelineProps {
  caseId: string
}

export function CaseTimeline({ caseId }: CaseTimelineProps) {
  // Placeholder for activity timeline
  const activities = []

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Activity Timeline
      </h2>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">
            No recent activity
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Activity items will go here */}
        </div>
      )}
    </div>
  )
}

