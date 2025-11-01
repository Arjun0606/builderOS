import { CourtDateForm } from '@/components/court-dates/court-date-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function NewCourtDatePage() {
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

  // Fetch cases for the dropdown
  const { data: cases, error: casesError } = await supabase
    .from('cases')
    .select('id, case_title, case_number')
    .eq('organization_id', userProfile.organization_id)
    .order('created_at', { ascending: false });

  if (casesError) {
    console.error('Error fetching cases for court date form:', casesError);
    return <div className="p-6">Error loading cases for court date form.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Add Court Date
        </h1>
        <p className="mt-2 text-slate-600">
          Schedule a new court hearing or date for a case.
        </p>
      </div>
      <CourtDateForm organizationId={userProfile.organization_id} cases={cases || []} />
    </div>
  );
}

