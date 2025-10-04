'use client';

import { AppHeader } from '@/components/layout/header';
import { MainSidebar } from '@/components/layout/sidebar';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import type { Settings } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  }

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
     if (typeof window !== 'undefined') {
       router.replace('/');
     }
     return (
       <div className="flex min-h-screen items-center justify-center">
         <p>Redirecting to login...</p>
       </div>
     );
  }


  return (
    <div className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns]",
        isSidebarOpen ? "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]" : "md:grid-cols-[68px_1fr]"
    )}>
      <div className="hidden border-r bg-sidebar md:block">
        <MainSidebar isOpen={isSidebarOpen} />
      </div>
      <div className="flex flex-col">
        <AppHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
