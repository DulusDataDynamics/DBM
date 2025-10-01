import Image from "next/image";
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
import { clients } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ClientsPage() {
  return (
    <>
      <PageHeader title="Clients" description="Manage your client relationships.">
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Client
          </span>
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            An overview of all your clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const avatar = PlaceHolderImages.find(p => p.id === client.avatar);
                return (
                  <TableRow key={client.id}>
                    <TableCell className="hidden sm:table-cell">
                      {avatar && 
                        <Image
                          alt="Client avatar"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={avatar.imageUrl}
                          width="64"
                          data-ai-hint={avatar.imageHint}
                        />
                      }
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Active' ? 'outline' : 'secondary'}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>${client.revenue.toLocaleString()}</TableCell>
                    <TableCell>{client.projects}</TableCell>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
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
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-5</strong> of <strong>{clients.length}</strong> clients
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
