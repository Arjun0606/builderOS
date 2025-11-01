import Link from 'next/link'
import { Plus, Bot, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/clients/new">
          <Button variant="outline" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
        <Link href="/dashboard/cases/new">
          <Button variant="outline" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Add Case
          </Button>
        </Link>
        <Link href="/dashboard/ai-assistant">
          <Button variant="outline" className="w-full justify-start">
            <Bot className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Button>
        </Link>
        <Link href="/dashboard/templates">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Generate Document
          </Button>
        </Link>
      </div>
    </div>
  )
}

