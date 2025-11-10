'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { subscribeToInvoices } from '@/lib/firestore';
import { Invoice } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DownloadInvoices from '@/components/app/download-invoices';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToInvoices((invoicesData) => {
      setInvoices(invoicesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">Manage your invoices and track payments.</p>
          </div>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Invoice
          </Button>
        </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
              <CardHeader>
                  <CardTitle>All Invoices</CardTitle>
                  <CardDescription>A list of all your invoices.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground animate-pulse">Loading invoices...</p>
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id.substring(0,8)}</TableCell>
                        <TableCell>{invoice.client?.name || '...'}</TableCell>
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
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">R{invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
              </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
            <DownloadInvoices />
        </div>
      </div>
    </div>
  );
}
