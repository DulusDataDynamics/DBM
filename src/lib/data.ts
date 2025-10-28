
import { z } from 'zod';

export type Client = z.infer<typeof ClientSchema>;

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  userId: z.string(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;

export const InvoiceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  clientId: z.string(),
  invoiceNumber: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.enum(['paid', 'unpaid', 'overdue']),
  currency: z.string(),
});


export type Task = z.infer<typeof TaskSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string(),
  dueDate: z.string(),
  completed: z.boolean(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
});

export type Quote = z.infer<typeof QuoteSchema>;

export const QuoteSchema = z.object({
    id: z.string(),
    userId: z.string(),
    clientId: z.string(),
    quoteNumber: z.string(),
    issueDate: z.string(),
    expiryDate: z.string(),
    amount: z.number(),
    status: z.enum(['draft', 'sent', 'accepted', 'rejected']),
});

export type StockItem = z.infer<typeof StockItemSchema>;

export const StockItemSchema = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    sku: z.string().optional(),
    quantity: z.number(),
    price: z.number().optional(),
});


export type RecentActivity = {
    id: string;
    description: string;
    timestamp: string;
    user: string;
    avatar: string;
}

export type Settings = {
  id: string;
  businessName?: string;
  businessAddress?: string;
  contactEmail?: string;
  logoUrl?: string;
  currency?: string;
  theme?: string;
  invoiceLockPin?: string;
}

    