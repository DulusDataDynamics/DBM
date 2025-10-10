'use client';
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Task } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TasksOverview() {
    const { user } = useUser();
    const firestore = useFirestore();

    const tasksQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, `users/${user.uid}/tasks`),
            where('completed', '==', false)
        );
    }, [firestore, user]);

    const { data: pendingTasks, isLoading } = useCollection<Task>(tasksQuery);
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle className="font-headline">Pending Tasks</CardTitle>
                    <CardDescription>You have {isLoading ? '...' : pendingTasks?.length || 0} upcoming tasks.</CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/dashboard/tasks">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading && <p>Loading tasks...</p>}
                <ScrollArea className="h-[240px]">
                    <div className="space-y-4 pr-4">
                        {pendingTasks?.length === 0 && !isLoading && (
                            <p className="text-sm text-muted-foreground">No pending tasks. Well done!</p>
                        )}
                        {pendingTasks?.slice(0, 10).map(task => (
                            <div key={task.id} className="flex items-center">
                                <div className="flex flex-col">
                                    <span className="font-medium">{task.description}</span>
                                    <span className="text-sm text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
