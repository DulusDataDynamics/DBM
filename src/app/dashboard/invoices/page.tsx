'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Invoice } from "@/lib/data";

export default function InvoicesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const invoicesQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/invoices`));
    }, [firestore, user]);

    const { data: invoices, isLoading } = useCollection<Invoice>(invoicesQuery);

  return (
    <>
      <PageHeader title="Invoices" description="Manage your invoices and billing.">
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Invoice
          </span>
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            A record of all your sent invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>}
              {!isLoading && invoices && invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.clientId}</TableCell>
                  <TableCell>
                    <Badge variant={
                        invoice.status === 'paid' ? 'default' : 
                        invoice.status === 'overdue' ? 'destructive' : 'secondary'
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Send via Email</DropdownMenuItem>
                        <DropdownMenuItem>Send via WhatsApp</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            {invoices && `Showing <strong>1-${invoices.length}</strong> of <strong>${invoices.length}</strong> invoices`}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
