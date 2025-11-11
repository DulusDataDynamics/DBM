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
  ).optional().describe('Revenue data for each client from paid invoices.'),
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

// Tool to find the top client
const getTopClient = ai.defineTool(
  {
    name: 'getTopClient',
    description: 'Identifies the client with the highest total revenue from a list of transactions.',
    inputSchema: z.object({
      revenueData: z.array(
        z.object({
          clientId: z.string(),
          amount: z.number(),
        })
      ),
    }),
    outputSchema: z.object({
      topClientId: z.string(),
      totalRevenue: z.number(),
    }),
  },
  async ({ revenueData }) => {
    if (!revenueData || revenueData.length === 0) {
      throw new Error('Revenue data is empty.');
    }
    const clientTotals = revenueData.reduce((acc, item) => {
      acc[item.clientId] = (acc[item.clientId] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    const topClient = Object.entries(clientTotals).reduce(
      (top, [clientId, total]) => (total > top.totalRevenue ? { topClientId: clientId, totalRevenue: total } : top),
      { topClientId: '', totalRevenue: 0 }
    );

    return topClient;
  }
);


export async function generateRevenueInsights(input: GenerateRevenueInsightsInput): Promise<GenerateRevenueInsightsOutput> {
  return generateRevenueInsightsFlow(input);
}

const generateRevenueInsightsPrompt = ai.definePrompt({
  name: 'generateRevenueInsightsPrompt',
  input: {schema: GenerateRevenueInsightsInputSchema},
  output: {schema: GenerateRevenueInsightsOutputSchema},
  tools: [getTopClient],
  prompt: `You are an AI financial analyst for a business app called Dulus Business Manager.
Your task is to analyze the provided business data and generate a professional, multi-sentence summary of the business performance.

Focus on key metrics like total revenue, outstanding payments, and client activity.
If revenue data is available, use the getTopClient tool to identify the top client and include their performance in your analysis.

Here is the data:
- Revenue Data (from paid invoices): {{#if revenueData}}{{{JSON.stringify revenueData}}}{{else}}No revenue data available.{{/if}}
- Invoice Data (all statuses): {{#if invoiceData}}{{{JSON.stringify invoiceData}}}{{else}}No invoice data available.{{/if}}

Based on this, provide a clear and concise summary. If data is insufficient, state that more data is needed to generate insights.
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
