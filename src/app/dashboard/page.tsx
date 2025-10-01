import { StatsCard } from "@/components/dashboard/stats-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AiAssistant } from "@/components/dashboard/ai-assistant";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export default function DashboardPage() {
    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-6">
                <StatsCard title="Total Revenue" value="$45,231.89" icon={DollarSign} change="+20.1% from last month" changeType="positive" />
                <StatsCard title="New Clients" value="+23" icon={Users} change="+18.1% from last month" changeType="positive" />
                <StatsCard title="Pending Invoices" value="12" icon={CreditCard} change="-2 from last month" changeType="negative" />
                <StatsCard title="Tasks Done" value="53" icon={Activity} change="+19% from last month" changeType="positive" />
            </div>

            <div className="mt-8 grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <SalesChart />
                </div>
                <TasksOverview />
            </div>

            <div className="mt-8 grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <AiAssistant />
                </div>
                <RecentActivity />
            </div>
        </>
    );
}
