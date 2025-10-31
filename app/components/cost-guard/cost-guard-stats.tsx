'use client'

import { AlertTriangle, CheckCircle, DollarSign, FileText } from 'lucide-react'
import { formatCurrency, formatLakhs } from '@/lib/utils'

interface CostGuardStatsProps {
  totalInvoices: number
  flaggedCount: number
  totalSaved: number
}

export function CostGuardStats({ totalInvoices, flaggedCount, totalSaved }: CostGuardStatsProps) {
  const stats = [
    {
      name: 'Total Invoices',
      value: totalInvoices.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Anomalies Detected',
      value: flaggedCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Amount Saved',
      value: totalSaved > 100000 ? formatLakhs(totalSaved) : formatCurrency(totalSaved),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Clean Invoices',
      value: (totalInvoices - flaggedCount).toLocaleString(),
      icon: CheckCircle,
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

