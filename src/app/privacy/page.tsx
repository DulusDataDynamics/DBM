
import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold tracking-tight font-headline">Privacy Policy</h1>
            <p className="mt-4 text-muted-foreground">Last updated: October 10, 2025</p>

            <div className="prose prose-stone dark:prose-invert mt-8 max-w-none">
              <p>
                Dulus Inc. ("us", "we", or "our") operates the Dulus Business Manager website (the "Service"). This page
                informs you of our policies regarding the collection, use, and disclosure of personal data when you use
                our Service and the choices you have associated with that data.
              </p>
              
              <h2>1. Information Collection and Use</h2>
              <p>
                We collect several different types of information for various purposes to provide and improve our Service
                to you.
              </p>
              <h3>Types of Data Collected</h3>
              <h4>Personal Data</h4>
              <p>
                While using our Service, we may ask you to provide us with certain personally identifiable information
                that can be used to contact or identify you ("Personal Data"). Personally, identifiable information may
                include, but is not limited to:
              </p>
              <ul>
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
                <li>Address, State, Province, ZIP/Postal code, City</li>
                <li>Cookies and Usage Data</li>
              </ul>
              
              <h2>2. Use of Data</h2>
              <p>Dulus Inc. uses the collected data for various purposes:</p>
              <ul>
                <li>To provide and maintain the Service</li>
                <li>To notify you about changes to our Service</li>
                <li>
                  To allow you to participate in interactive features of our Service when you choose to do so
                </li>
                <li>To provide customer care and support</li>
                <li>To provide analysis or valuable information so that we can improve the Service</li>
                <li>To monitor the usage of the Service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
              
              <h2>3. Security of Data</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the
                Internet, or method of electronic storage is 100% secure. While we strive to use commercially
                acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
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

    