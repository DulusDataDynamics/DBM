
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { KeyRound, MoreHorizontal, PlusCircle, Download, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import type { Invoice, Client, Settings } from "@/lib/data";
import { AddEditInvoiceDialog } from "@/components/invoices/add-edit-invoice-dialog";
import { useState, useEffect, useMemo } from "react";
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
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { getCurrencySymbol, exportToCsv } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function InvoicesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>(undefined);
    const [isPageLocked, setIsPageLocked] = useState(true);
    const [unlockPin, setUnlockPin] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
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
      return doc(firestore, `users/${user.uid}/settings/appSettings`);
    }, [firestore, user]);
    const { data: settings } = useDoc<Settings>(settingsDocRef);

    const getClient = (clientId: string) => {
        return clients?.find(c => c.id === clientId);
    }
    
    const filteredInvoices = useMemo(() => {
        if (!invoices) return [];
        if (!searchQuery) return invoices;

        const lowercasedQuery = searchQuery.toLowerCase();
        return invoices.filter(invoice => {
            const clientName = getClient(invoice.clientId)?.name.toLowerCase();
            const invoiceNumber = invoice.invoiceNumber.toLowerCase();
            return clientName?.includes(lowercasedQuery) || invoiceNumber.includes(lowercasedQuery);
        });
    }, [invoices, searchQuery, clients]);

    const handleAddInvoice = () => {
      setEditingInvoice(undefined);
      setIsDialogOpen(true);
    }

    const handleEditInvoice = (invoice: Invoice) => {
      if(invoice.status === 'paid') {
        toast({ variant: "destructive", title: "Cannot Edit Paid Invoice", description: "Paid invoices cannot be modified." });
        return;
      }
      setEditingInvoice(invoice);
      setIsDialogOpen(true);
    }

    const handleDeleteInvoice = (invoice: Invoice) => {
      if (!user) return;
      if(invoice.status === 'paid') {
        toast({ variant: "destructive", title: "Cannot Delete Paid Invoice", description: "Paid invoices cannot be deleted." });
        return;
      }
      const invoiceRef = doc(firestore, `users/${user.uid}/invoices/${invoice.id}`);
      deleteDocumentNonBlocking(invoiceRef);
    }

    const handleMarkAsPaid = (invoiceId: string) => {
      if (!user) return;
      const invoiceRef = doc(firestore, `users/${user.uid}/invoices/${invoiceId}`);
      updateDocumentNonBlocking(invoiceRef, { status: 'paid' });
      toast({ title: "Invoice Updated", description: "The invoice has been marked as paid." });
    }
    
    const handleSendWhatsApp = (invoice: Invoice) => {
        const client = getClient(invoice.clientId);
        if (!client || !client.phone) {
            toast({ variant: "destructive", title: "Client Phone Not Found", description: "This client does not have a phone number saved." });
            return;
        }

        const businessName = settings?.businessName || "our business";
        const currencySymbol = getCurrencySymbol(invoice.currency);
        const invoiceAmount = `${currencySymbol}${invoice.amount.toFixed(2)}`;
        const dueDate = new Date(invoice.dueDate).toLocaleDateString();

        let message = '';
        const status = new Date(invoice.dueDate) < new Date() && invoice.status === 'unpaid' ? 'overdue' : invoice.status;

        if (status === 'paid') {
            message = `Hello ${client.name},\n\nThank you for your payment for invoice ${invoice.invoiceNumber} of ${invoiceAmount}. We appreciate your business.\n\nFrom, ${businessName}.`;
        } else { // unpaid or overdue
            message = `Hello ${client.name},\n\nThis is a friendly reminder regarding invoice ${invoice.invoiceNumber} for ${invoiceAmount} from ${businessName}. It is due on ${dueDate}.\n\nPlease let us know if you have any questions.\n\nThank you.`;
        }

        const whatsappUrl = `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    const handleUnlockPage = () => {
      if(unlockPin === settings?.invoiceLockPin) {
        setIsPageLocked(false);
        toast({ title: "Page Unlocked", description: "You can now manage invoices." });
        setUnlockPin('');
      } else {
        toast({ variant: "destructive", title: "Incorrect PIN", description: "The PIN you entered is incorrect." });
        setUnlockPin('');
      }
    }
    
    const handleExportToCsv = (invoicesToExport: Invoice[]) => {
      if (!invoicesToExport || invoicesToExport.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No Invoices',
          description: 'There are no invoices to export.',
        });
        return;
      }

      const headers = ['Invoice ID', 'Client Name', 'Status', 'Amount', 'Currency', 'Issue Date', 'Due Date'];
      const rows = invoicesToExport.map(invoice => [
        invoice.invoiceNumber,
        getClient(invoice.clientId)?.name || 'Unknown',
        new Date(invoice.dueDate) < new Date() && invoice.status === 'unpaid' ? 'overdue' : invoice.status,
        invoice.amount.toFixed(2),
        invoice.currency,
        new Date(invoice.issueDate).toLocaleDateString(),
        new Date(invoice.dueDate).toLocaleDateString(),
      ]);

      exportToCsv('invoices', headers, rows);
      toast({ title: "Export Successful", description: "Your invoices have been downloaded as a CSV file." });
    };
    
    useEffect(() => {
        if (settings) {
            setIsPageLocked(!!settings.invoiceLockPin);
        }
    }, [settings]);


  return (
    <>
      <PageHeader title="Invoices" description="Manage your invoices and billing.">
         <Button size="sm" variant="outline" className="gap-1" onClick={() => handleExportToCsv(filteredInvoices || [])}>
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Download CSV
            </span>
          </Button>
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
        settings={settings}
      />

       {isPageLocked && settings?.invoiceLockPin && (
          <Dialog open={isPageLocked} onOpenChange={(open) => !open && setIsPageLocked(false)}>
            <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"></div>
            <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><KeyRound/> Page Locked</DialogTitle>
                    <DialogDescription>
                        Enter the 6-digit PIN to unlock the invoicing page.
                    </DialogDescription>
                </DialogHeader>
                 <div className="flex items-center justify-center py-4">
                    <InputOTP maxLength={6} value={unlockPin} onChange={setUnlockPin}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleUnlockPage}>Unlock</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      
      <Card className="flex flex-col h-[calc(100vh-14rem)]">
        <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>
                  A record of all your sent invoices. {isPageLocked && settings?.invoiceLockPin && <span className="text-destructive font-semibold">(Locked)</span>}
                </CardDescription>
              </div>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client or invoice ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              <Table className="relative">
                <TableHeader className="sticky-header">
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
                  {!isLoadingInvoices && filteredInvoices && filteredInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        {searchQuery ? "No invoices match your search." : "No invoices found. Create one to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoadingInvoices && !isLoadingClients && filteredInvoices && filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{getClient(invoice.clientId)?.name || 'Unknown Client'}</TableCell>
                      <TableCell>
                        <Badge variant={
                            invoice.status === 'paid' ? 'default' : 
                            new Date(invoice.dueDate) < new Date() && invoice.status === 'unpaid' ? 'destructive' : 'secondary'
                        }>
                          {new Date(invoice.dueDate) < new Date() && invoice.status === 'unpaid' ? 'overdue' : invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{getCurrencySymbol(invoice.currency)}{invoice.amount.toFixed(2)}</TableCell>
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
                            {invoice.status !== 'paid' && (
                                <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>Mark as Paid</DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleEditInvoice(invoice)} disabled={invoice.status === 'paid'}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendWhatsApp(invoice)}>Send via WhatsApp</DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={invoice.status === 'paid'} className="text-destructive">Delete</DropdownMenuItem>
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
                                  <AlertDialogAction onClick={() => handleDeleteInvoice(invoice)}>Delete</AlertDialogAction>
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
            </ScrollArea>
        </CardContent>
        <CardFooter>
            {filteredInvoices && filteredInvoices.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{filteredInvoices.length}</strong> of <strong>{invoices?.length}</strong> invoices
              </div>
            )}
        </CardFooter>
      </Card>
    </>
  );
}
