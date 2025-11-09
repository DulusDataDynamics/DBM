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
import { invoices, tasks } from '@/lib/data';

export default function DashboardPage() {
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === 'Unpaid' || invoice.status === 'Overdue'
  ).length;

  const tasksToComplete = tasks.filter((task) => !task.completed).length;

  const recentInvoices = invoices.slice(0, 5);

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
          title="New Clients"
          value="+5"
          icon={Users}
          description="+2 since last month"
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
          <RevenueChart />
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
                      <div className="font-medium">{invoice.client.name}</div>
                      <div className="text-sm text-muted-foreground">{invoice.client.email}</div>
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
