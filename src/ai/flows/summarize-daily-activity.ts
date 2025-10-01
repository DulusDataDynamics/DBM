'use server';

/**
 * @fileOverview Generates a daily summary of business activities.
 *
 * - summarizeDailyActivity - A function that generates a summary of the day's business activities.
 * - SummarizeDailyActivityInput - The input type for the summarizeDailyActivity function.
 * - SummarizeDailyActivityOutput - The return type for the summarizeDailyActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDailyActivityInputSchema = z.object({
  completedTasks: z.string().describe('A list of completed tasks for the day.'),
  sentInvoices: z.string().describe('A list of invoices sent for the day.'),
  newClients: z.string().describe('A list of new clients added today.'),
  financialMetrics: z.string().describe('Key financial metrics for the day.'),
});
export type SummarizeDailyActivityInput = z.infer<typeof SummarizeDailyActivityInputSchema>;

const SummarizeDailyActivityOutputSchema = z.object({
  summary: z.string().describe('A summary of the day\'s business activities.'),
});
export type SummarizeDailyActivityOutput = z.infer<typeof SummarizeDailyActivityOutputSchema>;

export async function summarizeDailyActivity(input: SummarizeDailyActivityInput): Promise<SummarizeDailyActivityOutput> {
  return summarizeDailyActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDailyActivityPrompt',
  input: {schema: SummarizeDailyActivityInputSchema},
  output: {schema: SummarizeDailyActivityOutputSchema},
  prompt: `You are an AI assistant that provides daily summaries of business activities for business owners.

  Based on the following information, generate a concise and informative daily summary. The summary should include key highlights from completed tasks, sent invoices, new clients, and financial metrics.

  Completed Tasks: {{{completedTasks}}}
  Sent Invoices: {{{sentInvoices}}}
  New Clients: {{{newClients}}}
  Financial Metrics: {{{financialMetrics}}}

  Summary:`,
});

const summarizeDailyActivityFlow = ai.defineFlow(
  {
    name: 'summarizeDailyActivityFlow',
    inputSchema: SummarizeDailyActivityInputSchema,
    outputSchema: SummarizeDailyActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
