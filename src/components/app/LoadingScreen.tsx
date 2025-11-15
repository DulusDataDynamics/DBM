'use client';

import { Logo } from '@/components/logo';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Getting things ready..." }: LoadingScreenProps) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
      <Logo />
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">
          {message}
          <span className="animate-pulse">.</span>
          <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
          <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
        </p>
        <p className="text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
    </div>
  );
}
