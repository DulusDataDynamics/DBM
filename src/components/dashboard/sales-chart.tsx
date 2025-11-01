'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import type { Invoice } from '@/lib/data';
import { Button } from '../ui/button';
import { getWeek } from 'date-fns';

type SalesChartView = 'monthly' | 'weekly';

export function SalesChart({ invoices, isLoading, currencySymbol }: { invoices: Invoice[] | null, isLoading: boolean, currencySymbol: string }) {
  const [view, setView] = useState<SalesChartView>('monthly');

  const salesData = useMemo(() => {
    if (!invoices) return [];
    
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');

    if (view === 'monthly') {
        const monthlySales = paidInvoices.reduce((acc, inv) => {
            const month = new Date(inv.issueDate).toLocaleString('default', { month: 'short' });
            const existing = acc.find(item => item.name === month);
            if (existing) {
                existing.sales += inv.amount;
            } else {
                acc.push({ name: month, sales: inv.amount });
            }
            return acc;
        }, [] as { name: string, sales: number }[]);
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        const recentMonths = monthNames.slice(0, currentMonth + 1);

        return recentMonths.map(month => {
            const found = monthlySales.find(d => d.name === month);
            return found || { name: month, sales: 0 };
        });
    } else { // Weekly view
        const weeklySales = paidInvoices.reduce((acc, inv) => {
            const weekNumber = getWeek(new Date(inv.issueDate));
            const name = `Week ${weekNumber}`;
            const existing = acc.find(item => item.name === name);
            if (existing) {
                existing.sales += inv.amount;
            } else {
                acc.push({ name, sales: inv.amount });
            }
            return acc;
        }, [] as { name: string, sales: number }[]);
        
        // Let's show the last 12 weeks of data
        const currentWeek = getWeek(new Date());
        const recentWeeks = Array.from({ length: 12 }, (_, i) => {
            const week = currentWeek - i;
            return week > 0 ? `Week ${week}` : `Week ${52 + week}`;
        }).reverse();
        
        return recentWeeks.map(weekName => {
           const found = weeklySales.find(d => d.name === weekName);
           return found || { name: weekName, sales: 0 };
        });
    }

  }, [invoices, view]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline">Sales Overview</CardTitle>
              <CardDescription>A summary of your {view} sales.</CardDescription>
            </div>
            <div className='flex items-center gap-2'>
                <Button variant={view === 'monthly' ? 'default' : 'outline'} size="sm" onClick={() => setView('monthly')}>Monthly</Button>
                <Button variant={view === 'weekly' ? 'default' : 'outline'} size="sm" onClick={() => setView('weekly')}>Weekly</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading ? <p className="text-center">Loading chart data...</p> :
          salesData.length === 0 ? <p className="text-center">No sales data yet. Paid invoices will appear here.</p> :
          (<ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${currencySymbol}${value}`} />
              <Tooltip
                  contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                  }}
                  formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, 'Sales']}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>)
        }
      </CardContent>
    </Card>
  );
}
