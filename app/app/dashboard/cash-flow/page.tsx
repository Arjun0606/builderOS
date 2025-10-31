'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { UploadBankData } from '@/components/cash-flow/upload-bank-data';
import { CashPositionCards } from '@/components/cash-flow/cash-position-cards';
import { CashFlowForecast } from '@/components/cash-flow/cash-flow-forecast';
import { BankBreakdown } from '@/components/cash-flow/bank-breakdown';
import { CashAlerts } from '@/components/cash-flow/cash-alerts';

export default function CashFlowPage() {
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cash Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Real-time cash position, AI forecasting, and escrow compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Bank Data
          </Button>
        </div>
      </div>

      {!hasData ? (
        // Empty state - First time user
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Get Started with Cash Command Center</CardTitle>
            <CardDescription>
              Upload your bank statements (CSV) to get instant cash position analysis and AI-powered forecasting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadBankData onUploadComplete={() => setHasData(true)} />
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Consolidated cash position across all bank accounts (HDFC, ICICI, Axis, SBI, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AI-powered cash flow forecasting (30/60/90 days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>RERA escrow compliance tracking and alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Anomaly detection (unusual transactions, escrow breaches)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Main dashboard with data
        <>
          {/* Last Updated Badge */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Last updated: Oct 31, 8:03 AM (just now)</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLoading(true)}>
              Refresh Data
            </Button>
          </div>

          {/* Cash Position Cards */}
          <CashPositionCards />

          {/* Alerts */}
          <CashAlerts />

          {/* AI Forecast */}
          <CashFlowForecast />

          {/* Bank Breakdown */}
          <BankBreakdown />
        </>
      )}
    </div>
  );
}

