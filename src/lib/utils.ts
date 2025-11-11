import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Maps raw data to match an AI flow schema by including only specified fields.
 * @param data Array of objects (e.g., invoices)
 * @param fields Array of field names required by the AI flow
 * @returns Array of simplified objects matching the AI schema
 */
export function mapToAISchema<T extends Record<string, any>>(data: T[], fields: (keyof T)[]) {
  return data.map(item => {
    const mapped: Partial<T> = {};
    fields.forEach(field => {
      if (field in item) {
        mapped[field] = item[field];
      }
    });
    return mapped;
  });
}
