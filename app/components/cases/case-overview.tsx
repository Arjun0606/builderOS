import { format } from 'date-fns'
import { User, Calendar, Building2, Scale, FileText } from 'lucide-react'

interface CaseOverviewProps {
  caseData: any
}

export function CaseOverview({ caseData }: CaseOverviewProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Case Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">Client</p>
          {caseData.clients ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-900">
                {caseData.clients.name}
              </span>
            </div>
          ) : (
            <span className="text-sm text-slate-600">No client linked</span>
          )}
        </div>

        {/* Lead Lawyer */}
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">Lead Lawyer</p>
          {caseData.users ? (
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-900">
                {caseData.users.full_name}
              </span>
            </div>
          ) : (
            <span className="text-sm text-slate-600">Not assigned</span>
          )}
        </div>

        {/* Court */}
        {caseData.court_name && (
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Court</p>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-900">
                {caseData.court_name}
              </span>
            </div>
          </div>
        )}

        {/* Filing Date */}
        {caseData.filing_date && (
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Filing Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-900">
                {format(new Date(caseData.filing_date), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        )}

        {/* Next Hearing */}
        {caseData.next_hearing_date && (
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Next Hearing</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-900">
                {format(new Date(caseData.next_hearing_date), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        )}

        {/* Judge */}
        {caseData.judge_name && (
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Judge</p>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-900">
                {caseData.judge_name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {caseData.description && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-2">Description</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {caseData.description}
          </p>
        </div>
      )}

      {/* Parties */}
      {(caseData.petitioner_name || caseData.respondent_name) && (
        <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 gap-6">
          {caseData.petitioner_name && (
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Petitioner</p>
              <p className="text-sm font-medium text-slate-900">
                {caseData.petitioner_name}
              </p>
            </div>
          )}
          {caseData.respondent_name && (
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Respondent</p>
              <p className="text-sm font-medium text-slate-900">
                {caseData.respondent_name}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

