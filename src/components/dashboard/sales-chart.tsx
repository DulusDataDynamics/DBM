'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';
import type { Invoice } from '@/lib/data';

export function SalesChart({ invoices, isLoading }: { invoices: Invoice[] | null, isLoading: boolean }) {

  const salesData = useMemo(() => {
    if (!invoices) return [];
    
    const monthlySales = invoices.reduce((acc, inv) => {
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
    }, [] as { month: string, sales: number }[]);
    
    // Ensure all recent months are present, even if with 0 sales
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const recentMonths = monthNames.slice(0, currentMonth + 1);

    return recentMonths.map(month => {
        const found = monthlySales.find(d => d.month === month);
        return found || { month, sales: 0 };
    });

  }, [invoices]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Sales Overview</CardTitle>
        <CardDescription>A summary of your monthly sales.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading ? <p className="text-center">Loading chart data...</p> :
          salesData.length === 0 ? <p className="text-center">No sales data yet. Paid invoices will appear here.</p> :
          (<ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                  }}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>)
        }
      </CardContent>
    </Card>
  );
}
