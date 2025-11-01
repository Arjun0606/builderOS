import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TeamMembersList } from '@/components/team/team-members-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default async function TeamPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('organization_id, role, organizations(name, subscription_plan)')
    .eq('id', user.id)
    .single();

  if (!userProfile?.organization_id) {
    redirect('/onboarding');
  }

  // Fetch all team members
  const { data: teamMembers, error } = await supabase
    .from('users')
    .select('*')
    .eq('organization_id', userProfile.organization_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching team members:', error);
  }

  const activeMembers = teamMembers?.filter(m => m.status === 'active').length || 0;
  const pendingMembers = teamMembers?.filter(m => m.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Team Members
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your law firm's team and user permissions.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/team/invite">
            <UserPlus className="mr-2 h-4 w-4" /> Invite Member
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Total Members</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {teamMembers?.length || 0}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Active</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {activeMembers}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-600">Pending Invites</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {pendingMembers}
          </p>
        </div>
      </div>

      {/* Team Members List */}
      <TeamMembersList
        members={teamMembers || []}
        currentUserId={user.id}
        currentUserRole={userProfile.role}
      />
    </div>
  );
}

