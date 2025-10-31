'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, Plus, Check, X } from 'lucide-react';
import { SubscriptionCard } from '@/components/billing/subscription-card';
import { PaymentHistory } from '@/components/billing/payment-history';
import { LicenseManagement } from '@/components/billing/license-management';
import { InvoiceList } from '@/components/billing/invoice-list';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSubscription();
  }, []);

  async function fetchSubscription() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription, licenses, and payment methods
          </p>
        </div>
      </div>

      {/* Current Subscription */}
      <SubscriptionCard subscription={subscription} loading={loading} />

      {/* License Management */}
      <LicenseManagement />

      {/* Payment History */}
      <PaymentHistory />

      {/* Invoices */}
      <InvoiceList />
    </div>
  );
}

