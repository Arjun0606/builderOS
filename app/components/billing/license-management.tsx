'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, X, Mail } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function LicenseManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const activeLicenses = users.filter(u => u.status === 'active').length;
  const includedLicenses = 10;
  const extraLicenses = Math.max(0, activeLicenses - includedLicenses);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              License Management
            </CardTitle>
            <CardDescription>
              Manage user licenses and team access
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* License Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Active Licenses</p>
            <p className="text-2xl font-bold mt-1">{activeLicenses}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Included (Free)</p>
            <p className="text-2xl font-bold mt-1">{includedLicenses}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Extra Licenses</p>
            <p className="text-2xl font-bold mt-1">{extraLicenses}</p>
            {extraLicenses > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                +₹{(extraLicenses * 15000 / 1000).toFixed(0)}K/month
              </p>
            )}
          </div>
        </div>

        {/* User List */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm mb-3">Active Users</h4>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No users yet</p>
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Invite your first user
              </Button>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.full_name || 'No name'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={user.role === 'owner' ? 'default' : 'outline'}>
                    {user.role || 'User'}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status || 'Active'}
                  </Badge>
                  {user.role !== 'owner' && (
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

