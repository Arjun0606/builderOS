'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, IndianRupee, Sparkles } from 'lucide-react';

interface ROIData {
  this_week: {
    cost_guard: number;
    rera: number;
    contracts: number;
    cash: number;
    total: number;
  };
  this_month: {
    cost_guard: number;
    rera: number;
    contracts: number;
    cash: number;
    total: number;
  };
  all_time: {
    cost_guard: number;
    rera: number;
    contracts: number;
    cash: number;
    total: number;
  };
  roi: number;
  builderos_cost: number;
}

export function ROIMonitor() {
  const [data, setData] = useState<ROIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    fetchROIData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchROIData, 300000);
    return () => clearInterval(interval);
  }, []);

  async function fetchROIData() {
    try {
      const response = await fetch('/api/metrics/roi');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching ROI data:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number): string {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return `₹${(amount / 1000).toFixed(0)} K`;
    }
  }

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded w-32 mb-4"></div>
          <div className="h-8 bg-green-200 rounded w-24"></div>
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setShowBreakdown(!showBreakdown)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-semibold text-green-900">
              YOUR BUILDEROS SAVINGS
            </h3>
          </div>
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>

        {/* Main Savings Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-700">THIS WEEK:</span>
            <span className="text-lg font-bold text-green-900">
              {formatCurrency(data.this_week.total)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-700">THIS MONTH:</span>
            <span className="text-2xl font-bold text-green-900">
              {formatCurrency(data.this_month.total)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-green-200 pt-2">
            <span className="text-sm font-semibold text-green-800">ALL TIME:</span>
            <span className="text-3xl font-bold text-green-900">
              {formatCurrency(data.all_time.total)} 📈
            </span>
          </div>
        </div>

        {/* ROI */}
        <div className="bg-white/50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700">ROI:</span>
            <span className="text-xl font-bold text-green-900">
              {data.roi.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Breakdown (Collapsible) */}
        {showBreakdown && (
          <div className="space-y-2 pt-2 border-t border-green-200 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">💰 Cost Guard:</span>
              <span className="font-semibold text-green-900">
                {formatCurrency(data.this_month.cost_guard)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">📜 RERA Compliance:</span>
              <span className="font-semibold text-green-900">
                {formatCurrency(data.this_month.rera)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">⚖️ Contracts:</span>
              <span className="font-semibold text-green-900">
                {formatCurrency(data.this_month.contracts)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">💸 Cash Flow:</span>
              <span className="font-semibold text-green-900">
                {formatCurrency(data.this_month.cash)}
              </span>
            </div>
          </div>
        )}

        {/* Click Hint */}
        <p className="text-xs text-center text-green-600 opacity-70">
          {showBreakdown ? '▲ Click to collapse' : '▼ Click for breakdown'}
        </p>
      </div>
    </Card>
  );
}

