'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import type { Task, Invoice, Client } from "@/lib/data";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { useMemo } from "react";
import { CheckSquare, FileText } from "lucide-react";

type ActivityItem = {
    id: string;
    description: string;
    timestamp: string;
    user: string;
    type: 'task' | 'invoice';
};

export function RecentActivity() {
    const { user } = useUser();
    const firestore = useFirestore();

    const tasksQuery = useMemoFirebase(() => user ? query(collection(firestore, `users/${user.uid}/tasks`), orderBy('dueDate', 'desc'), limit(2)) : null, [firestore, user]);
    const { data: tasks } = useCollection<Task>(tasksQuery);
    
    const invoicesQuery = useMemoFirebase(() => user ? query(collection(firestore, `users/${user.uid}/invoices`), orderBy('issueDate', 'desc'), limit(2)) : null, [firestore, user]);
    const { data: invoices } = useCollection<Invoice>(invoicesQuery);

    const clientsQuery = useMemoFirebase(() => user ? query(collection(firestore, `users/${user.uid}/clients`)) : null, [firestore, user]);
    const { data: clients } = useCollection<Client>(clientsQuery);

    const recentActivity = useMemo(() => {
        const activities: ActivityItem[] = [];

        if (tasks) {
            tasks.forEach(task => {
                activities.push({
                    id: `task-${task.id}`,
                    description: `${task.completed ? 'completed the task' : 'has a new task:'} "${task.description}"`,
                    timestamp: new Date(task.dueDate).toLocaleDateString(),
                    user: "You",
                    type: 'task'
                });
            });
        }
        if (invoices && clients) {
            invoices.forEach(invoice => {
                const clientName = clients.find(c => c.id === invoice.clientId)?.name || 'a client';
                activities.push({
                    id: `invoice-${invoice.id}`,
                    description: `sent an invoice to ${clientName}.`,
                    timestamp: new Date(invoice.issueDate).toLocaleDateString(),
                    user: "You",
                    type: 'invoice'
                });
            });
        }

        return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);

    }, [tasks, invoices, clients]);


    const renderIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'task':
                return <CheckSquare className="h-4 w-4" />;
            case 'invoice':
                return <FileText className="h-4 w-4" />;
            default:
                return null;
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
                <CardDescription>A log of your recent actions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
                {recentActivity.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
                {recentActivity.map(activity => {
                    return (
                        <div key={activity.id} className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex bg-secondary text-secondary-foreground items-center justify-center">
                                <AvatarFallback>{renderIcon(activity.type)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                    <span className="font-semibold">{activity.user}</span> {activity.description}
                                </p>

                                <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
