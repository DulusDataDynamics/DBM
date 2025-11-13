'use server';

import { generateRevenueInsights } from "@/ai/flows/generate-revenue-insights";
import { Invoice, InventoryItem } from "./types";
import { mapToAISchema } from "./utils";

export async function getRevenueInsights(invoices: Invoice[], inventory: InventoryItem[]) {
  try {
    const salesData = mapToAISchema(invoices, inventory);

    const result = await generateRevenueInsights(salesData);
    return { success: true, insights: result };
  } catch (error) {
    console.error('Error generating revenue insights:', error);
    // Check for a specific AI-related error message if possible
    const errorMessage = (error as Error)?.message || 'An unknown error occurred while generating insights.';
    return { success: false, error: errorMessage };
  }
}
