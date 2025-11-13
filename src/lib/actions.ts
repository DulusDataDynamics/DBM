'use server';

import { generateRevenueInsights } from "@/ai/flows/generate-revenue-insights";
import { Invoice } from "./types";
import { mapToAISchema } from "./utils";

export async function getRevenueInsights(invoices: Invoice[], inventory: any[]) {
  try {
    // Map paid invoices to the salesData format the AI expects.
    const salesData = invoices
      .filter(i => i.status === 'Paid')
      .map(invoice => {
          // Attempt to find the product name from inventory. This is a simplification.
          // In a real app, invoices would likely store item IDs.
          const product = inventory.find(item => item.price === invoice.amount) || { name: `Service/Product at R${invoice.amount}`, quantity: 1 };
          return {
            id: invoice.id,
            product: product.name,
            amount: invoice.amount,
            quantity: 1, // Assuming 1 unit per invoice for this simplified model
            date: invoice.dueDate,
          };
      });

    const result = await generateRevenueInsights({ sales: salesData });
    return { success: true, insights: result };
  } catch (error) {
    console.error('Error generating revenue insights:', error);
    return { success: false, error: 'An error occurred while generating insights. Please try again.' };
  }
}
