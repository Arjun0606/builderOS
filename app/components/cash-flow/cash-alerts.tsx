'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CashAlerts() {
  // TODO: Fetch real alerts from Supabase
  const alerts = [
    {
      id: 1,
      severity: 'high',
      type: 'ESCROW_BREACH_RISK',
      title: 'ESCROW LIMIT BREACH RISK',
      message: "You're at 92% of RERA escrow cap",
      action: 'Review withdrawal for steel payment',
      impact: 'RERA can freeze account if you breach 100%',
      link: '/dashboard/cash-flow/escrow'
    },
    {
      id: 2,
      severity: 'medium',
      type: 'LARGE_OUTFLOW',
      title: 'LARGE OUTFLOW NEXT WEEK',
      message: '₹4.8 Cr due to contractors (Nov 5-7)',
      action: 'Ensure sufficient balance in HDFC account',
      impact: 'May need to transfer funds from other accounts',
      link: '/dashboard/cash-flow/schedule'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          AI Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              p-4 rounded-lg border-l-4 
              ${alert.severity === 'high' 
                ? 'bg-red-50 dark:bg-red-950/20 border-red-500' 
                : 'bg-orange-50 dark:bg-orange-950/20 border-orange-500'
              }
            `}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {alert.severity === 'high' ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-400 uppercase">
                      🔴 HIGH PRIORITY
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase">
                      🟡 ATTENTION NEEDED
                    </span>
                  )}
                </div>
                
                <h4 className="font-semibold text-sm">{alert.title}</h4>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Action:</span> {alert.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Impact:</span> {alert.impact}
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link href={alert.link}>
                  View Details
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No alerts at the moment</p>
            <p className="text-xs mt-1">All cash flows are healthy 🎉</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

