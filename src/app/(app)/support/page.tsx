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
import { Separator } from '@/components/ui/separator';

const faqItems = [
  {
    question: 'How do I reset my password?',
    answer:
      "To reset your password, go to the login page and click the 'Forgot Password' link. You'll receive an email with instructions to create a new one.",
  },
  {
    question: "Why isn't my invoice data showing up?",
    answer:
      "Data can sometimes take a few moments to sync. Try refreshing the page. If the problem persists, check your internet connection or contact support.",
  },
  {
    question: 'How do I add a new client?',
    answer:
      "Navigate to the 'Clients' page from the sidebar and click the 'Add Client' button. Fill in the required details and save.",
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
                <strong>Phone:</strong> 074 646 1288
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
