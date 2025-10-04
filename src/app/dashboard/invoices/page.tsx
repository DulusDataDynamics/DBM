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
import { collection, query, doc } from "firebase/firestore";
import type { Invoice, Client, Settings } from "@/lib/data";
import { AddEditInvoiceDialog } from "@/components/invoices/add-edit-invoice-dialog";
import { useState } from "react";
import { useDoc } from "@/firebase/firestore/use-doc";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";


export default function InvoicesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
    
    const invoicesQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/invoices`));
    }, [firestore, user]);
    const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);

    const clientsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/clients`));
    }, [firestore, user]);
    const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);
    
    const settingsDocRef = useMemoFirebase(() => {
      if (!user) return null;
      return doc(firestore, `users/${user.uid}/settings/invoiceSettings`);
    }, [firestore, user]);
    const { data: settings } = useDoc<Settings>(settingsDocRef);


    const getClientName = (clientId: string) => {
        return clients?.find(c => c.id === clientId)?.name || 'Unknown Client';
    }

    const handleAddInvoice = () => {
      setEditingInvoice(undefined);
      setIsDialogOpen(true);
    }

    const handleEditInvoice = (invoice: Invoice) => {
      setEditingInvoice(invoice);
      setIsDialogOpen(true);
    }

    const handleDeleteInvoice = (invoiceId: string) => {
      if (!user) return;
      const invoiceRef = doc(firestore, `users/${user.uid}/invoices/${invoiceId}`);
      deleteDocumentNonBlocking(invoiceRef);
    }

    const isPageLocked = settings?.invoicePageLocked;


  return (
    <>
      <PageHeader title="Invoices" description="Manage your invoices and billing.">
        <Button size="sm" className="gap-1" onClick={handleAddInvoice} disabled={isPageLocked}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Invoice
          </span>
        </Button>
      </PageHeader>
      
      <AddEditInvoiceDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        invoice={editingInvoice}
        clients={clients || []}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            A record of all your sent invoices. {isPageLocked && <span className="text-red-500 font-semibold">(Locked)</span>}
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
              {(isLoadingInvoices || isLoadingClients) && <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>}
              {!isLoadingInvoices && invoices && invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No invoices found. Create one to get started.</TableCell>
                </TableRow>
              )}
              {!isLoadingInvoices && !isLoadingClients && invoices && invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{getClientName(invoice.clientId)}</TableCell>
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
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPageLocked}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Send via Email</DropdownMenuItem>
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this invoice.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteInvoice(invoice.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            {invoices && invoices.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{invoices.length}</strong> of <strong>{invoices.length}</strong> invoices
              </div>
            )}
        </CardFooter>
      </Card>
    </>
  );
}
