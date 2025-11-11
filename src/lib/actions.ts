'use server';

import { generateRevenueInsights } from "@/ai/flows/generate-revenue-insights";
import { Invoice } from "./types";
import { mapToAISchema } from "./utils";

export async function getRevenueInsights(invoices: Invoice[]) {
  try {
    // Revenue data: only include fields the AI expects (paid invoices)
    const revenueData = mapToAISchema(
      invoices.filter(i => i.status === 'Paid'), 
      ['clientId', 'amount']
    );

    // Invoice data: include all fields required by the AI flow for all invoices
    const invoiceData = mapToAISchema(
      invoices, 
      ['clientId', 'status', 'amount']
    );

    const result = await generateRevenueInsights({ revenueData, invoiceData });
    return result;
  } catch (error) {
    console.error('Error generating revenue insights:', error);
    return { insight: 'An error occurred while generating insights. Please try again.' };
  }
}
