'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AnomaliesListProps {
  invoices: any[]
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
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

export function AnomaliesList({ invoices }: AnomaliesListProps) {
  const router = useRouter()
  const [resolving, setResolving] = useState<string | null>(null)

  const handleResolve = async (invoiceId: string, action: 'mark_false_positive' | 'confirm') => {
    setResolving(invoiceId)

    try {
      const supabase = createClient()

      // Update invoice
      await supabase
        .from('invoices')
        .update({
          flagged_by_cost_guard: action === 'mark_false_positive' ? false : true,
          is_duplicate: action === 'confirm' ? true : false,
        })
        .eq('id', invoiceId)

      router.refresh()
    } catch (err) {
      console.error('Failed to resolve:', err)
    } finally {
      setResolving(null)
    }
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No anomalies detected
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          All invoices look good! Upload more data to continue monitoring.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Detected Anomalies
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {invoices.length} {invoices.length === 1 ? 'issue' : 'issues'} flagged by AI
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {invoices.map((invoice) => {
          const severity = invoice.is_duplicate ? 'critical' : invoice.confidence_score > 80 ? 'important' : 'info'
          const config = severityConfig[severity]
          const Icon = config.icon

          return (
            <div
              key={invoice.id}
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
                          {invoice.supplier}
                        </h3>
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                            config.color,
                            config.bgColor
                          )}
                        >
                          {invoice.is_duplicate ? 'DUPLICATE' : 'ANOMALY'}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium">Amount:</span> {formatCurrency(invoice.amount)}
                        </p>
                        <p>
                          <span className="font-medium">Invoice #:</span> {invoice.invoice_number}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> {formatDate(invoice.date)}
                        </p>
                        {invoice.projects && (
                          <p>
                            <span className="font-medium">Project:</span> {invoice.projects.name}
                          </p>
                        )}
                      </div>

                      {invoice.flag_reason && (
                        <div className="mt-3 rounded-md bg-white p-3 text-sm text-slate-700">
                          <p className="font-medium">Reason:</p>
                          <p className="mt-1">{invoice.flag_reason}</p>
                        </div>
                      )}

                      {invoice.confidence_score && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            AI Confidence:
                          </span>
                          <div className="h-2 w-32 rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${invoice.confidence_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-700">
                            {invoice.confidence_score}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleResolve(invoice.id, 'confirm')}
                      disabled={resolving === invoice.id}
                    >
                      {resolving === invoice.id ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm {invoice.is_duplicate ? 'Duplicate' : 'Issue'}
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(invoice.id, 'mark_false_positive')}
                      disabled={resolving === invoice.id}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Mark as False Positive
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

