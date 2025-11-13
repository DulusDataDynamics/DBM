'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Zap, ClipboardCheck, FileText, Users, Shield, BookUser, Check } from 'lucide-react';

export default function LandingPage() {
  const heroImage = PlaceHolderImages && PlaceHolderImages.find((p) => p.id === 'landing-hero');

  const features = [
    {
      icon: Zap,
      title: 'AI Assistant',
      description: 'Leverage AI to get daily summaries, business insights, and execute commands with natural language.',
    },
    {
      icon: ClipboardCheck,
      title: 'Task Management',
      description: 'Organize, assign, and track tasks to keep your projects on schedule.',
    },
    {
      icon: FileText,
      title: 'Invoice Tracking',
      description: 'Create and manage invoices with ease, and keep track of payments.',
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Maintain a complete directory of your clients and their information.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Built with security in mind, with data protection and privacy at its core.',
    },
    {
      icon: BookUser,
      title: 'Legal Documents',
      description: 'Includes templates for your Privacy Policy and Terms of Service.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <nav className="hidden items-center space-x-6 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
          <div className="md:hidden">
             <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:py-24">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Streamline Your Business with an AI-Powered Manager
            </h1>
            <p className="text-lg text-muted-foreground">
              DBM helps you manage tasks, invoices, and clients effortlessly.
              Automate your workflow, get smart insights, and focus on what
              matters most: growing your business.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button asChild size="lg">
                <Link href="/signup">Sign Up for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={600}
                height={400}
                data-ai-hint={heroImage.imageHint}
                className="rounded-lg object-cover shadow-xl"
              />
            )}
          </div>
        </section>

        <section className="bg-muted/40 py-12 lg:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="font-semibold text-primary">Key Features</p>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">The Ultimate Toolkit for Small Business</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From intelligent automation to comprehensive management, Dulus provides everything you need to succeed.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="py-12 lg:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start for free and scale as you grow. No hidden fees.
              </p>
            </div>
            <div className="mt-12 flex justify-center">
              <div className="w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-lg">
                <div className="p-8">
                  <h3 className="text-2xl font-bold">Unlimited Plan</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    14‑day free trial (up to 20 clients + 20 invoices).
                  </p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">R349</span>
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    or approx. $20/month
                  </p>
                  <Button asChild size="lg" className="mt-6 w-full">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <ul className="mt-8 space-y-4 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Unlimited Clients
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Unlimited Invoices
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      AI-Powered Insights
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Task & Inventory Management
                    </li>
                     <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      WhatsApp Support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">
            © 2024 Dulus Data Dynamics. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
             <Link href="https://dulusdatadynamics.netlify.app" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              Website
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
