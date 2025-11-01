
'use client';

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
import type { StockItem } from "@/lib/data";
import { useState } from "react";
import { AddEditStockItemDialog } from "@/components/stock/add-edit-stock-item-dialog";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
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
import { getCurrencySymbol } from "@/lib/utils";


export default function StockPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStockItem, setEditingStockItem] = useState<StockItem | undefined>(undefined);

  const stockQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/stock`));
  }, [firestore, user]);

  const { data: stockItems, isLoading } = useCollection<StockItem>(stockQuery);

  const handleAddItem = () => {
    setEditingStockItem(undefined);
    setIsDialogOpen(true);
  }

  const handleEditItem = (item: StockItem) => {
    setEditingStockItem(item);
    setIsDialogOpen(true);
  }

  const handleDeleteItem = (itemId: string) => {
    if (!user) return;
    const itemRef = doc(firestore, `users/${user.uid}/stock/${itemId}`);
    deleteDocumentNonBlocking(itemRef);
  }

  return (
    <>
      <PageHeader title="Stock & Inventory" description="Manage your product stock and inventory levels.">
        <Button size="sm" className="gap-1" onClick={handleAddItem}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Stock Item
          </span>
        </Button>
      </PageHeader>
      
      <AddEditStockItemDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        stockItem={editingStockItem}
      />

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            An overview of all items in your inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
              {!isLoading && stockItems && stockItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No stock items found. Add one to get started.</TableCell>
                </TableRow>
              )}
              {!isLoading && stockItems && stockItems.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku || 'N/A'}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price ? `${getCurrencySymbol('zar')}${item.price.toFixed(2)}` : 'N/A'}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>Edit</DropdownMenuItem>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this stock item.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            {stockItems && stockItems.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{stockItems.length}</strong> of <strong>{stockItems.length}</strong> items
              </div>
            )}
        </CardFooter>
      </Card>
    </>
  );
}

    