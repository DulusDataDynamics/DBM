'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Invoice } from '@/lib/types';

interface InvoiceStatusChartProps {
  invoices: Invoice[];
}

const COLORS: Record<string, string> = {
  Paid: 'hsl(var(--chart-1))',
  Unpaid: 'hsl(var(--chart-4))',
  Overdue: 'hsl(var(--chart-5))',
};

export function InvoiceStatusChart({ invoices }: InvoiceStatusChartProps) {

  const statusData = invoices.reduce((acc, invoice) => {
    if (!acc[invoice.status]) {
      acc[invoice.status] = { name: invoice.status, value: 0 };
    }
    acc[invoice.status].value += 1;
    return acc;
  }, {} as Record<string, { name: string, value: number }>);

  const data = Object.values(statusData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Status Breakdown</CardTitle>
        <CardDescription>A visual summary of your invoice statuses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 text-sm mt-4">
          {data.map(entry => (
            <div key={entry.name} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[entry.name] }} />
              <span>{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
