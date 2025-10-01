import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tasks } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export function TasksOverview() {
    const pendingTasks = tasks.filter(task => task.status !== 'Done').slice(0, 5);
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle className="font-headline">Pending Tasks</CardTitle>
                    <CardDescription>You have {pendingTasks.length} upcoming tasks.</CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/dashboard/tasks">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pendingTasks.map(task => (
                        <div key={task.id} className="flex items-center">
                            <div className="flex flex-col">
                                <span className="font-medium">{task.title}</span>
                                <span className="text-sm text-muted-foreground">Due: {task.dueDate}</span>
                            </div>
                            <div className="ml-auto text-sm text-muted-foreground">{task.priority}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
