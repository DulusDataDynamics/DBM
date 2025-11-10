
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

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
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
            Dulus Data Dynamics ("we," "our," or "us") is committed to
            protecting your privacy. This Privacy Policy explains how your
            personal information is collected, used, and disclosed by our
            service.
          </p>
          <h3 className="text-lg font-semibold text-foreground">1. Information We Collect</h3>
          <p>
            We may collect personal information from you such as your name,
            email address, and payment information when you register for an
            account, use our services, or communicate with us.
          </p>
          <h3 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h3>
          <p>
            We use the information we collect to provide, maintain, and
            improve our services, to process transactions, to send you
            technical notices, updates, security alerts, and support messages,
            and to communicate with you about products, services, and offers.
          </p>
          <h3 className="text-lg font-semibold text-foreground">3. Information Sharing</h3>
          <p>
            We do not share your personal information with third parties
            without your consent, except in the following circumstances or as
            described in this Privacy Policy: for legal, protection, and
            safety purposes; to comply with laws; or with our service
            providers who perform services on our behalf.
          </p>
          <h3 className="text-lg font-semibold text-foreground">4. Data Security</h3>
          <p>
            We implement security measures designed to protect your information
            from unauthorized access. However, no security system is
            impenetrable, and we cannot guarantee the security of our systems
            100%.
          </p>
          <h3 className="text-lg font-semibold text-foreground">5. Your Rights</h3>
          <p>
            You have the right to access, update, or delete the information we
            have on you. You can do this by accessing your account settings or
            contacting us directly.
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
