'use client';

import { StatsCard } from "@/components/dashboard/stats-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AiAssistant } from "@/components/dashboard/ai-assistant";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import type { Invoice, Client, Task, Settings } from "@/lib/data";
import { useMemo } from "react";
import { getCurrencySymbol } from "@/lib/utils";

export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const invoicesQuery = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/invoices`);
    }, [firestore, user]);
    const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);

    const clientsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/clients`);
    }, [firestore, user]);
    const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);
    
    const tasksQuery = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/tasks`);
    }, [firestore, user]);
    const { data: tasks, isLoading: isLoadingTasks } = useCollection<Task>(tasksQuery);

    const settingsDocRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, `users/${user.uid}/settings/appSettings`);
    }, [firestore, user]);
    const { data: settings, isLoading: isLoadingSettings } = useDoc<Settings>(settingsDocRef);

    const totalRevenue = useMemo(() => {
        return invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0) || 0;
    }, [invoices]);

    const pendingInvoices = useMemo(() => {
        return invoices?.filter(inv => inv.status === 'unpaid').length || 0;
    }, [invoices]);

    const tasksDone = useMemo(() => {
        return tasks?.filter(t => t.completed).length || 0;
    }, [tasks]);

    const currencySymbol = useMemo(() => getCurrencySymbol(settings?.currency || 'zar'), [settings]);

    const isLoading = isLoadingInvoices || isLoadingClients || isLoadingTasks || isLoadingSettings;

    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-6">
                <StatsCard 
                    title="Total Revenue" 
                    value={isLoading ? '...' : `${currencySymbol}${totalRevenue.toFixed(2)}`} 
                    icon={DollarSign} 
                />
                <StatsCard 
                    title="New Clients" 
                    value={isLoading ? '...' : `+${clients?.length || 0}`} 
                    icon={Users} 
                />
                <StatsCard 
                    title="Pending Invoices" 
                    value={isLoading ? '...' : `${pendingInvoices}`} 
                    icon={CreditCard} 
                />
                <StatsCard 
                    title="Tasks Done" 
                    value={isLoading ? '...' : `${tasksDone}`} 
                    icon={Activity} 
                />
            </div>

            <div className="mt-8 grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <SalesChart invoices={invoices} isLoading={isLoadingInvoices}/>
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
