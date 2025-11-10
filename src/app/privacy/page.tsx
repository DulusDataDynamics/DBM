
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
            Effective Date: November 9, 2025
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>
            Company: Dulus Data Dynamics
            <br />
            Product: Dulus Business Manager (DBM)
            <br />
            Contact: <a href="mailto:dulusdatadynamics@gmail.com" className="text-primary hover:underline">dulusdatadynamics@gmail.com</a>
          </p>

          <h3 className="text-lg font-semibold text-foreground">1. Overview</h3>
          <p>
            This Privacy Policy explains how Dulus Data Dynamics collects, uses, and protects your information when you use the DBM platform. We are committed to protecting your privacy and complying with South Africa’s Protection of Personal Information Act (POPIA) and international data standards (GDPR where applicable).
          </p>

          <h3 className="text-lg font-semibold text-foreground">2. Information We Collect</h3>
          <p>
            We may collect the following types of information:
          </p>
          <ul className="list-disc list-outside space-y-2 pl-6">
            <li>
              <strong>Account Information:</strong> Name, email, phone number, password, and company details.
            </li>
            <li>
              <strong>Business Data:</strong> Customer lists, invoices, inventory, and financial records entered by you into DBM.
            </li>
            <li>
              <strong>Usage Information:</strong> Log data, IP address, browser type, and device information.
            </li>
            <li>
              <strong>Payment Information:</strong> Billing details and transaction records (processed securely through third-party payment providers).
            </li>
          </ul>


          <h3 className="text-lg font-semibold text-foreground">3. How We Use Your Information</h3>
          <p>
            We use the information to: Provide, maintain, and improve DBM; Personalize your experience and display relevant features; Process payments and manage subscriptions; Communicate updates, support messages, or security alerts; Comply with legal obligations.
          </p>
          
          <h3 className="text-lg font-semibold text-foreground">4. Data Storage & Security</h3>
          <p>
            All data is stored securely on trusted cloud servers. Access is restricted to authorized personnel only. Encryption and regular backups protect your data from loss or misuse. Despite our best efforts, no system is completely secure. You use DBM at your own risk but we implement industry best practices to protect your data.
          </p>

          <h3 className="text-lg font-semibold text-foreground">5. Data Sharing</h3>
          <p>
            We do not sell or rent your personal or business data. We may share limited data with: Payment processors (for billing purposes); Cloud service providers (for hosting); Law enforcement, if legally required.
          </p>

          <h3 className="text-lg font-semibold text-foreground">6. Your Rights</h3>
          <p>
            Under POPIA and GDPR, you have the right to: Access and download your personal data; Request corrections or deletion; Withdraw consent or delete your account; Request a copy of all data stored about you. You can exercise these rights by emailing dulusdatadynamics@gmail.com.
          </p>
          
          <h3 className="text-lg font-semibold text-foreground">7. Data Retention</h3>
          <p>
            We retain your data only as long as necessary to provide the service or comply with legal obligations. Upon account deletion, we will remove or anonymize your data within a reasonable timeframe.
          </p>

          <h3 className="text-lg font-semibold text-foreground">8. Cookies</h3>
          <p>
            DBM uses cookies to improve user experience, analytics, and security. You can disable cookies in your browser settings, but some features may not work properly.
          </p>

          <h3 className="text-lg font-semibold text-foreground">9. Third-Party Services</h3>
          <p>
            DBM may integrate with third-party apps (e.g., Google, QuickBooks, Notify). Their use is subject to their own privacy policies. We recommend reviewing those before enabling integrations.
          </p>

          <h3 className="text-lg font-semibold text-foreground">10. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy periodically. Changes will be posted in-app or on our website. Your continued use of DBM after updates means you accept the revised Policy.
          </p>

          <h3 className="text-lg font-semibold text-foreground">11. Contact Us</h3>
          <p>
            For any questions about this Policy, please contact us at: <a href="mailto:dulusdatadynamics@gmail.com" className="text-primary hover:underline">dulusdatadynamics@gmail.com</a>
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
