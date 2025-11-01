'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface CaseTasksProps {
  caseId: string
  tasks: any[]
}

export function CaseTasks({ caseId, tasks }: CaseTasksProps) {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed')

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {pendingTasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <p className="mt-4 text-sm text-slate-600">
            All tasks completed!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pendingTasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
            >
              <button className="mt-0.5">
                <Circle className="h-5 w-5 text-slate-400" />
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {task.title}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-600">
                  {task.due_date && (
                    <span>Due: {format(new Date(task.due_date), 'MMM d')}</span>
                  )}
                  {task.assigned_to && (
                    <span>· {task.assigned_to.full_name}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {pendingTasks.length > 5 && (
            <Button variant="outline" className="w-full" size="sm">
              View All {pendingTasks.length} Tasks
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

