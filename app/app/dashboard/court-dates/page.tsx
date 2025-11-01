import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CourtDatesCalendar } from '@/components/court-dates/court-dates-calendar';
import { UpcomingHearingsList } from '@/components/court-dates/upcoming-hearings-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export default async function CourtDatesPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!userProfile?.organization_id) {
    redirect('/onboarding');
  }

  const organizationId = userProfile.organization_id;

  // Get current month or use query params
  const now = new Date();
  const currentMonth = searchParams.month ? parseInt(searchParams.month) : now.getMonth() + 1;
  const currentYear = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();

  // Fetch court dates for the month
  const monthStart = startOfMonth(new Date(currentYear, currentMonth - 1));
  const monthEnd = endOfMonth(new Date(currentYear, currentMonth - 1));

  const { data: courtDates, error } = await supabase
    .from('court_dates')
    .select(`
      *,
      cases(
        id,
        case_title,
        case_number,
        clients(full_name, company_name)
      )
    `)
    .eq('organization_id', organizationId)
    .gte('hearing_date', monthStart.toISOString())
    .lte('hearing_date', monthEnd.toISOString())
    .order('hearing_date', { ascending: true });

  // Fetch upcoming hearings (next 30 days)
  const { data: upcomingHearings } = await supabase
    .from('court_dates')
    .select(`
      *,
      cases(
        id,
        case_title,
        case_number,
        clients(full_name, company_name)
      )
    `)
    .eq('organization_id', organizationId)
    .gte('hearing_date', new Date().toISOString())
    .lte('hearing_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('hearing_date', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error fetching court dates:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Court Dates
          </h1>
          <p className="mt-2 text-slate-600">
            Manage all court hearings and never miss a date.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/court-dates/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Court Date
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">Today</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {courtDates?.filter(cd => {
              const hearingDate = new Date(cd.hearing_date);
              return hearingDate.toDateString() === now.toDateString();
            }).length || 0}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">This Week</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {courtDates?.filter(cd => {
              const hearingDate = new Date(cd.hearing_date);
              const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
              return hearingDate >= now && hearingDate <= weekFromNow;
            }).length || 0}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">This Month</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {courtDates?.length || 0}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <CourtDatesCalendar
            courtDates={courtDates || []}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </div>

        {/* Upcoming Hearings Sidebar */}
        <div className="lg:col-span-1">
          <UpcomingHearingsList hearings={upcomingHearings || []} />
        </div>
      </div>
    </div>
  );
}

