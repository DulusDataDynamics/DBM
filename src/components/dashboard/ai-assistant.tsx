'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeDailyActivity } from '@/ai/flows/summarize-daily-activity';
import { generateBusinessInsights } from '@/ai/flows/generate-business-insights';
import { Lightbulb, Sparkles } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { Task, Invoice, Client } from '@/lib/data';
import { useEffect, useState } from 'react';

async function AiSummary({ tasks, invoices, clients }: { tasks: Task[], invoices: Invoice[], clients: Client[] }) {
    const completedTasks = tasks.filter(t => t.completed).map(t => t.description).join(', ');
    const sentInvoices = invoices.map(i => `Invoice ${i.invoiceNumber} for $${i.amount}`).join(', ');
    const newClients = clients.map(c => c.name).join(', ');

    const summaryResult = await summarizeDailyActivity({
        completedTasks: completedTasks || "None",
        sentInvoices: sentInvoices || "None",
        newClients: newClients || "None",
        financialMetrics: "Not available"
    });
    return (
        <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-2 rounded-full">
                <Sparkles className="h-5 w-5" />
            </div>
            <div>
                <h4 className="font-semibold">Daily Summary</h4>
                <p className="text-sm text-muted-foreground">{summaryResult.summary}</p>
            </div>
        </div>
    );
}

async function AiInsights({ tasks, invoices, clients }: { tasks: Task[], invoices: Invoice[], clients: Client[] }) {
    const salesData = {
        monthlySales: invoices.reduce((acc, inv) => {
            if (inv.status === 'paid') {
                const month = new Date(inv.issueDate).toLocaleString('default', { month: 'short' });
                const existing = acc.find(item => item.month === month);
                if (existing) {
                    existing.sales += inv.amount;
                } else {
                    acc.push({ month, sales: inv.amount });
                }
            }
            return acc;
        }, [] as { month: string, sales: number }[])
    };
    
    const financialData = {
        revenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
        pending: invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0)
    };


    const insightsResult = await generateBusinessInsights({
        salesData: JSON.stringify(salesData),
        financialData: JSON.stringify(financialData),
    });
    return (
         <div className="flex items-start gap-4">
             <div className="bg-accent/10 text-accent p-2 rounded-full">
                <Lightbulb className="h-5 w-5" />
            </div>
            <div>
                <h4 className="font-semibold">Smart Suggestions</h4>
                <p className="text-sm text-muted-foreground">{insightsResult.insights}</p>
            </div>
        </div>
    );
}

export function AiAssistant() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(true);

  const tasksQuery = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/tasks`) : null, [firestore, user]);
  const { data: tasks, isLoading: loadingTasks } = useCollection<Task>(tasksQuery);

  const invoicesQuery = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/invoices`) : null, [firestore, user]);
  const { data: invoices, isLoading: loadingInvoices } = useCollection<Invoice>(invoicesQuery);

  const clientsQuery = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/clients`) : null, [firestore, user]);
  const { data: clients, isLoading: loadingClients } = useCollection<Client>(clientsQuery);
  
  useEffect(() => {
    setLoading(loadingTasks || loadingInvoices || loadingClients);
  }, [loadingTasks, loadingInvoices, loadingClients]);


  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">AI Assistant</CardTitle>
            <CardDescription>Your AI-powered business insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {loading ? <p>Analyzing your data...</p> : (
              <>
                <AiSummary tasks={tasks || []} invoices={invoices || []} clients={clients || []} />
                <AiInsights tasks={tasks || []} invoices={invoices || []} clients={clients || []} />
              </>
            )}
        </CardContent>
    </Card>
  )
}
