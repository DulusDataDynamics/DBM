'use server';

/**
 * @fileOverview A flow for generating revenue insights.
 *
 * - generateRevenueInsights - A function that generates revenue insights based on available data.
 * - GenerateRevenueInsightsInput - The input type for the generateRevenueInsights function.
 * - GenerateRevenueInsightsOutput - The return type for the generateRevenueInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRevenueInsightsInputSchema = z.object({
  revenueData: z.array(
    z.object({
      clientId: z.string().describe('The ID of the client.'),
      amount: z.number().describe('The revenue amount from the client.'),
    })
  ).optional().describe('Revenue data for each client.'),
  invoiceData: z.array(
    z.object({
      clientId: z.string().describe('The ID of the client associated with the invoice.'),
      status: z.enum(['Paid', 'Unpaid', 'Overdue']).describe('The status of the invoice.'),
      amount: z.number().describe('The invoice amount.'),
    })
  ).optional().describe('Invoice data including status and amount.'),
});
export type GenerateRevenueInsightsInput = z.infer<typeof GenerateRevenueInsightsInputSchema>;

const GenerateRevenueInsightsOutputSchema = z.object({
  insight: z.string().describe('A summary of revenue insights.'),
});
export type GenerateRevenueInsightsOutput = z.infer<typeof GenerateRevenueInsightsOutputSchema>;

export async function generateRevenueInsights(input: GenerateRevenueInsightsInput): Promise<GenerateRevenueInsightsOutput> {
  return generateRevenueInsightsFlow(input);
}

const generateRevenueInsightsPrompt = ai.definePrompt({
  name: 'generateRevenueInsightsPrompt',
  input: {schema: GenerateRevenueInsightsInputSchema},
  output: {schema: GenerateRevenueInsightsOutputSchema},
  prompt: `You are a business intelligence expert tasked with generating revenue insights.

  Analyze the provided data and provide a concise, actionable insight regarding revenue, client revenue, and outstanding payments.

  If the data is insufficient to generate a meaningful insight, respond with a message stating that an insight cannot be provided due to data limitations.

  Consider these aspects:
  - Total revenue generated.
  - Revenue distribution across clients.
  - Outstanding payments and their potential impact.

  Revenue Data: {{#if revenueData}}{{{JSON.stringify revenueData}}}{{else}}No revenue data available.{{/if}}
  Invoice Data: {{#if invoiceData}}{{{JSON.stringify invoiceData}}}{{else}}No invoice data available.{{/if}}
`,
});

const generateRevenueInsightsFlow = ai.defineFlow(
  {
    name: 'generateRevenueInsightsFlow',
    inputSchema: GenerateRevenueInsightsInputSchema,
    outputSchema: GenerateRevenueInsightsOutputSchema,
  },
  async input => {
    const {output} = await generateRevenueInsightsPrompt(input);
    return output!;
  }
);
