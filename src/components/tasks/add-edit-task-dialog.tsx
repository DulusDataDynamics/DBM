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
import { Task } from '@/lib/data';
import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
});

interface AddEditTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task?: Task;
}

export function AddEditTaskDialog({ isOpen, onOpenChange, task }: AddEditTaskDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      dueDate: new Date(),
      priority: 'Low',
    },
  });
  
  useEffect(() => {
    if (task) {
      form.reset({
        description: task.description,
        dueDate: new Date(task.dueDate),
        priority: task.priority || 'Low',
      });
    } else {
        form.reset({
            description: '',
            dueDate: new Date(),
            priority: 'Low',
        })
    }
  }, [task, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    const taskData = {
      description: values.description,
      dueDate: values.dueDate.toISOString(),
      priority: values.priority || 'Low',
      completed: task?.completed || false,
      userId: user.uid,
    };

    if (task) {
      // Update existing task
      const taskRef = doc(firestore, `users/${user.uid}/tasks/${task.id}`);
      updateDocumentNonBlocking(taskRef, taskData);

    } else {
      // Add new task
      const tasksColRef = collection(firestore, `users/${user.uid}/tasks`);
      addDocumentNonBlocking(tasksColRef, taskData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Follow up with client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
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
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Low">Low</SelectItem>
                           <SelectItem value="Medium">Medium</SelectItem>
                           <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter>
              <Button type="submit"> {task ? 'Save Changes' : 'Create Task'} </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
