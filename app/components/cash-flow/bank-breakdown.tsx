'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp } from 'lucide-react';

export function BankBreakdown() {
  // TODO: Fetch real bank data from Supabase
  const banks = [
    {
      name: 'HDFC Bank',
      accountType: 'RERA Escrow',
      balance: 182400000,
      percentage: 68.3,
      color: 'bg-blue-500'
    },
    {
      name: 'ICICI Bank',
      accountType: 'Operations',
      balance: 14218450,
      percentage: 5.3,
      color: 'bg-orange-500'
    },
    {
      name: 'Axis Bank',
      accountType: 'Vendor Payments',
      balance: 5200000,
      percentage: 1.9,
      color: 'bg-purple-500'
    },
    {
      name: 'State Bank of India',
      accountType: 'Salaries',
      balance: 2800000,
      percentage: 1.0,
      color: 'bg-green-500'
    },
    {
      name: 'Kotak Mahindra',
      accountType: 'Reserve',
      balance: 1200000,
      percentage: 0.4,
      color: 'bg-red-500'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalBalance = banks.reduce((sum, bank) => sum + bank.balance, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Bank-wise Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {banks.map((bank, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{bank.name}</p>
                  <p className="text-xs text-muted-foreground">{bank.accountType}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(bank.balance)}</p>
                  <p className="text-xs text-muted-foreground">{bank.percentage}% of total</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className={`${bank.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${bank.percentage}%` }}
                />
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Total Cash Position</p>
              <p className="text-xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

