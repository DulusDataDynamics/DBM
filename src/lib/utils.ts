import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Invoice, InventoryItem } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Maps raw invoice and inventory data to a structured format for the AI.
 * @param invoices Array of invoice objects
 * @param inventory Array of inventory item objects
 * @returns An object containing mapped sales data
 */
export function mapToAISchema(invoices: Invoice[], inventory: InventoryItem[]) {
  // Map paid invoices to the salesData format the AI expects.
  const salesData = invoices
    .filter(i => i.status === 'Paid')
    .map(invoice => {
      // Attempt to find the product name from inventory. This is a simplification.
      // In a real app, invoices would likely store item IDs.
      const product = inventory.find(item => item.price === invoice.amount) || { name: `Service/Product at R${invoice.amount}` };
      return {
        id: invoice.id,
        product: product.name,
        amount: invoice.amount,
        quantity: 1, // Assuming 1 unit per invoice for this simplified model
        date: invoice.dueDate,
      };
    });

  return {
    sales: salesData
  };
}
