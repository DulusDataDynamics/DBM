'use client';
import { RevenueChart } from "@/components/app/revenue-chart";
import { InvoiceStatusChart } from "@/components/app/invoice-status-chart";
import { subscribeToInvoices } from "@/lib/firestore";
import { Invoice } from "@/lib/types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToInvoices((invoicesData) => {
      setInvoices(invoicesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Insights</h1>
      {loading ? (
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-2">
              <p className="text-sm text-muted-foreground animate-pulse">Analyzing revenue data...</p>
              <Skeleton className="h-96" />
            </div>
            <div className="lg:col-span-2 space-y-2">
              <p className="text-sm text-muted-foreground animate-pulse">Checking invoice statuses...</p>
              <Skeleton className="h-96" />
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RevenueChart invoices={invoices} />
          </div>
          <div className="lg:col-span-2">
            <InvoiceStatusChart invoices={invoices} />
          </div>
        </div>
      )}
       <Card>
        <CardHeader>
            <CardTitle>Additional Reports</CardTitle>
            <CardDescription>More detailed reports and data exports will be available here soon.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-6 text-center">
                <p className="text-muted-foreground">Coming soon...</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
