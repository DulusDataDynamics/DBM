'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, MessageSquare } from 'lucide-react';


const faqItems = [
  {
    question: 'How do I reset my password?',
    answer:
      "To reset your password, go to the login page and click the 'Forgot Password' link. You'll receive an email with instructions to create a new one.",
  },
  {
    question: "Why isn't my invoice data showing up?",
    answer:
      "Data can sometimes take a few moments to sync. Try refreshing the page by pressing Ctrl+R (or Cmd+R on Mac). If the problem persists, check your internet connection or contact support. The app will sync automatically when you're back online.",
  },
  {
    question: 'How do I add a new client?',
    answer:
      "Navigate to the 'Clients' page from the sidebar and click the 'Add Client' button. Fill in the required details and save.",
  },
  {
    question: 'Why are the AI Revenue Insights not generating?',
    answer:
      "This can happen if there is not enough invoice data to analyze. Ensure you have at least one 'Paid' invoice, as the AI needs this to calculate revenue. If you have sufficient data and it still fails, please try again after a few moments or contact support.",
  },
  {
    question: "Why can't I download a PDF of my invoices?",
    answer:
      "PDF generation requires your Business Profile to be complete. Please go to Settings > Business Profile and ensure all fields, especially your company name and contact details, are filled in. You also need to have at least one invoice in the system to export.",
  },
  {
    question: 'Can I use the app offline?',
    answer:
      'Yes! Our app has offline support. Any changes you make while offline will automatically sync with the server once your connection is restored.',
  },
  {
    question: "How do I send an invoice via WhatsApp?",
    answer:
      "On the 'Invoices' page, click the three-dots menu next to any invoice and select 'Send via WhatsApp'. This will open a pre-filled WhatsApp chat. Please note, the client must have a valid phone number saved in their profile for this to work.",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            If you can&apos;t find an answer here, please reach out to us.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <p className="text-sm text-muted-foreground">For assistance, feature requests, or to report a bug, please contact our support team. We're here to help you get the most out of Dulus Business Manager.</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="w-full sm:w-auto">
                    <Link href="mailto:dulusdatadynamics@gmail.com">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact via Email
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="https://wa.me/27736461288" target="_blank">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat on WhatsApp
                    </Link>
                </Button>
            </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting & FAQ</CardTitle>
          <CardDescription>
            Find answers to common questions and issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
