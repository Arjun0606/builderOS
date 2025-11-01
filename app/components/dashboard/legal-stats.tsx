import { Users, Briefcase, Calendar, Scale } from 'lucide-react'

interface LegalStatsProps {
  stats: {
    totalClients: number
    totalCases: number
    activeCases: number
    upcomingHearings: number
  }
}

export function LegalStats({ stats }: LegalStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Clients</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.totalClients}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Cases</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.totalCases}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Briefcase className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Active Cases</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.activeCases}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Scale className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">
              Upcoming Hearings
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.upcomingHearings}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

