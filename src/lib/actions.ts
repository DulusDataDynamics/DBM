'use server';

import { generateRevenueInsights } from "@/ai/flows/generate-revenue-insights";
import { Invoice } from "./types";

export async function getRevenueInsights(invoices: Invoice[]) {
  try {
    const revenueData = invoices
      .filter(i => i.status === 'Paid')
      .map(i => ({
        clientId: i.clientId,
        amount: i.amount,
      }));

    const invoiceData = invoices.map(i => ({
      clientId: i.clientId,
      status: i.status,
      amount: i.amount,
    }));

    const result = await generateRevenueInsights({ revenueData, invoiceData });
    return result;
  } catch (error) {
    console.error('Error generating revenue insights:', error);
    return { insight: 'An error occurred while generating insights. Please try again.' };
  }
}
