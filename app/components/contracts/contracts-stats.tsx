'use client'

import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface ContractsStatsProps {
  totalContracts: number
  analyzedContracts: number
  highRiskContracts: number
}

export function ContractsStats({ 
  totalContracts, 
  analyzedContracts,
  highRiskContracts 
}: ContractsStatsProps) {
  const stats = [
    {
      name: 'Total Contracts',
      value: totalContracts,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Analyzed',
      value: analyzedContracts,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'High Risk',
      value: highRiskContracts,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Pending Review',
      value: totalContracts - analyzedContracts,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
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

