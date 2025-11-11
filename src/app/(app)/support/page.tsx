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
          <div className="flex flex-col space-y-2">
            <p>
              For technical issues or account inquiries, you can reach us through the following channels:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>
                <strong>Email:</strong> dulusdatadynamics@gmail.com
              </li>
              <li>
                <strong>Phone:</strong> 073 646 1288
              </li>
              <li>
                <strong>Website:</strong> <a href="https://dulusdatadynamics.netlify.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dulusdatadynamics.netlify.app</a>
              </li>
            </ul>
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
