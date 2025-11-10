
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
            Effective Date: November 9, 2025
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>
            Company: Dulus Data Dynamics (“we”, “us”, “our”)
            <br />
            Product: Dulus Business Manager (DBM)
          </p>

          <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
          <p>
            By accessing or using Dulus Business Manager (“DBM”), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use the Service.
          </p>

          <h3 className="text-lg font-semibold text-foreground">2. Description of Service</h3>
          <p>
            DBM is a cloud-based business management platform designed to help small and medium enterprises manage sales, inventory, invoicing, reporting, and team collaboration. Features may include AI tools, analytics, integrations, and subscription management.
          </p>

          <h3 className="text-lg font-semibold text-foreground">3. Eligibility</h3>
          <p>
            You must be at least 18 years old or the legal age of majority in your jurisdiction to use DBM. By creating an account, you represent that the information you provide is accurate and complete.
          </p>

          <h3 className="text-lg font-semibold text-foreground">4. Account Registration & Security</h3>
          <p>
            You must create an account to access most features. You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized access to your account. Dulus Data Dynamics will not be liable for any loss or damage from your failure to comply with this security obligation.
          </p>

          <h3 className="text-lg font-semibold text-foreground">5. Use of Service</h3>
          <p>
            You agree to: Use DBM only for lawful business purposes. Not attempt to reverse-engineer, decompile, or exploit the Service. Not upload malicious code, spam, or content that violates any law. We reserve the right to suspend or terminate your account for misuse or violation of these Terms.
          </p>

          <h3 className="text-lg font-semibold text-foreground">6. Subscription & Payments</h3>
          <p>
            DBM offers free and paid subscription plans. Fees are billed in ZAR (South African Rand) or other supported currencies. Payments are processed through secure third-party gateways (e.g., PayFast, Stripe). All payments are non-refundable unless otherwise stated. You may cancel your subscription at any time via the Billing page.
          </p>

          <h3 className="text-lg font-semibold text-foreground">7. Intellectual Property</h3>
          <p>
            All content, trademarks, logos, software, and materials available on DBM are owned by Dulus Data Dynamics or its licensors. You are granted a limited, non-exclusive, non-transferable license to use DBM solely for your business operations.
          </p>

          <h3 className="text-lg font-semibold text-foreground">8. Data Ownership</h3>
          <p>
            You retain full ownership of the business data you upload to DBM. We do not claim any rights to your data other than those necessary to operate and provide the service.
          </p>

          <h3 className="text-lg font-semibold text-foreground">9. Limitation of Liability</h3>
          <p>
            DBM is provided “as is” and “as available.” Dulus Data Dynamics is not liable for: Any loss of data, profits, or business opportunities; Downtime, errors, or interruptions; Any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid for the service in the last 12 months.
          </p>

          <h3 className="text-lg font-semibold text-foreground">10. Termination</h3>
          <p>
            You may terminate your account at any time. We may suspend or terminate your account if you breach these Terms or misuse the platform.
          </p>

          <h3 className="text-lg font-semibold text-foreground">11. Changes to the Terms</h3>
          <p>
            We may update these Terms from time to time. Updates will be posted within the app or on our website. Continued use of DBM after such changes means you accept the revised Terms.
          </p>

          <h3 className="text-lg font-semibold text-foreground">12. Governing Law</h3>
          <p>
            These Terms shall be governed by and interpreted in accordance with the laws of South Africa. Any disputes will be subject to the exclusive jurisdiction of the courts in KwaZulu-Natal.
          </p>

          <h3 className="text-lg font-semibold text-foreground">13. Contact Us</h3>
          <p>
            For any questions about these Terms, please contact us at: <a href="mailto:dulusdatadynamics@gmail.com" className="text-primary hover:underline">dulusdatadynamics@gmail.com</a>
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
