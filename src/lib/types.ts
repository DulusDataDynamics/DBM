export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Invoice = {
  id: string;
  client: Client;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
};

export type Task = {
  id: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  completed: boolean;
};

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
};
