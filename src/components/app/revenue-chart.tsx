'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { clients, invoices } from '@/lib/data';

const revenueByClient = clients.map(client => {
  const clientInvoices = invoices.filter(invoice => invoice.client.id === client.id && invoice.status === 'Paid');
  const totalRevenue = clientInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  return {
    client: client.name,
    total: totalRevenue,
  };
}).filter(c => c.total > 0);


export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Client</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={revenueByClient}>
            <XAxis
              dataKey="client"
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ 
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
              }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
