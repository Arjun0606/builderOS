'use client'

import Link from 'next/link'
import { FileText, AlertTriangle, Download, CheckCircle, Clock } from 'lucide-react'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ContractsListProps {
  contracts: any[]
}

function getRiskColor(score: number) {
  if (score >= 7) return { bg: 'bg-red-100', text: 'text-red-700', label: 'High Risk' }
  if (score >= 4) return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Medium Risk' }
  return { bg: 'bg-green-100', text: 'text-green-700', label: 'Low Risk' }
}

export function ContractsList({ contracts }: ContractsListProps) {
  if (contracts.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <FileText className="h-6 w-6 text-slate-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No contracts yet
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Upload your first contract to get AI-powered risk analysis
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Contract History
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {contracts.length} {contracts.length === 1 ? 'contract' : 'contracts'} uploaded
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {contracts.map((contract) => {
          const riskColor = contract.risk_score ? getRiskColor(contract.risk_score) : null

          return (
            <Link
              key={contract.id}
              href={`/dashboard/contracts/${contract.id}`}
              className="flex items-start gap-4 p-6 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {contract.counterparty}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {contract.contract_type.replace('_', ' ').toUpperCase()}
                      {contract.projects && ` • ${contract.projects.name}`}
                    </p>
                  </div>

                  {riskColor ? (
                    <div className="flex items-center gap-2">
                      <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', riskColor.bg, riskColor.text)}>
                        {contract.risk_score}/10 {riskColor.label}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <Clock className="h-4 w-4" />
                      <span>Analyzing...</span>
                    </div>
                  )}
                </div>

                {/* Issues Summary */}
                {contract.analyzed_at && (
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    {contract.critical_issues > 0 && (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        {contract.critical_issues} critical
                      </span>
                    )}
                    {contract.moderate_issues > 0 && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        {contract.moderate_issues} moderate
                      </span>
                    )}
                    {contract.low_issues > 0 && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <AlertTriangle className="h-4 w-4" />
                        {contract.low_issues} low
                      </span>
                    )}
                    {contract.critical_issues === 0 && contract.moderate_issues === 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        No issues found
                      </span>
                    )}
                  </div>
                )}

                <p className="mt-3 text-xs text-slate-500">
                  Uploaded {formatRelativeTime(contract.created_at)}
                  {contract.analyzed_at && ` • Analyzed ${formatRelativeTime(contract.analyzed_at)}`}
                </p>
              </div>

              {contract.marked_pdf_url && (
                <Button size="sm" variant="outline" asChild>
                  <a href={contract.marked_pdf_url} download>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

