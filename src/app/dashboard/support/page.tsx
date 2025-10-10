'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, MessageCircleQuestion, Send } from "lucide-react";

export default function SupportPage() {
    return (
        <>
            <PageHeader title="Support Center" description="Get help and find answers to your questions." />

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><MessageCircleQuestion /> Frequently Asked Questions</CardTitle>
                            <CardDescription>Find answers to common questions about Dulus Business Manager.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I create an invoice?</AccordionTrigger>
                                    <AccordionContent>
                                        You can create an invoice from the Invoices page by clicking "Create Invoice", or by asking the AI Assistant: "Create an invoice for [Client Name] for [Amount]".
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Can I change my business currency?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, you can set your default currency in the Settings page under "Financial Settings".
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How does the AI assistant work?</AccordionTrigger>
                                    <AccordionContent>
                                        The AI assistant uses natural language to help you manage your business. You can give it commands like "add a new task" or "show me my clients" directly in the chatbot.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Is my data secure?</AccordionTrigger>
                                    <AccordionContent>
                                        Absolutely. We prioritize your data security with industry-standard encryption and secure infrastructure. You can read more in our Privacy Policy.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Mail /> Contact Support</CardTitle>
                             <CardDescription>Can't find an answer? Reach out to us directly.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Email Us</h3>
                                <a href="mailto:dulusdatadynamics@gmail.com" className="text-sm text-primary hover:underline">
                                    dulusdatadynamics@gmail.com
                                </a>
                                <p className="text-xs text-muted-foreground">We typically reply within 24 hours.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">Call / WhatsApp</h3>
                                <p className="text-sm text-primary">
                                    +27 64 64 1288 CAT
                                </p>
                                <p className="text-xs text-muted-foreground">Mon-Fri, 9am - 5pm CAT</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Send /> Submit a Ticket</CardTitle>
                            <CardDescription>For technical issues, submit a ticket for our team to investigate.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Submit a Support Ticket</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
