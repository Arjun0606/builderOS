'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, AlertTriangle } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: any;
  loading: boolean;
}

export function SubscriptionCard({ subscription, loading }: SubscriptionCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const plan = {
    name: 'BuilderOS Pro',
    price: 100000, // ₹1,00,000
    projects: subscription?.project_count || 1,
    licenses: subscription?.license_count || 10,
    status: subscription?.status || 'active'
  };

  const extraLicenses = Math.max(0, plan.licenses - 10);
  const extraLicenseCost = extraLicenses * 15000;
  const totalCost = (plan.price * plan.projects) + extraLicenseCost;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Current Subscription
              <Badge variant={plan.status === 'active' ? 'default' : 'destructive'}>
                {plan.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              {plan.status === 'active' 
                ? `Next billing date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}`
                : 'Your subscription is not active'
              }
            </CardDescription>
          </div>
          <Button variant="outline">
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg">{plan.name}</h4>
              <p className="text-3xl font-bold mt-2">
                ₹{(totalCost / 100000).toFixed(2)} L
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{plan.projects} Active Project{plan.projects > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{plan.licenses} User Licenses</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>All 3 AI Features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Multi-Project Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>WhatsApp + Email Support</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold">Cost Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span>Base ({plan.projects} project{plan.projects > 1 ? 's' : ''} × ₹1L)</span>
                <span className="font-medium">₹{(plan.price * plan.projects / 100000).toFixed(2)} L</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Included Licenses (10 per project)</span>
                <span className="font-medium">₹0</span>
              </div>
              {extraLicenses > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Extra Licenses ({extraLicenses} × ₹15K)</span>
                  <span className="font-medium">₹{(extraLicenseCost / 100000).toFixed(2)} L</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-primary/20">
                <span className="font-semibold">Total (Monthly)</span>
                <span className="text-xl font-bold">₹{(totalCost / 100000).toFixed(2)} L</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                Add Project
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Manage Licenses
              </Button>
            </div>
          </div>
        </div>

        {/* Trial/Warning Messages */}
        {plan.status !== 'active' && (
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900 dark:text-orange-100">
                  Subscription Inactive
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Please update your payment method to continue using BuilderOS.
                </p>
                <Button variant="default" size="sm" className="mt-3">
                  Activate Subscription
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

