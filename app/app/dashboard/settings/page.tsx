import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/settings/settings-form';
import { OrganizationSettings } from '@/components/settings/organization-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single();

  if (!userProfile?.organization_id) {
    redirect('/onboarding');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-2 text-slate-600">
          Manage your account and organization settings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <SettingsForm user={user} userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="organization">
          <OrganizationSettings organization={userProfile.organizations} />
        </TabsContent>

        <TabsContent value="billing">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Billing & Subscription
            </h2>
            <p className="text-sm text-slate-600">
              Coming soon: Manage your subscription, payment methods, and invoices.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

