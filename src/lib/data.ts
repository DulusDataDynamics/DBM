export type Client = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  projects: number;
  revenue: number;
  status: 'Active' | 'Inactive';
};

export const clients: Client[] = [
  { id: '1', name: 'Innovate Inc.', email: 'contact@innovate.com', avatar: '1', projects: 5, revenue: 25000, status: 'Active' },
  { id: '2', name: 'Apex Solutions', email: 'info@apex.com', avatar: '2', projects: 3, revenue: 18000, status: 'Active' },
  { id: '3', name: 'Quantum Corp', email: 'support@quantum.com', avatar: '3', projects: 8, revenue: 42000, status: 'Active' },
  { id: '4', name: 'Legacy Ltd.', email: 'legacy@lltd.com', avatar: '4', projects: 2, revenue: 9500, status: 'Inactive' },
  { id: '5', name: 'Synergy Group', email: 'hello@synergy.com', avatar: '5', projects: 6, revenue: 31000, status: 'Active' },
];

export type Invoice = {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
};

export const invoices: Invoice[] = [
  { id: 'INV-001', clientName: 'Innovate Inc.', amount: 5000, dueDate: '2024-08-01', status: 'Paid' },
  { id: 'INV-002', clientName: 'Apex Solutions', amount: 6000, dueDate: '2024-08-05', status: 'Pending' },
  { id: 'INV-003', clientName: 'Quantum Corp', amount: 12000, dueDate: '2024-07-20', status: 'Overdue' },
  { id: 'INV-004', clientName: 'Synergy Group', amount: 5500, dueDate: '2024-08-15', status: 'Pending' },
  { id: 'INV-005', clientName: 'Innovate Inc.', amount: 7500, dueDate: '2024-07-28', status: 'Paid' },
];

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Done' | 'In Progress' | 'Todo';
};

export const tasks: Task[] = [
  { id: '1', title: 'Draft proposal for Apex Solutions', dueDate: '2024-08-10', priority: 'High', status: 'In Progress' },
  { id: '2', title: 'Follow up with Quantum Corp on overdue invoice', dueDate: '2024-08-02', priority: 'High', status: 'Todo' },
  { id: '3', title: 'Onboard Synergy Group to new system', dueDate: '2024-08-12', priority: 'Medium', status: 'Todo' },
  { id: '4', title: 'Prepare Q3 financial report', dueDate: '2024-08-20', priority: 'Medium', status: 'In Progress' },
  { id: '5', title: 'Update company website with new testimonials', dueDate: '2024-08-18', priority: 'Low', status: 'Done' },
];

export type RecentActivity = {
    id: string;
    description: string;
    timestamp: string;
    user: string;
    avatar: string;
}

export const recentActivity: RecentActivity[] = [
    { id: '1', description: 'sent an invoice to Apex Solutions.', timestamp: '2 hours ago', user: 'You', avatar: '6' },
    { id: '2', description: 'completed the task "Update company website".', timestamp: '5 hours ago', user: 'You', avatar: '6' },
    { id: '3', description: 'added a new client: Synergy Group.', timestamp: '1 day ago', user: 'You', avatar: '6' },
]

export const salesData = {
    "monthlySales": [
        { "month": "Jan", "sales": 4000 }, { "month": "Feb", "sales": 3000 },
        { "month": "Mar", "sales": 5000 }, { "month": "Apr", "sales": 4500 },
        { "month": "May", "sales": 6000 }, { "month": "Jun", "sales": 5500 },
        { "month": "Jul", "sales": 7000 }
    ],
    "topProducts": [
        { "name": "Web Development", "sales": 15000 },
        { "name": "Consulting", "sales": 12000 },
        { "name": "UI/UX Design", "sales": 8000 }
    ]
};

export const financialData = {
    "revenue": 55000,
    "expenses": 25000,
    "profit": 30000,
    "cashFlow": [
        {"month": "Jan", "flow": 1000}, {"month": "Feb", "flow": -500},
        {"month": "Mar", "flow": 2000}, {"month": "Apr", "flow": 1500},
        {"month": "May", "flow": 2500}, {"month": "Jun", "flow": 2000},
        {"month": "Jul", "flow": 3000}
    ]
};

export const dailyActivityData = {
    completedTasks: "Updated company website with new testimonials, Finalized Q2 marketing plan.",
    sentInvoices: "INV-005 to Innovate Inc. for $7500.",
    newClients: "N/A",
    financialMetrics: "Daily Revenue: $1200, Expenses: $300, Profit: $900."
};
