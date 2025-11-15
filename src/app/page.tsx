'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap, ClipboardCheck, FileText } from 'lucide-react';

export default function LandingPage() {
  const { user, appReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth is ready and user exists
    if (appReady && user) {
      router.replace('/dashboard');
    }
  }, [user, appReady, router]);

  // Prevent flash of landing page for authenticated users by waiting for appReady
  // The full-screen loader in AuthProvider handles the initial loading state.
  if (!appReady || user) {
    return null;
  }

  // Default landing page for unauthenticated users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center">
        <Logo className="mb-6 justify-center" />
        <h1 className="text-3xl font-bold mb-4">Welcome to DBM</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Manage your business seamlessly with Dulus Business Manager.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span>Fast Setup</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-primary" />
            <span>Easy Tracking</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span>Invoices</span>
          </div>
        </div>
      </div>
    </div>
  );
}
