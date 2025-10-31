'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Lock, Unlock, DollarSign } from 'lucide-react';

export function CashPositionCards() {
  // TODO: Fetch real data from Supabase
  const data = {
    totalCash: 23418450,
    escrowBalance: 182400000,
    escrowWithdrawable: 61200000,
    netAvailable: 84618450,
    trend: 12 // percentage change from last month
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCrores = (amount: number) => {
    const crores = amount / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Available Cash */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCrores(data.totalCash)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all bank accounts
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-500 font-medium">
              +{data.trend}% from last month
            </span>
          </div>
        </CardContent>
      </Card>

      {/* RERA Escrow Balance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RERA Escrow</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCrores(data.escrowBalance)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Locked for construction
          </p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Utilization</span>
              <span className="font-medium">65.4%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '65.4%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawable Escrow */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Escrow Withdrawable</CardTitle>
          <Unlock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCrores(data.escrowWithdrawable)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Available for construction expenses
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            ✓ Within RERA limits
          </p>
        </CardContent>
      </Card>

      {/* Net Available */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Available</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatCrores(data.netAvailable)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total operational funds
          </p>
          <p className="text-xs font-medium mt-2">
            = Available + Withdrawable Escrow
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

