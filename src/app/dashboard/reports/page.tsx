'use client'
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { Client, Invoice } from "@/lib/data";
import { collection } from "firebase/firestore";
import { Download } from "lucide-react";
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function ReportsPage() {
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

    const invoiceStatusData = invoices?.reduce((acc, invoice) => {
        const status = invoice.status;
        const existing = acc.find(item => item.name === status);
        if(existing) {
            existing.value += 1;
        } else {
            acc.push({ name: status, value: 1 });
        }
        return acc;
    }, [] as {name: string, value: number}[]) || [];

    const revenueByClientData = clients?.map(client => {
        const clientInvoices = invoices?.filter(invoice => invoice.clientId === client.id && invoice.status === 'paid') || [];
        const revenue = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        return {
            name: client.name,
            revenue: revenue,
        }
    }).filter(c => c.revenue > 0) || [];


    return (
        <>
            <PageHeader title="Reports" description="Analyze your business performance with detailed reports.">
                <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export to CSV
                    </span>
                </Button>
            </PageHeader>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="font-headline">Revenue by Client</CardTitle>
                        <CardDescription>
                            See which clients are generating the most revenue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingClients || isLoadingInvoices ? <p>Loading chart data...</p> : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueByClientData} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                        }}
                                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                                    />
                                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="font-headline">Invoice Status</CardTitle>
                        <CardDescription>
                            A breakdown of your invoice statuses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         {isLoadingInvoices ? <p>Loading chart data...</p> : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={invoiceStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {invoiceStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                         )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
