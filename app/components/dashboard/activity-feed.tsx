'use client'

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { format } from 'date-fns'
import { Loading } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-message'

interface ActivityItem {
  id: string
  type: 'case' | 'client' | 'document' | 'court_date' | 'time_entry' | 'user'
  action: 'created' | 'updated' | 'deleted' | 'uploaded' | 'completed'
  title: string
  description: string
  user: {
    id: string
    full_name: string
    email: string
  }
  resource_id?: string
  created_at: string
}

export function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/activities?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }
      
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    const colors = {
      case: 'bg-blue-100 text-blue-600',
      client: 'bg-green-100 text-green-600',
      document: 'bg-purple-100 text-purple-600',
      court_date: 'bg-red-100 text-red-600',
      time_entry: 'bg-yellow-100 text-yellow-600',
      user: 'bg-slate-100 text-slate-600',
    }
    
    return colors[type as keyof typeof colors] || colors.user
  }

  if (isLoading) {
    return <Loading text="Loading activities..." />
  }

  if (error) {
    return <ErrorMessage message={error} type="error" onRetry={fetchActivities} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <Activity className="h-6 w-6 text-slate-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
          <p className="text-sm text-slate-500">What's happening in your firm</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${getActivityIcon(
                  activity.type
                )}`}
              >
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                <p className="text-xs text-slate-500">{activity.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-600">{activity.user.full_name}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

