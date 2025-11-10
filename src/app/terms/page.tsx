
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <CardDescription>
            Last updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p className="font-semibold text-destructive">
            Disclaimer: This is a template and not legal advice. You should consult
            with a legal professional to create a policy that fits your
            specific needs.
          </p>
          <p>
            Welcome to Dulus Business Manager! These terms and conditions outline
            the rules and regulations for the use of our application. By
            accessing this app, we assume you accept these terms and conditions.
          </p>
          <h3 className="text-lg font-semibold text-foreground">1. Accounts</h3>
          <p>
            When you create an account with us, you must provide us with
            information that is accurate, complete, and current at all times.
            Failure to do so constitutes a breach of the Terms, which may
            result in immediate termination of your account on our Service.
          </p>
          <h3 className="text-lg font-semibold text-foreground">2. Content</h3>
          <p>
            Our Service allows you to post, link, store, share and otherwise
            make available certain information, text, graphics, videos, or
            other material ("Content"). You are responsible for the Content
            that you post on or through the Service, including its legality,
            reliability, and appropriateness.
          </p>
          <h3 className="text-lg font-semibold text-foreground">3. Termination</h3>
          <p>
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
          <h3 className="text-lg font-semibold text-foreground">4. Limitation Of Liability</h3>
          <p>
            In no event shall Dulus Data Dynamics, nor its directors,
            employees, partners, agents, suppliers, or affiliates, be liable
            for any indirect, incidental, special, consequential or punitive
            damages, including without limitation, loss of profits, data, use,
            goodwill, or other intangible losses.
          </p>
          <h3 className="text-lg font-semibold text-foreground">5. Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of South Africa, without regard to its conflict of law
            provisions.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
