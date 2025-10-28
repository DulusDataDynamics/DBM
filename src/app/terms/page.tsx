
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { format } from 'date-fns';

export default function TermsPage() {
  const lastUpdated = format(new Date(), 'MMMM dd, yyyy');
  return (
    <div className="flex flex-col min-h-screen">
       <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Bot className="h-6 w-6 text-primary" />
          <span className="sr-only">Dulus Business Manager</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight font-headline">Terms of Service</h1>
            <p className="mt-4 text-muted-foreground">Last updated: {lastUpdated}</p>

            <div className="prose prose-stone dark:prose-invert mt-8 max-w-none">
              <p>Welcome to Dulus Business Manager!</p>
              
              <p>
                These terms and conditions outline the rules and regulations for the use of Dulus Inc.'s Website, located
                at this domain.
              </p>
              
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use Dulus
                Business Manager if you do not agree to take all of the terms and conditions stated on this page.
              </p>
              
              <h2>1. License to Use</h2>
              <p>
                Unless otherwise stated, Dulus Inc. and/or its licensors own the intellectual property rights for all
                material on Dulus Business Manager. All intellectual property rights are reserved. You may access this
                from Dulus Business Manager for your own personal use subjected to restrictions set in these terms and
                conditions.
              </p>
              
              <h2>2. User Content</h2>
              <p>
                In these terms and conditions, "your user content" means material (including without limitation text,
                images, audio material, video material, and audio-visual material) that you submit to this website, for
                whatever purpose.
              </p>
              
              <p>
                You grant to Dulus Inc. a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce,
                adapt, publish, translate and distribute your user content in any existing or future media. You also grant
                to Dulus Inc. the right to sub-license these rights, and the right to bring an action for infringement of
                these rights.
              </p>

              <h2>3. Limitations of Liability</h2>
              <p>In no event shall Dulus Inc., nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Dulus Inc., including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

              <h2>4. Governing Law</h2>
              <p>These Terms will be governed by and interpreted in accordance with the laws of the State, and you submit to the non-exclusive jurisdiction of the state and federal courts located in for the resolution of any disputes.</p>

            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Dulus Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

    
