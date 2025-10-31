'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, DollarSign, FileText, Shield } from 'lucide-react'

interface ProjectTabsProps {
  project: any
  alerts: any[]
}

const tabs = [
  {
    id: 'overview',
    name: 'Overview',
    icon: AlertCircle,
  },
  {
    id: 'cost-guard',
    name: 'Cost Guard',
    icon: DollarSign,
    badge: 'AI',
  },
  {
    id: 'rera',
    name: 'RERA Compliance',
    icon: Shield,
    badge: 'AI',
  },
  {
    id: 'contracts',
    name: 'Contracts',
    icon: FileText,
    badge: 'AI',
  },
]

export function ProjectTabs({ project, alerts }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
                {tab.badge && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-600">No recent alerts. Everything looks good!</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 p-4"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                      <p className="mt-1 text-sm text-slate-600">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cost-guard' && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Cost Guard</h3>
            <p className="mt-2 text-sm text-slate-600">
              Upload Tally CSV to detect duplicates and anomalies
            </p>
            <p className="mt-4 text-xs text-slate-500">Coming in Week 3...</p>
          </div>
        )}

        {activeTab === 'rera' && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">RERA Compliance</h3>
            <p className="mt-2 text-sm text-slate-600">
              Automated monitoring of {project.state} RERA updates
            </p>
            <p className="mt-4 text-xs text-slate-500">Coming in Week 4-5...</p>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Contract Analyzer</h3>
            <p className="mt-2 text-sm text-slate-600">
              AI-powered risk analysis for your contracts
            </p>
            <p className="mt-4 text-xs text-slate-500">Coming in Week 6-7...</p>
          </div>
        )}
      </div>
    </div>
  )
}

