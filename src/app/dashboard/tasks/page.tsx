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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import type { Task } from "@/lib/data";
import { useState } from "react";
import { AddEditTaskDialog } from "@/components/tasks/add-edit-task-dialog";
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
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
} from "@/components/ui/alert-dialog"


export default function TasksPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    const tasksQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, `users/${user.uid}/tasks`));
    }, [firestore, user]);

    const { data: tasks, isLoading } = useCollection<Task>(tasksQuery);
    
    const handleAddTask = () => {
      setEditingTask(undefined);
      setIsDialogOpen(true);
    }
    
    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsDialogOpen(true);
    }

    const handleDeleteTask = (taskId: string) => {
      if(!user) return;
      const taskRef = doc(firestore, `users/${user.uid}/tasks/${taskId}`);
      deleteDocumentNonBlocking(taskRef);
    }

    const handleToggleComplete = (task: Task) => {
      if(!user) return;
      const taskRef = doc(firestore, `users/${user.uid}/tasks/${task.id}`);
      updateDocumentNonBlocking(taskRef, { completed: !task.completed });
    }

  return (
    <>
      <PageHeader title="Tasks" description="Manage your daily tasks and to-do lists.">
        <Button size="sm" className="gap-1" onClick={handleAddTask}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Task
          </span>
        </Button>
      </PageHeader>
      
      <AddEditTaskDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
      />

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
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
               {!isLoading && tasks && tasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No tasks found. Add one to get started.</TableCell>
                </TableRow>
              )}
              {!isLoading && tasks && tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.description}</TableCell>
                  <TableCell>
                    <Badge variant={task.completed ? 'default' : 'secondary'}>
                      {task.completed ? 'Done' : 'In Progress'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      task.priority === 'High' ? 'destructive' :
                      task.priority === 'Medium' ? 'secondary' :
                      'outline'
                    }>
                      {task.priority || 'Low'}
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
                        <DropdownMenuItem onClick={() => handleEditTask(task)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleComplete(task)}>
                            {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this task.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>Delete</AlertDialogAction>
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
            {tasks && tasks.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{tasks.length}</strong> of <strong>{tasks.length}</strong> tasks
              </div>
            )}
        </CardFooter>
      </Card>
    </>
  );
}
