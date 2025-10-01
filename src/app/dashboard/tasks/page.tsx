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
import type { Task } from "@/lib/data";


export default function TasksPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const tasksQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/tasks`));
    }, [firestore, user]);

    const { data: tasks, isLoading } = useCollection<Task>(tasksQuery);

  return (
    <>
      <PageHeader title="Tasks" description="Manage your daily tasks and to-do lists.">
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Task
          </span>
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>
            An overview of all your tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
              {!isLoading && tasks && tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.description}</TableCell>
                  <TableCell>
                    <Badge variant={task.completed ? 'default' : 'secondary'}>
                      {task.completed ? 'Done' : 'In Progress'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
             {tasks && `Showing <strong>1-${tasks.length}</strong> of <strong>${tasks.length}</strong> tasks`}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
