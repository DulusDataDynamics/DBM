export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  userId: string;
};

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

export type Task = {
  id: string;
  userId: string;
  description: string;
  dueDate: string;
  completed: boolean;
};

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
