import { Client, Invoice, Task, InventoryItem } from './types';

export const clients: Client[] = [
  { id: '1', name: 'Innovate LLC', email: 'contact@innovate.com', phone: '555-0101' },
  { id: '2', name: 'Quantum Solutions', email: 'support@quantum.dev', phone: '555-0102' },
  { id: '3', name: 'Apex Designs', email: 'hello@apexdesigns.io', phone: '555-0103' },
  { id: '4', name: 'Starlight Media', email: 'team@starlight.co', phone: '555-0104' },
  { id: '5',name: 'Momentum Inc.', email: 'admin@momentum.inc', phone: '555-0105' },
];

export const invoices: Invoice[] = [
  { id: 'INV-001', client: clients[0], amount: 2500, status: 'Paid', dueDate: '2024-06-01' },
  { id: 'INV-002', client: clients[1], amount: 1800, status: 'Paid', dueDate: '2024-06-05' },
  { id: 'INV-003', client: clients[2], amount: 3200, status: 'Unpaid', dueDate: '2024-07-15' },
  { id: 'INV-004', client: clients[3], amount: 500, status: 'Overdue', dueDate: '2024-05-20' },
  { id: 'INV-005', client: clients[0], amount: 4500, status: 'Unpaid', dueDate: '2024-07-30' },
  { id: 'INV-006', client: clients[4], amount: 2200, status: 'Paid', dueDate: '2024-06-12' },
];

export const tasks: Task[] = [
  { id: '1', description: 'Finalize project proposal for Quantum Solutions', priority: 'High', dueDate: '2024-07-10', completed: false },
  { id: '2', description: 'Follow up with Apex Designs on invoice INV-003', priority: 'Medium', dueDate: '2024-07-12', completed: false },
  { id: '3', description: 'Onboard new client Momentum Inc.', priority: 'High', dueDate: '2024-07-08', completed: true },
  { id: '4', description: 'Prepare monthly report', priority: 'Low', dueDate: '2024-07-25', completed: false },
  { id: '5', description: 'Update inventory for new stock', priority: 'Medium', dueDate: '2024-07-09', completed: false },
];

export const inventory: InventoryItem[] = [
  { id: '1', sku: 'DBM-PRO-001', name: 'Pro Website Package', quantity: 15, price: 2500 },
  { id: '2', sku: 'DBM-STD-001', name: 'Standard Logo Design', quantity: 30, price: 800 },
  { id: '3', sku: 'DBM-HR-CON', name: 'Hourly Consulting', quantity: 100, price: 150 },
  { id '4', sku: 'DBM-SOC-MGT', name: 'Social Media Mgmt (Month)', quantity: 8, price: 1200 },
  { id: '5', sku: 'DBM-SEO-AUD', name: 'SEO Audit', quantity: 22, price: 600 },
];
