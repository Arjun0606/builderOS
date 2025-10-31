'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function CashFlowForecast() {
  // TODO: Get AI forecast data from API
  const forecast = {
    incoming: 125000000,
    outgoing: 82000000,
    net: 43000000,
    projectedBalance: 127618450,
    status: 'healthy'
  };

  const chartData = [
    { month: 'Oct', actual: 234, forecast: null },
    { month: 'Nov', actual: null, forecast: 277 },
    { month: 'Dec', actual: null, forecast: 312 },
    { month: 'Jan', actual: null, forecast: 348 }
  ];

  const formatCrores = (amount: number) => {
    const crores = amount / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          AI Cash Flow Forecast (Next 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Incoming */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Incoming</span>
            </div>
            <div className="text-2xl font-bold">{formatCrores(forecast.incoming)}</div>
            <p className="text-xs text-muted-foreground">Customer bookings</p>
          </div>

          {/* Outgoing */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span>Outgoing</span>
            </div>
            <div className="text-2xl font-bold">{formatCrores(forecast.outgoing)}</div>
            <p className="text-xs text-muted-foreground">Approved payments</p>
          </div>

          {/* Projected Balance */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Projected Balance (Nov 30)</div>
            <div className="text-2xl font-bold text-primary">{formatCrores(forecast.projectedBalance)}</div>
            <div className="flex items-center gap-1">
              <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                🟢 HEALTHY
              </span>
              <span className="text-xs text-muted-foreground">No cash crunch expected</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                label={{ value: '₹ Cr', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Actual"
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="AI Forecast"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
            AI Insights:
          </p>
          <ul className="text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc text-xs">
            <li>Cash inflow expected to increase 15% due to festival season bookings</li>
            <li>Major contractor payment (₹4.8 Cr) scheduled for Nov 5-7</li>
            <li>Recommended action: Keep ₹5 Cr buffer in HDFC account</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

