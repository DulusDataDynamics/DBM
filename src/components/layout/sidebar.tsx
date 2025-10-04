'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, BarChart2, CheckSquare, FileText, LayoutDashboard, Settings, Users, LifeBuoy, MessageSquare } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { cn } from '@/lib/utils';

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

export function MainSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  const renderNavItem = ({ href, icon: Icon, label }: typeof navItems[0]) => {
    const isActive = pathname === href;
    const linkContent = (
      <>
        <Icon className="h-5 w-5 shrink-0" />
        <span className={cn("truncate transition-opacity", !isOpen && "opacity-0 hidden")}>{label}</span>
      </>
    );

    return (
      <li key={label}>
        {isOpen ? (
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary-foreground hover:bg-sidebar-accent",
                isActive ? 'bg-sidebar-accent text-primary-foreground' : 'text-sidebar-foreground/80'
              )}
            >
              {linkContent}
            </Link>
        ) : (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary-foreground hover:bg-sidebar-accent",
                    isActive ? 'bg-sidebar-accent text-primary-foreground' : 'text-sidebar-foreground/80'
                  )}
                >
                  {linkContent}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </li>
    );
  }

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] transition-all", isOpen ? 'lg:px-6' : 'justify-center lg:px-2')}>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
          <Bot className="h-6 w-6 text-accent shrink-0" />
          <span className={cn("transition-opacity", !isOpen && "opacity-0 hidden")}>Dulus</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className={cn("grid items-start text-sm font-medium transition-all", isOpen ? "px-2 lg:px-4" : "px-2")}>
          <ul className="space-y-1">
            {navItems.map(renderNavItem)}
          </ul>
        </nav>
      </div>
      <div className={cn("mt-auto p-4 transition-all", !isOpen && "px-2")}>
        <nav className="grid items-start text-sm font-medium">
            <ul className="space-y-1">
                {bottomNavItems.map(renderNavItem)}
            </ul>
        </nav>
      </div>
    </div>
  );
}
