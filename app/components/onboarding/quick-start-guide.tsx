'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuickStartTask {
  id: string
  title: string
  description: string
  link: string
}

const QUICK_START_TASKS: QuickStartTask[] = [
  {
    id: 'add-client',
    title: 'Add your first client',
    description: 'Start by adding client information',
    link: '/dashboard/clients/new',
  },
  {
    id: 'create-case',
    title: 'Create a case',
    description: 'Add a case and link it to a client',
    link: '/dashboard/cases/new',
  },
  {
    id: 'try-ai',
    title: 'Try the AI Assistant',
    description: 'Ask a legal question or draft a document',
    link: '/dashboard/ai-assistant',
  },
  {
    id: 'upload-knowledge',
    title: 'Upload firm documents',
    description: 'Build your knowledge base with past cases',
    link: '/dashboard/knowledge-base',
  },
]

export function QuickStartGuide() {
  const [isOpen, setIsOpen] = useState(true)
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legalos-quick-start')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const toggleTask = (taskId: string) => {
    const updated = completedTasks.includes(taskId)
      ? completedTasks.filter((id) => id !== taskId)
      : [...completedTasks, taskId]
    setCompletedTasks(updated)
    localStorage.setItem('legalos-quick-start', JSON.stringify(updated))
  }

  const allCompleted = completedTasks.length === QUICK_START_TASKS.length

  if (!isOpen) {
    return null
  }

  if (allCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900">
              🎉 Quick Start Complete!
            </h3>
            <p className="mt-2 text-sm text-green-700">
              You've completed all the initial setup tasks. You're ready to use LegalOS!
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">Quick Start Guide</h3>
          <p className="mt-1 text-sm text-blue-700">
            Complete these tasks to get the most out of LegalOS
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        {QUICK_START_TASKS.map((task) => {
          const isCompleted = completedTasks.includes(task.id)
          return (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 flex-shrink-0"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <a
                  href={task.link}
                  className={`font-medium hover:text-blue-600 ${
                    isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </a>
                <p className="text-sm text-slate-600 mt-1">{task.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-700">
            {completedTasks.length} of {QUICK_START_TASKS.length} completed
          </span>
          <div className="flex gap-1">
            {QUICK_START_TASKS.map((task, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded ${
                  completedTasks.includes(task.id) ? 'bg-blue-600' : 'bg-blue-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

