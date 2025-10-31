'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthData {
  overall: number;
  financial: number;
  compliance: number;
  contracts: number;
  cash_flow: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export function FinanceHealthBar() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
    // Refresh every 2 minutes
    const interval = setInterval(fetchHealthData, 120000);
    return () => clearInterval(interval);
  }, []);

  async function fetchHealthData() {
    try {
      const response = await fetch('/api/metrics/health');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  function getProgressColor(score: number) {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'excellent':
        return '🟢';
      case 'good':
        return '🟡';
      case 'warning':
        return '🟠';
      case 'critical':
        return '🔴';
      default:
        return '⚪';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'excellent':
        return 'EXCELLENT - All systems optimal';
      case 'good':
        return 'GOOD - Minor attention needed';
      case 'warning':
        return 'WARNING - Issues detected';
      case 'critical':
        return 'CRITICAL - Immediate action required';
      default:
        return 'UNKNOWN';
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">
              PROJECT FINANCE HEALTH
            </h2>
          </div>
        </div>

        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Overall Score:
            </span>
            <span className="text-3xl font-bold text-gray-900">
              {data.overall}/100
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(data.overall)}`}
              style={{ width: `${data.overall}%` }}
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(data.status)}`}>
          <span>{getStatusIcon(data.status)}</span>
          <span>{getStatusText(data.status)}</span>
        </div>

        {/* Detailed Scores */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Breakdown:</h3>
          
          {/* Financial */}
          <HealthMetric
            label="💰 Financial"
            score={data.financial}
            maxScore={100}
          />

          {/* Compliance */}
          <HealthMetric
            label="📜 Compliance"
            score={data.compliance}
            maxScore={100}
          />

          {/* Contracts */}
          <HealthMetric
            label="⚖️ Contracts"
            score={data.contracts}
            maxScore={100}
          />

          {/* Cash Flow */}
          <HealthMetric
            label="💸 Cash Flow"
            score={data.cash_flow}
            maxScore={100}
          />
        </div>

        {/* Last Updated */}
        <p className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </Card>
  );
}

// Sub-component for individual health metrics
function HealthMetric({
  label,
  score,
  maxScore,
}: {
  label: string;
  score: number;
  maxScore: number;
}) {
  const percentage = (score / maxScore) * 100;
  const colorClass =
    score >= 90
      ? 'bg-green-500'
      : score >= 70
      ? 'bg-yellow-500'
      : score >= 50
      ? 'bg-orange-500'
      : 'bg-red-500';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {score}/{maxScore}
        </span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

