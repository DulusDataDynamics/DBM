
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { StockItem } from '@/lib/data';
import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Item name must be at least 2 characters.' }),
  sku: z.string().optional(),
  quantity: z.coerce.number().min(0, { message: 'Quantity cannot be negative.' }),
  price: z.coerce.number().min(0, { message: 'Price cannot be negative.' }).optional(),
});

interface AddEditStockItemDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  stockItem?: StockItem;
}

export function AddEditStockItemDialog({ isOpen, onOpenChange, stockItem }: AddEditStockItemDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  useEffect(() => {
    if (stockItem) {
      form.reset({
        name: stockItem.name,
        sku: stockItem.sku,
        quantity: stockItem.quantity,
        price: stockItem.price,
      });
    } else {
        form.reset({
            name: '',
            sku: '',
            quantity: 0,
            price: 0,
        })
    }
  }, [stockItem, form, isOpen]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    const itemData = {
      ...values,
      userId: user.uid,
    };

    if (stockItem) {
      const itemRef = doc(firestore, `users/${user.uid}/stock/${stockItem.id}`);
      updateDocumentNonBlocking(itemRef, itemData);
    } else {
      const stockColRef = collection(firestore, `users/${user.uid}/stock`);
      addDocumentNonBlocking(stockColRef, itemData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{stockItem ? 'Edit Stock Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {stockItem ? 'Update the details for this item.' : 'Fill in the details for the new item in your inventory.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <DialogFooter>
              <Button type="submit"> {stockItem ? 'Save Changes' : 'Add Item'} </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    