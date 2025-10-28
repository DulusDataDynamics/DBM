'use server';

import { z } from 'zod';
import { InvoiceSchema, TaskSchema, ClientSchema } from '@/lib/data';


export async function createTask(
  userId: string,
  description: string,
  dueDate?: string
): Promise<z.infer<typeof TaskSchema>> {
    throw new Error("Not implemented");
}

export async function listTasks(userId: string): Promise<z.infer<typeof TaskSchema>[]> {
    throw new Error("Not implemented");
}


export async function createClient(
    userId: string,
    name: string,
    email: string,
    phone: string,
    address: string
): Promise<z.infer<typeof ClientSchema>> {
    throw new Error("Not implemented");
}


export async function listClients(userId: string): Promise<z.infer<typeof ClientSchema>[]> {
  throw new Error("Not implemented");
}

export async function createInvoice(
    userId: string,
    clientId: string,
    amount: number,
    dueDate?: string
): Promise<z.infer<typeof InvoiceSchema>> {
    throw new Error("Not implemented");
}
