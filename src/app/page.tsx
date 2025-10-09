
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckSquare, FileText, Users, Zap, Shield } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="px-4 lg:px-6 h-14 flex items-center shadow-sm">
                <Link href="#" className="flex items-center justify-center" prefetch={false}>
                    <Image src="/logo.svg" alt="Dulus BS Manager Logo" width={32} height={32} />
                    <span className="ml-3 text-xl font-bold font-headline tracking-tighter">Dulus BS Manager</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Button variant="ghost" asChild>
                        <Link href="/login" prefetch={false}>
                            Login
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup" prefetch={false}>Get Started</Link>
                    </Button>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                                        Streamline Your Business with an AI-Powered Manager
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Dulus helps you manage tasks, invoices, and clients effortlessly. Automate your workflow, get smart insights, and focus on what matters most: growing your business.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button asChild size="lg">
                                        <Link href="/signup" prefetch={false}>
                                            Sign Up for Free
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg">
                                        <Link href="#features" prefetch={false}>
                                            Learn More
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                             <Image
                                src="/dulus-bs-manager-logo.png"
                                alt="Dulus BS Manager Logo"
                                width={600}
                                height={600}
                                className="mx-auto aspect-square overflow-hidden rounded-xl object-contain sm:w-full lg:order-last"
                                data-ai-hint="app logo"
                            />
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-primary">Key Features</div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">The Ultimate Toolkit for Small Business</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    From intelligent automation to comprehensive management, Dulus provides everything you need to succeed.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
                            <div className="grid gap-1 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                    <Zap className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">AI Assistant</h3>
                                <p className="text-muted-foreground">
                                    Leverage AI to get daily summaries, business insights, and execute commands with natural language.
                                </p>
                            </div>
                             <div className="grid gap-1 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                    <CheckSquare className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Task Management</h3>
                                <p className="text-muted-foreground">
                                    Organize, assign, and track tasks to keep your projects on schedule.
                                </p>
                            </div>
                             <div className="grid gap-1 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Invoice Tracking</h3>
                                <p className="text-muted-foreground">
                                    Create and manage invoices with ease, and keep track of payments.
                                </p>
                            </div>
                             <div className="grid gap-1 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Client Management</h3>
                                <p className="text-muted-foreground">
                                    Maintain a complete directory of your clients and their information.
                                </p>
                            </div>
                            <div className="grid gap-1 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Secure & Private</h3>
                                <p className="text-muted-foreground">
                                    Built with security in mind, with data protection and privacy at its core.
                                </p>
                            </div>
                             <div className="grid gap-1 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Legal Documents</h3>
                                <p className="text-muted-foreground">
                                   Includes templates for your Privacy Policy and Terms of Service.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
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
