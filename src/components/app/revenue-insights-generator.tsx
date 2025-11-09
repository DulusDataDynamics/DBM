'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb, Sparkles } from 'lucide-react';
import { getRevenueInsights } from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';
import { Invoice } from '@/lib/types';

interface RevenueInsightsGeneratorProps {
    invoices: Invoice[];
}

export function RevenueInsightsGenerator({ invoices }: RevenueInsightsGeneratorProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await getRevenueInsights(invoices);
      setInsight(result.insight);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>AI-Powered Revenue Insights</CardTitle>
            <CardDescription>
              Generate insights from your revenue and invoice data.
            </CardDescription>
          </div>
          <Button onClick={handleGenerate} disabled={isPending || invoices.length === 0} size="sm" variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            {isPending ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[150px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-6">
          {isPending ? (
            <div className="space-y-3 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          ) : insight ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Lightbulb className="h-6 w-6" />
              </div>
              <p className="text-sm text-foreground">{insight}</p>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
                {invoices.length === 0 
                ? 'Waiting for invoice data to generate insights.'
                : 'Click "Generate" to get AI-powered insights.'
                }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
