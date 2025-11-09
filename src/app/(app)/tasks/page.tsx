'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getTasks, updateTaskCompletion } from '@/lib/firestore';
import { Task } from '@/lib/types';
import { useEffect, useState, useTransition } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleTaskChecked = (task: Task, checked: boolean) => {
    startTransition(async () => {
      await updateTaskCompletion(task.id, checked);
      setTasks(currentTasks => 
        currentTasks.map(t => t.id === task.id ? {...t, completed: checked} : t)
      );
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage your tasks and track your workload.</CardDescription>
          </div>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
         {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '50px' }}>Done</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className={task.completed ? 'text-muted-foreground line-through' : ''}>
                <TableCell>
                  <Checkbox 
                    checked={task.completed} 
                    onCheckedChange={(checked) => handleTaskChecked(task, !!checked)}
                    aria-label="Mark task as complete" 
                    disabled={isPending}
                  />
                </TableCell>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      task.priority === 'High' ? 'destructive' :
                      task.priority === 'Medium' ? 'secondary' : 'outline'
                    }
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={task.completed || isPending}>
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
        )}
      </CardContent>
    </Card>
  );
}
