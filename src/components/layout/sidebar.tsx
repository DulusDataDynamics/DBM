'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, BarChart2, CheckSquare, FileText, LayoutDashboard, Settings, Users, LifeBuoy, MessageSquare } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/chatbot', icon: MessageSquare, label: 'Chatbot' },
  { href: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
  { href: '/dashboard/clients', icon: Users, label: 'Clients' },
  { href: '/dashboard/reports', icon: BarChart2, label: 'Reports' },
];

const bottomNavItems = [
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { href: '#', icon: LifeBuoy, label: 'Support' },
]

export function MainSidebar() {
  const pathname = usePathname();

  const renderNavItem = ({ href, icon: Icon, label }: typeof navItems[0]) => {
    const isActive = pathname === href;
    return (
      <li key={label}>
        <Link
          href={href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary-foreground hover:bg-sidebar-accent ${
            isActive ? 'bg-sidebar-accent text-primary-foreground' : 'text-sidebar-foreground/80'
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      </li>
    );
  }

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
          <Bot className="h-6 w-6 text-accent" />
          <span className="">Dulus</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <ul className="space-y-1">
            {navItems.map(renderNavItem)}
          </ul>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <nav className="grid items-start text-sm font-medium">
            <ul className="space-y-1">
                {bottomNavItems.map(renderNavItem)}
            </ul>
        </nav>
      </div>
    </div>
  );
}
