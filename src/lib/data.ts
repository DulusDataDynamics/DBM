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
};

export type Task = {
  id: string;
  userId: string;
  description: string;
  dueDate: string;
  completed: boolean;
};

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
