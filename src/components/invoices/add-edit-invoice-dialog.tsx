'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Invoice, Client } from '@/lib/data';
import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  clientId: z.string().min(1, { message: 'Please select a client.' }),
  invoiceNumber: z.string().min(1, { message: 'Invoice number is required.' }),
  amount: z.coerce.number().min(0.01, { message: 'Amount must be greater than 0.' }),
  status: z.enum(['paid', 'unpaid', 'overdue']),
  issueDate: z.date({ required_error: 'An issue date is required.' }),
  dueDate: z.date({ required_error: 'A due date is required.' }),
});

interface AddEditInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  invoice?: Invoice;
  clients: Client[];
}

export function AddEditInvoiceDialog({ isOpen, onOpenChange, invoice, clients }: AddEditInvoiceDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  useEffect(() => {
    if (invoice) {
      form.reset({
        clientId: invoice.clientId,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        status: invoice.status,
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate),
      });
    } else {
        form.reset({
            clientId: '',
            invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
            amount: 0,
            status: 'unpaid',
            issueDate: new Date(),
            dueDate: new Date(),
        })
    }
  }, [invoice, form, isOpen]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    const invoiceData = {
      ...values,
      issueDate: values.issueDate.toISOString(),
      dueDate: values.dueDate.toISOString(),
      userId: user.uid,
    };

    if (invoice) {
      const invoiceRef = doc(firestore, `users/${user.uid}/invoices/${invoice.id}`);
      updateDocumentNonBlocking(invoiceRef, invoiceData);
    } else {
      const invoicesColRef = collection(firestore, `users/${user.uid}/invoices`);
      addDocumentNonBlocking(invoicesColRef, invoiceData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
          <DialogDescription>
            {invoice ? 'Update the details of your invoice.' : 'Fill in the details for your new invoice.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Client</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {clients.map(client => (
                               <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="paid">Paid</SelectItem>
                           <SelectItem value="unpaid">Unpaid</SelectItem>
                           <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Issue Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter>
              <Button type="submit"> {invoice ? 'Save Changes' : 'Create Invoice'} </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
