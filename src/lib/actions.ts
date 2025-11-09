'use server';

import { generateRevenueInsights } from "@/ai/flows/generate-revenue-insights";
import { invoices, clients } from "./data";
import { Invoice } from "./types";

export async function getRevenueInsights() {
  try {
    const revenueData = invoices
      .filter(i => i.status === 'Paid')
      .map(i => ({
        clientId: i.client.id,
        amount: i.amount,
      }));

    const invoiceData = invoices.map(i => ({
      clientId: i.client.id,
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
