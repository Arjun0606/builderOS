'use client'

import { Clock, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Hearing {
  id: string;
  hearing_date: string;
  hearing_time: string;
  court_name: string;
  court_location: string;
  hearing_type: string;
  purpose: string;
  cases: {
    id: string;
    case_title: string;
    case_number: string;
    clients: {
      full_name: string | null;
      company_name: string | null;
    };
  };
}

interface UpcomingHearingsListProps {
  hearings: Hearing[];
}

export function UpcomingHearingsList({ hearings }: UpcomingHearingsListProps) {
  if (!hearings || hearings.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Upcoming Hearings
        </h2>
        <div className="text-center py-8 text-slate-500">
          <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No upcoming hearings in the next 30 days</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Upcoming Hearings ({hearings.length})
      </h2>

      <div className="space-y-4">
        {hearings.map(hearing => {
          const hearingDate = new Date(hearing.hearing_date);
          const isUrgent = hearingDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000; // Less than 3 days

          return (
            <Link
              key={hearing.id}
              href={`/dashboard/court-dates/${hearing.id}`}
              className="block border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              {/* Date */}
              <div className={`flex items-center gap-2 mb-2 ${isUrgent ? 'text-red-600' : 'text-slate-900'}`}>
                <Clock className="h-4 w-4" />
                <span className="font-semibold">
                  {format(hearingDate, 'MMM d, yyyy')} at {hearing.hearing_time}
                </span>
                {isUrgent && (
                  <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    URGENT
                  </span>
                )}
              </div>

              {/* Case */}
              <div className="flex items-start gap-2 mb-2">
                <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {hearing.cases.case_title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {hearing.cases.case_number}
                  </p>
                </div>
              </div>

              {/* Court */}
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{hearing.court_name}</p>
                  {hearing.court_location && (
                    <p className="text-xs text-slate-500">{hearing.court_location}</p>
                  )}
                </div>
              </div>

              {/* Purpose */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  <span className="font-medium">{hearing.hearing_type}</span>
                  {hearing.purpose && ` - ${hearing.purpose}`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

