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
import type { Client } from "@/lib/data";
import { useState } from "react";
import { AddEditClientDialog } from "@/components/clients/add-edit-client-dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ClientsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  const clientsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/clients`));
  }, [firestore, user]);

  const { data: clients, isLoading } = useCollection<Client>(clientsQuery);

  const handleAddClient = () => {
    setEditingClient(undefined);
    setIsDialogOpen(true);
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  }

  const handleDeleteClient = (clientId: string) => {
    if (!user) return;
    const clientRef = doc(firestore, `users/${user.uid}/clients/${clientId}`);
    deleteDocumentNonBlocking(clientRef);
  }

  return (
    <>
      <PageHeader title="Clients" description="Manage your client relationships.">
        <Button size="sm" className="gap-1" onClick={handleAddClient}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Client
          </span>
        </Button>
      </PageHeader>
      
      <AddEditClientDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={editingClient}
      />

      <Card className="flex flex-col h-[calc(100vh-14rem)]">
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            An overview of all your clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
           <ScrollArea className="h-full">
            <Table className="relative">
              <TableHeader className="sticky-header">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
                {!isLoading && clients && clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No clients found. Add one to get started.</TableCell>
                  </TableRow>
                )}
                {!isLoading && clients && clients.map((client) => {
                  return (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.address}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditClient(client)}>Edit</DropdownMenuItem>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this client and all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>Delete</AlertDialogAction>
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
          </ScrollArea>
        </CardContent>
        <CardFooter>
            {clients && clients.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{clients.length}</strong> of <strong>{clients.length}</strong> clients
              </div>
            )}
        </CardFooter>
      </Card>
    </>
  );
}
