'use client';
import { RevenueChart } from "@/components/app/revenue-chart";
import { InvoiceStatusChart } from "@/components/app/invoice-status-chart";
import { RevenueInsightsGenerator } from "@/components/app/revenue-insights-generator";
import { getInvoices } from "@/lib/firestore";
import { Invoice } from "@/lib/types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const invoicesData = await getInvoices();
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Insights</h1>
      {loading ? (
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Skeleton className="lg:col-span-3 h-96" />
            <Skeleton className="lg:col-span-2 h-96" />
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
      <div>
        <RevenueInsightsGenerator invoices={invoices} />
      </div>
    </div>
  );
}
