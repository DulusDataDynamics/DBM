import { RevenueChart } from "@/components/app/revenue-chart";
import { InvoiceStatusChart } from "@/components/app/invoice-status-chart";
import { RevenueInsightsGenerator } from "@/components/app/revenue-insights-generator";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Insights</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <InvoiceStatusChart />
        </div>
      </div>
      <div>
        <RevenueInsightsGenerator />
      </div>
    </div>
  );
}
