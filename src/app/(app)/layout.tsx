'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { NAV_LINKS, SUPPORT_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/app/user-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveBusinessProfile } from '@/lib/firestore';

function TrialBanner() {
  const { profile, user, setProfile } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (profile?.trialStart && profile.trialActive && !profile.subscribed) {
      const trialDays = 14;
      const startTime = profile.trialStart;
      const daysPassed = (Date.now() - startTime) / (1000 * 60 * 60 * 24);
      const remaining = Math.max(0, trialDays - daysPassed);
      setDaysRemaining(Math.ceil(remaining));

      if (daysPassed > trialDays && profile.trialActive) {
        if (user?.uid) {
          saveBusinessProfile(user.uid, { ...profile, trialActive: false });
          setProfile(prev => prev ? {...prev, trialActive: false} : null);
        }
      }
    }
  }, [profile, user, setProfile]);

  if (daysRemaining === null || !profile?.trialActive) return null;

  if (daysRemaining <= 0) {
    return (
      <div className="bg-destructive text-destructive-foreground p-3 text-center text-sm flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Your free trial has ended. Please subscribe to continue using all features.</span>
        <Button size="sm" variant="secondary" className="ml-4 h-auto py-1 px-3">Subscribe Now</Button>
      </div>
    );
  }

  if (daysRemaining <= 7) {
    return (
      <div className="bg-primary/20 text-primary-foreground p-3 text-center text-sm flex items-center justify-center gap-2">
        <Zap className="h-4 w-4" />
        <span>Your free trial ends in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}.</span>
        <Button size="sm" variant="default" className="ml-4 h-auto py-1 px-3">Upgrade to Pro</Button>
      </div>
    );
  }
  
  return null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
        <Logo />
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            Getting things ready
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
          </p>
          <p className="text-sm text-muted-foreground">Please wait a moment while we load the app.</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarMenu>
            {NAV_LINKS.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(link.href)}
                  tooltip={{ children: link.label }}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex-col !items-stretch">
          <SidebarSeparator />
           <SidebarMenu>
            {SUPPORT_LINKS.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(link.href)}
                  tooltip={{ children: link.label }}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
             <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
             <UserNav />
          </div>
        </header>
        <TrialBanner />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
