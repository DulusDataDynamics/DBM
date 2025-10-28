
'use server';

import { z } from 'zod';
import { InvoiceSchema, TaskSchema, ClientSchema, QuoteSchema, StockItemSchema } from '@/lib/data';


export async function createTask(
  userId: string,
  description: string,
  dueDate?: string
): Promise<z.infer<typeof TaskSchema>> {
    console.log("Creating task:", { userId, description, dueDate });
    // This is a placeholder. In a real app, you'd interact with a database.
    return {
        id: `task-${Date.now()}`,
        userId,
        description,
        dueDate: dueDate || new Date().toISOString(),
        completed: false,
        priority: 'Medium'
    };
}

export async function listTasks(userId: string): Promise<z.infer<typeof TaskSchema>[]> {
    console.log("Listing tasks for user:", userId);
    // Placeholder data
    return [
        { id: 'task-1', userId, description: 'Finish the report', dueDate: new Date().toISOString(), completed: false, priority: 'High' },
        { id: 'task-2', userId, description: 'Call the supplier', dueDate: new Date().toISOString(), completed: true, priority: 'Medium' },
    ];
}


export async function createClient(
    userId: string,
    name: string,
    email: string,
    phone: string,
    address: string
): Promise<z.infer<typeof ClientSchema>> {
    console.log("Creating client:", { userId, name, email });
     return {
        id: `client-${Date.now()}`,
        userId,
        name,
        email,
        phone,
        address,
    };
}


export async function listClients(userId: string): Promise<z.infer<typeof ClientSchema>[]> {
  console.log("Listing clients for user:", userId);
  // Placeholder data
  return [
    { id: 'client-1', userId, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' },
    { id: 'client-2', userId, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', address: '456 Oak Ave' },
  ];
}

export async function createInvoice(
    userId: string,
    clientId: string,
    amount: number,
    dueDate?: string
): Promise<z.infer<typeof InvoiceSchema>> {
    console.log("Creating invoice:", { userId, clientId, amount, dueDate });
    const invoiceNumber = `INV-${Math.floor(Math.random() * 9000) + 1000}`;
    return {
        id: `inv-${Date.now()}`,
        userId,
        clientId,
        amount,
        invoiceNumber,
        issueDate: new Date().toISOString(),
        dueDate: dueDate || new Date().toISOString(),
        status: 'unpaid',
        currency: 'zar',
    };
}

export async function createQuote(
    userId: string,
    clientId: string,
    amount: number
): Promise<z.infer<typeof QuoteSchema>> {
    console.log("Creating quote:", { userId, clientId, amount });
    const quoteNumber = `QT-${Math.floor(Math.random() * 9000) + 1000}`;
    return {
        id: `qt-${Date.now()}`,
        userId,
        clientId,
        amount,
        quoteNumber,
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days expiry
        status: 'draft',
    };
}

export async function listStock(userId: string): Promise<z.infer<typeof StockItemSchema>[]> {
    console.log("Listing stock for user:", userId);
    return [
        { id: 'item-1', userId, name: 'Laptop', sku: 'LP-001', quantity: 15, price: 1200 },
        { id: 'item-2', userId, name: 'Mouse', sku: 'MS-002', quantity: 50, price: 25 },
    ];
}

export async function updateStock(userId: string, stockItemId: string, quantity: number): Promise<z.infer<typeof StockItemSchema>> {
    console.log("Updating stock:", { userId, stockItemId, quantity });
    return {
        id: stockItemId,
        userId,
        name: 'Updated Item',
        sku: 'SKU-UPD',
        quantity: quantity,
        price: 100,
    };
}

    