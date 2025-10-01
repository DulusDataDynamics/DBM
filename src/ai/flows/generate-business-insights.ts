'use server';

/**
 * @fileOverview Generates actionable business insights by analyzing sales and financial data.
 *
 * - generateBusinessInsights - A function that generates business insights.
 * - BusinessInsightsInput - The input type for the generateBusinessInsights function.
 * - BusinessInsightsOutput - The return type for the generateBusinessInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessInsightsInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format.'),
  financialData: z.string().describe('Financial data in JSON format.'),
});
export type BusinessInsightsInput = z.infer<typeof BusinessInsightsInputSchema>;

const BusinessInsightsOutputSchema = z.object({
  insights: z.string().describe('Actionable business insights and recommendations.'),
});
export type BusinessInsightsOutput = z.infer<typeof BusinessInsightsOutputSchema>;

export async function generateBusinessInsights(input: BusinessInsightsInput): Promise<BusinessInsightsOutput> {
  return generateBusinessInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'businessInsightsPrompt',
  input: {schema: BusinessInsightsInputSchema},
  output: {schema: BusinessInsightsOutputSchema},
  prompt: `You are an AI-powered business consultant. Analyze the provided sales and financial data to identify trends, suggest cost-saving measures, and highlight growth opportunities. Provide actionable insights and recommendations to improve business performance.

Sales Data: {{{salesData}}}
Financial Data: {{{financialData}}}

Insights:
`, // Ensure the insights are well-formatted and easy to understand.
});

const generateBusinessInsightsFlow = ai.defineFlow(
  {
    name: 'generateBusinessInsightsFlow',
    inputSchema: BusinessInsightsInputSchema,
    outputSchema: BusinessInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
