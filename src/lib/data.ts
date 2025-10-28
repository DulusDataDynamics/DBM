import { z } from 'zod';

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  userId: string;
};

export const ClientSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
});

export type Invoice = {
  id: string;
  userId: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  currency: string;
};

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


export type Task = {
  id: string;
  userId: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority?: 'Low' | 'Medium' | 'High';
};

export const TaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string(),
  dueDate: z.string(),
  completed: z.boolean(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
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
