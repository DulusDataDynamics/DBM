'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/app/stat-card';
import { RevenueChart } from '@/components/app/revenue-chart';

import { DollarSign, Users, FileText, CheckCircle2 } from 'lucide-react';
import { subscribeToInvoices, subscribeToTasks, subscribeToClients } from '@/lib/firestore';
import { Invoice, Task, Client } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubInvoices = subscribeToInvoices(setInvoices);
    const unsubTasks = subscribeToTasks(setTasks);
    const unsubClients = subscribeToClients(setClients);

    // Initial loading state
    const timer = setTimeout(() => {
      if (invoices.length === 0 && tasks.length === 0 && clients.length === 0) {
         setLoading(false);
      }
    }, 3000); // Failsafe to turn off skeleton if data doesn't come back

    return () => {
      unsubInvoices();
      unsubTasks();
      unsubClients();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if(invoices.length > 0 && tasks.length > 0 && clients.length > 0) {
      setLoading(false);
    }
  }, [invoices, tasks, clients]);


  if (loading) {
    return (
       <div className="flex flex-col gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <Skeleton className="lg:col-span-4 h-96" />
          <Skeleton className="lg:col-span-3 h-96" />
        </div>
      </div>
    );
  }

  const totalRevenue = invoices
    .filter((invoice) => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === 'Unpaid' || invoice.status === 'Overdue'
  ).length;

  const tasksToComplete = tasks.filter((task) => !task.completed).length;

  const recentInvoices = invoices.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="Total revenue from paid invoices"
        />
        <StatCard
          title="Total Clients"
          value={clients.length.toString()}
          icon={Users}
          description="All-time clients"
        />
        <StatCard
          title="Pending Invoices"
          value={pendingInvoices.toString()}
          icon={FileText}
          description="Awaiting payment"
        />
        <StatCard
          title="Tasks to Complete"
          value={tasksToComplete.toString()}
          icon={CheckCircle2}
          description="Incomplete tasks"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart invoices={invoices} />
        </div>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>
              A summary of your 5 most recent invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-medium">{invoice.client?.name || '...'}</div>
                      <div className="text-sm text-muted-foreground">{invoice.client?.email || '...'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          invoice.status === 'Paid' ? 'default' : 
                          invoice.status === 'Overdue' ? 'destructive' : 'secondary'
                        }
                        className={
                          invoice.status === 'Paid' ? 'bg-green-500/20 text-green-700 border-green-500/20 hover:bg-green-500/30' : ''
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${invoice.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
